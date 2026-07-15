## ADDED Requirements

### Requirement: README.md na raiz do repositório

O repositório SHALL conter um arquivo `README.md` na raiz que sirva como ponto de entrada para qualquer pessoa que clone o projeto.

#### Scenario: Visitante encontra o README

- **WHEN** um desenvolvedor clonar o repositório e abrir a pasta
- **THEN** SHALL encontrar o `README.md` como primeiro arquivo documentado
- **AND** o README SHALL conter informações suficientes para entender o projeto

### Requirement: Visão geral do projeto

O README SHALL apresentar o projeto de forma acessível, incluindo nome, descrição curta, stack tecnológica e propósito.

#### Scenario: Leitor entende o projeto em 30 segundos

- **WHEN** um leitor acessar o README
- **THEN** SHALL entender em até 30 segundos o que o sistema faz e para quem foi feito

### Requirement: Documentação de Spec-Driven Development

O README SHALL conter uma seção explicativa sobre Spec-Driven Development (SDD) e como o OpenSpec o implementa neste projeto.

#### Scenario: Leitor compreende SDD

- **WHEN** um leitor que nunca ouviu falar de SDD acessar a seção correspondente
- **THEN** SHALL entender a lógica de especificar antes de implementar
- **AND** SHALL ver um diagrama visual do ciclo SDD

### Requirement: Diagrama de módulos e domínio

O README SHALL incluir um diagrama em ASCII mostrando a estrutura de módulos e a separação de domínios do sistema.

#### Scenario: Leitor visualiza arquitetura

- **WHEN** um leitor acessar a seção de arquitetura
- **THEN** SHALL ver um diagrama que mostra os bounded contexts (Catálogo e Execução)
- **AND** SHALL entender a relação entre módulos

### Requirement: Guia de contribuição com SDD

O README SHALL incluir um guia de como contribuir para o projeto seguindo o fluxo SDD.

#### Scenario: Contribuidor sabe como começar

- **WHEN** um desenvolvedor quiser contribuir com uma nova funcionalidade
- **THEN** SHALL encontrar instruções sobre como criar uma change no OpenSpec
- **AND** SHALL entender o fluxo: proposal → design → specs → tasks → implementação

### Requirement: Menção a ferramentas de IA

O README SHALL mencionar de forma transparente as ferramentas de IA utilizadas no desenvolvimento.

#### Scenario: Leitor conhece as ferramentas

- **WHEN** um leitor acessar a seção de ferramentas
- **THEN** SHALL saber que o projeto usa OpenCode + Big Pickle/Codex como agente de código
- **AND** SHALL entender o papel do RTK na otimização de tokens