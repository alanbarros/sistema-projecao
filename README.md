# Sistema de Projeção Litúrgica

**Projeção de slides em tempo real para celebrações litúrgicas**

[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20TypeScript%20%7C%20SQLite-blue)]()
[![Arquitetura](https://img.shields.io/badge/Arquitetura-Clean%20Architecture%20%7C%20DDD-green)]()
[![Metodologia](https://img.shields.io/badge/Metodologia-Spec--Driven%20Development-orange)]()

---

## O que é este projeto

Um sistema para projetar textos litúrgicos (músicas, orações, leituras) em telas de projetor durante celebrações. O operador monta um roteiro no navegador e controla a projeção em tempo real com atalhos de teclado.

O projeto é um estudo de caso sobre **Spec-Driven Development** — toda funcionalidade é especificada antes de ser implementada.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + TypeScript |
| Backend | Node.js + TypeScript |
| Banco | SQLite (local) |
| Comunicação | REST + WebSockets |

---

## Arquitetura

O sistema segue **Clean Architecture** com **Domain-Driven Design**. A separação principal é entre dois bounded contexts:

```
┌─────────────────────────────────────────────────────────────────┐
│                     SISTEMA DE PROJEÇÃO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────┐     ┌─────────────────────────┐   │
│   │    CONTEXTO DE CATÁLOGO │     │    CONTEXTO DE EXECUÇÃO  │   │
│   │      (Permanente)       │     │       (Dinâmico)         │   │
│   ├─────────────────────────┤     ├─────────────────────────┤   │
│   │                         │     │                         │   │
│   │  ┌─────────────────┐    │     │  ┌─────────────────┐    │   │
│   │  │  ItemColetanea  │    │     │  │     Roteiro     │    │   │
│   │  │  (Músicas,      │    │     │  │  (Celebração)   │    │   │
│   │  │   Orações)      │    │     │  └────────┬────────┘    │   │
│   │  └─────────────────┘    │     │           │             │   │
│   │                         │     │  ┌────────▼────────┐    │   │
│   │  ┌─────────────────┐    │     │  │   ItemRoteiro   │    │   │
│   │  │   MarcaDagua    │    │     │  │  (Snapshot)     │    │   │
│   │  │  (Logotipos)    │    │     │  └────────┬────────┘    │   │
│   │  └─────────────────┘    │     │           │             │   │
│   │                         │     │  ┌────────▼────────┐    │   │
│   │  REST/HTTP              │     │  │      Slide      │    │   │
│   │  (CRUD síncrono)        │     │  │  (Tela)         │    │   │
│   │                         │     │  └─────────────────┘    │   │
│   └─────────────────────────┘     │                         │   │
│                                   │  REST + WebSockets      │   │
│                                   │  (Montagem + Tempo Real)│   │
│                                   └─────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Subdomínios

- **Acervo**: Catálogo permanente de músicas e orações
- **Roteiro**: Linha do tempo cronológica de uma celebração
- **Projeção**: Transmissão em tempo real dos slides para o projetor
- **Play Mode**: Modo de execução contínua com atalhos de teclado

---

## Spec-Driven Development (SDD)

Este projeto é desenvolvido seguindo **Spec-Driven Development** — uma abordagem onde toda funcionalidade é especificada antes de ser implementada.

### Por que SDD?

A ideia é simples: **antes de escrever código, escreva o que o sistema deve fazer**. Isso garante que:

- Todos entendem o requisito antes de implementar
- O código nasce das specs, não de suposições
- Há um registro do que foi decidido e por quê

### O ciclo SDD

```
┌─────────────────────────────────────────────────────────────────┐
│                        CICLO SDD                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│   │          │    │          │    │          │    │          │ │
│   │ Proposal │───▶│  Design  │───▶│  Specs   │───▶│  Tasks   │ │
│   │          │    │          │    │          │    │          │ │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│        │                                              │        │
│        │              "O que e por quê"               │        │
│        │              "Como implementar"              │        │
│        │              "O que o sistema deve fazer"    │        │
│        │              "O que fazer agora"             │        │
│        │                                              │        │
│        │                                              ▼        │
│        │                                         ┌──────────┐  │
│        │                                         │          │  │
│        │                                         │   Code   │  │
│        │                                         │          │  │
│        │                                         └──────────┘  │
│        │                                                       │
│        └───────────────────────────────────────────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Como o OpenSpec implementa SDD

O **OpenSpec** é a ferramenta que estrutura esse ciclo. Cada funcionalidade é uma "change" que passa por 4 artifacts:

| Artifact | O que define | Onde vive |
|----------|--------------|-----------|
| **Proposal** | O que vamos construir e por quê | `proposal.md` |
| **Design** | Como vamos implementar | `design.md` |
| **Specs** | Requisitos e cenários testáveis | `specs/<capability>/spec.md` |
| **Tasks** | Checklist de implementação | `tasks.md` |

As specs ficam em `openspec/specs/` como **source of truth** — são a referência permanente do que o sistema deve fazer.

---

## Como contribuir

### Pré-requisitos

- Node.js 18+
- npm

### Setup

```bash
# Instalar dependências
npm install

# Iniciar backend
npm run dev:backend

# Iniciar frontend (em outro terminal)
npm run dev:frontend
```

### Fluxo de contribuição (SDD)

Para adicionar uma nova funcionalidade:

**1. Criar uma change no OpenSpec**

```bash
openspec new change "nome-da-funcionalidade"
```

Isso cria uma pasta em `openspec/changes/nome-da-funcionalidade/` com os templates dos artifacts.

**2. Preencher os artifacts (na ordem)**

| Passo | Artifact | Comando |
|-------|----------|---------|
| 1 | Proposal | `openspec instructions proposal --change "nome"` |
| 2 | Design | `openspec instructions design --change "nome"` |
| 3 | Specs | `openspec instructions specs --change "nome"` |
| 4 | Tasks | `openspec instructions tasks --change "nome"` |

**3. Implementar as tarefas**

```bash
/opsx-apply nome-da-funcionalidade
```

O agente de IA irá ler as specs e implementar cada tarefa sequencialmente.

**4. Arquivar quando completo**

```bash
/opsx-archive nome-da-funcionalidade
```

### Estrutura de uma change

```
openspec/changes/nome-da-funcionalidade/
├── proposal.md           # O que e por quê
├── design.md             # Como implementar
├── specs/
│   └── capability/
│       └── spec.md       # Requisitos e cenários
└── tasks.md              # Checklist de implementação
```

---

## Ferramentas de IA

Este projeto foi desenvolvido com auxílio de ferramentas de IA de forma transparente:

### OpenCode + Big Pickle/Codex

O **OpenCode** é um agente de código que executa tarefas de desenvolvimento. Ele lê as specs do OpenSpec e implementa as funcionalidades seguindo o fluxo SDD.

O modelo **Big Pickle/Codex** é o "cérebro" por trás do agente — ele entende o contexto do projeto e toma decisões de implementação.

### RTK (Runtime Token Kompresion)

O **RTK** é uma técnica para otimizar o uso de tokens em contextos de IA. Em vez de enviar arquivos inteiros a cada consulta, o RTK comprime o contexto, reduzindo custos e mantendo a qualidade das respostas.

### AGENTS.md

O arquivo `AGENTS.md` na raiz do projeto fornece contexto persistente para o agente de IA. Ele contém:

- Glossário do domínio (linguagem ubíqua)
- Arquitetura e bounded contexts
- Escopo do projeto
- Restrições e decisões de design

Isso permite que o agente "lembre" do projeto entre sessões.

---

## Licença

Projeto de estudos — sem licença definida.