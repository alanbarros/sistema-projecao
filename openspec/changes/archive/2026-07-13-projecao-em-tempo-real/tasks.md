## 1. Domínio — Entidades e Interfaces

- [x] 1.1 Criar interface `Slide` em `src/domain/entities/Slide.ts` (fields: `conteudo`, `indice`, `total`, `marcaAguaAtiva`)
- [x] 1.2 Criar interface `ProjectionState` em `src/domain/entities/ProjectionState.ts` (fields: `roteiroId`, `itemRoteiroId`, `slideIndice`, `totalSlides`, `itensComSlide`)
- [x] 1.3 Criar interface `IProjectionRepository` em `src/domain/repositories/IProjectionRepository.ts` (métodos: `obterEstado`, `atualizarEstado`, `limparEstado`)
- [x] 1.4 Criar função `gerarSlides(blocos, maxConteudoPorSlide): Slide[]` em `src/domain/entities/Slide.ts` com lógica de quebra de blocos semânticos (limite: 500 caracteres por Slide)
- [x] 1.5 Definir constante `MAX_CHARS_PER_SLIDE = 500` em `src/shared/constants.ts`

## 2. Infraestrutura Backend — WebSocket e Estado de Projeção

- [x] 2.1 Adicionar dependência `ws` no `package.json` do infrastructure e instalar
- [x] 2.2 Criar `src/infrastructure/websocket/ProjectionServer.ts` — servidor WebSocket integrado ao HTTP server do Express
- [x] 2.3 Criar `src/infrastructure/repositories/InMemoryProjectionRepository.ts` — Map<roteiroId, ProjectionState> em memória
- [x] 2.4 Criar rota `GET /api/projecao/:roteiroId/estado` para consultar estado de projeção
- [x] 2.5 Criar rota `PUT /api/projecao/:roteiroId/estado` para atualizar estado de projeção
- [x] 2.6 Integrar WebSocket no `server.ts` — criar HTTP server a partir do Express app e anexar o WebSocket server
- [x] 2.7 Implementar protocolo WebSocket com eventos: `projection:sync`, `projection:navigate`, `projection:update`, `projection:error`
- [x] 2.8 Implementar autenticação de conexão WebSocket utilizando `roteiroId` como identificador de sala (room)

## 3. Frontend — Slide Engine

- [x] 3.1 Criar `src/ui/src/engine/slideEngine.ts` com função `gerarSlides(blocos: ItemRoteiroBloco[], maxChars?: number): Slide[]`
- [x] 3.2 Implementar quebra por limite de caracteres por Slide (constante: `MAX_CHARS_PER_SLIDE = 500`)
- [x] 3.3 Implementar coerência semântica: não separar bloco de refrão do verso anterior
- [x] 3.4 Criar `src/ui/src/engine/projectionState.ts` — gerenciamento de estado de navegação (item ativo, slide atual,向前/向后)
- [x] 3.5 Implementar transição automática: avanço no último slide vai para primeiro slide do próximo item; retroceder no primeiro slide vai para último slide do item anterior
- [x] 3.6 Implementar limites: não avançar além do último item, não retroceder antes do primeiro item
- [x] 3.7 Integrar renderização de marca d'água no `slideEngine.ts` baseado em `ItemRoteiro.marcaAguaAtiva`

## 4. Frontend — WebSocket Client e Hook

- [x] 4.1 Criar `src/ui/src/hooks/useProjectionWebSocket.ts` — hook que conecta ao WebSocket do Roteiro
- [x] 4.2 Implementar reconnect com backoff exponencial (1s, 2s, 4s, max 10s)
- [x] 4.3 Implementar envio de comandos de navegação via WebSocket (evento `projection:navigate`)
- [x] 4.4 Implementar recebimento de atualizações de estado (evento `projection:update`) e notificação de listeners
- [x] 4.5 Criar `src/ui/src/hooks/useProjection.ts` — hook principal que orquestra Slide Engine + WebSocket + estado local

## 5. Frontend — Modo Play (Painel do Operador)

- [x] 5.1 Criar página `src/ui/src/pages/PlayModePage.tsx` com layout tripartido (Acervo, Roteiro, Preview)
- [x] 5.2 Implementar aba de Acervo no Modo Play — busca e seleção de itens do catálogo para adicionar ao roteiro
- [x] 5.3 Implementar aba de Roteiro no Modo Play — lista de ItemRoteiro com seleção e destaque do item ativo
- [x] 5.4 Implementar aba de Preview — renderização do Slide atual com paginação
- [x] 5.5 Criar componente `src/ui/src/components/ProjectionStatusBar.tsx` — barra fixa com título do item ativo e paginação "Slide X / Y"
- [x] 5.6 Criar componente `src/ui/src/components/SlidePreview.tsx` — preview do Slide com marca d'água condicional e paginação no rodapé
- [x] 5.7 Adicionar rota `/roteiros/:id/play` no `App.tsx`
- [x] 5.8 Adicionar botão "Iniciar Play" no `RoteiroEditorPage.tsx` que navega para a rota de Play

## 6. Frontend — Tela do Projetor (Popup)

- [x] 6.1 Criar página `src/ui/src/pages/ProjectorPage.tsx` — tela fullscreen com apenas o texto do Slide ativo
- [x] 6.2 Implementar renderização do texto centralizado em tela cheia, sem elementos de UI
- [x] 6.3 Implementar paginação no rodapé no formato "atual/total"
- [x] 6.4 Implementar marca d'água condicional baseada em `marcaAguaAtiva` do ItemRoteiro
- [x] 6.5 Criar função `src/ui/src/services/projector.ts` — `abrirProjecao(roteiroId): Window` que abre popup via `window.open()` com configurações fullscreen
- [x] 6.6 Implementar função `fecharProjecao(): void` para fechar a janela do Projetor
- [x] 6.7 Conectar o popup ao mesmo WebSocket do operador para receber atualizações de Slide
- [x] 6.8 Adicionar rota `/projetor/:roteiroId` no `App.tsx` para a tela do Projetor

## 7. Integração e Navegação por Teclado

- [x] 7.1 Implementar captura global de teclado (`keydown` no `document`) no Modo Play
- [x] 7.2 Mapear Seta Direita e Seta Baixo para avanço de Slide
- [x] 7.3 Mapear Seta Esquerda e Seta Cima para retrocesso de Slide
- [x] 7.4 Integrar atalhos de teclado com o hook `useProjection` para disparar navegação
- [x] 7.5 Sincronizar estado local + WebSocket a cada comando de teclado

## 8. Offline e Persistência Local

- [x] 8.1 Implementar cache do Roteiro completo no estado React ao iniciar Modo Play
- [x] 8.2 Persistir estado de projeção em `localStorage` como fallback (chave: `projection_state_${roteiroId}`)
- [x] 8.3 Restaurar estado de projeção do `localStorage` ao recarregar a página
- [x] 8.4 Garantir que navegação funcione sem conexão WebSocket (modo local via cache)
- [x] 8.5 Implementar sincronização do estado local com o backend ao restaurar conexão

## 9. Validação e Finalização

- [x] 9.1 Testar fluxo completo: criar roteiro → adicionar itens → iniciar Play → navegar → projetar
- [x] 9.2 Testar navegação entre ItemRoteiro adjacentes (avanço e retrocesso)
- [x] 9.3 Testar marca d'água ativa/inativa por item
- [x] 9.4 Testar operação com rede indisponível (offline)
- [x] 9.5 Verificar latência de projeção < 100ms em condições normais
- [x] 9.6 Executar `npm run build` e verificar que todos os workspaces compilam sem erros
