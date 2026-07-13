# Projeção em Tempo Real

## Purpose

Controlar e projetar Slides de um Roteiro com baixa latência, operação offline e tela de projetor desacoplada.

## Requirements

### Requirement: Painel operacional e tela do projetor

O sistema SHALL fornecer um painel do operador com Acervo, Roteiro e pré-visualização dos Slides do ItemRoteiro ativo.

O sistema SHALL fornecer uma tela de projetor desacoplada que exiba somente o texto do Slide ativo em tela cheia.

#### Scenario: Exibir slide na tela desacoplada

- **WHEN** o operador selecionar um Slide para projeção
- **THEN** a tela do projetor SHALL exibir somente o conteúdo do Slide selecionado

### Requirement: Navegação contínua em Modo Play

O Modo Play SHALL exibir uma barra de status fixa com o ItemRoteiro ativo e a paginação do Slide, como "Slide 2 / 4".

Seta Direita e Seta Baixo SHALL avançar um Slide. Na última página de um ItemRoteiro, esses atalhos SHALL avançar para o primeiro Slide do próximo ItemRoteiro.

Seta Esquerda e Seta Cima SHALL retroceder um Slide. Na primeira página de um ItemRoteiro, esses atalhos SHALL retornar ao último Slide do ItemRoteiro anterior.

#### Scenario: Avançar além do último slide

- **WHEN** o operador usar Seta Direita ou Seta Baixo no último Slide de um ItemRoteiro
- **THEN** o sistema SHALL projetar o primeiro Slide do próximo ItemRoteiro

### Requirement: Marca d'água por ItemRoteiro

O sistema SHALL permitir ativar ou desativar a marca d'água para cada ItemRoteiro.

O sistema SHALL aplicar a configuração da marca d'água aos Slides projetados daquele ItemRoteiro e SHALL NOT oferecer customização de fonte, cor ou fundo dos Slides.

#### Scenario: Projetar item sem marca d'água

- **WHEN** o ItemRoteiro ativo tiver a marca d'água desativada
- **THEN** o sistema SHALL ocultar a marca d'água em todos os seus Slides projetados

### Requirement: Paginação no rodapé do Slide

O sistema SHALL exibir, no rodapé de cada Slide gerado a partir de um ItemColetanea ou ItemRoteiro, sua posição e o total de Slides daquele item no formato "atual/total", como "2/5".

A paginação SHALL ser calculada no contexto do item exibido e SHALL ser atualizada quando a quantidade de Slides do item mudar.

#### Scenario: Exibir a posição de um slide intermediário

- **WHEN** o segundo Slide de um item com cinco Slides estiver projetado
- **THEN** o sistema SHALL exibir "2/5" no rodapé do Slide

### Requirement: Sincronização e continuidade offline

O sistema SHALL sincronizar comandos e o Slide ativo por WebSocket quando a rede estiver disponível.

Antes ou durante o início da apresentação, o sistema SHALL disponibilizar localmente o Roteiro em apresentação e seus Slides. A apresentação SHALL permanecer navegável e projetável sem conexão de rede após essa disponibilidade local.

#### Scenario: Perder a rede durante a apresentação

- **WHEN** a conexão de rede for perdida enquanto um Roteiro estiver em apresentação
- **THEN** o operador SHALL continuar navegando pelos Slides disponíveis localmente
- **AND** a tela do projetor local SHALL continuar recebendo as alterações de Slide

### Requirement: Baixa latência de projeção

O sistema SHALL atualizar a tela do projetor em menos de 100 ms após um comando do operador, nas condições normais da instalação.

#### Scenario: Comando de avanço

- **WHEN** o operador executar um comando de avanço de Slide
- **THEN** o Slide seguinte SHALL ser disponibilizado na tela do projetor em menos de 100 ms
