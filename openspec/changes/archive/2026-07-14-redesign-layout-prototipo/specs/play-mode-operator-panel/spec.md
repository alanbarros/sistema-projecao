## MODIFIED Requirements

### Requirement: Painel operacional e tela do projetor

O sistema SHALL fornecer um painel do operador com layout em grid de 3 colunas: Acervo (mini-items clicáveis), Roteiro (mini-items com item ativo destacado) e Pré-visualização (slide preview com sombra).

Cada coluna SHALL ter um título em uppercase bold, barra de scroll independente e bordas laterais. A coluna de preview SHALL ter fundo sage (#eff2e9) e o slide preview SHALL ter box-shadow e dimensões proporcionais.

O sistema SHALL fornecer uma tela de projetor desacoplada que exiba somente o texto do Slide ativo em tela cheia.

#### Scenario: Exibir slide na tela desacoplada

- **WHEN** o operador selecionar um Slide para projeção
- **THEN** a tela do projetor SHALL exibir somente o conteúdo do Slide selecionado

#### Scenario: Exibir mini-items no roteiro do Play Mode

- **WHEN** o Modo Play estiver ativo com itens no roteiro
- **THEN** o sistema SHALL exibir cada item como um mini-item compacto com título, momento litúrgico e contagem de slides

#### Scenario: Destacar item ativo no roteiro

- **WHEN** um ItemRoteiro estiver ativo durante o Modo Play
- **THEN** seu mini-item SHALL ter fundo verde claro (#e0ead8) para indicação visual

### Requirement: Barra de status do Play Mode

O Modo Play SHALL exibir uma barra de status fixa no rodapé com fundo moss-deep, texto branco e destaque gold para o título do item em exibição. A barra SHALL incluir botões de navegação (setas) e botão "Projetar".

#### Scenario: Exibir status de navegação

- **WHEN** o operador estiver navegando slides no Modo Play
- **THEN** a barra de status SHALL exibir "EM EXIBIÇÃO · [título do item] · Slide X / Y"

#### Scenario: Exibir controles de teclado

- **WHEN** o Modo Play estiver ativo
- **THEN** a barra de status SHALL exibir os atalhos de teclado com ícones de setas e o texto "← → para navegar"
