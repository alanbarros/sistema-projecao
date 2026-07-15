## Context

A marca d'água atual é um texto hardcoded "Marca d'Agua" renderizado em dois componentes (`SlidePreview` e `ProjectorPage`), com toggle por ItemRoteiro. O sistema é usado em múltiplas paróquias/comunidades, cada uma com sua identidade visual. Hoje não há como personalizar a marca d'água nem associá-la a um roteiro.

A entidade `Roteiro` não possui nenhuma coluna de marca d'água. A tabela `item_roteiro` possui `marca_agua_ativa` (boolean, default TRUE) que controla se a marca d'água é exibida por item.

Não existe infra de upload no codebase. O banco é SQLite com better-sqlite3.

## Goals / Non-Goals

**Goals:**
- Criar entidade global `MarcaDagua` com CRUD completo (máx. 10 registros)
- Cada marca d'água possui título e conteúdo SVG (armazenado como TEXT)
- Permitir ao operador selecionar uma marca d'água ao criar/editar um roteiro
- Propagar o SVG da marca d'água do roteiro para os Slides e renderizar no projetor
- Manter o toggle `marcaAguaAtiva` por ItemRoteiro (herda do roteiro, item pode desligar)

**Non-Goals:**
- Upload de imagens PNG/JPG (apenas SVG colado como texto)
- Customização de fonte, cor ou tamanho da marca d'água
- Marca d'água por item (override individual)
- Edição visual de SVG dentro do sistema
- Migration de dados para roteiros existentes

## Decisions

### 1. SVG como texto no banco (não upload)

**Decisão:** Armazenar o conteúdo SVG como TEXT na coluna `conteudo_svg` da tabela `marca_dagua`.

**Alternativa considerada:** Upload de arquivo + path no DB. Rejeitado porque:
- Não existe infra de upload no codebase
- SVG é texto XML — armazenar como TEXT é natural
- Elimina necessidade de servir arquivos estáticos
- Backup do DB já inclui todas as marcas d'água

**Justificativa:** SVGs de logo/marca d'água são tipicamente < 20KB. 10 marcas × 20KB = 200KB no SQLite — insignificante.

### 2. CRUD global com limite de 10

**Decisão:** Criar tabela `marca_dagua` com CRUD completo. Validar no use case que o limite de 10 registros não seja excedido.

**Alternativa considerada:** Sem limite. Rejeitado porque:
- Marca d'água é um recurso finito (paróquias/comunidades fixas)
- Previne acidental acúmulo de registros
- Mantém a interface de seleção enxuta

### 3. FK opcional no Roteiro

**Decisão:** Adicionar coluna `marca_dagua_id INTEGER REFERENCES marca_dagua(id) ON DELETE SET NULL` na tabela `roteiro`.

**Alternativa considerada:** Tabela de pivot `roteiro_marca_dagua`. Rejeitada porque:
- Um roteiro usa apenas uma marca d'água por vez
- FK direto é mais simples e performático
- ON DELETE SET NULL preserva roteiros se a marca for excluída

### 4. Propagação via Slide

**Decisão:** O SVG da marca d'água é propagado do Roteiro para cada Slide gerado. O `Slide` passa a ter um campo `marcaAguaSvg?: string`.

**Fluxo:** `Roteiro.marca_dagua_id` → busca `MarcaDagua.conteudo_svg` → propaga para `Slide.marcaAguaSvg` → renderizado no `ProjectorPage` e `SlidePreview`.

**Justificativa:** Segue o mesmo padrão de propagação do `marcaAguaAtiva`. O slide engine apenas recebe e threads o dado.

### 5. Renderização inline do SVG

**Decisão:** No `ProjectorPage` e `SlidePreview`, substituir o div hardcoded por `dangerouslySetInnerHTML` com o SVG.

**Alternativa considerada:** `<img src="data:image/svg+xml,...">`. Rejeitada porque:
- `dangerouslySetInnerHTML` renderiza SVG nativamente com mais controle
- SVG vindo do banco é trusted (não é input de usuário externo)
- Permite estilização CSS do SVG (tamanho, opacidade)

### 6. Textarea para colar SVG

**Decisão:** O formulário de marca d'água usa textarea para colar o código SVG, com preview em tempo real.

**Alternativa considerada:** Input file que lê SVG como texto. Rejeitada porque:
- textarea + preview é mais direto
- Não precisa de FileReader API
- O operador pode copiar SVG de qualquer ferramenta

## Risks / Trade-offs

- **SVG malformado** → O browser ignora SVG inválido. Preview em tempo real ajuda a detectar. Não há risco de segurança significativo (SVGs de marcas d'água são可控).
- **Roteiros sem marca d'água** → Aceito como design. Roteiros existentes ficam NULL. Operador precisa selecionar manualmente.
- **Exclusão de marca d'água usada** → ON DELETE SET NULL no FK. Roteiro perde a marca mas continua funcionando (mostra sem marca d'água).
- **Limite de 10** → Validado no use case. Se atingido, botão "Nova Marca d'Água" fica desabilitado.

## Migration

1. `CREATE TABLE IF NOT EXISTS marca_dagua (...)`
2. `ALTER TABLE roteiro ADD COLUMN marca_dagua_id INTEGER REFERENCES marca_dagua(id) ON DELETE SET NULL`

Rollback: `DROP TABLE marca_dagua` + `ALTER TABLE roteiro DROP COLUMN marca_dagua_id` (SQLite não suporta DROP COLUMN nativamente antes do 3.35.0 — verificar versão).
