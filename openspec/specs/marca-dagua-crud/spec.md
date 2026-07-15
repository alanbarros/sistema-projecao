# Marca d'Água CRUD

## Purpose

Gerenciar o catálogo global de marcas d'água (MarcaDagua) disponíveis para associação a Roteiros.

## Requirements

### Requirement: CRUD de MarcaDagua

O sistema SHALL permitir criar, consultar, editar e excluir uma MarcaDagua no catálogo global de marcas d'água.

Cada MarcaDagua SHALL possuir título obrigatório (máx. 255 caracteres) e conteúdo SVG obrigatório (coluna TEXT).

O sistema SHALL limitar o cadastro a no máximo 10 MarcaDagua.

#### Scenario: Criar uma marca d'água

- **WHEN** o operador cadastrar uma MarcaDagua com título e conteúdo SVG válidos
- **THEN** o sistema SHALL persistir a marca d'água no banco
- **AND** a marca d'água SHALL estar disponível para seleção nos Roteiros

#### Scenario: Tentar cadastrar marca d'água com SVG vazio

- **WHEN** o operador tentar cadastrar uma MarcaDagua sem conteúdo SVG
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro de validação

#### Scenario: Exceder limite de 10 marcas d'água

- **WHEN** o operador tentar cadastrar uma MarcaDagua e já existirem 10 registros
- **THEN** o sistema SHALL rejeitar a operação
- **AND** SHALL retornar erro indicando que o limite de 10 marcas d'água foi atingido

#### Scenario: Editar uma marca d'água

- **WHEN** o operador alterar o título ou conteúdo SVG de uma MarcaDagua existente
- **THEN** o sistema SHALL persistir as alterações
- **AND** os Roteiros que referenciam essa marca d'água SHALL refletir a alteração imediatamente

#### Scenario: Excluir uma marca d'água

- **WHEN** o operador excluir uma MarcaDagua
- **THEN** o sistema SHALL remover o registro do banco
- **AND** os Roteiros que referenciavam essa marca SHALL ter marca_dagua_id definido como NULL

#### Scenario: Tentar excluir marca d'água inexistente

- **WHEN** o operador tentar excluir uma MarcaDagua com ID inexistente
- **THEN** o sistema SHALL retornar erro 404

### Requirement: Preview de SVG

O sistema SHALL exibir preview em tempo real do conteúdo SVG enquanto o operador edita o campo SVG no formulário de criação/edição de MarcaDagua.

#### Scenario: Preview atualiza ao digitar SVG

- **WHEN** o operador alterar o conteúdo do campo SVG no formulário
- **THEN** o preview SHALL atualizar instantaneamente refletindo o SVG digitado

#### Scenario: Preview de SVG inválido

- **WHEN** o operador inserir conteúdo que não é um SVG válido
- **THEN** o preview SHALL exibir mensagem "SVG inválido" ou área vazia
- **AND** SHALL impedir o salvamento até que o SVG seja válido

### Requirement: Interface de gestão de marcas d'água

O sistema SHALL fornecer uma interface para listar, criar, editar e excluir MarcaDagua.

A interface SHALL exibir as marcas d'água como cards com preview do SVG, título e botões de editar/excluir.

A interface SHALL exibir contador de marcas d'água (ex: "3 de 10 marcas d'água cadastradas").

#### Scenario: Acessar gestão de marcas d'água

- **WHEN** o operador acessar a página de gerenciamento de marcas d'água
- **THEN** o sistema SHALL exibir a lista de marcas d'água cadastradas com preview SVG

#### Scenario: Botão desabilitado no limite

- **WHEN** o operador tiver 10 marcas d'água cadastradas
- **THEN** o botão "Nova Marca d'Água" SHALL estar desabilitado
- **AND** SHALL exibir indicação de que o limite foi atingido
