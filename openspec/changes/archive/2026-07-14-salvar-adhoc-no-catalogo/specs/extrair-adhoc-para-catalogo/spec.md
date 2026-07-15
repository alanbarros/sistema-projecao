## ADDED Requirements

### Requirement: Extrair item ad-hoc para o catálogo

O sistema SHALL permitir extrair os dados de um ItemRoteiro ad-hoc e persisti-los como um novo ItemColetanea permanente no catálogo.

A extração SHALL copiar o título (`titulo_snapshot`), tipo (`tipo_snapshot`) e blocos (`ItemRoteiroBloco`) do ItemRoteiro para um novo ItemColetanea com seus respectivos ItemBloco.

O ItemRoteiro de origem SHALL permanecer inalterado após a extração — is_ad_hoc, item_coletanea_id e todos os dados snapshot SHALL ser mantidos.

#### Scenario: Extrair prece ad-hoc para o catálogo

- **WHEN** o operador acionar "Salvar no catálogo" em um ItemRoteiro ad-hoc do tipo Oração com título "Prece do povo" e 2 blocos
- **THEN** o sistema SHALL criar um novo ItemColetanea com título "Prece do povo", tipo Oração e 2 ItemBloco correspondentes
- **AND** o ItemRoteiro original SHALL permanecer com is_ad_hoc = true e item_coletanea_id = null

#### Scenario: Extrair aviso ad-hoc para o catálogo

- **WHEN** o operador extrair um ItemRoteiro ad-hoc do tipo Aviso
- **THEN** o sistema SHALL criar um ItemColetanea do tipo Aviso com os dados do snapshot

#### Scenario: Tentar extrair item que não é ad-hoc

- **WHEN** o operador tentar extrair um ItemRoteiro que possui item_coletanea_id diferente de null (não é ad-hoc)
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro indicando que apenas itens ad-hoc podem ser extraídos

#### Scenario: Tentar extrair item inexistente

- **WHEN** o operador tentar extrair um ItemRoteiro com ID inexistente no roteiro informado
- **THEN** o sistema SHALL retornar erro 404

#### Scenario: Erro na extração exibido no modal

- **WHEN** a API retornar erro durante a extração (validação, item não encontrado ou erro interno)
- **THEN** o modal SHALL permanecer aberto
- **AND** SHALL exibir a mensagem de erro ao operador
- **AND** o botão "Salvar" SHALL ser reabilitado

### Requirement: Revisão de metadados antes da extração

O sistema SHALL fornecer um modal que permite ao operador revisar e editar o título e o tipo do ItemColetanea antes de salvar no catálogo.

Os blocos do item SHALL ser exibidos como lista estática de texto no modal (não como componente `BlocoEditor`), para referência visual.

#### Scenario: Editar título antes de salvar

- **WHEN** o operador abrir o modal de extração e alterar o título de "Prece do povo" para "Prece do povo - Domingo"
- **THEN** o sistema SHALL criar o ItemColetanea com o título alterado "Prece do povo - Domingo"

#### Scenario: Alterar tipo antes de salvar

- **WHEN** o operador alterar o tipo de "Aviso" para "Resposta" no modal
- **THEN** o sistema SHALL criar o ItemColetanea com o tipo "Resposta"

#### Scenario: Manter dados originais sem alteração

- **WHEN** o operador abrir o modal e salvar sem alterar título nem tipo
- **THEN** o sistema SHALL criar o ItemColetanea com título e tipo originais do snapshot

### Requirement: Feedback de sucesso

O sistema SHALL exibir uma notificação (toast) de confirmação após criar o ItemColetanea no catálogo.

O sistema SHALL permanecer na mesma tela do editor de roteiro após o sucesso.

#### Scenario: Confirmar extração com sucesso

- **WHEN** a extração for concluída com sucesso
- **THEN** o sistema SHALL exibir toast com mensagem "Salvo no catálogo!"
- **AND** SHALL permanecer no editor de roteiro

### Requirement: Botão visível apenas para itens ad-hoc

O sistema SHALL exibir o botão "Salvar no catálogo" exclusivamente para ItemRoteiro com isAdHoc = true.

Itens que possuem itemColetaneaId (originados do catálogo) SHALL NOT exibir esse botão.

#### Scenario: Exibir botão para item ad-hoc

- **WHEN** o editor de roteiro renderizar um ItemRoteiro com is_ad_hoc = true
- **THEN** o card do item SHALL exibir botão "Salvar no catálogo"

#### Scenario: Ocultar botão para item do catálogo

- **WHEN** o editor de roteiro renderizar um ItemRoteiro com is_ad_hoc = false
- **THEN** o card do item SHALL NÃO exibir botão "Salvar no catálogo"
