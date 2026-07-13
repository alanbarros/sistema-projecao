## Why

O sistema precisa de um contexto dinâmico para montagem de celebrações (missas, eventos) que permite ao operador criar linhas do tempo ordenadas com itens do catálogo e itens ad-hoc. Esta é a segunda etapa fundamental antes da implementação do Motor de Projeção em Tempo Real.

## What Changes

- CRUD de Roteiros (criar, listar, editar, excluir celebrações)
- Adição de ItemColetanea ao Roteiro com snapshot isolado
- Criação de ItemRoteiro ad-hoc (itens temporários exclusivos do roteiro)
- Reordenação dinâmica de itens dentro do Roteiro
- MomentoLiturgico opcional para cada ItemRoteiro
- Configuração de marca d'água por ItemRoteiro
- API REST para operações de montagem do roteiro
- Validação completa de dados
- Paginação nas listagens

## Capabilities

### New Capabilities

- `roteiros`: CRUD de Roteiros com composição ordenada de ItemRoteiro (snapshot e ad-hoc), reordenação, MomentoLiturgico e paginação

### Modified Capabilities

<!-- Nenhuma capacidade existente será modificada - o catálogo já suporta busca para incluir em roteiros -->

## Impact

- Backend: Novas tabelas (roteiro, item_roteiro, item_roteiro_bloco) e endpoints REST
- Frontend: Interface para montagem e edição de roteiros
- Database: Relacionamentos com cascade e snapshot de dados do catálogo
- Integração com Catálogo de Itens (leitura de ItemColetanea para snapshots)
- Validação de dados em todas as camadas
