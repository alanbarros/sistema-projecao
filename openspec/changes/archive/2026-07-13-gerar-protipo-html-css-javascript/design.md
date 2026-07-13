## Context

O repositorio possui as capabilities de Catalogo de Itens, Roteiros e Projecao em Tempo Real, mas ainda nao possui aplicacao ou referencia visual. Este change cria uma demonstracao estatica para validar o fluxo do operador antes da implementacao React e do backend.

## Goals / Non-Goals

**Goals:**
- Disponibilizar uma experiencia navegavel que represente as seis telas principais do sistema.
- Usar dados liturgicos de demonstracao para tornar a avaliacao concreta.
- Simular as interacoes essenciais: busca, selecao, reordenacao, criacao visual de item ad-hoc, navegacao de Slides, marca d'agua e paginacao.
- Funcionar localmente em navegador moderno sem servidor ou dependencias externas.

**Non-Goals:**
- Implementar persistencia, regras de dominio, WebSocket, autenticacao ou sincronizacao offline real.
- Definir a identidade visual final ou tornar fonte, cores e fundo dos Slides configuraveis.
- Substituir a futura aplicacao React.

## Decisions

### Arquivos estaticos separados

O prototipo sera composto por `prototype/index.html`, `prototype/styles.css` e `prototype/app.js`. HTML estrutura as telas, CSS define o sistema visual responsivo e JavaScript concentra o estado demonstrativo e os manipuladores de interface.

Arquivos separados permitem que o usuario inspecione cada camada e que a futura aplicacao reutilize a referencia visual. Um unico arquivo HTML foi descartado por dificultar a leitura e manutencao.

### Navegacao de tela unica

Uma barra lateral levara o operador entre Catalogo, editor de ItemColetanea, lista de Roteiros, editor de Roteiro e Modo Play. A tela do Projetor sera uma visualizacao dedicada acionada a partir do Modo Play, com opcao de ocupar toda a viewport.

Essa abordagem entrega um prototipo executavel por abertura direta do arquivo HTML e evita a complexidade de rotas ou uma segunda janela real. A abertura de janela separada foi descartada por poder ser bloqueada pelo navegador e nao agregar valor para a validacao inicial.

### Estado em memoria com exemplos representativos

`app.js` manterá um Roteiro de demonstracao, ItemColetanea e ItemRoteiro ad-hoc. Interacoes atualizarão somente o estado em memoria: filtros, item selecionado, ordem do Roteiro, Slide ativo e marca d'agua ativa.

Dados persistentes foram descartados porque o objetivo e validacao visual, nao operacao real.

### Visual operacional focado em leitura

O painel usara uma linguagem visual de console de operacao: contraste alto, hierarquia clara, areas densas e controles diretos. A tela do Projetor apresentara texto centralizado, marca d'agua condicional e paginacao no rodape no formato `atual/total`.

O prototipo nao fornecera controles de cor, fonte ou fundo dos Slides, em conformidade com as capabilities existentes.

## Risks / Trade-offs

- [O prototipo pode sugerir que comportamentos simulados ja existem no produto] -> Identificar claramente a tela como prototipo e limitar os dados ao estado em memoria.
- [A visualizacao unica nao prova comunicacao entre operador e projetor em dispositivos distintos] -> Tratar a tela do Projetor como validacao visual; WebSocket sera validado em change posterior de implementacao.
- [Abrir o HTML diretamente pode ter restricoes de navegador] -> Nao usar modulos JavaScript, chamadas de rede ou recursos que exijam servidor.
