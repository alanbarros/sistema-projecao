## MODIFIED Requirements

### Requirement: Interface de gestão de roteiros

O sistema SHALL fornecer uma interface para listar, criar, editar e gerenciar Roteiros.

A interface SHALL exibir a lista de roteiros como cards horizontais com badge de data (quadrado com dia da semana + número do dia), título, descrição com data e contagem de itens, e seta de navegação à direita. A busca SHALL estar em um formulário toolbar dentro de um container card.

O cabeçalho SHALL usar o padrão eyebrow + título h2 + descrição + botão de ação. O editor de Roteiro SHALL incluir um layout em 2 colunas: sequência de itens à esquerda e painel de adicionar à direita.

#### Scenario: Acessar editor de roteiro

- **WHEN** o operador selecionar um Roteiro na listagem
- **THEN** o sistema SHALL exibir a tela do editor com layout em 2 colunas: lista ordenada de ItemRoteiro à esquerda e painel para adicionar itens à direita

#### Scenario: Adicionar item do catálogo via interface

- **WHEN** o operador selecionar um ItemColetânea do catálogo e adicionar ao roteiro
- **THEN** o sistema SHALL criar o ItemRoteiro com snapshot e exibir na lista

#### Scenario: Navegar na paginação de roteiros

- **WHEN** houver mais de 20 roteiros cadastrados
- **THEN** o sistema SHALL exibir controles de paginação
- **AND** SHALL permitir navegar entre páginas

#### Scenario: Iniciar Modo Play a partir do editor

- **WHEN** o operador acionar o comando de Play no editor do Roteiro
- **THEN** o sistema SHALL navegar para a tela do Modo Play com o primeiro ItemRoteiro ativo
