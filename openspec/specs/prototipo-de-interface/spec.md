# Prototipo de Interface

## Purpose

Disponibilizar uma referencia visual navegavel para validar os fluxos operacionais antes da implementacao da aplicacao.

## Requirements

### Requirement: Telas navegaveis do prototipo
O prototipo SHALL disponibilizar navegacao entre as telas de Catalogo, editor de ItemColetanea, lista de Roteiros, editor de Roteiro, Modo Play e Projetor.

#### Scenario: Navegar para o editor de roteiro
- **WHEN** o usuario selecionar um Roteiro na lista ou na navegacao
- **THEN** o prototipo SHALL exibir a tela do editor de Roteiro

### Requirement: Representacao do catalogo e do roteiro
O prototipo SHALL apresentar ItemColetanea com titulo, tipo e trechos de texto e SHALL apresentar ItemRoteiro ordenado com tipo, MomentoLiturgico e origem catalogada ou ad-hoc.

O prototipo SHALL permitir filtrar visualmente o Catalogo, selecionar um item para o Roteiro e alterar visualmente a ordem dos seus ItemRoteiro.

#### Scenario: Reordenar um item do roteiro
- **WHEN** o usuario acionar o controle de mover um ItemRoteiro para cima ou para baixo
- **THEN** o prototipo SHALL atualizar a ordem exibida do Roteiro

### Requirement: Simulacao de Modo Play
O Modo Play SHALL mostrar Acervo, Roteiro e pre-visualizacao do ItemRoteiro ativo em uma unica tela operacional.

O prototipo SHALL permitir avancar e retroceder Slides por controles de interface e pelas setas do teclado, inclusive na transicao entre ItemRoteiro adjacentes.

#### Scenario: Avancar para o proximo item
- **WHEN** o usuario avancar a partir do ultimo Slide de um ItemRoteiro
- **THEN** o prototipo SHALL tornar ativo o primeiro Slide do proximo ItemRoteiro

### Requirement: Visualizacao do Projetor
O prototipo SHALL fornecer uma visualizacao dedicada do Projetor com o texto do Slide ativo, marca d'agua condicional e paginacao no rodape no formato `atual/total`.

#### Scenario: Projetar slide sem marca d'agua
- **WHEN** o ItemRoteiro ativo tiver a marca d'agua desativada
- **THEN** a visualizacao do Projetor SHALL ocultar a marca d'agua e exibir a paginacao do Slide ativo

### Requirement: Execucao local sem dependencias
O prototipo SHALL ser executavel ao abrir seu arquivo HTML em um navegador moderno, sem backend, dependencias externas ou chamadas de rede.

#### Scenario: Abrir o prototipo localmente
- **WHEN** o usuario abrir o arquivo HTML do prototipo localmente
- **THEN** as telas e as interacoes demonstrativas SHALL estar disponiveis
