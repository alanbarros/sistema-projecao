## Why

O sistema precisa de um acervo permanente de conteúdos litúrgicos reutilizáveis (músicas, orações, etc.) para fundamentar a criação de Roteiros. Esta é a primeira etapa de implementação do sistema completo.

## What Changes

- API REST para CRUD de ItemColetanea com validação completa
- Interface React para listar, buscar, criar e editar itens do catálogo
- Tipos compartilhados: Canto, Oração, Resposta, Leitura, Aviso
- Busca textual por título e conteúdo dos blocos semânticos
- Estrutura de blocos semânticos em tabela separada (ItemBloco)
- Paginação cursor-based nas listagens
- Arquitetura Clean Architecture + DDD conforme AGENTS.md

## Capabilities

### New Capabilities

- `catalogo-de-itens`: CRUD de ItemColetanea permanente com classificação por tipos, busca textual e paginação

### Modified Capabilities

<!-- Nenhuma capacidade existente será modificada -->

## Impact

- Backend: Novos endpoints REST com validação e tratamento de erros
- Frontend: Novos componentes React para gestão do catálogo
- Database: Duas tabelas (item_coletanea, item_bloco) com cascade
- Tipos compartilhados em src/shared/
- Arquitetura: Separação em camadas (Domínio, Aplicação, Infraestrutura, UI)
