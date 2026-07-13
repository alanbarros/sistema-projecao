## Why

As especificacoes atuais divergem do comportamento demonstrado no prototipo e do modelo de dominio definido para o sistema, especialmente ao propagar alteracoes do Catalogo para Roteiros ja compostos. As capacidades precisam ser alinhadas para que a futura implementacao mantenha a experiencia operacional validada e preserve o historico das celebracoes.

## What Changes

- Substituir a propagacao de alteracoes do Catalogo por snapshots de conteudo ao adicionar ItemColetanea a um Roteiro.
- Especificar a composicao de Roteiros conforme os controles demonstrados: selecao de item ativo, origem catalogada ou ad-hoc, momento liturgico e configuracao de marca d'agua.
- Alinhar o Modo Play e a projecao ao fluxo validado no prototipo, incluindo selecao pelo roteiro, navegacao continua e abertura de tela dedicada do Projetor.
- Consolidar os requisitos de interface operacional e disponibilidade local apresentados pelo prototipo nas capacidades de produto correspondentes.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `catalogo-de-itens`: remover a propagacao do conteudo editado para ItemRoteiro previamente criados.
- `roteiros`: exigir snapshot do conteudo catalogado na insercao e explicitar os atributos operacionais do ItemRoteiro.
- `projecao-em-tempo-real`: alinhar a operacao de Modo Play e Projetor ao fluxo de selecao, projecao e disponibilidade local validado no prototipo.

## Impact

Afeta os modelos e casos de uso de Catalogo, Roteiro e Projecao, os contratos de persistencia dos snapshots e as interfaces do painel operacional e Projetor. Nao introduz dependencias externas nem altera o escopo sem autenticacao, sem midia e sem editor visual de Slides.
