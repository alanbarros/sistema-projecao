## ADDED Requirements

### Requirement: Salvar item ad-hoc no catálogo

O sistema SHALL permitir salvar um ItemRoteiro ad-hoc como um novo ItemColetanea permanente no catálogo, preservando o item de origem inalterado.

O botão "Salvar no catálogo" SHALL estar disponível exclusivamente para ItemRoteiro com is_ad_hoc = true.

#### Scenario: Salvar ad-hoc no catálogo

- **WHEN** o operador acionar "Salvar no catálogo" em um ItemRoteiro ad-hoc
- **THEN** o sistema SHALL criar um novo ItemColetanea no catálogo com os dados do snapshot
- **AND** o ItemRoteiro ad-hoc SHALL permanecer inalterado

#### Scenario: Ocultar botão para item do catálogo

- **WHEN** o editor de roteiro renderizar um ItemRoteiro com is_ad_hoc = false
- **THEN** o card do item SHALL NÃO exibir botão "Salvar no catálogo"
