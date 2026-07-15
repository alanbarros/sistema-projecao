# Catálogo de Itens

## Purpose

Manter o acervo permanente de conteúdos litúrgicos reutilizáveis.

## Requirements

### Requirement: Cadastro de ItemColetanea

O sistema SHALL permitir criar, consultar, editar e excluir um ItemColetanea permanente no catálogo.

Cada ItemColetanea SHALL possuir título, tipo e conteúdo estruturado em blocos semânticos. Um bloco semântico representa, por exemplo, uma estrofe, parágrafo ou versículo e permite a posterior distribuição em Slides.

#### Scenario: Cadastrar um canto no catálogo

- **WHEN** o operador cadastrar um ItemColetanea do tipo Canto com título e blocos de texto válidos
- **THEN** o sistema SHALL persistir o item no catálogo
- **AND** o item SHALL estar disponível para busca e inclusão em Roteiros

#### Scenario: Editar conteúdo catalogado

- **WHEN** o operador alterar o conteúdo de um ItemColetanea existente
- **THEN** o sistema SHALL persistir o novo conteúdo no catálogo
- **AND** SHALL manter inalterados os snapshots dos ItemRoteiro criados anteriormente a partir desse item

#### Scenario: Tentar cadastrar item com dados inválidos

- **WHEN** o operador tentar cadastrar um ItemColetanea sem título ou com tipo inválido
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro com detalhes dos campos inválidos

#### Scenario: Tentar excluir item inexistente

- **WHEN** o operador tentar excluir um ItemColetanea com ID inexistente
- **THEN** o sistema SHALL retornar erro 404

### Requirement: Tipos compartilhados de itens

O sistema SHALL classificar ItemColetanea e ItemRoteiro usando o mesmo conjunto de tipos: Canto, Oração, Resposta, Leitura e Aviso.

O tipo SHALL descrever a natureza do conteúdo, e não o momento em que ele ocorre na celebração.

#### Scenario: Classificar um item do catálogo

- **WHEN** o operador cadastrar ou editar um ItemColetanea
- **THEN** o sistema SHALL exigir a seleção de um dos tipos compartilhados

### Requirement: Busca no catálogo

O sistema SHALL permitir buscar ItemColetanea por título, texto presente nos seus blocos semânticos e tipo.

#### Scenario: Encontrar conteúdo por trecho textual

- **WHEN** o operador pesquisar uma palavra presente em um bloco semântico
- **THEN** o sistema SHALL retornar os ItemColetanea correspondentes

#### Scenario: Filtrar por tipo

- **WHEN** o operador filtrar por tipo "Canto"
- **THEN** o sistema SHALL retornar apenas itens do tipo Canto

#### Scenario: Combinar busca textual e filtro por tipo

- **WHEN** o operador pesquisar "aleluia" e filtrar por tipo "Canto"
- **THEN** o sistema SHALL retornar itens do tipo Canto que contenham "aleluia" no título ou blocos

### Requirement: Estrutura de blocos semânticos

O sistema SHALL armazenar o conteúdo de cada ItemColetanea como uma sequência ordenada de blocos semânticos em tabela separada (ItemBloco).

Cada bloco semântico SHALL possuir um tipo (estrofe, parágrafo, versículo, canto, refrão) e conteúdo textual. A ordem dos blocos SHALL ser preservada para geração posterior de Slides.

#### Scenario: Adicionar múltiplos blocos a um canto

- **WHEN** o operador criar um ItemColetanea do tipo Canto com 3 estrofes
- **THEN** o sistema SHALL armazenar 3 registros na tabela ItemBloco, ordenados sequencialmente
- **AND** cada bloco SHALL manter seu tipo e conteúdo

#### Scenario: Editar blocos existentes

- **WHEN** o operador alterar a ordem ou conteúdo dos blocos de um ItemColetanea
- **THEN** o sistema SHALL substituir todos os blocos pelos novos fornecidos
- **AND** SHALL preservar a ordem especificada

#### Scenario: Excluir item com blocos

- **WHEN** um ItemColetanea com 3 blocos for excluído
- **THEN** o sistema SHALL excluir automaticamente os 3 registros de ItemBloco (cascade)

### Requirement: Interface de gestão do catálogo

O sistema SHALL fornecer uma interface para listar, buscar, criar e editar ItemColetanea.

A interface SHALL exibir os itens como um grid responsivo de cards (`repeat(auto-fill, minmax(245px, 1fr))`). Cada card SHALL conter a tag do tipo, título, texto preview e metadados (número de slides e ação de editar).

A interface SHALL incluir um toolbar com campo de busca (max-width 470px) e seletor de tipo dentro de um container card. O cabeçalho SHALL usar o padrão eyebrow (texto pequeno uppercase) + título h2 + descrição + botão de ação.

O preview de slides SHALL usar o motor `gerarSlides()` para gerar slides a partir dos blocos, respeitando o limite de caracteres e a coerência semântica.

O preview SHALL exibir todos os slides gerados com controles de navegação (anterior/próximo) e indicador de posição atual (ex: "Slide 2 / 5").

O preview SHALL atualizar automaticamente quando o operador editar os blocos no formulário.

#### Scenario: Filtrar itens por tipo

- **WHEN** o operador selecionar o tipo "Canto" no filtro
- **THEN** o sistema SHALL exibir apenas os ItemColetanea do tipo Canto em formato de cards

#### Scenario: Criar novo item via interface

- **WHEN** o operador acessar o formulário de criação e preencher título, tipo e blocos
- **THEN** o sistema SHALL persistir o novo ItemColetanea no catálogo

#### Scenario: Navegar na paginação

- **WHEN** houver mais de 20 itens no catálogo
- **THEN** o sistema SHALL exibir controles de paginação
- **AND** SHALL permitir navegar entre páginas

#### Scenario: Preview de item com múltiplas estrofes

- **WHEN** o operador criar um ItemColetanea com 3 estrofes que gerem 5 slides
- **THEN** o preview SHALL exibir os 5 slides com navegação
- **AND** SHALL mostrar indicador "Slide X / 5"

#### Scenario: Preview atualiza ao editar bloco

- **WHEN** o operador alterar o conteúdo de um bloco no formulário
- **THEN** o preview SHALL regenerar os slides instantaneamente
- **AND** SHALL exibir a partir do primeiro slide (a posição pode mudar se o conteúdo anterior crescer ou encolher)

#### Scenario: Preview de item sem blocos

- **WHEN** o operador não tiver adicionado nenhum bloco
- **THEN** o preview SHALL exibir mensagem "Digite o conteúdo dos blocos para visualizar"

### Requirement: Paginação de resultados

O sistema SHALL suportar paginação nas listagens usando offset e limit.

#### Scenario: Listar primeira página

- **WHEN** o operador acessar a listagem de itens
- **THEN** o sistema SHALL retornar os primeiros 20 itens
- **AND** SHALL informar o total de itens disponíveis

#### Scenario: Navegar para segunda página

- **WHEN** o operador solicitar a segunda página (offset=20)
- **THEN** o sistema SHALL retornar os itens 21-40
