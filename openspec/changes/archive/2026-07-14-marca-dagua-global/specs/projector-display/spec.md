## MODIFIED Requirements

### Requirement: Marca d'água condicional

O sistema SHALL aplicar a configuração da marca d'água (ativa/inativa) do ItemRoteiro aos Slides projetados daquele item.

Quando a marca d'água estiver ativa e o Roteiro possuir uma MarcaDagua associada, o sistema SHALL renderizar o conteúdo SVG da marca d'água no canto superior direito da tela do projetor.

Quando a marca d'água não estiver ativa ou o Roteiro não possuir MarcaDagua, o sistema SHALL ocultar a marca d'água.

#### Scenario: Projetar item com marca d'água ativa

- **WHEN** o ItemRoteiro ativo tiver a marca d'água ativada e o Roteiro possuir MarcaDagua
- **THEN** o sistema SHALL renderizar o SVG da marca d'água em todos os seus Slides projetados

#### Scenario: Projetar item sem marca d'água

- **WHEN** o ItemRoteiro ativo tiver a marca d'água desativada
- **THEN** o sistema SHALL ocultar a marca d'água em todos os seus Slides projetados

#### Scenario: Projetar item com roteiro sem marca d'água

- **WHEN** o Roteiro não possuir MarcaDagua associada (marca_dagua_id = NULL)
- **THEN** o sistema SHALL projetar os Slides sem marca d'água independente do toggle do item
