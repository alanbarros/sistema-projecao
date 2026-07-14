## Context

O sistema já implementa Catálogo de Itens e gestão de Roteiros (CRUD, snapshot, reordenação, itens ad-hoc). O backend usa Express + better-sqlite3 com Clean Architecture (domain/application/infrastructure). O frontend usa React + Vite com rotas por react-router-dom.

A funcionalidade de Projeção em Tempo Real é o core operacional do sistema — sem ela, o projeto é apenas um editor de listas. O desafio principal é bidirecionar o estado de projeção entre o painel do operador e a tela do Projetor com latência < 100ms, suportando operação offline.

## Goals / Non-Goals

**Goals:**
- Implementar o Modo Play como página dedicada com Acervo, Roteiro e Preview
- Engine de quebra de blocos em Slides paginados
- Tela do Projetor em janela desacoplada (popup do navegador)
- Sincronização via WebSocket entre operador e Projetor
- Navegação por teclado com transição automática entre ItemRoteiro
- Cache local para operação offline
- Marca d'água condicional por ItemRoteiro

**Non-Goals:**
- Editor visual de Slides (WYSIWYG, fontes, cores, imagens de fundo)
- Suporte a mídia (vídeo, áudio, PDF, PowerPoint)
- Autenticação ou RBAC de usuários
- Integração com calendário litúrgico externo
- Transições animadas entre Slides (fade, slide)

## Decisions

### D1: WebSocket via `ws` no backend, `ws` no frontend (não Socket.IO)

**Decisão:** Usar a biblioteca `ws` tanto no servidor quanto no cliente.

**Alternativas consideradas:**
- **Socket.IO**: Abstrai reconnect automático, namespaces, salas. Porém adiciona protocolo próprio sobre HTTP, aumenta bundle size e cria acoplamento a uma lib pesada.
- **SSE (Server-Sent Events)**: Mais simples, mas só suporta server→client. Navegação do operador precisa client→server.

**Ração:** `ws` é leve (~2KB client), segue o padrão WebSocket nativo do browser, e o protocolo binário/JSON é suficiente para o volume de mensagens do sistema (comandos de navegação). Reconnect automático pode ser implementado em ~15 linhas no cliente.

### D2: Estado de projeção em memória no servidor (não SQLite)

**Decisão:** Manter o estado de projeção (ItemRoteiro ativo, Slide atual) em um Map<roteiroId, ProjectionState> no servidor.

**Alternativas consideradas:**
- **SQLite**: Persistência garante sobrevivência a restarts do servidor.
- **Redis**: Escalável, mas introduz dependência externa desnecessária para uso local.

**Ração:** O estado de projeção é volátil — só existe durante a apresentação. Se o servidor reiniciar, a apresentação precisa ser reiniciada de qualquer forma (o operador reabre o Modo Play). SQLite adiciona I/O desnecessário a cada navegação (< 100ms target). SQLite pode ser considerado futuramente para logs de apresentação.

### D3: Slide Engine no frontend (não no backend)

**Decisão:** A quebra de blocos em Slides paginados é feita no cliente, a partir dos dados do ItemRoteiro.

**Alternativas consideradas:**
- **Backend gera Slides**: Backend retorna Slides prontos. Simplifica o cliente, mas acopla a lógica de apresentação ao servidor e aumenta payload de rede.
- **Backend calcula, frontend renderiza**: Híbrido com split de responsabilidades.

**Ração:** O cliente já recebe os blocos do ItemRoteiro (snapshot). A quebra é pura lógica de apresentação (tamanho de texto, coerência semântica) e não precisa de dados do servidor. Manter no cliente: (1) reduz latência — navegação local é instantânea; (2) permite operação offline; (3) mantém o backend como API pura de dados.

### D4: Tela do Projetor via `window.open` (popup)

**Decisão:** Abrir a tela do Projetor como um popup do navegador (`window.open`) com rota dedicada.

**Alternativas consideradas:**
- **`<iframe>` embutido**: Mais fácil de sincronizar, mas não permite tela cheia real no datashow.
- **`window.postMessage` + iframe**: Funcional mas limitado pelo layout do operador.
- **Segunda tela via API do SO**: Exige permissões do sistema operacional.

**Ração:** `window.open` cria uma janela independente que pode ser arrastada para a segunda tela do datashow e colocada em fullscreen. Comunicação entre janelas via BroadcastChannel (mesmo origin) ou SharedArrayBuffer. O popup herda a origem e pode acessar o mesmo estado via WebSocket.

### D5: Navegação por teclado com captura global

**Decisão:** Capturar eventos de teclado globalmente no Modo Play usando `keydown` no `document`.

**Alternativas consideradas:**
- **Controles de UI (botões)**: Acessível mas lento para operação ao vivo.
- **`onKeyDown` em elemento focado**: Depende do foco estar no componente certo.

**Ração:** Operação litúrgica exige respostas imediatas sem mover o mouse. Captura global no `document` garante que as setas funcionam independentemente do foco. Botões de UI ficam como alternativa visual para touchpads.

### D6: Cache local com Service Worker (futuro) ou fallback com localStorage

**Decisão:** Para a primeira versão, cache do Roteiro completo no estado React (in-memory) com persistência em localStorage como fallback. Service Worker pode ser adicionado depois.

**Alternativas consideradas:**
- **Service Worker desde o início**: PWA completo, offline-first. Complexidade alta para MVP.
- **Apenas in-memory**: Simples, mas perde dados se recarregar a página.

**Ração:** localStorage tem limite de ~5MB, suficiente para múltiplos Roteiros com textos. O estado React mantém os dados quentes durante a sessão. Service Worker é overkill para um sistema que roda em rede local (igreja).

## Risks / Trade-offs

- **[Popup bloqueado pelo browser]** → Alguns browsers bloqueiam `window.open` sem gesto do usuário. Mitigação: abrir o popup a partir do clique do operador no botão "Projetar" e orientar o usuário a permitir popups.
- **[Reconnect de WebSocket]** → Se a rede cair momentaneamente, a conexão pode ser perdida. Mitigação: implementar reconnect com backoff exponencial no cliente (1s, 2s, 4s, max 10s).
- **[Slide Engine com conteúdo imprevisível]** → Textos muito longos ou com formatação especial podem quebrar a paginação. Mitigação: limitar tamanho por Slide e truncar com "..." se necessário; testar com conteúdos reais.
- **[Estado inconsistente entre abas]** → Se o operador abrir múltiplos Modo Play, o estado pode conflitar. Mitigação: usar um único WebSocket por Roteiro e ignorar estados antigos.
- **[Performance com Roteiros grandes]** → Roteiros com 50+ itens podem causar lag na renderização. Mitigação: virtualizar a lista de itens no roteiro e renderizar Slides sob demanda.
