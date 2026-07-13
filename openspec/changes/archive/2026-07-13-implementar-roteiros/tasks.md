## 1. Camada de Domínio

- [x] 1.1 Definir enum MomentoLiturgico (Entrada, Ofertório, Comunhão, etc.)
- [x] 1.2 Criar entidade ItemRoteiroBloco (id, tipo, conteudo, ordem, created_at)
- [x] 1.3 Criar entidade ItemRoteiro (id, titulo_snapshot, tipo_snapshot, momento_liturgico, posicao, is_ad_hoc, marca_agua_ativa)
- [x] 1.4 Criar entidade Roteiro (id, titulo, descricao, data_celebracao, itens)
- [x] 1.5 Definir interface IRoteiroRepository (buscarPorId, listar, criar, atualizar, excluir)
- [x] 1.6 Definir interface IItemRoteiroRepository (buscarPorRoteiroId, criar, atualizar, excluir)

## 2. Camada de Infraestrutura - Database

- [x] 2.1 Criar schema SQLite: tabela roteiro com índices
- [x] 2.2 Criar schema SQLite: tabela item_roteiro com índices e foreign keys
- [x] 2.3 Criar schema SQLite: tabela item_roteiro_bloco com índices, foreign key e created_at
- [x] 2.4 Implementar repositório SQLite para Roteiro (com paginação)
- [x] 2.5 Implementar repositório SQLite para ItemRoteiro (com snapshot)
- [x] 2.6 Implementar operações de reordenação com transação e validação

## 3. Camada de Aplicação (Use Cases)

- [x] 3.1 Criar use case CriarRoteiro (validar titulo obrigatório, máx. 255 chars)
- [x] 3.2 Criar use case ListarRoteiros (buscar, ordenar por data, paginar)
- [x] 3.3 Criar use case BuscarRoteiroPorId (retornar roteiro com itens e blocos)
- [x] 3.4 Criar use case EditarRoteiro (validar, atualizar metadados)
- [x] 3.5 Criar use case ExcluirRoteiro (excluir com cascade)
- [x] 3.6 Criar use case AdicionarItemAoRoteiro (validar item_coletanea_id existe, criar snapshot)
- [x] 3.7 Criar use case CriarItemAdHoc (validar titulo, tipo, blocos obrigatórios)
- [x] 3.8 Criar use case AtualizarItemRoteiro (validar momento_liturgico enum válido)
- [x] 3.9 Criar use case RemoverItemDoRoteiro (excluir item e blocos)
- [x] 3.10 Criar use case ReordenarItens (validar item_ids: todos os itens, sem duplicatas, atomicidade)

## 4. Camada de Infraestrutura - API

- [x] 4.1 Configurar rotas de roteiros no servidor Express
- [x] 4.2 Implementar GET /api/roteiros (listar com paginação)
- [x] 4.3 Implementar GET /api/roteiros/:id (buscar com itens)
- [x] 4.4 Implementar POST /api/roteiros (criar com validação)
- [x] 4.5 Implementar PUT /api/roteiros/:id (atualizar)
- [x] 4.6 Implementar DELETE /api/roteiros/:id (excluir com cascade)
- [x] 4.7 Implementar POST /api/roteiros/:id/itens (adicionar do catálogo)
- [x] 4.8 Implementar POST /api/roteiros/:id/itens/ad-hoc (criar ad-hoc)
- [x] 4.9 Implementar PUT /api/roteiros/:id/itens/:itemId (atualizar item)
- [x] 4.10 Implementar DELETE /api/roteiros/:id/itens/:itemId (remover item)
- [x] 4.11 Implementar PUT /api/roteiros/:id/itens/reorder (reordenar com validação)
- [x] 4.12 Implementar tratamento de erros (400, 404, 500)

## 5. Camada de UI (React)

- [x] 5.1 Configurar rotas para roteiros no React Router
- [x] 5.2 Criar página de listagem de roteiros com paginação
- [x] 5.3 Criar formulário de criação/edição de roteiro
- [x] 5.4 Criar página do editor de roteiro (lista de itens ordenados)
- [x] 5.5 Implementar componente de seleção de ItemColetanea para adicionar ao roteiro
- [x] 5.6 Implementar formulário de criação de item ad-hoc
- [x] 5.7 Implementar controles de reordenação (mover para cima/baixo)
- [x] 5.8 Implementar edição de MomentoLiturgico por item
- [x] 5.9 Implementar toggle de marca d'água por item
- [x] 5.10 Implementar remoção de item do roteiro

## 6. Validação e Regras de Negócio

- [x] 6.1 Validar título do roteiro obrigatório (máx. 255 caracteres)
- [x] 6.2 Validar que item adicionado do catálogo existe (404 se não)
- [x] 6.3 Validar dados do item ad-hoc (título, tipo, blocos obrigatórios)
- [x] 6.4 Validar MomentoLiturgico (enum válido ou null)
- [x] 6.5 Validar posições na reordenação (todos os IDs, sem duplicatas)
- [x] 6.6 Garantir snapshot completo (título, tipo, todos os blocos)
- [x] 6.7 Validar paginação (offset/limit positivos)

## 7. Testes e Integração

- [x] 7.1 Testar CRUD completo de roteiros via API
- [x] 7.2 Testar adição de item do catálogo com snapshot
- [x] 7.3 Testar criação de item ad-hoc
- [x] 7.4 Testar reordenação de itens
- [x] 7.5 Testar exclusão em cascade (roteiro → itens → blocos)
- [x] 7.6 Testar que edição no catálogo não afeta snapshots
- [x] 7.7 Testar validação de dados inválidos
- [x] 7.8 Testar fluxo completo via interface
