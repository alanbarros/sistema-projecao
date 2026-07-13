## 1. Setup do Projeto

- [x] 1.1 Criar estrutura de monorepo: src/domain, src/application, src/infrastructure, src/ui, src/shared
- [x] 1.2 Configurar package.json raiz com workspaces
- [x] 1.3 Configurar TypeScript no backend (infrastructure) e frontend (ui)
- [x] 1.4 Instalar dependências básicas (Express, React, SQLite, etc.)

## 2. Camada de Domínio

- [x] 2.1 Definir enum ItemType (Canto, Oração, Resposta, Leitura, Aviso)
- [x] 2.2 Definir enum BlockType (estrofe, paragrafo, versiculo, canto, refrao)
- [x] 2.3 Criar entidade ItemBloco (id, tipo, conteudo, ordem)
- [x] 2.4 Criar entidade ItemColetanea (id, titulo, tipo, blocos, created_at, updated_at)
- [x] 2.5 Definir interface IItemColetaneaRepository (buscarPorId, listar, buscar, criar, atualizar, excluir)

## 3. Camada de Infraestrutura - Database

- [x] 3.1 Criar schema SQLite: tabela item_coletanea com índices
- [x] 3.2 Criar schema SQLite: tabela item_bloco com índices e foreign key
- [x] 3.3 Implementar repositório SQLite para ItemColetanea
- [x] 3.4 Implementar busca textual com LIKE e índices
- [x] 3.5 Implementar paginação (offset/limit)
- [x] 3.6 Implementar cascade na exclusão (onDelete: cascade)

## 4. Camada de Aplicação (Use Cases)

- [x] 4.1 Criar use case CriarItem (validar dados, persistir item e blocos)
- [x] 4.2 Criar use case ListarItens (buscar, filtrar por tipo, paginar)
- [x] 4.3 Criar use case BuscarItemPorId (retornar item com blocos)
- [x] 4.4 Criar use case EditarItem (validar, substituir blocos)
- [x] 4.5 Criar use case ExcluirItem (excluir item e blocos via cascade)

## 5. Camada de Infraestrutura - API

- [x] 5.1 Configurar servidor Express com rotas
- [x] 5.2 Implementar GET /api/itens (query params: q, tipo, offset, limit)
- [x] 5.3 Implementar GET /api/itens/:id (retorna item com blocos)
- [x] 5.4 Implementar POST /api/itens (validação + criação)
- [x] 5.5 Implementar PUT /api/itens/:id (validação + atualização)
- [x] 5.6 Implementar DELETE /api/itens/:id (exclusão com cascade)
- [x] 5.7 Implementar tratamento de erros (400, 404, 500)

## 6. Camada de UI (React)

- [x] 6.1 Configurar React com TypeScript e roteamento
- [x] 6.2 Criar componentes base (Layout, Header, Sidebar)
- [x] 6.3 Configurar estado global (Context API ou Zustand)
- [x] 6.4 Criar serviço de API (fetch/axios com tratamento de erros)

## 7. UI - Páginas do Catálogo

- [x] 7.1 Criar página de listagem de itens com paginação
- [x] 7.2 Implementar componente de filtro por tipo
- [x] 7.3 Implementar busca textual em tempo real (debounce)
- [x] 7.4 Criar formulário de criação de ItemColetanea
- [x] 7.5 Criar formulário de edição de ItemColetanea
- [x] 7.6 Implementar gerenciamento de blocos (adicionar, remover, reordenar)
- [x] 7.7 Implementar validação client-side nos formulários

## 8. Validação e Regras de Negócio

- [x] 8.1 Validar título obrigatório e máx. 255 caracteres
- [x] 8.2 Validar tipo obrigatório (enum válido)
- [x] 8.3 Validar blocos obrigatórios (mínimo 1)
- [x] 8.4 Validar tipo do bloco (enum válido)
- [x] 8.5 Validar conteúdo do bloco (não vazio)

## 9. Testes e Integração

- [x] 9.1 Testar CRUD completo via API (postman/curl)
- [x] 9.2 Testar busca por título e conteúdo
- [x] 9.3 Testar filtro por tipo
- [x] 9.4 Testar paginação
- [x] 9.5 Testar validação de dados inválidos
- [x] 9.6 Testar exclusão em cascade
- [x] 9.7 Testar fluxo completo via interface
