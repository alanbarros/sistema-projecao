## Why

A marca d'água atual é text hardcoded "Marca d'Agua" em dois componentes, com toggle por ItemRoteiro. O sistema precisa suportar múltiplas paróquias/comunidades, cada uma com sua marca d'água (imagem SVG + texto). Hoje não há como personalizar a marca d'água nem associá-la a um roteiro específico.

## What Changes

- **Nova entidade MarcaDagua:** CRUD global de marcas d'água com título e conteúdo SVG. Limite de 10 registros.
- **Nova tabela `marca_dagua`:** Armazena título e SVG como texto (coluna TEXT).
- **FK no Roteiro:** Coluna `marca_dagua_id` na tabela `roteiro` referenciando `marca_dagua`. O operador escolhe qual marca d'água usar ao criar/editar um roteiro.
- **Propagação para projeção:** O SVG da marca d'água selecionada é propagado do roteiro para os Slides e renderizado no ProjectorPage e SlidePreview.
- **Substituição do texto hardcoded:** O div "Marca d'Agua" é substituído por renderização inline do SVG.
- **Roteiros existentes:** Roteiros já criados ficam sem marca d'água (`marca_dagua_id = NULL`). Nenhuma migration de dados.

## Capabilities

### New Capabilities

- `marca-dagua-crud`: Cadastro global de marcas d'água (CRUD). Cada marca possui título e conteúdo SVG. Limite de 10 registros no sistema.

### Modified Capabilities

- `roteiros`: Adiciona `marca_dagua_id` como FK opcional. Roteiro pode ser criado/editado com uma marca d'água selecionada.
- `projecao-em-tempo-real`: Projecao passa a renderizar SVG da marca d'água do roteiro em vez de texto hardcoded.
- `projector-display`: Tela do projetor renderiza SVG inline da marca d'água.

## Impact

- **Backend:** Nova tabela, novo entity, novo repository, novos use cases, novas rotas CRUD, alteração no schema de `roteiro`.
- **Frontend:** Nova página de gerenciamento de marcas d'água, campo de seleção no formulário de roteiro, alteração na renderização do ProjectorPage e SlidePreview.
- **Database:** Migration (ALTER TABLE + CREATE TABLE).
- **Sem breaking changes:** Roteiros existentes permanecem funcionais com marca d'água NULL.
