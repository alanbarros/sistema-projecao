# 📖 Especificação de Design do Sistema (SDD) — OpenSpec

**Projeto:** Sistema de Projeção Litúrgica em Tempo Real

**Arquitetura:** Clean Architecture + DDD

**Stack:** React (Frontend) | Node.js + TypeScript (Backend)

**Abordagem:** Spec-Driven Development (SDD)

---

## Projeto

## 1. Glossário e Linguagem Ubíqua (Domain Vocabulary)

Para que a especificação seja precisa, toda a base de código e APIs deve seguir estritamente estes termos:

* **ItemColetanea (Item de Coletânea):** Registro permanente e estático no catálogo geral (Músicas, Orações).
* **Roteiro (Missa/Evento):** Agregado dinâmico que representa a linha do tempo cronológica de uma celebração específica.
* **ItemRoteiro (Item do Roteiro):** Instância ordenada contida em um Roteiro. Pode ser um *Snapshot* de um `ItemColetanea` ou um item criado *Ad-Hoc* (Aviso/Prece temporária).
* **Slide (Tela):** Unidade mínima de exibição textual projetável em 100% da viewport.
* **Modo Play (Play Mode):** Estado operacional de execução contínua controlado por atalhos unificados de teclado.

---

## 2. Limites de Contexto (Bounded Contexts) & Arquitetura

O sistema será dividido em duas grandes frentes de negócio independentes a nível de domínio, banco de dados e aplicação:

### A. Contexto de Catálogo (Permanente)

* **Responsabilidade:** CRUD de músicas, orações e termos fixos.
* **Comportamento:** Operações síncronas tradicionais (REST/HTTP).

### B. Contexto de Execução (Dinâmico)

* **Responsabilidade:** Montagem do roteiro do dia, ordenação, persistência e transmissão em tempo real de baixa latência ($<100\text{ms}$).
* **Comportamento:** Híbrido (REST para montagem e WebSockets/API de Projeção para transmissão).

---

## Escopo

## 1. Subdomínio de Acervo (Catálogo Permanente)

* **Cadastro Geral e Estático:** Criação, leitura, atualização e exclusão (CRUD) de músicas e orações perenes.
* **Categorização Litúrgica:** Classificação obrigatória de cada item em tipos predefinidos (*Canto*, *Oração*, *Resposta*, *Leitura*, *Aviso*).
* **Estruturação de Texto Semântico:** Divisão de textos longos em blocos (estrofes/parágrafos) no banco de dados para posterior quebra em slides.
* **Busca Textual Integrada:** Filtro rápido no acervo por título ou por palavras contidas nos slides.

---

## 2. Subdomínio de Execução (Roteiro e Play Mode)

* **Criação de Eventos Dinâmicos:** Instanciação de um roteiro específico para uma celebração (Ex: "Missa de Ramos").
* **Linha do Tempo Cronológica:** Fluxo linear onde itens do acervo são adicionados e ordenados sequencialmente.
* **Snapshot Isolado de Dados:** Cópia dos slides da música para o roteiro no momento da inserção, garantindo que alterações posteriores no acervo não quebrem o histórico da missa.
* **Itens Ad-Hoc (Uso Único):** Criação de avisos rápidos ou preces específicas direto no roteiro do dia, sem poluír o acervo permanente.
* **Reordenação Dinâmica:** Mecanismo para mover itens para cima ou para baixo na estrutura cronológica do evento.

---

## 3. Motor de Projeção em Tempo Real

* **Painel de Visualização do Operador:** Interface com divisão tripla (Acervo, Roteiro e Preview de Slides do item ativo).
* **Barra de Status do Play Mode:** Indicador visual fixo mostrando o item atual em execução e a paginação exata (Ex: *Slide 2 / 4*).
* **Controle Unificado por Teclado:** Atalhos inteligentes usando as setas direcionais:
* *Seta Direita / Baixo:* Avança para a próxima página do item. Se for a última página, avança automaticamente para o próximo item do roteiro.
* *Seta Esquerda / Cima:* Retrocede para a página anterior. Se estiver na primeira página, retorna automaticamente para a última página do item anterior.


* **Tela do Projetor Desacoplada:** Janela limpa secundária (Datashow) que renderiza apenas o texto centralizado em tela cheia.
* **Sincronização de Baixa Latência:** Protocolo de comunicação interna para atualizar a tela do projetor instantaneamente a cada comando do operador.

## Fora do escopo

* **Controle de Usuários e Autenticação (RBAC):** Login de operadores, gerenciamento de permissões, perfis de acesso ou divisão por níveis de usuário (como administrador e operador). O sistema assume uma sessão única operacional direta.
* **Editor Visual de Slides (Wysiwyg/Styles):** Customização em tempo real de fontes, cores de fundo, imagens de background por slide, alinhamentos ou transições animadas (fade, slide). O foco é puramente a distribuição e quebra linear de texto limpo para projeção.
* **Suporte a Mídia Multimídia:** Upload, decodificação ou reprodução de vídeos, arquivos de áudio (MP3/Wav), apresentações externas em PowerPoint/PDF ou streaming de câmeras.
* **Integração com Cifras e Instrumentos:** Exibição de acordes, transposição de tonalidades musicais ou integração com aplicativos de músicos (como SongBook). O foco do acervo é puramente litúrgico/textual para a assembleia.
* **Automação de Agendamento:** Agendas recorrentes automáticas integradas a calendários litúrgicos externos ou download automatizado de leituras diárias da CNBB (o preenchimento do conteúdo das leituras deve ser feito manualmente no cadastro de uso único ou acervo).
