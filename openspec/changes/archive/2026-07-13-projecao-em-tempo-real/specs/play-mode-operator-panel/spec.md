## ADDED Requirements

### Requirement: Painel do operador com divisão tripla

O sistema SHALL fornecer um painel do operador com três áreas: Acervo (busca e seleção de itens), Roteiro (lista ordenada de ItemRoteiro) e Preview (pré-visualização dos Slides do ItemRoteiro ativo).

#### Scenario: Exibir painel do operador

- **WHEN** o operador acessar o Modo Play de um Roteiro
- **THEN** o sistema SHALL exibir o painel com as três áreas: Acervo, Roteiro e Preview

#### Scenario: Selecionar item no roteiro durante o Modo Play

- **WHEN** o operador selecionar um ItemRoteiro diferente na lista do Roteiro
- **THEN** o sistema SHALL tornar ativo o primeiro Slide desse ItemRoteiro no Preview e no estado de projeção

### Requirement: Barra de status do Modo Play

O Modo Play SHALL exibir uma barra de status fixa com o ItemRoteiro ativo e a paginação do Slide no formato "Slide X / Y".

#### Scenario: Exibir status com paginação

- **WHEN** o operador estiver no Modo Play com um ItemRoteiro ativo de 4 Slides
- **THEN** a barra de status SHALL exibir o título do ItemRoteiro e "Slide 1 / 4"

#### Scenario: Atualizar paginação ao navegar

- **WHEN** o operador avançar para o terceiro Slide de um item com 4 Slides
- **THEN** a barra de status SHALL atualizar para "Slide 3 / 4"

### Requirement: Entrada no Modo Play a partir do editor

O editor de Roteiro SHALL disponibilizar um acionamento explícito para iniciar o Modo Play do Roteiro atual.

#### Scenario: Iniciar Modo Play

- **WHEN** o operador acionar o comando de Play no editor do Roteiro
- **THEN** o sistema SHALL navegar para a tela do Modo Play com o primeiro ItemRoteiro ativo
