## MODIFIED Requirements

### Requirement: Composição e ordenação de Roteiro

O sistema SHALL permitir criar e manter um Roteiro composto por uma sequência ordenada de ItemRoteiro.

Cada ItemRoteiro SHALL ter uma posição no Roteiro, um tipo compartilhado e poderá ter um MomentoLiturgico opcional. MomentoLiturgico SHALL representar a função do item na celebração, como Entrada, Ofertório ou Comunhão, e SHALL ser independente do tipo.

Ao adicionar um ItemColetanea a um Roteiro, o sistema SHALL criar um ItemRoteiro com snapshot do seu título, tipo e blocos de conteúdo para geração dos Slides. O ItemRoteiro poderá reter a referência ao ItemColetanea de origem para rastreabilidade, mas SHALL usar seu snapshot como fonte do conteúdo exibido.

Cada ItemRoteiro SHALL manter uma configuração própria de marca d'água para seus Slides e sua origem, catalogada ou ad-hoc.

#### Scenario: Adicionar canto de entrada ao roteiro

- **WHEN** o operador adicionar um ItemColetanea do tipo Canto a um Roteiro e informar o MomentoLiturgico Entrada
- **THEN** o sistema SHALL criar um ItemRoteiro com o snapshot do conteúdo do ItemColetanea
- **AND** SHALL posicioná-lo na sequência do Roteiro

#### Scenario: Reordenar itens

- **WHEN** o operador mover um ItemRoteiro para cima ou para baixo
- **THEN** o sistema SHALL atualizar sua posição e a ordem dos demais itens afetados

## UNCHANGED Requirements

### Requirement: Itens ad-hoc do roteiro

O requirement "Itens ad-hoc do roteiro" da spec principal é preservado sem alterações. Itens ad-hoc continuam sendo criados diretamente no Roteiro, sem vinculo ao Catalogo, e sao restritos ao Roteiro em que foram criados.

## REMOVED Requirements

### Requirement: Propagação de alterações do catálogo

**Reason**: ItemRoteiro deve preservar o conteúdo snapshotado na composição do Roteiro, em vez de refletir alterações posteriores do catálogo.

**Migration**: Para registros existentes vinculados ao Catalogo, materializar o snapshot a partir do conteudo atual antes de remover a leitura viva. Em projeto greenfield, iniciar diretamente com o novo formato.
