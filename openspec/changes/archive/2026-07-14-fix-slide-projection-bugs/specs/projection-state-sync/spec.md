## MODIFIED Requirements

### Requirement: Protocolo WebSocket para Sincronização

O sistema SHALL utilizar WebSocket para sincronização em tempo real entre operador e projetor. O protocolo SHALL seguir o formato JSON com os seguintes eventos:

- **`projection:sync`** — Sincronização inicial ao conectar. Payload: `{ roteiroId: number, itemRoteiroId: number, slideIndex: number, totalSlides: number }`
- **`projection:navigate`** — Comando de navegação. Payload: `{ direction: 'next' | 'prev' }`
- **`projection:update`** — Atualização de estado. Payload: `{ itemRoteiroId: number, slideIndex: number, totalSlides: number, titulo: string }`
- **`projection:error`** — Erro de operação. Payload: `{ message: string }`

O campo `itensComSlide` SHALL ser serializado como `Record<number, number>` (objeto plano) em todas as mensagens WebSocket, garantindo serialização/deserialização correta via `JSON.stringify()`/`JSON.parse()`.

O sistema SHALL autenticar conexões WebSocket utilizando o `roteiroId` como identificador de sala (room).

#### Scenario: Consultar estado de projeção

- **WHEN** o sistema receber uma requisição GET para o estado de projeção de um Roteiro
- **THEN** o sistema SHALL retornar o ItemRoteiro ativo, o índice do Slide e a paginação total

#### Scenario: Atualizar estado de projeção

- **WHEN** o operador navegar para um novo Slide
- **THEN** o sistema SHALL atualizar o estado de projeção no backend
- **AND** a atualização SHALL refletir o ItemRoteiro ativo e o Slide atual

### Requirement: Operação offline

O sistema SHALL disponibilizar o roteiro atual e seus Slides em cache local (localStorage) no momento da entrada no Modo Play. A apresentação SHALL permanecer navegável localmente sem conexão de rede, utilizando o cache como fallback.

O `itensComSlide` SHALL ser armazenado no localStorage como `Record<number, number>` (objeto plano) para garantir serialização correta via `JSON.stringify()`.

#### Scenario: Perder a rede durante a apresentação

- **WHEN** a conexão de rede for perdida enquanto um Roteiro estiver em apresentação
- **THEN** o operador SHALL continuar navegando pelos Slides disponíveis em cache local
- **AND** a tela do Projetor local SHALL continuar recebendo as alterações de Slide via comunicação interna

#### Scenario: Restaurar conexão após perda

- **WHEN** a conexão de rede for restaurada
- **THEN** o sistema SHALL sincronizar o estado local com o backend
- **AND** SHALL retomar a transmissão via WebSocket

#### Scenario: Persistir estado corretamente no localStorage

- **WHEN** o operador navegar entre slides
- **THEN** o sistema SHALL serializar `itensComSlide` como objeto plano no localStorage
- **AND** o estado SHALL ser restaurado corretamente ao recarregar a página

#### Scenario: Recuperar de localStorage com estado corrompido

- **WHEN** o sistema tentar carregar o estado do localStorage e `itensComSlide` for `{}` vazio, `null`, array ou tipo incompatível
- **THEN** o sistema SHALL descartar o estado salvo
- **AND** SHALL criar um estado inicial limpo com o primeiro item do roteiro
