## MODIFIED Requirements

### Requirement: Interface de gestão do catálogo

O sistema SHALL fornecer uma interface para listar, buscar, criar e editar ItemColetanea.

A interface SHALL exibir os itens como um grid responsivo de cards (`repeat(auto-fill, minmax(245px, 1fr))`). Cada card SHALL conter a tag do tipo, título, texto preview e metadados (número de slides e ação de editar).

A interface SHALL incluir um toolbar com campo de busca (max-width 470px) e seletor de tipo dentro de um container card. O cabeçalho SHALL usar o padrão eyebrow (texto pequeno uppercase) + título h2 + descrição + botão de ação.

#### Scenario: Filtrar itens por tipo

- **WHEN** o operador selecionar o tipo "Canto" no filtro
- **THEN** o sistema SHALL exibir apenas os ItemColetanea do tipo Canto em formato de cards

#### Scenario: Criar novo item via interface

- **WHEN** o operador acessar o formulário de criação e preencher título, tipo e blocos
- **THEN** o sistema SHALL persistir o novo ItemColetanea no catálogo

#### Scenario: Navegar na paginação

- **WHEN** houver mais de 20 itens no catálogo
- **THEN** o sistema SHALL exibir controles de paginação
- **AND** SHALL permitir navegar entre páginas

### Requirement: Paginação de resultados

O sistema SHALL suportar paginação nas listagens usando offset e limit.

#### Scenario: Listar primeira página

- **WHEN** o operador acessar a listagem de itens
- **THEN** o sistema SHALL retornar os primeiros 20 itens
- **AND** SHALL informar o total de itens disponíveis

#### Scenario: Navegar para segunda página

- **WHEN** o operador solicitar a segunda página (offset=20)
- **THEN** o sistema SHALL retornar os itens 21-40
