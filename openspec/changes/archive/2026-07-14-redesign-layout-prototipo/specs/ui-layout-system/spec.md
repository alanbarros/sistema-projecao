## ADDED Requirements

### Requirement: Sidebar de navegação
O sistema SHALL fornecer uma sidebar vertical fixa à esquerda com largura de 248px. A sidebar SHALL conter o brand (título do sistema + subtítulo), navegação vertical com botões para as seções principais (Catálogo, Roteiros) e um rodapé com informação do sistema.

#### Scenario: Exibir sidebar com navegação
- **WHEN** o operador acessar qualquer página da aplicação
- **THEN** o sistema SHALL exibir uma sidebar vertical à esquerda com os links de navegação

#### Scenario: Destacar seção ativa na sidebar
- **WHEN** o operador estiver na seção "Catálogo"
- **THEN** o botão "Catálogo" na sidebar SHALL estar destacado com fundo mais claro

### Requirement: Topbar contextual com breadcrumb
O sistema SHALL fornecer uma barra superior dentro da área principal com breadcrumb contextual mostrando a seção atual e título da página, além de um indicador de status do sistema.

#### Scenario: Exibir breadcrumb
- **WHEN** o operador estiver na página de edição de um roteiro
- **THEN** o sistema SHALL exibir "Celebrações / Editor de Roteiro" na topbar

#### Scenario: Exibir status do sistema
- **WHEN** a aplicação estiver funcionando normalmente
- **THEN** o sistema SHALL exibir um indicador verde com texto "Disponível localmente" na topbar

### Requirement: Design tokens via CSS variables
O sistema SHALL definir todas as cores, tipografia e espçamento usando CSS custom properties no seletor `:root`. As variáveis SHALL seguir a paleta do protótipo: ink, muted, paper, line, moss, moss-deep, sage, gold, coral e white.

#### Scenario: Aplicar paleta de cores
- **WHEN** a aplicação for carregada
- **THEN** o sistema SHALL aplicar as CSS variables definidas em `:root` para todos os componentes

### Requirement: Tipografia Georgia e Inter
O sistema SHALL usar a fonte Inter para o corpo do texto e a fonte Georgia para títulos (h1, h2, headings de slides). As fontes SHALL ser importadas via Google Fonts ou fallbacks do sistema.

#### Scenario: Aplicar tipografia nos títulos
- **WHEN** uma página for renderizada com títulos h2
- **THEN** os títulos SHALL usar a fonte Georgia com peso 500

### Requirement: Layout shell com sidebar e main
O sistema SHALL usar CSS Grid com `grid-template-columns: 248px minmax(0, 1fr)` para o layout principal da aplicação. A sidebar SHALL ter fundo moss-deep (#182a20) e o conteúdo principal SHALL ter fundo paper (#f6f5ef).

#### Scenario: Renderizar layout em desktop
- **WHEN** a viewport tiver mais de 900px de largura
- **THEN** o sistema SHALL exibir sidebar de 248px à esquerda e conteúdo principal ao lado

#### Scenario: Colapsar sidebar em mobile
- **WHEN** a viewport tiver 900px ou menos de largura
- **THEN** a sidebar SHALL se tornar sticky no topo e a navegação SHALL ficar horizontal com scroll

### Requirement: Botões com 4 variantes
O sistema SHALL fornecer botões com 4 variantes visuais: primary (fundo moss, texto branco), secondary (fundo transparente, borda moss, texto moss), ghost (fundo sage claro, texto moss, sem borda) e danger (fundo coral, borda coral).

#### Scenario: Exibir botão primary
- **WHEN** um botão primary for renderizado
- **THEN** o botão SHALL ter fundo verde escuro (#294333), texto branco e borda arredondada de 6px

### Requirement: Cards arredondados com sombra sutil
O sistema SHALL exibir elementos de cartão (cards) com bordas arredondadas de 10px, borda sutil (#d7d9d0), sombra mínima e fundo branco (#fffefa). Cards SHALL ter hover com borda mais escura e leve elevação.

#### Scenario: Exibir card com hover
- **WHEN** o operador passar o mouse sobre um card
- **THEN** o card SHALL ter a borda mudada para verde mais claro e leve elevação translateY(-1px)

### Requirement: Tags de tipo com fundo sage
O sistema SHALL exibir tags de classificação (tipo de item) com fundo sage (#dbe7ce), texto moss (#294333), borda 99px (pill shape) e texto em uppercase bold.

#### Scenario: Exibir tag de tipo Canto
- **WHEN** um item do tipo "Canto" for exibido
- **THEN** sua tag SHALL ter fundo sage e texto moss com o label "Canto"
