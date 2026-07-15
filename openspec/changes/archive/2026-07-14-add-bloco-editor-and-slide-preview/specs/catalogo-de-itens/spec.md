# catalogo-de-itens (delta)

## Modified Requirements

### Requirement: Interface de gestão do catálogo

The slide preview SHALL use the `gerarSlides()` engine to generate slides from blocos, respecting the 500-character limit and semantic coherence.

The preview SHALL display all generated slides with pagination controls (prev/next) and current slide indicator (e.g., "Slide 2 / 5").

The preview SHALL update live as the operator edits blocos in the form.

#### Scenario: Preview de item com múltiplas estrofes

- **WHEN** o operador criar um ItemColetanea com 3 estrofes que gerem 5 slides
- **THEN** o preview SHALL exibir os 5 slides com navegação
- **AND** SHALL mostrar indicador "Slide X / 5"

#### Scenario: Preview atualiza ao editar bloco

- **WHEN** o operador alterar o conteúdo de um bloco no formulário
- **THEN** o preview SHALL regenerar os slides instantaneamente
- **AND** SHALL exibir a partir do primeiro slide (a posição pode mudar se o conteúdo anterior crescer ou encolher)

#### Scenario: Preview de item sem blocos

- **WHEN** o operador não tiver adicionado nenhum bloco
- **THEN** o preview SHALL exibir mensagem "Digite o conteúdo dos blocos para visualizar"
