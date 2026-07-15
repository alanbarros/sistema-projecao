# Projeção em Tempo Real

## Purpose

Controlar e projetar Slides de um Roteiro com baixa latência, operação offline e tela de projetor desacoplada.

## Requirements

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

O sistema SHALL herdar a marca d'água do Roteiro pai. Quando a marca d'água do Roteiro estiver definida, os Slides do ItemRoteiro SHALL exibir a marca d'água do Roteiro (SVG + texto). Quando a marca d'água do Roteiro não estiver definida, os Slides SHALL exibir sem marca d'água.

O ItemRoteiro SHALL poder desativar a marca d'água herdada do Roteiro via toggle `marcaAguaAtiva`.

O sistema SHALL aplicar a configuração da marca d'água aos Slides projetados daquele ItemRoteiro e SHALL NOT oferecer customização de fonte, cor ou fundo dos Slides.

#### Scenario: Projetar item com marca d'água do roteiro

- **WHEN** o Roteiro possuir uma MarcaDagua associada e o ItemRoteiro tiver marcaAguaAtiva = true
- **THEN** o sistema SHALL exibir o SVG da marca d'água do Roteiro em todos os Slides do item

#### Scenario: Projetar item sem marca d'água do roteiro

- **WHEN** o Roteiro NÃO possuir uma MarcaDagua associada (marca_dagua_id = NULL)
- **THEN** o sistema SHALL projetar os Slides sem marca d'água

#### Scenario: Projetar item com marca d'água desativada

- **WHEN** o ItemRoteiro ativo tiver a marca d'água desativada (marcaAguaAtiva = false)
- **THEN** o sistema SHALL ocultar a marca d'água em todos os seus Slides projetados

### Requirement: Propagação de marca d'água para Slides

O motor de geração de Slides SHALL receber o conteúdo SVG da marca d'água do Roteiro e propagá-lo para cada Slide gerado.

#### Scenario: Gerar slides com marca d'água

- **WHEN** o motor de Slides gerar Slides a partir de um Roteiro com MarcaDagua definida
- **THEN** cada Slide SHALL conter o campo `marcaAguaSvg` com o conteúdo SVG da marca d'água

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
