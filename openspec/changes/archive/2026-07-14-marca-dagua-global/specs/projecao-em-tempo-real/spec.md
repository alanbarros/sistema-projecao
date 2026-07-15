## MODIFIED Requirements

### Requirement: Marca d'água por ItemRoteiro

O sistema SHALL permitir ativar ou desativar a marca d'água para cada ItemRoteiro.

O sistema SHALL herdar a marca d'água do Roteiro pai. Quando a marca d'água do Roteiro estiver definida, os Slides do ItemRoteiro SHALL exibir a marca d'água do Roteiro (SVG + texto). Quando a marca d'água do Roteiro não estiver definida, os Slides SHALL exibir sem marca d'água.

O ItemRoteiro SHALL poder desativar a marca d'água herdada do Roteiro via toggle `marcaAguaAtiva`.

O sistema SHALL aplicar a configuração da marca d'água aos Slides projetados daquele ItemRoteiro e SHALL NOT oferecer customização de fonte, cor ou fundo dos Slides.

#### Scenario: Projetar item com marca d'água do roteiro

- **WHEN** o Roteiro possuir uma MarcaDagua associada e o ItemRoteiro tiver marcaAguaAtiva = true
- **THEN** o sistema SHALL exibir o SVG da marca d'água do Roteiro em todos os Slides do item

#### Scenario: Projetar item sem marca d'água do roteiro

- **WHEN** o Roteiro NÃO possuir uma MarcaDagua associada (marca_dagua_id = NULL)
- **THEN** o sistema SHALL projetar os Slides sem marca d'água

#### Scenario: Projetar item com marca d'água desativada

- **WHEN** o ItemRoteiro ativo tiver a marca d'água desativada (marcaAguaAtiva = false)
- **THEN** o sistema SHALL ocultar a marca d'água em todos os seus Slides projetados

### Requirement: Propagação de marca d'água para Slides

O motor de geração de Slides SHALL receber o conteúdo SVG da marca d'água do Roteiro e propagá-lo para cada Slide gerado.

#### Scenario: Gerar slides com marca d'água

- **WHEN** o motor de Slides gerar Slides a partir de um Roteiro com MarcaDagua definida
- **THEN** cada Slide SHALL conter o campo `marcaAguaSvg` com o conteúdo SVG da marca d'água
