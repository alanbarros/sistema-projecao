## 1. Decisoes de design

- [x] 1.1 Definir estado de apresentacao como efemero (sem persistencia no servidor).
- [x] 1.2 Definir mecanismo do Projetor como rota dedicada (/projecao).

## 2. Sincronizacao de specs

- [x] 2.1 Aplicar delta spec de catalogo-de-itens a spec principal: remover propagacao de edicoes para ItemRoteiro vinculados.
- [x] 2.2 Aplicar delta spec de roteiros a spec principal: exigir snapshot na insercao, remover propagacao e preservar requirement de itens ad-hoc.
- [x] 2.3 Aplicar delta spec de projecao-em-tempo-real a spec principal: adicionar requirement de selecao operacional e acionamento do Projetor.

## 3. Validacao

- [x] 3.1 Verificar consistencia entre specs sincronizadas e AGENTS.md (glossario, contextos, escopo).
- [x] 3.2 Verificar que nenhum requirement ficou orfao ou contraditorio apos a sincronizacao.
