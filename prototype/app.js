const catalog = [
  { id: "gloria", title: "Glória a Deus", type: "Canto", text: "Glória a Deus nas alturas, e paz na terra aos homens por Ele amados.", blocks: ["Glória a Deus nas alturas, e paz na terra aos homens por Ele amados.", "Senhor Deus, Rei dos céus, Deus Pai todo-poderoso."] },
  { id: "entrada", title: "Povo de Deus", type: "Canto", text: "Povo de Deus, foi assim: Deus cumpriu a promessa que fez.", blocks: ["Povo de Deus, foi assim: Deus cumpriu a promessa que fez.", "Vem, nos salva e nos reúne, Senhor."] },
  { id: "salmo", title: "Salmo 23", type: "Resposta", text: "O Senhor é o pastor que me conduz; não me falta coisa alguma.", blocks: ["O Senhor é o pastor que me conduz; não me falta coisa alguma.", "Pelos prados e campinas verdejantes ele me leva a descansar."] },
  { id: "pai-nosso", title: "Pai Nosso", type: "Oração", text: "Pai nosso que estais nos céus, santificado seja o vosso nome.", blocks: ["Pai nosso que estais nos céus, santificado seja o vosso nome.", "Venha a nós o vosso Reino; seja feita a vossa vontade."] },
  { id: "evangelho", title: "Evangelho do dia", type: "Leitura", text: "Proclamação do Evangelho de Jesus Cristo segundo João.", blocks: ["Proclamação do Evangelho de Jesus Cristo segundo João.", "Palavra da Salvação."] },
];

const state = {
  view: "catalog",
  query: "",
  type: "Todos",
  selectedCatalogId: "entrada",
  activeItemId: "entrada",
  activeSlide: 0,
  showProjector: false,
  route: [
    { id: "entrada", catalogId: "entrada", title: "Povo de Deus", type: "Canto", moment: "Entrada", watermark: true, slides: catalog[1].blocks },
    { id: "salmo", catalogId: "salmo", title: "Salmo 23", type: "Resposta", moment: "Salmo", watermark: false, slides: catalog[2].blocks },
    { id: "evangelho", catalogId: "evangelho", title: "Evangelho do dia", type: "Leitura", moment: "Liturgia da Palavra", watermark: true, slides: catalog[4].blocks },
    { id: "aviso", title: "Aviso da comunidade", type: "Aviso", moment: "Encerramento", watermark: false, adHoc: true, slides: ["Na próxima quarta-feira, às 19h30, teremos a celebração da Palavra."] },
  ],
};

const nav = [
  ["catalog", "Catálogo"],
  ["item-editor", "Editor de Item"],
  ["routes", "Roteiros"],
  ["route-editor", "Editor de Roteiro"],
  ["play", "Modo Play"],
];

function currentItem() { return state.route.find((item) => item.id === state.activeItemId) || state.route[0]; }
function currentCatalog() { return catalog.find((item) => item.id === state.selectedCatalogId) || catalog[0]; }
function escapeHtml(value) { return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
function renderSlide(item, slide, variant = "preview") {
  const text = escapeHtml(item.slides[slide]);
  const watermark = item.watermark ? '<span class="watermark">Paróquia São José</span>' : "";
  return `<div class="slide-preview ${variant}">${watermark}<div class="slide-text">${text}</div><div class="pagination">${slide + 1}/${item.slides.length}</div></div>`;
}

function layout(content, title) {
  return `<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">Liturgia</div><h1>Sistema de Projeção</h1><p>Protótipo operacional</p></div><nav class="nav">${nav.map(([id, label]) => `<button data-view="${id}" class="${state.view === id ? "active" : ""}">${label}</button>`).join("")}</nav><div class="sidebar-foot">Dados demonstrativos<br>Sem conexão de rede</div></aside><main><header class="topbar"><div class="crumb">Área de trabalho<strong>${title}</strong></div><span class="status">Disponível localmente</span></header>${content}</main></div>${projector()}`;
}

function pageHead(eyebrow, title, description, action = "") { return `<div class="page-head"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${description}</p></div>${action}</div>`; }

function catalogView() {
  const items = catalog.filter((item) => (state.type === "Todos" || item.type === state.type) && `${item.title} ${item.text}`.toLowerCase().includes(state.query.toLowerCase()));
  return layout(`<section class="view">${pageHead("Acervo permanente", "Catálogo de itens", "Músicas, orações, respostas e leituras reutilizáveis.", '<button class="button" data-view="item-editor">Novo ItemColetânea</button>')}<div class="toolbar card"><input id="catalog-query" class="search" value="${escapeHtml(state.query)}" placeholder="Buscar por título ou trecho do texto"><select id="catalog-type"><option>Todos</option>${["Canto", "Oração", "Resposta", "Leitura", "Aviso"].map((type) => `<option ${state.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></div><div class="collection">${items.map((item) => `<button class="card item-card" data-select-catalog="${item.id}"><span class="tag">${item.type}</span><h3>${item.title}</h3><p>${item.text}</p><div class="item-meta"><span>${item.blocks.length} slides</span><span>Editar</span></div></button>`).join("") || '<p>Nenhum ItemColetânea encontrado.</p>'}</div></section>`, "Catálogo");
}

function itemEditorView() {
  const item = currentCatalog();
  return layout(`<section class="view">${pageHead("Acervo permanente", "Editor de ItemColetânea", "Estruture o texto em blocos para definir os Slides.", '<button class="button">Salvar alterações</button>')}<div class="form-layout"><form class="card form" onsubmit="return false"><div class="two-cols"><label class="field">Título<input value="${escapeHtml(item.title)}"></label><label class="field">Tipo<select>${["Canto", "Oração", "Resposta", "Leitura", "Aviso"].map((type) => `<option ${item.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label></div><div><p class="eyebrow">Blocos semânticos</p>${item.blocks.map((block, index) => `<div class="block"><strong>Slide ${index + 1}</strong><p>${escapeHtml(block)}</p></div>`).join("")}</div><button class="button ghost">+ Adicionar bloco</button></form><aside class="card preview"><p class="eyebrow">Pré-visualização</p>${renderSlide({ ...item, watermark: true, slides: item.blocks }, 0)}<p class="hint">A paginação é exibida no rodapé do Slide.</p></aside></div></section>`, "Editor de Item");
}

function routesView() {
  return layout(`<section class="view">${pageHead("Celebrações", "Roteiros", "Linhas do tempo preparadas para cada celebração.", '<button class="button" data-view="route-editor">Criar Roteiro</button>')}<div class="route-list"><button class="card route-card" data-view="route-editor"><div class="route-date">DOM<br>14</div><div><h3>Missa do 15º Domingo do Tempo Comum</h3><p>14 de julho · 4 itens no roteiro · Em preparação</p></div><span class="arrow">›</span></button><button class="card route-card" data-view="route-editor"><div class="route-date">QUA<br>17</div><div><h3>Novena de São José</h3><p>17 de julho · 6 itens no roteiro · Rascunho</p></div><span class="arrow">›</span></button></div></section>`, "Roteiros");
}

function routeEditorView() {
  return layout(`<section class="view">${pageHead("Celebração", "Missa do 15º Domingo", "14 de julho · 19h00 · ${state.route.length} itens no roteiro.", '<button class="button" data-view="play">Iniciar Modo Play</button>')}<div class="route-layout"><div class="card sequence">${state.route.map((item, index) => `<article class="route-item"><span class="position">${String(index + 1).padStart(2, "0")}</span><div><h3>${item.title} ${item.adHoc ? '<span class="origin">Ad-hoc</span>' : ""}</h3><p>${item.type} · ${item.moment} · ${item.slides.length} slides · Marca d'água ${item.watermark ? "ativa" : "inativa"}</p></div><div class="route-actions"><button class="icon-button" data-move="up" data-id="${item.id}" aria-label="Mover para cima">↑</button><button class="icon-button" data-move="down" data-id="${item.id}" aria-label="Mover para baixo">↓</button><button class="icon-button" data-select-route="${item.id}" aria-label="Selecionar">›</button></div></article>`).join("")}</div><aside class="card add-panel"><h3>Adicionar ao roteiro</h3><p class="hint">Escolha um ItemColetânea ou crie conteúdo de uso único.</p><select id="add-catalog"><option value="">Selecionar do catálogo</option>${catalog.map((item) => `<option value="${item.id}">${item.title}</option>`).join("")}</select><button class="button secondary" data-action="add-catalog">Adicionar ItemColetânea</button><hr><button class="button ghost" data-action="add-adhoc">+ Criar aviso ad-hoc</button></aside></div></section>`, "Editor de Roteiro");
}

function playView() {
  const active = currentItem();
  return layout(`<section class="play"><div class="play-grid"><aside class="play-column"><div class="column-title">Acervo <button class="icon-button" data-view="catalog">+</button></div><input class="search compact-search" placeholder="Filtrar acervo">${catalog.map((item) => `<button class="mini-item" data-add-from-play="${item.id}"><strong>${item.title}</strong><span>${item.type} · ${item.blocks.length} slides</span></button>`).join("")}</aside><aside class="play-column"><div class="column-title">Roteiro <span>${state.route.length}</span></div>${state.route.map((item, index) => `<button class="mini-item ${active.id === item.id ? "active" : ""}" data-select-route="${item.id}"><strong>${String(index + 1).padStart(2, "0")} · ${item.title}</strong><span>${item.moment} · ${item.slides.length} slides</span></button>`).join("")}</aside><section class="play-column"><div class="column-title">Pré-visualização <button class="button ghost" data-action="project">Abrir projetor</button></div><div class="play-preview">${renderSlide(active, state.activeSlide)}</div></section></div><footer class="play-status"><div class="current"><strong>EM EXIBIÇÃO</strong> · ${active.title} · Slide ${state.activeSlide + 1} / ${active.slides.length}</div><div class="keyboard"><button class="icon-button" data-action="previous">←</button><span><span class="key">←</span> <span class="key">→</span> para navegar</span><button class="icon-button" data-action="next">→</button><button class="button" data-action="project">Projetar</button></div></footer></section>`, "Modo Play");
}

function projector() {
  const item = currentItem();
  return `<section class="projector ${state.showProjector ? "" : "hidden"}" aria-label="Tela do Projetor"><button class="close-projector" data-action="close-projector">Fechar</button>${item.watermark ? '<div class="projector-watermark">Paróquia São José</div>' : ""}<div class="projector-text">${escapeHtml(item.slides[state.activeSlide])}</div><div class="projector-page">${state.activeSlide + 1}/${item.slides.length}</div></section>`;
}

function render() {
  const views = { catalog: catalogView, "item-editor": itemEditorView, routes: routesView, "route-editor": routeEditorView, play: playView };
  document.querySelector("#app").innerHTML = views[state.view]();
  bindEvents();
}

function selectRoute(id) { state.activeItemId = id; state.activeSlide = 0; }
function navigateSlide(direction) {
  const itemIndex = state.route.findIndex((item) => item.id === currentItem().id);
  const item = currentItem();
  if (direction === "next" && state.activeSlide < item.slides.length - 1) state.activeSlide += 1;
  else if (direction === "previous" && state.activeSlide > 0) state.activeSlide -= 1;
  else if (direction === "next" && state.route[itemIndex + 1]) { selectRoute(state.route[itemIndex + 1].id); }
  else if (direction === "previous" && state.route[itemIndex - 1]) { selectRoute(state.route[itemIndex - 1].id); state.activeSlide = currentItem().slides.length - 1; }
  render();
}
function addCatalogItem(id) {
  const source = catalog.find((item) => item.id === id);
  if (!source || state.route.some((item) => item.catalogId === id)) return;
  state.route.push({ id: `route-${id}`, catalogId: id, title: source.title, type: source.type, moment: "Sem momento", watermark: true, slides: source.blocks });
}
function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => { state.view = button.dataset.view; render(); }));
  document.querySelectorAll("[data-select-catalog]").forEach((button) => button.addEventListener("click", () => { state.selectedCatalogId = button.dataset.selectCatalog; state.view = "item-editor"; render(); }));
  document.querySelectorAll("[data-select-route]").forEach((button) => button.addEventListener("click", () => { selectRoute(button.dataset.selectRoute); if (state.view === "route-editor") state.view = "play"; render(); }));
  document.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => { const index = state.route.findIndex((item) => item.id === button.dataset.id); const destination = button.dataset.move === "up" ? index - 1 : index + 1; if (destination >= 0 && destination < state.route.length) [state.route[index], state.route[destination]] = [state.route[destination], state.route[index]]; render(); }));
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => { const action = button.dataset.action; if (action === "next" || action === "previous") navigateSlide(action); if (action === "project") { state.showProjector = true; render(); } if (action === "close-projector") { state.showProjector = false; render(); } if (action === "add-catalog") { addCatalogItem(document.querySelector("#add-catalog").value); render(); } if (action === "add-adhoc") { state.route.push({ id: `ad-hoc-${Date.now()}`, title: "Novo aviso da comunidade", type: "Aviso", moment: "Encerramento", watermark: false, adHoc: true, slides: ["Comunicado temporário para esta celebração."] }); render(); } }));
  document.querySelectorAll("[data-add-from-play]").forEach((button) => button.addEventListener("click", () => { addCatalogItem(button.dataset.addFromPlay); render(); }));
  const query = document.querySelector("#catalog-query"); if (query) query.addEventListener("input", (event) => { state.query = event.target.value; render(); });
  const type = document.querySelector("#catalog-type"); if (type) type.addEventListener("change", (event) => { state.type = event.target.value; render(); });
}

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select")) return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); navigateSlide("next"); }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); navigateSlide("previous"); }
  if (event.key === "Escape" && state.showProjector) { state.showProjector = false; render(); }
});

render();
