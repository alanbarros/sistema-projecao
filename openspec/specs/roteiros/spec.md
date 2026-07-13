# Roteiros

## Purpose

Organizar os conteúdos de uma celebração em uma linha do tempo independente do catálogo permanente.

## Requirements

### Requirement: Composição e ordenação de Roteiro

O sistema SHALL permitir criar e manter um Roteiro composto por uma sequência ordenada de ItemRoteiro.

Cada ItemRoteiro SHALL ter uma posição no Roteiro, um tipo compartilhado e poderá ter um MomentoLiturgico opcional. MomentoLiturgico SHALL representar a função do item na celebração, como Entrada, Ofertório ou Comunhão, e SHALL ser independente do tipo.

#### Scenario: Adicionar canto de entrada ao roteiro

- **WHEN** o operador adicionar um ItemColetanea do tipo Canto a um Roteiro e informar o MomentoLiturgico Entrada
- **THEN** o sistema SHALL criar um ItemRoteiro vinculado ao ItemColetanea
- **AND** SHALL posicioná-lo na sequência do Roteiro

#### Scenario: Reordenar itens

- **WHEN** o operador mover um ItemRoteiro para cima ou para baixo
- **THEN** o sistema SHALL atualizar sua posição e a ordem dos demais itens afetados

### Requirement: Propagação de alterações do catálogo

Um ItemRoteiro originado de um ItemColetanea SHALL manter seu vínculo com o item de origem.

Quando o conteúdo de um ItemColetanea for alterado, o sistema SHALL atualizar o conteúdo de todos os ItemRoteiro vinculados, inclusive os presentes em Roteiros já existentes e no Roteiro em apresentação.

#### Scenario: Alterar canto usado em múltiplos roteiros

- **WHEN** o operador editar um ItemColetanea usado em mais de um Roteiro
- **THEN** o sistema SHALL atualizar todos os ItemRoteiro vinculados
- **AND** SHALL disponibilizar o conteúdo atualizado para projeção

### Requirement: Itens ad-hoc do roteiro

O sistema SHALL permitir criar ItemRoteiro ad-hoc diretamente em um Roteiro, sem criar ItemColetanea no catálogo.

Itens ad-hoc SHALL ser restritos ao Roteiro em que foram criados e poderão ser dos tipos Aviso, Resposta, Canto, Oração ou Leitura. Eles incluem usos como avisos do dia, salmos, preces e respostas temporárias.

#### Scenario: Criar aviso exclusivo da celebração

- **WHEN** o operador criar um ItemRoteiro ad-hoc do tipo Aviso
- **THEN** o sistema SHALL adicioná-lo apenas ao Roteiro atual
- **AND** SHALL impedir que esse item apareça nas buscas do catálogo
