## ADDED Requirements

### Requirement: Geração de Slides a partir de blocos semânticos

O sistema SHALL converter os blocos semânticos (estrofes, parágrafos, versículos) de um ItemRoteiro em Slides paginados para projeção.

A quebra de Slides SHALL respeitar o limite máximo de **500 caracteres por Slide** e SHALL preservar a coerência semântica (não separar verso de refrão, por exemplo).

O sistema SHALL renderizar a marca d'água do ItemRoteiro quando `marcaAguaAtiva` estiver ativada, exibindo texto sutil posicionado no canto inferior direito com opacidade reduzida (15-20%).

#### Scenario: Gerar múltiplos slides a partir de blocos longos

- **WHEN** um ItemRoteiro possuir um bloco de texto com conteúdo que exceda o limite de um Slide
- **THEN** o sistema SHALL dividir o conteúdo em múltiplos Slides
- **AND** cada Slide SHALL manter coerência semântica

#### Scenario: Gerar slide único para bloco curto

- **WHEN** um ItemRoteiro possuir blocos cujo conteúdo total caiba em um único Slide
- **THEN** o sistema SHALL gerar apenas um Slide para o item

#### Scenario: Renderizar marca d'água em slides

- **WHEN** um ItemRoteiro tiver `marcaAguaAtiva` definido como `true`
- **THEN** o sistema SHALL renderizar a marca d'água em todos os Slides daquele item
- **AND** a marca d'água SHALL ter texto sutil no canto inferior direito com opacidade de 15-20%

### Requirement: Navegação contínua entre ItemRoteiro

Seta Direita e Seta Baixo SHALL avançar um Slide. Na última página de um ItemRoteiro, esses atalhos SHALL avançar para o primeiro Slide do próximo ItemRoteiro.

Seta Esquerda e Seta Cima SHALL retroceder um Slide. Na primeira página de um ItemRoteiro, esses atalhos SHALL retornar ao último Slide do ItemRoteiro anterior.

#### Scenario: Avançar além do último slide

- **WHEN** o operador usar Seta Direita ou Seta Baixo no último Slide de um ItemRoteiro
- **THEN** o sistema SHALL projetar o primeiro Slide do próximo ItemRoteiro

#### Scenario: Retroceder antes do primeiro slide

- **WHEN** o operador usar Seta Esquerda ou Seta Cima no primeiro Slide de um ItemRoteiro
- **THEN** o sistema SHALL projetar o último Slide do ItemRoteiro anterior

#### Scenario: Navegar no último item do roteiro

- **WHEN** o operador estiver no último Slide do último ItemRoteiro e avançar
- **THEN** o sistema SHALL permanecer no último Slide (sem avançar além do roteiro)

#### Scenario: Navegar no primeiro item do roteiro

- **WHEN** o operador estiver no primeiro Slide do primeiro ItemRoteiro e retroceder
- **THEN** o sistema SHALL permanecer no primeiro Slide (sem retroceder além do roteiro)
