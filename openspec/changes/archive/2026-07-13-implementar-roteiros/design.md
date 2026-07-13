## Context

O sistema de Projeção Litúrgica já possui o contexto de Catálogo implementado (ItemColetanea com blocos semânticos). Agora é necessário implementar o contexto de Execução — os Roteiros — que são as linhas do tempo dinâmicas para celebrações. O Roteiro é um agregado que contém snapshots do catálogo e itens ad-hoc, formando a sequência cronológica da missa/evento.

## Goals / Non-Goals

**Goals:**
- Implementar CRUD de Roteiros (criar, listar, editar, excluir)
- Criar ItemRoteiro com snapshot isolado do ItemColetanea
- Suportar itens ad-hoc (itens temporários exclusivos do roteiro)
- Implementar reordenação dinâmica de itens
- Adicionar MomentoLiturgico opcional por ItemRoteiro
- Configurar marca d'água por ItemRoteiro
- Manter Clean Architecture + DDD

**Non-Goals:**
- Motor de Projeção em Tempo Real (será change separado)
- WebSocket ou sincronização em tempo real
- Interface do Modo Play
- Tela do Projetor

## Decisions

### 1. Database: Tabelas separadas para Roteiro, ItemRoteiro e ItemRoteiroBloco

**Rationale:** Normalização relacional permite consultas eficientes e manutenção de integridade. Snapshot dos blocos em tabela separada permite busca e paginação no futuro.

**Decision:** Criar 3 tabelas:
- `roteiro`: id, titulo, descricao, data_celebracao, created_at, updated_at
- `item_roteiro`: id, roteiro_id, item_coletanea_id (nullable), titulo_snapshot, tipo_snapshot, momento_liturgico, posicao, is_ad_hoc, marca_agua_ativa, created_at
- `item_roteiro_bloco`: id, item_roteiro_id, tipo, conteudo, ordem, created_at

### 2. Snapshot: Cópia completa na criação do ItemRoteiro

**Rationale:** Snapshot isolado garante que alterações posteriores no catálogo não afetem roteiros já criados. Conforme especificação: "manter inalterados os snapshots dos ItemRoteiro criados anteriormente".

**Decision:** Ao adicionar um ItemColetanea a um Roteiro, copiar título, tipo e todos os blocos para as tabelas de snapshot. A referência ao ItemColetanea de origem é mantida para rastreabilidade mas não é usada para exibição.

### 3. Itens ad-hoc: Mesma estrutura, sem referência ao catálogo

**Rationale:** Itens ad-hoc usam a mesma estrutura de snapshot mas sem item_coletanea_id. Isso permite reutilizar a lógica de exibição e mantém consistência.

**Decision:** ItemRoteiro ad-hoc tem item_coletanea_id = NULL e preenche titulo_snapshot e tipo_snapshot diretamente. Os blocos são criados na tabela item_roteiro_bloco.

### 4. Reordenação: Campo posicao com atualização em cascata

**Rationale:** Manter positions simples com integers permite ordenação eficiente. Atualização em cascata garante consistência.

**Decision:** Campo `posicao` NOT NULL na tabela item_roteiro. Ao mover um item, atualizar posicao do item movido e dos afetados. Usar transação para garantir atomicidade.

**Regras de validação:**
- O array `item_ids` deve conter TODOS os itens do roteiro (sem adições ou remoções)
- Não podem haver IDs duplicados
- As posições serão atribuídas pela ordem no array (índice + 1)
- Operação atômica: ou todas as posições são atualizadas ou nenhuma

### 5. MomentoLiturgico: Enum com valores litúrgicos

**Rationale:** MomentoLiturgico representa a função do item na celebração (Entrada, Ofertório, Comunhão, etc.) e é independente do tipo.

**Decision:** Criar enum MomentoLiturgico com valores: Entrada, Ofertório, Comunhão, Preparação, Ato Penitencial, Aclamação, Oração dos Fiéis, Outro. Campo nullable no ItemRoteiro.

### 6. Marca d'água: Configuração por ItemRoteiro

**Rationale:** Cada ItemRoteiro pode ter configuração própria de marca d'água para seus Slides.

**Decision:** Campo booleano `marca_agua_ativa` no ItemRoteiro (padrão true). Pode ser expandido no futuro para incluir texto da marca d'água.

### 7. API REST: Endpoints para CRUD e operações de compose

**Rationale:** Operações síncronas conforme especificação do contexto de Execução (REST para montagem).

**Endpoints:**
- GET /api/roteiros - Listar roteiros (com paginação)
- GET /api/roteiros/:id - Buscar roteiro com itens
- POST /api/roteiros - Criar roteiro
- PUT /api/roteiros/:id - Atualizar roteiro
- DELETE /api/roteiros/:id - Excluir roteiro (cascade)
- POST /api/roteiros/:id/itens - Adicionar item do catálogo
- POST /api/roteiros/:id/itens/ad-hoc - Criar item ad-hoc
- PUT /api/roteiros/:id/itens/:itemId - Atualizar item (momento, marca d'água)
- DELETE /api/roteiros/:id/itens/:itemId - Remover item
- PUT /api/roteiros/:id/itens/reorder - Reordenar itens

## Database Schema

### Tabela: roteiro

```sql
CREATE TABLE roteiro (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_celebracao DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roteiro_titulo ON roteiro(titulo);
CREATE INDEX idx_roteiro_data ON roteiro(data_celebracao);
```

### Tabela: item_roteiro

```sql
CREATE TABLE item_roteiro (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roteiro_id INTEGER NOT NULL,
  item_coletanea_id INTEGER,
  titulo_snapshot TEXT NOT NULL,
  tipo_snapshot TEXT NOT NULL CHECK(tipo_snapshot IN ('Canto', 'Oração', 'Resposta', 'Leitura', 'Aviso')),
  momento_liturgico TEXT CHECK(momento_liturgico IN ('Entrada', 'Ofertório', 'Comunhão', 'Preparação', 'Ato Penitencial', 'Aclamação', 'Oração dos Fiéis', 'Outro')),
  posicao INTEGER NOT NULL,
  is_ad_hoc BOOLEAN DEFAULT FALSE,
  marca_agua_ativa BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (roteiro_id) REFERENCES roteiro(id) ON DELETE CASCADE,
  FOREIGN KEY (item_coletanea_id) REFERENCES item_coletanea(id) ON DELETE SET NULL
);

CREATE INDEX idx_item_roteiro_roteiro ON item_roteiro(roteiro_id);
CREATE INDEX idx_item_roteiro_posicao ON item_roteiro(roteiro_id, posicao);
```

### Tabela: item_roteiro_bloco

```sql
CREATE TABLE item_roteiro_bloco (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_roteiro_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('estrofe', 'paragrafo', 'versiculo', 'canto', 'refrao')),
  conteudo TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_roteiro_id) REFERENCES item_roteiro(id) ON DELETE CASCADE
);

CREATE INDEX idx_roteiro_bloco_item ON item_roteiro_bloco(item_roteiro_id);
```

### Regras de cascade

- Ao excluir um `Roteiro`, todos os seus `ItemRoteiro` são excluídos (cascade)
- Ao excluir um `ItemRoteiro`, todos os seus `ItemRoteiroBloco` são excluídos (cascade)
- Se o `ItemColetanea` de origem for excluído, `item_coletanea_id` fica NULL (SET NULL) — o snapshot permanece

## Regras de Validação

### Roteiro

| Campo | Obrigatório | Regra |
|-------|-------------|-------|
| titulo | Sim | Não vazio, máx. 255 caracteres |
| descricao | Não | Máx. 500 caracteres |
| data_celebracao | Não | Formato ISO 8601 (YYYY-MM-DD) |

### ItemRoteiro (adição do catálogo)

| Campo | Obrigatório | Regra |
|-------|-------------|-------|
| item_coletanea_id | Sim | ID deve existir na tabela item_coletanea |
| momento_liturgico | Não | Enum válido ou null |

### ItemRoteiro (adição ad-hoc)

| Campo | Obrigatório | Regra |
|-------|-------------|-------|
| titulo | Sim | Não vazio, máx. 255 caracteres |
| tipo | Sim | Enum: Canto, Oração, Resposta, Leitura, Aviso |
| blocos | Sim | Array com pelo menos 1 bloco |
| blocos[].tipo | Sim | Enum: estrofe, paragrafo, versiculo, canto, refrao |
| blocos[].conteudo | Sim | Não vazio |

### Reordenação

| Campo | Obrigatório | Regra |
|-------|-------------|-------|
| item_ids | Sim | Array com TODOS os IDs dos itens do roteiro |
| item_ids | Validação | Sem duplicatas, todos os IDs devem existir no roteiro |

## Formato da API

### GET /api/roteiros

Query params:
- `offset` (opcional, padrão 0): paginação
- `limit` (opcional, padrão 20): limite por página

Response 200:
```json
{
  "roteiros": [
    {
      "id": 1,
      "titulo": "Missa de Ramos",
      "descricao": "Celebração dominical",
      "data_celebracao": "2025-03-30",
      "created_at": "2025-03-28T10:00:00Z",
      "updated_at": "2025-03-28T10:00:00Z"
    }
  ],
  "total": 5,
  "offset": 0,
  "limit": 20
}
```

### GET /api/roteiros/:id

Response 200:
```json
{
  "id": 1,
  "titulo": "Missa de Ramos",
  "descricao": "Celebração dominical",
  "data_celebracao": "2025-03-30",
  "itens": [
    {
      "id": 1,
      "titulo": "Entrada dos Ramos",
      "tipo": "Canto",
      "momento_liturgico": "Entrada",
      "posicao": 1,
      "is_ad_hoc": false,
      "marca_agua_ativa": true,
      "item_coletanea_id": 15,
      "blocos": [
        {
          "id": 1,
          "tipo": "estrofe",
          "conteudo": "Senhor dos céus e da terra...",
          "ordem": 1
        }
      ]
    }
  ],
  "created_at": "2025-03-28T10:00:00Z",
  "updated_at": "2025-03-28T10:00:00Z"
}
```

### POST /api/roteiros

Request body:
```json
{
  "titulo": "Missa de Ramos",
  "descricao": "Celebração dominical",
  "data_celebracao": "2025-03-30"
}
```

Response 201: Mesmo formato do GET /api/roteiros/:id (sem itens)

### POST /api/roteiros/:id/itens

Request body:
```json
{
  "item_coletanea_id": 15,
  "momento_liturgico": "Entrada"
}
```

Response 201: ItemRoteiro criado com snapshot

### POST /api/roteiros/:id/itens/ad-hoc

Request body:
```json
{
  "titulo": "Aviso da Pastoral",
  "tipo": "Aviso",
  "blocos": [
    {
      "tipo": "paragrafo",
      "conteudo": "Amanhã terá ensaio do coral..."
    }
  ]
}
```

Response 201: ItemRoteiro ad-hoc criado

### PUT /api/roteiros/:id/itens/reorder

Request body:
```json
{
  "item_ids": [3, 1, 2, 4]
}
```

Response 200: Ordem atualizada

Response 400 (validação):
```json
{
  "error": "Dados inválidos",
  "details": [
    { "field": "item_ids", "message": "Deve conter todos os itens do roteiro" }
  ]
}
```

## Risks / Trade-offs

- **[Risco] Performance da reordenação** → Mitigação: Usar transação e atualizar apenas posições afetadas. Para listas muito longas (>50 itens), considerar positions fracionadas no futuro.
- **[Trade-off] Snapshot completo vs referência** → Snapshot consome mais espaço mas garante isolamento. Aceitável para o volume esperado.
- **[Risco] Consistência na reordenação** → Mitigação: Usar transação SQLite para garantir atomicidade das atualizações de posição. Validar que item_ids contém todos os itens.

## Migration Plan

1. Criar tabelas roteiro, item_roteiro, item_roteiro_bloco
2. Implementar repositório SQLite para Roteiro
3. Implementar use cases de CRUD e compose
4. Implementar API REST
5. Testar fluxos completos
