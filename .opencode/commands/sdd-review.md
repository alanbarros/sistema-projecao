---
description: Revisar uma change OpenSpec antes do Apply.
---

Revise uma change OpenSpec antes da execucao do Apply.

**Entrada:** `$ARGUMENTS` pode conter o nome da change. Sem argumento, identifique a change pelo contexto da conversa. Se nao for possivel inferir e houver mais de uma change ativa, execute `openspec list --json` e solicite que o usuario selecione uma.

1. Execute `openspec status --change "<nome-da-change>" --json` para identificar os artefatos e o estado da change.
2. Leia todos os artefatos de planejamento disponiveis, especialmente `proposal.md`, `design.md`, `tasks.md`, as especificacoes em `specs/` e `AGENTS.md`.
3. Verifique a consistencia entre os artefatos: requisitos conflitantes, funcionalidades presentes em apenas um documento, tarefas sem requisito e requisitos sem tarefa.
4. Avalie o escopo: itens excessivos para uma unica change, funcionalidades que devem ser separadas e dependencias entre funcionalidades.
5. Valide a arquitetura em relacao ao `AGENTS.md`: violacoes arquiteturais, estruturas de pastas inconsistentes, componentes excessivamente grandes, acoplamento desnecessario e riscos de manutencao.
6. Avalie a viabilidade da implementacao: dependencias, servicos, entidades, casos de uso ou fluxos ausentes.
7. Avalie banco de dados e persistencia: entidades incompletas, relacionamentos ausentes, dados nao previstos e riscos de persistencia.
8. Classifique cada risco como baixo, medio ou alto e destaque ambiguidades e decisoes nao documentadas.

Apresente o resultado nesta estrutura:

## Pontos Positivos

## Problemas Encontrados

Liste primeiro os problemas mais graves, com referencias aos arquivos e linhas quando possivel.

## Recomendacoes

## Conclusao

Conclua com exatamente uma das opcoes: `Pronto para Apply` ou `Requer ajustes antes do Apply`.
