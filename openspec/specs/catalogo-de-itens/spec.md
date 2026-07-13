# Catálogo de Itens

## Purpose

Manter o acervo permanente de conteúdos litúrgicos reutilizáveis.

## Requirements

### Requirement: Cadastro de ItemColetanea

O sistema SHALL permitir criar, consultar, editar e excluir um ItemColetanea permanente no catálogo.

Cada ItemColetanea SHALL possuir título, tipo e conteúdo estruturado em blocos semânticos. Um bloco semântico representa, por exemplo, uma estrofe, parágrafo ou versículo e permite a posterior distribuição em Slides.

#### Scenario: Cadastrar um canto no catálogo

- **WHEN** o operador cadastrar um ItemColetanea do tipo Canto com título e blocos de texto válidos
- **THEN** o sistema SHALL persistir o item no catálogo
- **AND** o item SHALL estar disponível para busca e inclusão em Roteiros

#### Scenario: Editar conteúdo catalogado

- **WHEN** o operador alterar o conteúdo de um ItemColetanea existente
- **THEN** o sistema SHALL persistir o novo conteúdo
- **AND** SHALL propagar a atualização aos ItemRoteiro vinculados a esse item

### Requirement: Tipos compartilhados de itens

O sistema SHALL classificar ItemColetanea e ItemRoteiro usando o mesmo conjunto de tipos: Canto, Oração, Resposta, Leitura e Aviso.

O tipo SHALL descrever a natureza do conteúdo, e não o momento em que ele ocorre na celebração.

#### Scenario: Classificar um item do catálogo

- **WHEN** o operador cadastrar ou editar um ItemColetanea
- **THEN** o sistema SHALL exigir a seleção de um dos tipos compartilhados

### Requirement: Busca no catálogo

O sistema SHALL permitir buscar ItemColetanea por título, texto presente nos seus blocos semânticos e tipo.

#### Scenario: Encontrar conteúdo por trecho textual

- **WHEN** o operador pesquisar uma palavra presente em um bloco semântico
- **THEN** o sistema SHALL retornar os ItemColetanea correspondentes
