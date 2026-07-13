## Context

O prototipo navegavel em `prototype/` valida o fluxo de Catalogo, Roteiro, Modo Play e Projetor. As especificacoes atuais ainda determinam que edicoes de um ItemColetanea sejam propagadas aos ItemRoteiro, em conflito com o snapshot isolado definido para o dominio e esperado para preservar a celebracao. A implementacao futura seguira React no frontend e Node.js com TypeScript no backend, mantendo os contextos de Catalogo e Execucao separados.

## Goals / Non-Goals

**Goals:**

- Preservar em cada ItemRoteiro uma copia independente dos dados projetaveis do ItemColetanea no momento da inclusao.
- Tornar explicitos os atributos e fluxos operacionais vistos no prototipo para composicao, selecao e projecao de Roteiros.
- Manter a projecao navegavel localmente, com a mesma fonte de estado para preview e Projetor.

**Non-Goals:**

- Implementar autenticacao, customizacao visual de Slides, midia ou integracoes externas.
- Alterar o ItemColetanea original ao editar um ItemRoteiro.
- Definir um mecanismo de sincronizacao retroativa de snapshots ja criados.

## Decisions

### Persistir snapshot no contexto de Execucao

Ao adicionar um ItemColetanea a um Roteiro, o caso de uso copiara titulo, tipo e blocos que originam os Slides para o ItemRoteiro. O identificador de origem pode ser preservado somente como referencia de rastreabilidade; a projecao lerá exclusivamente o snapshot. Isso evita que uma alteracao posterior do Catalogo modifique uma celebracao ja preparada ou em exibicao. A alternativa de manter referencia viva e propagar edicoes foi descartada por contrariar a preservacao historica do agregado Roteiro.

### Centralizar o estado operacional na selecao ativa do Roteiro

O Modo Play mantera o identificador do ItemRoteiro ativo e o indice do Slide ativo como estado de execucao. A selecao pela lista de Roteiro reinicia o indice no primeiro Slide; os comandos direcionais aplicam a transicao entre itens apenas nos limites. Preview e Projetor receberao esse mesmo estado, evitando divergencia entre a tela do operador e a tela exibida. A alternativa de cada superficie manter selecao propria foi descartada porque introduz risco de projetar conteudo diferente do preview.

### Configurar a apresentacao no ItemRoteiro

MomentoLiturgico, origem ad-hoc ou catalogada e marca d'agua pertencem ao ItemRoteiro, pois descrevem o uso na celebracao e nao o ItemColetanea permanente. Itens ad-hoc serao criados apenas no Roteiro com seus proprios blocos e nao terao referencia ao Catalogo.

### Separar sincronizacao remota de continuidade local

O estado do Roteiro em apresentacao e seus snapshots deverao estar disponiveis no cliente antes de iniciar o Modo Play. WebSocket replicara comandos quando houver conexao, enquanto a comunicacao da tela de Projetor local usara o estado local para continuar sem rede. Essa separacao preserva o requisito de baixa latencia e a operacao offline; depender exclusivamente do WebSocket foi descartado porque interromperia a apresentacao diante de perda de rede.

## Risks / Trade-offs

- [Snapshots duplicam conteudo do Catalogo] -> Aceitar a duplicacao como custo de isolamento e armazenar apenas dados necessarios para a projecao.
- [Edicoes no Catalogo deixam Roteiros existentes desatualizados] -> Exibir a origem como referencia quando relevante, sem atualizacao automatica; uma futura acao explicita de substituicao podera ser projetada separadamente.
- [Tela do Projetor pode abrir em outra janela] -> Definir um canal local de estado e tratar a indisponibilidade da janela sem bloquear o painel do operador.
- [Atalhos globais podem afetar formularios] -> Ignorar comandos de navegacao quando o foco estiver em campo de entrada ou selecao.

## Migration Plan

1. Ajustar os contratos de dominio e persistencia para armazenar o snapshot em novos ItemRoteiro.
2. Para registros existentes vinculados ao Catalogo, materializar o snapshot a partir do conteudo atual antes de remover a leitura viva; se nao houver registros legados, iniciar diretamente com o novo formato.
3. Atualizar os casos de uso e interfaces de Roteiro e Modo Play para consumirem o snapshot.
4. Validar navegacao, marca d'agua, paginacao e continuidade local antes da liberacao.
5. Em caso de rollback antes da migracao ser concluida, restaurar a leitura por referencia; apos a materializacao, manter os snapshots e reverter apenas a interface se necessario.

## Decisoes Adotadas

### Estado de apresentacao efemero

O estado do Modo Play (ItemRoteiro ativo e Slide ativo) sera mantido apenas na memoria do cliente. Ao reiniciar o Modo Play, a navegacao comeca pelo primeiro ItemRoteiro. Nao haverao persistencia nem retomada de estado apos fechamento do navegador, pois a operacao liturgica e tipicamente contínua e nao requer resgate de sessao anterior.

### Projetor como rota dedicada (/projecao)

A tela do Projetor sera uma rota dedicada no frontend, acessivel por URL direta em dispositivo separado (datashow, tablet). O estado de exibicao sera sincronizado via WebSocket entre a rota do operador e a rota do Projetor. Essa abordagem e preferivel a window.open() porque permite acesso independente de dispositivos e nao depende de configuracoes de popup do navegador.
