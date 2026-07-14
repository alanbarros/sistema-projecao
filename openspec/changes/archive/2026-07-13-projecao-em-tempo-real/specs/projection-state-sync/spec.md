## ADDED Requirements

### Requirement: Protocolo WebSocket para Sincronização

O sistema SHALL utilizar WebSocket para sincronização em tempo real entre operador e projetor. O protocolo SHALL seguir o formato JSON com os seguintes eventos:

- **`projection:sync`** — Sincronização inicial ao conectar. Payload: `{ roteiroId: number, itemRoteiroId: number, slideIndex: number, totalSlides: number }`
- **`projection:navigate`** — Comando de navegação. Payload: `{ direction: 'next' | 'prev' }`
- **`projection:update`** — Atualização de estado. Payload: `{ itemRoteiroId: number, slideIndex: number, totalSlides: number, titulo: string }`
- **`projection:error`** — Erro de operação. Payload: `{ message: string }`

O sistema SHALL autenticar conexões WebSocket utilizando o `roteiroId` como identificador de sala (room).

#### Scenario: Consultar estado de projeção

- **WHEN** o sistema receber uma requisição GET para o estado de projeção de um Roteiro
- **THEN** o sistema SHALL retornar o ItemRoteiro ativo, o índice do Slide e a paginação total

#### Scenario: Atualizar estado de projeção

- **WHEN** o operador navegar para um novo Slide
- **THEN** o sistema SHALL atualizar o estado de projeção no backend
- **AND** a atualização SHALL refletir o ItemRoteiro ativo e o Slide atual

### Requirement: Sincronização via WebSocket

O sistema SHALL sincronizar comandos e o Slide ativo por WebSocket quando a rede estiver disponível.

#### Scenario: Receber atualização de slide por WebSocket

- **WHEN** o operador navegar para um novo Slide
- **THEN** o sistema SHALL transmitir o estado atualizado via WebSocket para todas as janelas conectadas ao mesmo Roteiro

#### Scenario: Conectar ao WebSocket

- **WHEN** uma nova janela (Projetor ou operador) acessar o Modo Play
- **THEN** o sistema SHALL estabelecer conexão WebSocket associada ao Roteiro em apresentação

### Requirement: Operação offline

O sistema SHALL disponibilizar o roteiro atual e seus Slides em cache local (localStorage) no momento da entrada no Modo Play. A apresentação SHALL permanecer navegável localmente sem conexão de rede, utilizando o cache como fallback.

#### Scenario: Perder a rede durante a apresentação

- **WHEN** a conexão de rede for perdida enquanto um Roteiro estiver em apresentação
- **THEN** o operador SHALL continuar navegando pelos Slides disponíveis em cache local
- **AND** a tela do Projetor local SHALL continuar recebendo as alterações de Slide via comunicação interna

#### Scenario: Restaurar conexão após perda

- **WHEN** a conexão de rede for restaurada
- **THEN** o sistema SHALL sincronizar o estado local com o backend
- **AND** SHALL retomar a transmissão via WebSocket

### Requirement: Baixa latência de projeção

O sistema SHALL atualizar a tela do projetor em menos de 100 ms após um comando do operador, nas condições normais da instalação.

#### Scenario: Comando de avanço

- **WHEN** o operador executar um comando de avanço de Slide
- **THEN** o Slide seguinte SHALL ser disponibilizado na tela do projetor em menos de 100 ms
