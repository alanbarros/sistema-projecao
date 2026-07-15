## 1. Tipo ProjectionState — Map para Record

- [x] 1.0 Unificar interfaces `ProjectionState`: remover as interfaces locais de `useProjection.ts` (L28-33) e `useProjectionWebSocket.ts` (L4-8), importando de `src/domain/entities/ProjectionState.ts`. Adicionar `roteiroId` ao tipo de domínio se necessário para compatibilidade, ou manter as interfaces separadas com `itensComSlide: Record<number, number>` em ambas — Documentar a decisão no código
- [x] 1.1 Alterar `itensComSlide` de `Map<number, number>` para `Record<number, number>` em `src/domain/entities/ProjectionState.ts`. **Nota:** Esta interface é importada por `ProjectionServer.ts` (server-side) — o server já recebe `{}` via JSON.parse, então a mudança apenas alinha o tipo com a realidade
- [x] 1.2 Atualizar interface `ProjectionState` em `src/ui/src/hooks/useProjection.ts` para usar `Record<number, number>` (ou remover se importar do domínio)
- [x] 1.3 Atualizar interface `ProjectionState` em `src/ui/src/hooks/useProjectionWebSocket.ts` para usar `Record<number, number>` (ou remover se importar do domínio)
- [x] 1.4 Atualizar interface `ProjectionState` em `src/ui/src/engine/projectionState.ts` para usar `Record<number, number>`

## 2. Engine de projeção — adaptar para Record

- [x] 2.1 Atualizar `criarEstadoInicial` em `projectionState.ts` para criar `Record` em vez de `Map`: `{ [primeiroItemRoteiroId]: totalSlidesPrimeiroItem }`
- [x] 2.2 Atualizar `navegarParaProximo` em `projectionState.ts`: trocar `new Map(estado.itensComSlide)` por `{ ...estado.itensComSlide }`, e `.set(...)` por atribuição direta
- [x] 2.3 Atualizar `navegarParaAnterior` em `projectionState.ts`: mesma alteração que 2.2
- [x] 2.4 Atualizar `atualizarTotalSlides` em `projectionState.ts`: mesma alteração que 2.2
- [x] 2.5 Alterar assinatura de `navegarParaProximo` e `navegarParaAnterior`: parâmetro `itens` muda de `Array<{ id: number; totalSlides: number }>` para `Record<number, number>`. Atualizar lógica interna: `itens[itemRoteiroId]` em vez de `itens.find(...)`

## 3. Hook useProjection — adaptar para Record

- [x] 3.1 Atualizar `salvarEstadoLocalStorage` em `useProjection.ts`: remover `Array.from(estado.itensComSlide.entries())`, passar `itensComSlide` diretamente para `JSON.stringify`
- [x] 3.2 Atualizar `carregarEstadoLocalStorage` em `useProjection.ts`: remover `new Map(estadoSerializado.itensComSlide)`, receber `Record` direto
- [x] 3.3 Adicionar validação em `carregarEstadoLocalStorage`: verificar se `itensComSlide` é um objeto com chaves (não `{}` vazio, não `null`, não array). Se inválido, retornar `null` para forçar estado inicial
- [x] 3.4 Atualizar `navigateNext` em `useProjection.ts`: construir `Record<number, number>` a partir de `itens.map(...)` em vez de array de `{ id, totalSlides }`. Passar o `Record` diretamente para `navegarParaProximo`
- [x] 3.5 Atualizar `navigatePrev` em `useProjection.ts`: mesma alteração que 3.4 para `navegarParaAnterior`
- [x] 3.6 Atualizar `jumpToItem` em `useProjection.ts`: trocar `new Map<number, number>()` + `.set(...)` por construção de objeto `Record<number, number>`

## 4. Play Mode — correção do label

- [x] 4.1 Em `PlayModePage.tsx`, importar `gerarSlides` do `../engine/slideEngine`
- [x] 4.2 Substituir `item.blocos.length` por `gerarSlides(item.blocos).length` no mini-item da coluna Acervo (linha ~155)
- [x] 4.3 Substituir `item.blocos.length` por `gerarSlides(item.blocos).length` no mini-item da coluna Roteiro (linha ~179)

## 5. Limpeza — remover código duplicado

- [x] 5.1 Remover função `gerarSlides` duplicada de `src/domain/entities/Slide.ts`
- [x] 5.2 Verificar se `Slide.ts` ainda exporta algo necessário (interface `Slide`); se não, simplificar o arquivo

## 6. Verificação

- [x] 6.1 Rodar `cd src/ui && npx tsc --noEmit` para verificar erros de tipo
- [ ] 6.2 Testar navegação: abrir Play Mode, navegar com setas, verificar que slides avançam/retrocedem corretamente
- [ ] 6.3 Testar persistência: navegar, recarregar página, verificar que o estado é restaurado
- [ ] 6.4 Testar sincronização: abrir projetor, navegar no operador, verificar que o projetor atualiza
- [ ] 6.5 Testar cenário de borda: abrir Play Mode com localStorage contendo `{}` (estado corrompido antigo), verificar que o sistema cria estado inicial limpo
