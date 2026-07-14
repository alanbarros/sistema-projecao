## MODIFIED Requirements

### Requirement: Interface de gestão de roteiros

O sistema SHALL fornecer uma interface para listar, criar, editar e gerenciar Roteiros.

A interface SHALL exibir a lista de roteiros com título e data, e SHALL permitir acessar o editor de cada roteiro. O editor de Roteiro SHALL incluir um acionamento explícito para iniciar o Modo Play do Roteiro atual.

#### Scenario: Acessar editor de roteiro

- **WHEN** o operador selecionar um Roteiro na listagem
- **THEN** o sistema SHALL exibir a tela do editor com a lista ordenada de ItemRoteiro

#### Scenario: Adicionar item do catálogo via interface

- **WHEN** o operador selecionar um ItemColetanea do catálogo e adicionar ao roteiro
- **THEN** o sistema SHALL criar o ItemRoteiro com snapshot e exibir na lista

#### Scenario: Navegar na paginação de roteiros

- **WHEN** houver mais de 20 roteiros cadastrados
- **THEN** o sistema SHALL exibir controles de paginação
- **AND** SHALL permitir navegar entre páginas

#### Scenario: Iniciar Modo Play a partir do editor

- **WHEN** o operador acionar o comando de Play no editor do Roteiro
- **THEN** o sistema SHALL navegar para a tela do Modo Play com o primeiro ItemRoteiro ativo
