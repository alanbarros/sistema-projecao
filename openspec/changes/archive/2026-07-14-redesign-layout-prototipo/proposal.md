## Why

A aplicação real possui um layout genérico (top bar + tabelas + modais) que não corresponde ao design aprovado no protótipo interativo (`./prototype/`). O protótipo apresenta uma identidade visual coesa com sidebar escura, paleta verde/dourado, tipografia Georgia/Inter e cards arredondados — uma experiência visual mais profissional e alinhada com o contexto litúrgico. O objetivo é alinhar a aplicação real ao look & feel do protótipo.

## What Changes

- **Layout principal**: Substituir top bar por sidebar vertical escura (248px) com navegação, brand e footer
- **Design tokens**: Criar CSS custom properties com paleta do protótipo (moss, sage, gold, coral, paper, ink, muted)
- **Tipografia**: Importar Inter (corpo) e Georgia (títulos/headings), aplicar em toda a aplicação
- **Componentes visuais**: Redesenhar cards, botões (4 variantes), tags, formulários e modais para acompanhar o protótipo
- **Catálogo de Itens**: Layout em grid de cards (collection) ao invés de lista linear com tabelas
- **Roteiros**: Layout em cards de roteiro com badge de data ao invés de tabela
- **Editor de Roteiro**: Layout em 2 colunas (sequência + painel adicionar) ao invés de tabela + modais
- **Modo Play**: Grid 3 colunas com mini-items ao invés de tabs
- **Topbar/Breadcrumb**: Barra superior com breadcrumb contextual e indicador de status
- **Responsividade**: Media queries para mobile (sidebar colapsa, grid 1 coluna)

## Capabilities

### New Capabilities
- `ui-layout-system`: Sistema de layout com sidebar, topbar, design tokens e responsividade

### Modified Capabilities
- `catalogo-de-itens`: Interface muda de lista/tabela para grid de cards
- `roteiros`: Interface muda de tabela para cards com badge de data
- `play-mode-operator-panel`: Layout muda de tabs para grid 3 colunas com mini-items

## Impact

- **Frontend**: `src/ui/src/index.css` (substituir completamente), `Layout.tsx`, `Header.tsx`, todas as 7 páginas
- **Componentes**: `CatalogoPage`, `RoteirosPage`, `RoteiroEditorPage`, `RoteiroFormPage`, `ItemFormPage`, `PlayModePage`, `ProjectorPage`
- **CSS**: Remover classes antigas (.btn, .tabela, .modal, etc.) e substituir por novo design system
- **Dependências**: Nenhuma mudança de dependências (CSS puro)
- **APIs/Backend**: Nenhuma mudança
- **Breaking changes**: Nenhum — mudança puramente visual
