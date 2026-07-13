## MODIFIED Requirements

### Requirement: Cadastro de ItemColetanea

O sistema SHALL permitir criar, consultar, editar e excluir um ItemColetanea permanente no catálogo.

Cada ItemColetanea SHALL possuir título, tipo e conteúdo estruturado em blocos semânticos. Um bloco semântico representa, por exemplo, uma estrofe, parágrafo ou versículo e permite a posterior distribuição em Slides.

Alterações em um ItemColetanea SHALL afetar somente o catálogo e SHALL NOT alterar snapshots de ItemRoteiro previamente criados.

#### Scenario: Cadastrar um canto no catálogo

- **WHEN** o operador cadastrar um ItemColetanea do tipo Canto com título e blocos de texto válidos
- **THEN** o sistema SHALL persistir o item no catálogo
- **AND** o item SHALL estar disponível para busca e inclusão em Roteiros

#### Scenario: Editar conteúdo catalogado

- **WHEN** o operador alterar o conteúdo de um ItemColetanea existente
- **THEN** o sistema SHALL persistir o novo conteúdo no catálogo
- **AND** SHALL manter inalterados os snapshots dos ItemRoteiro criados anteriormente a partir desse item
