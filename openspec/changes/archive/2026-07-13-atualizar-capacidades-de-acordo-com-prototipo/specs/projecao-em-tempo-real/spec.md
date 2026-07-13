## ADDED Requirements

### Requirement: Seleção operacional e acionamento do Projetor

O Modo Play SHALL permitir selecionar um ItemRoteiro na linha do tempo do Roteiro e SHALL tornar ativo o primeiro Slide do item selecionado.

O painel do operador SHALL disponibilizar um acionamento explícito para abrir a tela dedicada do Projetor usando o ItemRoteiro e Slide ativos. A tela do Projetor SHALL refletir as alterações do estado de exibição sem exigir nova seleção manual.

#### Scenario: Selecionar item no roteiro durante o Modo Play

- **WHEN** o operador selecionar um ItemRoteiro diferente na lista do Roteiro
- **THEN** o sistema SHALL tornar ativo o primeiro Slide desse ItemRoteiro no preview e no estado de projeção

#### Scenario: Abrir a tela do Projetor

- **WHEN** o operador acionar o comando de projetar no Modo Play
- **THEN** o sistema SHALL abrir ou exibir a tela dedicada do Projetor com o Slide ativo
- **AND** SHALL manter essa tela sincronizada com os próximos comandos de navegação
