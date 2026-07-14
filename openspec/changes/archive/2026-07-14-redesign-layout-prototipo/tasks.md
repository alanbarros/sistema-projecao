## 1. Design Tokens e CSS Base

- [x] 1.1 Criar bloco `:root` com CSS variables do protótipo (ink, muted, paper, line, moss, moss-deep, sage, gold, coral, white)
- [x] 1.2 Adicionar import de fontes Inter e Google Fonts no index.html
- [x] 1.3 Definir estilos globais base (box-sizing, body margin, font-family default)
- [x] 1.4 Criar classes utilitárias de botão (.button primary, secondary, ghost, danger)
- [x] 1.5 Criar classes de card (.card com border, border-radius 10px, box-shadow)
- [x] 1.6 Criar classes de tag (.tag com fundo sage, pill shape)
- [x] 1.7 Criar classes de form (.field, .search, select, .form-layout 2-colunas)

## 2. Layout Shell (Sidebar + Topbar)

- [x] 2.1 Criar classe .shell com CSS Grid (248px + 1fr)
- [x] 2.2 Criar estilos da sidebar (.sidebar com fundo moss-deep, padding, flex column)
- [x] 2.3 Criar estilos do brand (.brand com brand-mark dourado, h1, p)
- [x] 2.4 Criar estilos da nav da sidebar (.nav button com hover e active)
- [x] 2.5 Criar estilos do footer da sidebar (.sidebar-foot com border-top)
- [x] 2.6 Criar estilos da topbar (.topbar com min-height 72px, flex, border-bottom)
- [x] 2.7 Criar estilos do breadcrumb (.crumb com muted + strong)
- [x] 2.8 Criar estilos do status indicator (.status com dot verde)
- [x] 2.9 Criar estilos da view (.view com padding e max-width 1440px)
- [x] 2.10 Criar estilos do page-head (.page-head com eyebrow + h2 + p)

## 3. Componente Layout.tsx

- [x] 3.1 Reescrever Layout.tsx com estrutura shell (sidebar + main com topbar)
- [x] 3.2 Adicionar props opcionais ao Layout (pageTitle, breadcrumb)
- [x] 3.3 Mover navegação do Header.tsx para a sidebar
- [x] 3.4 Remover componente Header.tsx (ou renomear para Sidebar)
- [x] 3.5 Atualizar todas as páginas que usam Layout para passar pageTitle

## 4. Catálogo de Itens (CatalogoPage)

- [x] 4.1 Reescrever cabeçalho com padrão eyebrow + h2 + botão
- [x] 4.2 Criar toolbar com busca e filtro tipo dentro de container card
- [x] 4.3 Substituir lista linear por grid de cards (.collection)
- [x] 4.4 Criar card de item (.item-card com tag, título, texto, meta)
- [x] 4.5 Adicionar hover effect no card (border-color + translateY)
- [x] 4.6 Manter paginação existente com novo estilo de botões

## 5. Roteiros (RoteirosPage)

- [x] 5.1 Reescrever cabeçalho com padrão eyebrow + h2 + botão
- [x] 5.2 Substituir tabela por lista de cards de roteiro (.route-list)
- [x] 5.3 Criar card de roteiro (.route-card com badge de data, título, seta)
- [x] 5.4 Criar componente de badge de data (.route-date com fundo sage)
- [x] 5.5 Manter busca com novo estilo de formulário

## 6. Editor de Roteiro (RoteiroEditorPage)

- [x] 6.1 Reescrever cabeçalho com padrão eyebrow + h2 + botões de ação
- [x] 6.2 Criar layout 2 colunas (.route-layout com grid 1fr + 320px)
- [x] 6.3 Substituir tabela de itens por sequência de cards (.sequence)
- [x] 6.4 Criar card de item do roteiro (.route-item com posição, título, ações)
- [x] 6.5 Criar painel lateral de adicionar (.add-panel com formulário)
- [x] 6.6 Adaptar modais (ad-hoc e catálogo) para novo estilo
- [x] 6.7 Atualizar botões de mover/remover para estilo icon-button

## 7. Formulários (ItemFormPage, RoteiroFormPage)

- [x] 7.1 Adaptar ItemFormPage para usar layout 2-colunas do protótipo
- [x] 7.2 Criar preview sticky do slide no formulário de item
- [x] 7.3 Adaptar RoteiroFormPage para novo estilo de campos
- [x] 7.4 Atualizar estilos de textarea e blocos semânticos

## 8. Modo Play (PlayModePage)

- [x] 8.1 Substituir tabs por grid 3 colunas (.play-grid)
- [x] 8.2 Criar estilos de coluna (.play-column com border-right, overflow auto)
- [x] 8.3 Criar estilos de mini-item (.mini-item com hover e active)
- [x] 8.4 Criar estilos de columna-title (.column-title uppercase bold)
- [x] 8.5 Adaptar preview para .play-preview com slide-preview com shadow
- [x] 8.6 Criar barra de status (.play-status com moss-deep, gold, keyboard hints)
- [x] 8.7 Adicionar botões de navegação com setas na barra de status
- [x] 8.8 Adicionar hint de atalhos de teclado (← → para navegar)

## 9. Projetor (ProjectorPage)

- [x] 9.1 Verificar estilos do projetor (já existentes e alinhados ao protótipo)
- [x] 9.2 Ajustar posicionamento da marca d'água se necessário
- [x] 9.3 Ajustar tipografia do texto do projetor para Georgia

## 10. Responsividade

- [x] 10.1 Adicionar media query @media (max-width: 900px) para sidebar colapsada
- [x] 10.2 Adicionar media query @media (max-width: 560px) para layout mobile
- [x] 10.3 Testar Play Mode em viewport mobile (grid 1 coluna)
- [x] 10.4 Testar formulários em viewport mobile (2 colunas → 1 coluna)

## 11. Limpeza e Validação

- [x] 11.1 Remover classes CSS antigas não utilizadas do index.css
- [x] 11.2 Verificar que todas as páginas compilar sem erros (npm run build)
- [x] 11.3 Verificar que nenhuma funcionalidade foi quebrada
- [x] 11.4 Testar navegação entre todas as páginas
- [x] 11.5 Testar Modo Play com navegação por teclado
