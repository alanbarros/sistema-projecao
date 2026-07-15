## Context

O sistema possui dois contextos de dados independentes: o Catálogo (itens permanentes e reutilizáveis) e os Roteiros (itens dinâmicos com snapshot isolado). Itens ad-hoc são criados direto nos Roteiros sem vínculo ao Catálogo — `isAdHoc = true`, `itemColetaneaId = null`.

Atualmente, não há mecanismo para "promover" um item ad-hoc ao Catálogo. O operador precisa recriá-lo manualmente no formulário de cadastro do Catálogo, copiando título, tipo e blocos.

A arquitetura segue Clean Architecture com DDD: entidades de domínio, interfaces de repository, use cases, rotas Express e frontend React.

## Goals / Non-Goals

**Goals:**
- Permitir extrair dados de um ItemRoteiro ad-hoc e persisti-los como novo ItemColetanea no catálogo
- Manter o ItemRoteiro original intacto (sem vínculo, sem mudança de estado)
- Fornecer modal para revisar título/tipo antes de salvar
- Seguir padrões existentes de use case, repository e rotas

**Non-Goals:**
- Criar vínculo entre o ItemRoteiro e o novo ItemColetanea
- Detectar duplicatas no catálogo (deixa para o operador decidir)
- Modificar itens ad-hoc existentes
- Alterar o comportamento de criação de ad-hoc ou catalog existente

## Decisions

### 1. Extração sem vínculo (Opção B)

**Decisão:** O ItemRoteiro original NÃO é modificado. A extração cria um "gêmeo" no Catálogo.

**Alternativa considerada:** Opção A — atualizar `itemColetaneaId` e `isAdHoc` do ItemRoteiro após criar o Catálogo. Rejeitada porque:
- Altera o histórico do roteiro (um item que era ad-hoc passa a ser catalogado)
- Viola o princípio de snapshot isolado

**Justificativa:** Preserva integridade histórica do Roteiro. O operador pode adicionar o novo item do Catálogo a outros Roteiros se quiser reutilizar.

### 2. Use case dedicado `ExtrairAdHocParaCatalogoUseCase`

**Decisão:** Criar um use case específico em vez de reusar `CriarItemUseCase`.

**Alternativa considerada:** Chamar `CriarItemUseCase` diretamente da rota. Rejeitada porque:
- `CriarItemUseCase` não valida se a origem é um ad-hoc válido
- A lógica de buscar o ItemRoteiro, extrair dados e mapear para o DTO de criação é responsabilidade específica dessa feature
- Separação de responsabilidades: o use case de catálogo não precisa saber de roteiros

**Detalhe de implementação:** O construtor recebe dois repositórios — `IItemReiroRepository` (para ler o ad-hoc) e `IItemColetaneaRepository` (para escrever no catálogo). O método `criar()` existente no `IItemColetaneaRepository` já aceita `CriarItemColetaneaDTO` com titulo, tipo e blocos — não há necessidade de criar um método novo no repository. O use case monta o DTO a partir do snapshot e delega a criação.

### 3. Modal com pré-visualização read-only dos blocos

**Decisão:** O modal exibe título editável, tipo selecionável e blocos como lista estática de texto (não `BlocoEditor`).

**Justificativa:** Blocos já vieram prontos do ad-hoc. Editar blocos no modal adicionaria complexidade sem benefício — o operador pode editar no catálogo depois de salvar. O modal serve para revisar metadados, não conteúdo. Usar `BlocoEditor` em modo read-only adicionaria dependência desnecessária; uma lista de texto é mais leve e clara.

### 4. Endpoint REST `POST /api/roteiros/:id/itens/:itemId/salvar-no-catalogo`

**Decisão:** Endpoint dedicado no escopo do roteiro, não um endpoint genérico no catálogo.

**Justificativa:** A ação parte do contexto do roteiro (estamos no editor de roteiro). O `:id` do roteiro garante que o item pertence ao roteiro correto. Coerente com o padrão de rotas existente em `roteiros.ts`.

### 5. Toast de feedback, sem redirect

**Decisão:** Após sucesso, exibir toast "Salvo no catálogo!" e permanecer na mesma tela.

**Justificativa:** O operador continua trabalhando no roteiro. Redirect para o catálogo quebraria o fluxo.

**Detalhe de implementação:** Não existe sistema de toast no codebase. Será criado um componente `Toast` simples (JSX + CSS, sem dependência externa) que exibe a mensagem por 3 segundos com fade out. Controlado por state no componente pai.

## Risks / Trade-offs

- **Duplicatas no catálogo** → Mitigação: aceitar como trade-off intencional. O operador é responsável por verificar se o item já existe. Futuro: checagem por similaridade.
- **Sem indicador de "já salvo"** → Mitigação: o ItemRoteiro continua `isAdHoc = true` sem rastro da extração. Opção consciente para manter simplicidade.
- **Edição limitada no modal** → Mitigação: blocos são read-only no modal. Operador pode editar no catálogo depois. Reduz complexidade do modal.
