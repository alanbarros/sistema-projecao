## MODIFIED Requirements

### Requirement: CRUD de Roteiro

O sistema SHALL permitir criar, consultar, editar e excluir um Roteiro (celebração/evento).

Cada Roteiro SHALL possuir título obrigatório (máx. 255 caracteres), descrição opcional (máx. 500 caracteres), data de celebração opcional e marca d'água opcional (referência a MarcaDagua). O Roteiro SHALL conter uma sequência ordenada de ItemRoteiro.

#### Scenario: Criar um roteiro para missa

- **WHEN** o operador criar um Roteiro com título "Missa de Ramos" e data de celebração
- **THEN** o sistema SHALL persistir o Roteiro no banco
- **AND** o Roteiro SHALL estar vazio (sem itens)

#### Scenario: Criar roteiro com marca d'água

- **WHEN** o operador criar um Roteiro selecionando uma MarcaDagua
- **THEN** o sistema SHALL associar a marca d'água ao roteiro
- **AND** todos os Slides projetados desse roteiro SHALL exibir a marca d'água selecionada

#### Scenario: Criar roteiro sem marca d'água

- **WHEN** o operador criar um Roteiro sem selecionar marca d'água
- **THEN** o sistema SHALL persistir o Roteiro com marca_dagua_id NULL
- **AND** os Slides projetados SHALL exibir sem marca d'água

#### Scenario: Tentar criar roteiro sem título

- **WHEN** o operador tentar criar um Roteiro sem título
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação

#### Scenario: Listar roteiros

- **WHEN** o operador acessar a listagem de roteiros
- **THEN** o sistema SHALL retornar os Roteiros ordenados por data de celebração
- **AND** SHALL suportar paginação (offset/limit)

#### Scenario: Excluir roteiro com itens

- **WHEN** o operador excluir um Roteiro que possui 5 ItemRoteiro
- **THEN** o sistema SHALL excluir o Roteiro e todos os seus ItemRoteiro e ItemRoteiroBloco (cascade)

#### Scenario: Editar marca d'água do roteiro

- **WHEN** o operador alterar a marca d'água de um Roteiro existente
- **THEN** o sistema SHALL atualizar a referência
- **AND** os Slides futuros SHALL usar a nova marca d'água
