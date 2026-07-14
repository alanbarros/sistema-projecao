## ADDED Requirements

### Requirement: Tela do Projetor desacoplada

O sistema SHALL fornecer uma tela de projetor desacoplada (janela separada) que exiba somente o texto do Slide ativo em tela cheia.

#### Scenario: Abrir a tela do Projetor

- **WHEN** o operador acionar o comando de projetar no Modo Play
- **THEN** o sistema SHALL abrir uma nova janela via `window.open()` com configurações: fullscreen, sem toolbar, sem barra de endereço
- **AND** a janela SHALL se conectar ao WebSocket do mesmo Roteiro
- **AND** SHALL manter essa janela sincronizada com os próximos comandos de navegação

#### Scenario: Fechar a tela do Projetor

- **WHEN** o operador acionar o comando de fechar projetor
- **THEN** o sistema SHALL fechar a janela do Projetor
- **AND** SHALL desconectar a conexão WebSocket associada

#### Scenario: Exibir slide na tela desacoplada

- **WHEN** o operador selecionar um Slide para projeção
- **THEN** a tela do Projetor SHALL exibir somente o conteúdo textual do Slide selecionado
- **AND** SHALL NOT exibir nenhum elemento de interface do operador

### Requirement: Paginação no rodapé do Slide

O sistema SHALL exibir, no rodapé de cada Slide projetado, sua posição e o total de Slides daquele item no formato "atual/total", como "2/5".

#### Scenario: Exibir a posição de um slide intermediário

- **WHEN** o segundo Slide de um item com cinco Slides estiver projetado
- **THEN** o sistema SHALL exibir "2/5" no rodapé do Slide

### Requirement: Marca d'água condicional

O sistema SHALL aplicar a configuração da marca d'água (ativa/inativa) do ItemRoteiro aos Slides projetados daquele item.

#### Scenario: Projetar item com marca d'água ativa

- **WHEN** o ItemRoteiro ativo tiver a marca d'água ativada
- **THEN** o sistema SHALL exibir a marca d'água em todos os seus Slides projetados

#### Scenario: Projetar item sem marca d'água

- **WHEN** o ItemRoteiro ativo tiver a marca d'água desativada
- **THEN** o sistema SHALL ocultar a marca d'água em todos os seus Slides projetados
