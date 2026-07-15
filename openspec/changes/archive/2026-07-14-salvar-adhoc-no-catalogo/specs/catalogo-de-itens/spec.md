## ADDED Requirements

### Requirement: Criação de ItemColetanea a partir de extração

O sistema SHALL permitir criar um ItemColetanea no catálogo a partir dos dados de um ItemRoteiro ad-hoc existente.

A criação por extração SHALL aceitar título, tipo e blocos fornecidos pelo use case de extração, seguindo as mesmas regras de validação do cadastro manual.

#### Scenario: Criar catálogo a partir de dados extraídos

- **WHEN** o use case de extração fornecer título, tipo e blocos válidos
- **THEN** o sistema SHALL persistir um novo ItemColetanea no catálogo
- **AND** o item SHALL estar disponível para busca e inclusão em Roteiros

#### Scenario: Validar dados na extração

- **WHEN** o título ou tipo fornecido pela extração for inválido
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação
