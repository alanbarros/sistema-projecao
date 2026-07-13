## ADDED Requirements

### Requirement: CRUD de Roteiro

O sistema SHALL permitir criar, consultar, editar e excluir um Roteiro (celebração/evento).

Cada Roteiro SHALL possuir título obrigatório (máx. 255 caracteres), descrição opcional (máx. 500 caracteres) e data de celebração opcional. O Roteiro SHALL conter uma sequência ordenada de ItemRoteiro.

#### Scenario: Criar um roteiro para missa

- **WHEN** o operador criar um Roteiro com título "Missa de Ramos" e data de celebração
- **THEN** o sistema SHALL persistir o Roteiro no banco
- **AND** o Roteiro SHALL estar vazio (sem itens)

#### Scenario: Tentar criar roteiro sem título

- **WHEN** o operador tentar criar um Roteiro sem título
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação

#### Scenario: Listar roteiros

- **WHEN** o operador acessar a listagem de roteiros
- **THEN** o sistema SHALL retornar os Roteiros ordenados por data de celebração
- **AND** SHALL suportar paginação (offset/limit)

#### Scenario: Excluir roteiro com itens

- **WHEN** o operador excluir um Roteiro que possui 5 ItemRoteiro
- **THEN** o sistema SHALL excluir o Roteiro e todos os seus ItemRoteiro e ItemRoteiroBloco (cascade)

### Requirement: Adicionar ItemColetanea ao Roteiro (Snapshot)

O sistema SHALL permitir adicionar um ItemColetanea do catálogo a um Roteiro, criando um ItemRoteiro com snapshot isolado do conteúdo.

O snapshot SHALL conter cópia do título, tipo e blocos do ItemColetanea no momento da inserção. Alterações posteriores no ItemColetanea de origem SHALL NOT afetar o snapshot criado.

Cada ItemRoteiro SHALL manter uma referência opcional ao ItemColetanea de origem para rastreabilidade.

#### Scenario: Adicionar canto de entrada ao roteiro

- **WHEN** o operador adicionar um ItemColetanea do tipo Canto a um Roteiro e informar o MomentoLiturgico "Entrada"
- **THEN** o sistema SHALL criar um ItemRoteiro com snapshot do título, tipo e blocos do ItemColetanea
- **AND** SHALL posicioná-lo na última posição do Roteiro
- **AND** SHALL registrar o MomentoLiturgico como "Entrada"

#### Scenario: Tentar adicionar item inexistente

- **WHEN** o operador tentar adicionar um ItemColetanea com ID inexistente
- **THEN** o sistema SHALL retornar erro 404

#### Scenario: Editar item catalogado após adicionar ao roteiro

- **WHEN** um ItemColetanea já adicionado a um Roteiro for editado no catálogo
- **THEN** o ItemRoteiro no Roteiro SHALL manter o conteúdo original (snapshot)
- **AND** SHALL NOT ser afetado pelas alterações no catálogo

#### Scenario: Excluir item catalogado usado em roteiro

- **WHEN** um ItemColetanea que foi adicionado a um Roteiro for excluído do catálogo
- **THEN** o ItemRoteiro SHALL permanecer no Roteiro com o snapshot
- **AND** a referência item_coletanea_id SHALL ficar NULL

### Requirement: Itens ad-hoc do Roteiro

O sistema SHALL permitir criar ItemRoteiro ad-hoc diretamente em um Roteiro, sem criar ItemColetanea no catálogo.

Itens ad-hoc SHALL ser restritos ao Roteiro em que foram criados e poderão ser dos tipos Aviso, Resposta, Canto, Oração ou Leitura. Todos os campos (título, tipo, blocos) são obrigatórios.

#### Scenario: Criar aviso exclusivo da celebração

- **WHEN** o operador criar um ItemRoteiro ad-hoc do tipo Aviso com título e blocos
- **THEN** o sistema SHALL adicioná-lo ao Roteiro atual
- **AND** SHALL impedir que esse item apareça nas buscas do catálogo
- **AND** SHALL marcar o item como is_ad_hoc = true

#### Scenario: Criar prece ad-hoc

- **WHEN** o operador criar um ItemRoteiro ad-hoc do tipo Oração com conteúdo específico da celebração
- **THEN** o sistema SHALL criar o item com snapshot do conteúdo fornecido
- **AND** SHALL posicioná-lo na última posição do Roteiro

#### Scenario: Tentar criar ad-hoc sem dados obrigatórios

- **WHEN** o operador tentar criar um item ad-hoc sem título ou sem blocos
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação

### Requirement: Reordenação de itens

O sistema SHALL permitir reordenar os ItemRoteiro dentro de um Roteiro.

A reordenação SHALL atualizar a posição do item movido e a ordem dos demais itens afetados. O sistema SHALL exigir que o array de IDs contenha TODOS os itens do roteiro, sem duplicatas.

#### Scenario: Mover item para cima

- **WHEN** o operador mover um ItemRoteiro da posição 3 para a posição 1
- **THEN** o sistema SHALL atualizar a posição do item para 1
- **AND** SHALL atualizar os itens que estavam nas posições 1 e 2 para as posições 2 e 3

#### Scenario: Mover item para baixo

- **WHEN** o operador mover um ItemRoteiro da posição 2 para a posição 4
- **THEN** o sistema SHALL atualizar a posição do item para 4
- **AND** SHALL atualizar os itens afetados entre as posições 2 e 4

#### Scenario: Tentar reordenar com lista incompleta

- **WHEN** o operador enviar apenas parte dos IDs dos itens para reordenação
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação

#### Scenario: Tentar reordenar com IDs duplicados

- **WHEN** o operador enviar IDs duplicados no array de reordenação
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação

### Requirement: MomentoLiturgico

O sistema SHALL permitir atribuir um MomentoLiturgico opcional a cada ItemRoteiro.

MomentoLiturgico SHALL representar a função do item na celebração e SHALL ser independente do tipo do item.

Valores permitidos: Entrada, Ofertório, Comunhão, Preparação, Ato Penitencial, Aclamação, Oração dos Fiéis, Outro.

#### Scenario: Definir momento litúrgico

- **WHEN** o operador atribuir o MomentoLiturgico "Comunhão" a um ItemRoteiro
- **THEN** o sistema SHALL persistir o momento litúrgico
- **AND** o ItemRoteiro SHALL manter seu tipo original (ex: Canto)

#### Scenario: Tentar definir momento litúrgico inválido

- **WHEN** o operador tentar atribuir um valor inválido para MomentoLiturgico
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação

### Requirement: Marca d'água por ItemRoteiro

O sistema SHALL permitir ativar ou desativar a marca d'água para cada ItemRoteiro.

O padrão SHALL ser marca d'água ativa (true).

#### Scenario: Desativar marca d'água

- **WHEN** o operador desativar a marca d'água de um ItemRoteiro
- **THEN** o sistema SHALL persistir marca_agua_ativa = false
- **AND** os Slides desse item SHALL ser exibidos sem marca d'água

### Requirement: Interface de gestão de roteiros

O sistema SHALL fornecer uma interface para listar, criar, editar e gerenciar Roteiros.

A interface SHALL exibir a lista de roteiros com título e data, e SHALL permitir acessar o editor de cada roteiro.

#### Scenario: Acessar editor de roteiro

- **WHEN** o operador selecionar um Roteiro na listagem
- **THEN** o sistema SHALL exibir a tela do editor com a lista ordenada de ItemRoteiro

#### Scenario: Adicionar item do catálogo via interface

- **WHEN** o operador selecionar um ItemColetanea do catálogo e adicionar ao roteiro
- **THEN** o sistema SHALL criar o ItemRoteiro com snapshot e exibir na lista

#### Scenario: Navegar na paginação de roteiros

- **WHEN** houver mais de 20 roteiros cadastrados
- **THEN** o sistema SHALL exibir controles de paginação
- **AND** SHALL permitir navegar entre páginas
