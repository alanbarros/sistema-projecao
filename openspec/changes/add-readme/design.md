## Context

O projeto Sistema de Projeção Litúrgica não possui documentação de entrada. O README.md será o primeiro ponto de contato para qualquer pessoa que clone o repositório. O projeto se destaca por ter sido desenvolvido integralmente com auxílio de IA seguindo Spec-Driven Development — algo que merece destaque na documentação.

## Goals / Non-Goals

**Goals:**
- Criar um README claro e acessível que explique o projeto
- Documentar a abordagem SDD de forma didática
- Mostrar o diagrama de módulos e domínio
- Guiar contribuidores sobre como usar o fluxo SDD
- Mencionar as ferramentas de IA de forma transparente

**Non-Goals:**
- Documentação detalhada de API (REST docs)
- Guia de instalação completa (setup básico apenas)
- Explicação de cada módulo individualmente
- CI/CD (não existe ainda)

## Decisions

### 1. Tom acessível, não acadêmico

**Decisão:** Usar linguagem direta e objetiva, evitando jargão excessivo.

**Por quê:** O projeto é de estudos. A documentação deve ser convidativa, não intimidadora.

**Alternativa considerada:** Documentação técnica densa com especificações formais — rejeitada por afastar leitores casuais.

### 2. Diagrama em ASCII

**Decisão:** Usar diagramas em texto (ASCII art) ao invés de imagens.

**Por quê:**版本控制友好 (git-friendly), sem dependência de assets externos, renderiza em qualquer terminal ou editor de texto.

**Alternativa considerada:** Mermaid ou imagens PNG — rejeitadas porque o GitHub renderiza Markdown puro e ASCII funciona em qualquer lugar.

### 3. Seção dedicada a SDD + OpenSpec

**Decisão:** Criar uma seção explicativa sobre Spec-Driven Development com diagrama do ciclo.

**Por quê:** É o aspecto mais diferenciado do projeto. Muitos desenvolvedores não conhecem SDD.

### 4. Mencionar ferramentas de IA transparentemente

**Decisão:** Incluir seção sobre OpenCode, Big Pickle/Codex e RTK.

**Por quê:** Transparência. Quem contribui precisa saber que o projeto usa IA como ferramenta de desenvolvimento.

## Risks / Trade-offs

- **[Risco] Documentação ficar desatualizada** → Mitigação: README curto e focado; detalhes ficam no AGENTS.md e openspec/
- **[Risco] Seção de IA parecer "hype"** → Mitigação: Mencionar de forma factual, sem superlativos; focar no que a IA faz, não no que "pode fazer"