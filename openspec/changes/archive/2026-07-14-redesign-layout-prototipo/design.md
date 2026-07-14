## Context

A aplicação real (`src/ui/`) possui um layout funcional mas visualmente genérico: top bar escura com links, conteúdo centralizado, tabelas para listas, modais para formulários. O protótipo interativo (`prototype/`) demonstra um design muito mais polido com sidebar escura, paleta verde/dourado, cards arredondados e grid 3-colunas no Play Mode.

A aplicação React já possui toda a lógica de negócio implementada (CRUD, projeção, WebSocket). A mudança é puramente de apresentação — nenhuma lógica de domínio ou API é afetada.

**Estado atual dos arquivos relevantes:**
- `src/ui/src/index.css` — 846 linhas de CSS genérico (sem CSS variables)
- `src/ui/src/components/Layout.tsx` — flex column com Header + main
- `src/ui/src/components/Header.tsx` — top bar com links de navegação
- `src/ui/src/pages/*.tsx` — 7 páginas com classes CSS antigas

## Goals / Non-Goals

**Goals:**
- Alinhar o visual da aplicação ao protótipo (`prototype/styles.css`)
- Implementar sidebar com navegação vertical
- Aplicar paleta de cores do protótipo (moss, sage, gold, coral)
- Importar e aplicar tipografia Georgia (títulos) + Inter (corpo)
- Redesenhar cards, botões, formulários e tags
- Adaptar cada página ao novo layout (grid de cards, 2 colunas, 3 colunas)
- Manter toda a funcionalidade existente intacta
- Garantir responsividade (sidebar colapsa em mobile)

**Non-Goals:**
- Alterar lógica de negócio ou API
- Adicionar novas funcionalidades
- Mudar a estrutura de componentes React (apenas classes CSS e markup interno)
- Alterar o comportamento de navegação do React Router
- Modificar o WebSocket ou engine de projeção

## Decisions

### 1. CSS Variables como design tokens

**Decisão:** Criar bloco `:root` com todas as variáveis do protótipo.

**Razão:** O protótipo define 9 variáveis de cor que guiam todo o design. Usar CSS variables permite consistência e facilita ajustes futuros. Manter as variáveis exatas do protótipo (valores hex) para fidelidade visual.

```css
:root {
  --ink: #202620;
  --muted: #677064;
  --paper: #f6f5ef;
  --line: #d7d9d0;
  --moss: #294333;
  --moss-deep: #182a20;
  --sage: #dbe7ce;
  --gold: #e6b550;
  --coral: #d7664d;
  --white: #fffefa;
}
```

**Alternativa considerada:** Manter CSS hardcoded como o protótipo faz. Rejeitado porque CSS variables são mais manuteníveis em escopo maior.

### 2. Layout Shell com CSS Grid

**Decisão:** Usar `display: grid; grid-template-columns: 248px minmax(0, 1fr)` para o shell principal.

**Razão:** O protótipo usa exatamente essa abordagem. Grid é ideal para layout sidebar+main porque:
- Largura fixa da sidebar (248px)
- Main content ocupa o espaço restante com `minmax(0, 1fr)`
- Mais limpo que flexbox para esse caso

**Alternativa considerada:** Flexbox com width fixo na sidebar. Funcional mas mais verbose.

### 3. Sidebar como componente Layout

**Decisão:** Mover a navegação para dentro de `Layout.tsx`, substituindo o `Header.tsx` atual.

**Razão:** A sidebar é parte do shell da aplicação, não de uma página específica. O componente `Layout` já é usado por todas as páginas (exceto PlayMode e Projector que são fullscreen). A sidebar conterá:
- Brand (título + subtítulo)
- Nav buttons (Catálogo, Roteiros)
- Footer (info do sistema)

**Alternativa considerada:** Criar um novo componente `Sidebar.tsx`. Rejeitado porque aumenta complexidade sem benefício — o Layout já serve como container.

### 4. Topbar contextual com breadcrumb

**Decisão:** Adicionar topbar dentro do `<main>` com breadcrumb dinâmico e indicador de status.

**Razão:** O protótipo mostra "Área de trabalho / Título da Página" + status verde "Disponível localmente". Isso dá contexto ao usuário. Implementar via props do Layout.

### 5. Substituir tabelas por cards/grid

**Decisão:** Catálogo usa `grid-template-columns: repeat(auto-fill, minmax(245px, 1fr))` para cards. Roteiros usa lista de cards com badge de data.

**Razão:** O protótipo mostra itens do catálogo como cards clicáveis com tag, título, texto e meta. Roteiros como cards com badge de data. Isso é visualmente mais rico que tabelas.

### 6. Play Mode como grid 3 colunas

**Decisão:** PlayModePage usa `grid-template-columns: minmax(210px, .75fr) minmax(245px, .95fr) minmax(340px, 1.7fr)`.

**Razão:** O protótipo mostra 3 colunas: Acervo (mini-items), Roteiro (mini-items), Preview (slide). Cada coluna com título, scroll independente e bordas laterais. A coluna de preview tem fundo sage (#eff2e9).

### 7. Remover CSS antigo completamente

**Decisão:** Substituir o `index.css` inteiro ao invés de adicionar novas classes por cima.

**Razão:** O CSS atual (846 linhas) usa classes genéricas (.btn, .tabela, .modal) que conflitam com o novo design. Manter as duas bases criaria inconsistência. O novo CSS será baseado no protótipo com adaptações para React.

**Alternativa considerada:** Manter classes antigas e adicionar novas. Rejeitado porque cria confusão de nomenclatura e CSS desnecessário.

## Risks / Trade-offs

**[Risco] Quebra de funcionalidade durante a transição**
→ Mitigação: Implementar incrementalmente (1 página por vez) e testar build após cada mudança. O `npm run build` deve passar sempre.

**[Risco] PlayModePage e ProjectorPage não usam Layout (fullscreen)**
→ Mitigação: Adaptar essas páginas independentemente, copiando os design tokens e estilos do protótipo diretamente nelas.

**[Risco] Perda de responsividade mobile**
→ Mitigação: Copiar as media queries do protótipo (`@media max-width: 900px` e `560px`) que já tratam sidebar colapsada e grid 1-coluna.

**[Trade-off] Fidelidade vs Manutenção**
→ O protótipo usa valores hardcoded. A aplicação real usa CSS variables. Algumas variações sutis podem ocorrer mas serão aceitáveis desde que a identidade visual seja preservada.
