## Why

Itens no Roteiro que deveriam conter múltiplos slides estão exibindo apenas o primeiro slide. O estado de projeção é corrompido após a primeira navegação porque `Map<number, number>` é serializado como `{}` pelo `JSON.stringify()` no WebSocket, destruindo `itensComSlide`. Além disso, o label de contagem de slides no Play Mode mostra o número de blocos em vez do número real de slides gerados.

## What Changes

- **Corrigir serialização do Map no WebSocket**: Substituir `Map<number, number>` por `Record<number, number>` (objeto plano) no `ProjectionState`, eliminando a destruição do dado durante `JSON.stringify()`/`JSON.parse()`
- **Corrigir localStorage**: Adaptar `salvarEstadoLocalStorage` e `carregarEstadoLocalStorage` para trabalhar com objeto plano em vez de Map
- **Corrigir label de contagem no Play Mode**: Usar `gerarSlides(item.blocos).length` em vez de `item.blocos.length` para mostrar o número real de slides
- **Remover código duplicado não utilizado**: Remover a função `gerarSlides` duplicada em `domain/entities/Slide.ts`

## Capabilities

### Modified Capabilities
- `projection-state-sync`: O tipo `ProjectionState.itensComSlide` muda de `Map<number, number>` para `Record<number, number>` para compatibilidade com serialização JSON
- `play-mode-operator-panel`: A contagem de slides nos mini-items agora reflete o número real de slides gerados, não o número de blocos
- `slide-engine`: Remoção da função duplicada não utilizada em `domain/entities/Slide.ts`

### New Capabilities
- (nenhuma)

## Impact

- **Arquivos afetados**:
  - `src/domain/entities/ProjectionState.ts` — mudança de tipo
  - `src/ui/src/engine/projectionState.ts` — adaptação para objeto plano
  - `src/ui/src/hooks/useProjection.ts` — adaptação para objeto plano
  - `src/ui/src/hooks/useProjectionWebSocket.ts` — adaptação para objeto plano
  - `src/ui/src/pages/PlayModePage.tsx` — correção do label
  - `src/domain/entities/Slide.ts` — remoção de código duplicado
- **Breaking changes**: Nenhum. A mudança de tipo é interna; a API externa (WebSocket protocol) já recebia `{}` devido ao bug — agora recebe o objeto correto
- **Dependências**: Nenhuma mudança de dependências
