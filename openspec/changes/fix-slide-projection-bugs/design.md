## Context

O sistema de projeção usa `ProjectionState` com `itensComSlide: Map<number, number>` para rastrear quantos slides cada item do roteiro possui. Esse estado é:
1. Enviado via WebSocket (`JSON.stringify`) entre operador e projetor
2. Salvo em `localStorage` para persistir entre recarregamentos

O problema: `JSON.stringify()` serializa `Map` como `{}`, corrompendo o estado após o primeiro envio via WebSocket. Isso quebra a navegação e impede persistência no localStorage.

## Goals / Non-Goals

**Goals:**
- Eliminar a corrupção de estado causada pela serialização do Map
- Garantir que a navegação entre slides funcione corretamente após múltiplas ações
- Garantir que o estado seja persistido corretamente no localStorage
- Corrigir a contagem de slides exibida no Play Mode
- Remover código duplicado não utilizado

**Non-Goals:**
- Refatorar a arquitetura de estado do WebSocket
- Adicionar novos eventos ou protocolos
- Mudar o algoritmo de geração de slides

## Decisions

### 1. Usar `Record<number, number>` em vez de `Map<number, number>`

**Decisão:** Substituir `Map<number, number>` por `Record<number, number>` (objeto JS plano) em `ProjectionState.itensComSlide`.

**Alternativas consideradas:**
- **Serializar/deserializar Map manualmente** (converter para array antes de enviar, reconstruir Map ao receber): Mais código, mais pontos de falta, mais difícil de manter
- **Usar `reviver`/`replacer` do JSON.parse/stringify**: Funciona mas adiciona complexidade e pode causar problemas com bibliotecas de terceiros que façam parse do WebSocket
- **Não compartilhar estado via WebSocket** (cada cliente gera slides independentemente): Quebra a sincronização operador↔projetor

**Razão:** `Record<number, number>` é nativamente serializável por JSON, não requer código auxiliar, e é compatível com todas as operações necessárias (lookup por chave, iteração, serialização).

### 2. Adaptar localStorage para objeto plano

**Decisão:** Atualizar `salvarEstadoLocalStorage` e `carregarEstadoLocalStorage` para trabalhar com `Record<number, number>` em vez de `Map`.

O `salvar` já usava `Array.from(map.entries())` — agora simplesmente passa o objeto plano direto para `JSON.stringify()`. O `carregar` já fazia `new Map(array)` — agora recebe o objeto plano diretamente.

### 3. Calcular contagem real de slides no Play Mode

**Decisão:** Chamar `gerarSlides(item.blocos).length` ao renderizar mini-items no PlayModePage, em vez de usar `item.blocos.length`.

**Alternativa considerada:** Pré-computar a contagem ao carregar o roteiro — adiciona complexidade sem benefício claro, dado que `gerarSlides` é síncrono e rápido.

### 4. Remover `gerarSlides` duplicado em domain/entities/Slide.ts

**Decisão:** Remover a função `gerarSlides` de `src/domain/entities/Slide.ts` que nunca é importada. A cópia ativa em `src/ui/src/engine/slideEngine.ts` permanece.

### 5. Validar `itensComSlide` ao carregar do localStorage

**Decisão:** Em `carregarEstadoLocalStorage`, verificar se `itensComSlide` é um objeto plano com chaves numéricas (não `{}` vazio, não `null`, não array). Se inválido, retornar `null` para forçar a criação de estado inicial limpo.

**Razão:** Usuários com localStorage corrompido (do bug anterior) teriam `itensComSlide: {}`. Sem validação, o estado seria restaurado silenciosamente com tracking vazio, causando comportamento errático na navegação entre itens.

### 6. Interface `ProjectionState` — manter separada ou unificar

**Decisão:** As interfaces `ProjectionState` em `domain/entities/ProjectionState.ts` (com `roteiroId`) e em `hooks/useProjection.ts` (sem `roteiroId`) são funcionalmente diferentes: a primeira é usada pelo server-side, a segunda é estado local do hook. Manter separadas, mas garantir que `itensComSlide: Record<number, number>` esteja em ambas.

**Alternativa considerada:** Importar a interface do domínio no hook e adicionar `roteiroId` ao estado local — causaria mudança desnecessária no hook (o `roteiroId` já está no closure do hook via props).

## Risks / Trade-offs

- **[Risco] Breaking change para clientes conectados durante o deploy** → Mitigação: A mudança é interna ao frontend. O protocolo WebSocket já recebia `{}` devido ao bug — agora recebe o objeto correto. Clientes antigos que reconectem receberão o novo formato corretamente.
- **[Trade-off] `Record` não preserva ordem de inserção** → Aceitável: A ordem dos itens é determinada pela lista `itens[]` do roteiro, não pelo mapa. O mapa é apenas lookup por ID.
- **[Trade-off] Duas interfaces `ProjectionState`** → Aceitável: São camadas diferentes (domain/server vs hook/local) com necessidades distintas. Unificaria apenas se o hook passasse a usar `roteiroId` do estado.
