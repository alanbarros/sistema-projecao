## Why

O sistema já possui Catálogo de Itens e gestão de Roteiros, mas ainda não oferece a funcionalidade central: projetar Slides em tempo real durante uma celebração. Sem o Modo Play e a tela do Projetor, o sistema é apenas um editor de listas — não substitui o uso operacional em datashow. Implementar agora permite validar a experiência completa do operador e fechar o ciclo de uso do sistema.

## What Changes

- **Novo Modo Play no frontend**: Tela do operador com divisão em Acervo, Roteiro e Preview de Slides do item ativo, incluindo barra de status com paginação "Slide 2 / 4".
- **Janela do Projetor desacoplada**: Segunda janela (popup) que renderiza apenas o texto do Slide ativo em tela cheia, sincronizada com os comandos do operador.
- **Navegação por teclado**: Atalhos com setas (Direita/Baixo = avançar, Esquerda/Cima = retroceder) com transição automática entre ItemRoteiro adjacentes.
- **API de estado de projeção (backend)**: Endpoint REST + WebSocket para persistir e transmitir o estado de projeção (ItemRoteiro ativo, Slide atual, paginação).
- **Slide Engine**: Lógica de quebra de blocos semânticos em Slides paginados e geração do conteúdo projetável.
- **Marca d'água condicional**: Renderização da marca d'água baseada na configuração `marca_agua_ativa` do ItemRoteiro.
- **Offline-first**: Cache local do Roteiro em apresentação para manter navegação funcional sem rede.

## Capabilities

### New Capabilities
- `play-mode-operator-panel`: Painel do operador com Acervo, Roteiro, Preview de Slides e barra de status do Modo Play.
- `projector-display`: Tela dedicada do Projetor com renderização fullscreen, paginação no rodapé e marca d'água condicional.
- `slide-engine`: Motor de quebra de blocos em Slides paginados e navegação contínua entre ItemRoteiro.
- `projection-state-sync`: API REST + WebSocket para estado de projeção em tempo real com suporte a operação offline.

### Modified Capabilities
- `roteiros`: O editor de Roteiro SHALL incluir botão de entrada no Modo Play, e o backend SHALL expor endpoints de estado de projeção vinculados ao Roteiro.

## Impact

- **Frontend (`src/ui`)**: Novas páginas `PlayModePage`, `ProjectorPage`; novos componentes `SlidePreview`, `StatusBar`, `ProjectorWindow`; novo hook `useProjection` com WebSocket; rota `/roteiros/:id/play`.
- **Backend (`src/infrastructure`)**: Novos endpoints REST (`/api/projecao/estado`) e servidor WebSocket; novo repositório de estado de projeção em memória (ou SQLite).
- **Domínio (`src/domain`)**: Novas interfaces `ProjectionState`, `Slide`; lógica de quebra de blocos em Slides.
- **Aplicação (`src/application`)**: Novos use-cases `IniciarProjecaoUseCase`, `NavegarSlideUseCase`, `AtualizarEstadoProjecaoUseCase`.
- **Dependências**: `ws` (WebSocket server no backend), `socket.io` ou `ws` (cliente no frontend).
- **Infraestrutura**: Servidor WebSocket integrado ao Express; popup window API do navegador para tela do Projetor.
