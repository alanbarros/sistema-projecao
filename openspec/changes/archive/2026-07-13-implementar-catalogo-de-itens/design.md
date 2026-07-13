## Context

O sistema de Projeção Litúrgica precisa de um acervo permanente para armazenar conteúdos reutilizáveis (músicas, orações, etc.). Atualmente o projeto está vazio (src/), com apenas um protótipo navegável em prototype/. A especificação original já define o contexto de Catálogo como permanente e estático.

## Goals / Non-Goals

**Goals:**
- Implementar API REST para CRUD de ItemColetanea
- Criar interface React para gestão do catálogo
- Estruturar dados com blocos semânticos para posterior distribuição em Slides
- Implementar busca textual por título e conteúdo
- Usar tipos compartilhados (Canto, Oração, Resposta, Leitura, Aviso)
- Seguir Clean Architecture + DDD conforme AGENTS.md

**Non-Goals:**
- Autenticação e controle de acesso (fora do escopo)
- Editor visual de Slides
- Integração com mídia
- Suporte a cifras e instrumentos

## Decisions

### 1. Stack: React + TypeScript (Frontend) | Node.js + TypeScript (Backend)

**Rationale:** Conforme definido no AGENTS.md, usar TypeScript em ambos os lados facilita o compartilhamento de tipos e mantém consistência.

**Alternatives considered:** JavaScript puro (descartado por falta de type safety), Python/FastAPI (descartado por não estar no escopo definido).

### 2. Database: SQLite para desenvolvimento inicial

**Rationale:** Simplicidade para prototipagem, sem necessidade de configurar servidor de banco. Pode ser migrado para PostgreSQL depois.

**Alternatives considered:** PostgreSQL desde início (complexidade desnecessária no protótipo), JSON files (limitações de consulta).

### 3. Estrutura de blocos semânticos: Tabela separada ItemBloco

**Rationale:** Tabela separada permite consultas por conteúdo (requisito de busca), mantém normalização relacional e facilita migração para PostgreSQL.

**Decision:** Usar tabela `ItemBloco` com chave estrangeira para `ItemColetanea`. Cada bloco possui tipo (estrofe, parágrafo, versículo) e conteúdo textual. Ordens são preservadas via coluna `ordem`.

**Alternatives considered:** Coluna JSON no ItemColetanea (descartada — difícil de consultar conteúdo), tabela JSON (descartada — não relational).

### 4. API REST padrão com endpoints CRUD

**Rationale:** Operações síncronas tradicionais conforme especificação do contexto de Catálogo.

**Endpoints:**
- GET /api/itens — Listar/buscar itens
- GET /api/itens/:id — Buscar item por ID
- POST /api/itens — Criar item
- PUT /api/itens/:id — Atualizar item
- DELETE /api/itens/:id — Excluir item

### 5. Frontend: Componentes React com busca em tempo real

**Rationale:** Interface responsiva com filtro incremental conforme o operador digita.

### 6. Busca textual: LIKE + índices (não FTS5)

**Rationale:** Usar `LIKE` com índices nas colunas `titulo` e `bloco.conteudo` para manter compatibilidade futura com PostgreSQL. FTS5 é específico do SQLite e complicaria a migração.

**Alternatives considered:** FTS5 (descartado — specifics do SQLite), Trigramas (complexo demais paraSQLite).

### 7. Tipos compartilhados: src/shared/

**Rationale:** Criar pasta `src/shared/` no monorepo para tipos TypeScript usados por frontend e backend.

### 8. Paginação: Implementar desde o início

**Rationale:** A listagem pode crescer indefinidamente. Usar paginação cursor-based (offset/limit) para listagens, com limite padrão de 20 itens.

### 9. Protótipo: Manter separado

**Rationale:** O protótipo em prototype/ é uma referência visual navegável. A implementação real em src/ o substituirá. O protótipo será mantido para referência mas não será integrado ao código final.

### 10. Clean Architecture: Camadas por responsabilidade

**Rationale:** Seguir AGENTS.md com separação em:
- **Domínio:** Entidades (ItemColetanea, ItemBloco), value objects (ItemType, BlockType), interfaces de repositório
- **Aplicação:** Use cases (CriarItem, ListarItens, BuscarItens, EditarItem, ExcluirItem)
- **Infraestrutura:** Implementação do repositório (SQLite), servidor Express
- **UI:** Componentes React, páginas, formulários

## Database Schema

### Tabela: item_coletanea

```sql
CREATE TABLE item_coletanea (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('Canto', 'Oração', 'Resposta', 'Leitura', 'Aviso')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_item_tipo ON item_coletanea(tipo);
CREATE INDEX idx_item_titulo ON item_coletanea(titulo);
```

### Tabela: item_bloco

```sql
CREATE TABLE item_bloco (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_coletanea_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('estrofe', 'paragrafo', 'versiculo', 'canto', 'refrao')),
  conteudo TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  FOREIGN KEY (item_coletanea_id) REFERENCES item_coletanea(id) ON DELETE CASCADE
);

CREATE INDEX idx_bloco_item ON item_bloco(item_coletanea_id);
CREATE INDEX idx_bloco_conteudo ON item_bloco(conteudo);
```

### Regras de cascade

- Ao excluir um `ItemColetanea`, todos os seus `ItemBloco` são excluídos automaticamente (ON DELETE CASCADE).
- Itens usados em Roteiros são snapshots — não há referência direta do Roteiro para o Catálogo, então a exclusão não afeta Roteiros existentes.

## Formato da API

### GET /api/itens

Query params:
- `q` (opcional): texto para busca em título e blocos
- `tipo` (opcional): filtro por tipo exato
- `offset` (opcional, padrão 0): paginação
- `limit` (opcional, padrão 20): limite por página

Response 200:
```json
{
  "itens": [
    {
      "id": 1,
      "titulo": "Ave Maria",
      "tipo": "Canto",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 45,
  "offset": 0,
  "limit": 20
}
```

### GET /api/itens/:id

Response 200:
```json
{
  "id": 1,
  "titulo": "Ave Maria",
  "tipo": "Canto",
  "blocos": [
    {
      "id": 1,
      "tipo": "estrofe",
      "conteudo": "Ave Maria, cheia de graça...",
      "ordem": 1
    },
    {
      "id": 2,
      "tipo": "estrofe",
      "conteudo": "Santa Maria, Mãe de Deus...",
      "ordem": 2
    }
  ],
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

Response 404:
```json
{
  "error": "Item não encontrado"
}
```

### POST /api/itens

Request body:
```json
{
  "titulo": "Ave Maria",
  "tipo": "Canto",
  "blocos": [
    {
      "tipo": "estrofe",
      "conteudo": "Ave Maria, cheia de graça..."
    },
    {
      "tipo": "estrofe",
      "conteudo": "Santa Maria, Mãe de Deus..."
    }
  ]
}
```

Response 201: Mesmo formato do GET /api/itens/:id

Response 400 (validação):
```json
{
  "error": "Dados inválidos",
  "details": [
    { "field": "titulo", "message": "Título é obrigatório" },
    { "field": "tipo", "message": "Tipo deve ser: Canto, Oração, Resposta, Leitura ou Aviso" }
  ]
}
```

### PUT /api/itens/:id

Request body: Mesmo formato do POST, mas todos os campos são opcionais (parcial update). Blocos são substituídos completamente (não merge).

Response 200: Mesmo formato do GET /api/itens/:id

### DELETE /api/itens/:id

Response 204: Sem conteúdo

Response 404:
```json
{
  "error": "Item não encontrado"
}
```

## Regras de Validação

### ItemColetanea

| Campo | Obrigatório | Regra |
|-------|-------------|-------|
| titulo | Sim | Não vazio, máx. 255 caracteres |
| tipo | Sim | Um de: Canto, Oração, Resposta, Leitura, Aviso |
| blocos | Sim | Array com pelo menos 1 bloco |

### ItemBloco

| Campo | Obrigatório | Regra |
|-------|-------------|-------|
| tipo | Sim | Um de: estrofe, paragrafo, versiculo, canto, refrao |
| conteudo | Sim | Não vazio |
| ordem | Automático | Gerenciado pelo backend (posición no array) |

## Risks / Trade-offs

- **[Risco] Performance da busca textual com LIKE** → Mitigação: Índices nas colunas `titulo` e `bloco.conteudo`. Para volumes muito altos, considerar FTS5 ou PostgreSQL no futuro.
- **[Trade-off] Tabela separada vs JSON** → Mais joins, mas melhor consultabilidade e normalização. Aceitável para o volume esperado.
- **[Risco] Migração futura para PostgreSQL** → Mitigação: Usar SQL compatível, evitar functions específicas do SQLite.

## Migration Plan

1. Criar banco SQLite com schema inicial (item_coletanea + item_bloco)
2. Implementar backend com Express + TypeScript (Clean Architecture)
3. Implementar frontend com React + TypeScript
4. Testar fluxos CRUD completos
5. Deploy local para validação
