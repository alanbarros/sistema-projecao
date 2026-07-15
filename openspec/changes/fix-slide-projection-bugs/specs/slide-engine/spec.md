## MODIFIED Requirements

### Requirement: Geração de Slides a partir de blocos semânticos

O sistema SHALL converter os blocos semânticos (estrofes, parágrafos, versículos) de um ItemRoteiro em Slides paginados para projeção.

A quebra de Slides SHALL respeitar o limite máximo de **500 caracteres por Slide** e SHALL preservar a coerência semântica (não separar verso de refrão, por exemplo).

O sistema SHALL renderizar a marca d'água do ItemRoteiro quando `marcaAguaAtiva` estiver ativada, exibindo texto sutil posicionado no canto inferior direito com opacidade reduzida (15-20%).

A função `gerarSlides` SHALL existir em uma única localização (`src/ui/src/engine/slideEngine.ts`). Funções duplicadas em outras camadas SHALL ser removidas.

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
