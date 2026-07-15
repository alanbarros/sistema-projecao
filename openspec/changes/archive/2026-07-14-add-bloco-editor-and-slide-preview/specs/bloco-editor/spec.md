# Bloco Editor

## Purpose

Gerenciar blocos semânticos (CRUD) nos contextos de catálogo e roteiro, com preview de slides.

## Requirements

### Requirement: Componente compartilhado de edição de blocos

O sistema SHALL fornecer um componente `BlocoEditor` reutilizável para criar, editar e remover blocos semânticos.

O componente SHALL exibir uma lista de cards de blocos, cada um com seletor de tipo (estrofe, parágrafo, versículo, canto, refrão), textarea de conteúdo e botão de remoção.

O componente SHALL incluir um botão "Adicionar bloco" que insere um novo bloco com tipo padrão `paragrafo`.

O componente SHALL incluir botões de seta (↑/↓) em cada card de bloco para reordenar a lista.

#### Scenario: Adicionar múltiplos blocos

- **WHEN** o operador clicar "Adicionar bloco" 3 vezes
- **THEN** o componente SHALL exibir 3 cards de bloco editáveis

#### Scenario: Remover um bloco

- **WHEN** o operador clicar o botão de remoção em um bloco
- **THEN** o componente SHALL remover aquele bloco da lista
- **AND** SHALL manter a ordem dos demais blocos

#### Scenario: Alterar tipo de um bloco

- **WHEN** o operador selecionar "Refrão" no seletor de tipo de um bloco
- **THEN** o componente SHALL atualizar o tipo daquele bloco

#### Scenario: Reordenar blocos

- **WHEN** o operador clicar a seta para cima em um bloco que não é o primeiro
- **THEN** o componente SHALL trocar a posição daquele bloco com o anterior

#### Scenario: Reordenar primeiro bloco

- **WHEN** o operador clicar a seta para cima no primeiro bloco
- **THEN** o botão SHALL estar desabilitado

### Requirement: Itens ad-hoc com múltiplos blocos

O sistema SHALL permitir criar itens ad-hoc com múltiplos blocos no editor de roteiro.

O formulário ad-hoc SHALL usar o componente `BlocoEditor` para gerenciar os blocos.

A submissão SHALL enviar o array completo de blocos para o endpoint `POST /:id/itens/ad-hoc`.

#### Scenario: Criar item ad-hoc com 3 estrofes

- **WHEN** o operador criar um item ad-hoc com título, tipo e 3 blocos
- **THEN** o sistema SHALL persistir o item com os 3 blocos
- **AND** SHALL posicioná-lo na última posição do roteiro

#### Scenario: Criar item ad-hoc com 1 bloco

- **WHEN** o operador criar um item ad-hoc com apenas 1 bloco
- **THEN** o sistema SHALL persistir normalmente (comportamento atual preservado)

### Requirement: Edição de blocos de ItemRoteiro existente

O sistema SHALL permitir editar os blocos de um ItemRoteiro existente (tanto de catálogo quanto ad-hoc) a partir do editor de roteiro.

A edição SHALL substituir todos os blocos existentes pelos novos fornecidos em uma transação.

O endpoint `PUT /:id/itens/:itemId` SHALL aceitar o campo opcional `blocos: CriarItemRoteiroBlocoDTO[]`. Quando presente, o sistema SHALL excluir os blocos antigos e inserir os novos.

#### Scenario: Editar blocos de item de catálogo no roteiro

- **WHEN** o operador editar os blocos de um ItemRoteiro originado do catálogo
- **THEN** o sistema SHALL substituir os blocos do snapshot
- **AND** SHALL manter o título, tipo e referência ao catálogo

#### Scenario: Editar blocos de item ad-hoc no roteiro

- **WHEN** o operador editar os blocos de um ItemRoteiro ad-hoc
- **THEN** o sistema SHALL substituir os blocos existentes

#### Scenario: Tentar editar blocos de item inexistente

- **WHEN** o operador tentar editar blocos de um ItemRoteiro com ID inexistente
- **THEN** o sistema SHALL retornar erro 404

### Requirement: Preview de slides no editor de blocos

O componente `BlocoEditor` SHALL incluir um preview de slides que usa o motor `gerarSlides()`.

O preview SHALL exibir todos os slides gerados com navegação (anterior/próximo) e indicador de posição.

O preview SHALL atualizar automaticamente quando os blocos forem editados.

#### Scenario: Preview com blocos que geram múltiplos slides

- **WHEN** os blocos editados tiverem conteúdo que exceda 500 caracteres total
- **THEN** o preview SHALL exibir múltiplos slides com paginação

#### Scenario: Preview vazio

- **WHEN** não houver blocos com conteúdo
- **THEN** o preview SHALL exibir mensagem indicando que não há conteúdo para visualizar
