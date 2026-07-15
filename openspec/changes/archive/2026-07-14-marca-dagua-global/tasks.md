## 1. Database — Migration

- [x] 1.1 Criar tabela `marca_dagua` em `src/infrastructure/database/schemas.ts` com colunas: id, titulo, conteudo_svg, created_at, updated_at
- [x] 1.2 Adicionar coluna `marca_dagua_id` na tabela `roteiro` via ALTER TABLE (com FK para marca_dagua ON DELETE SET NULL)
- [x] 1.3 Atualizar a function de init do banco para executar a migration (CREATE TABLE IF NOT EXISTS + ALTER TABLE com tratamento de coluna já existente)

## 2. Backend — Entidade e Repository

- [x] 2.1 Criar entidade `MarcaDagua` em `src/domain/entities/MarcaDagua.ts` com interface e DTOs
- [x] 2.2 Criar interface `IMarcaDaguaRepository` em `src/domain/repositories/IMarcaDaguaRepository.ts`
- [x] 2.3 Criar `SQLiteMarcaDaguaRepository` em `src/infrastructure/database/SQLiteMarcaDaguaRepository.ts` com implementação de criar, listar, buscarPorId, atualizar, excluir. Recebe `Database.Database` via constructor (padrão compartilhado, mesmo que `SQLiteRoteiroRepository`)
- [x] 2.4 Atualizar `Roteiro` entity e `CriarRoteiroDTO`/`AtualizarRoteiroDTO` para incluir `marcaDaguaId?: number | null`
- [x] 2.5 Atualizar `SQLiteRoteiroRepository` para persistir e ler `marca_dagua_id`
- [x] 2.6 Adicionar getter `getMarcaDaguaRepository()` em `src/infrastructure/database/index.ts`

## 3. Backend — Use Cases de MarcaDagua

- [x] 3.1 Criar `CriarMarcaDaguaUseCase` — valida titulo, conteudo_svg e limite de 10 registros
- [x] 3.2 Criar `EditarMarcaDaguaUseCase` — valida dados e atualiza
- [x] 3.3 Criar `ExcluirMarcaDaguaUseCase` — valida existência e exclui
- [x] 3.4 Criar `ListarMarcasDaguaUseCase` — lista todas as marcas d'água
- [x] 3.5 Criar `BuscarMarcaDaguaPorIdUseCase` — busca marca d'água por ID, retorna 404 se não encontrar

## 4. Backend — Rotas da API

- [x] 4.1 Criar rotas CRUD em `src/infrastructure/routes/marcas-dagua.ts`: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
- [x] 4.2 Registrar as rotas em `src/infrastructure/server.ts` no path `/api/marcas-dagua`
- [x] 4.3 Atualizar rotas de roteiros para aceitar `marca_dagua_id` no body de criação/edição

## 5. Frontend — Serviço de API

- [x] 5.1 Adicionar funções `listarMarcasDagua`, `buscarMarcaDaguaPorId`, `criarMarcaDagua`, `atualizarMarcaDagua`, `excluirMarcaDagua` em `src/ui/src/services/api.ts`
- [x] 5.2 Atualizar `CriarRoteiroDTO` e `AtualizarRoteiroDTO` no frontend para incluir `marca_dagua_id`

## 6. Frontend — Página de Gerenciamento de Marcas d'Água

- [x] 6.1 Criar componente `MarcaDaguaForm` — modal/form com campo título, textarea SVG e preview em tempo real (dangerouslySetInnerHTML)
- [x] 6.2 Criar página `MarcasDaguaPage` — lista de cards com preview SVG, título, botões editar/excluir, contador "X de 10", botão nova marca (desabilitado no limite)
- [x] 6.3 Adicionar rota `/marcas-dagua` no `App.tsx`
- [x] 6.4 Adicionar link "Marcas d'Água" na navegação do Layout

## 7. Frontend — Seleção de Marca d'Água no Roteiro

- [x] 7.1 Atualizar `RoteiroFormPage` para incluir seletor de marca d'água (dropdown com opção "Nenhuma")
- [x] 7.2 Buscar marcas d'água disponíveis ao carregar o formulário
- [x] 7.3 Passar `marca_dagua_id` ao criar/editar roteiro

## 8. Frontend — Renderização da Marca d'Água

- [x] 8.1 Atualizar entidade `Slide` para incluir campo `marcaAguaSvg?: string`
- [x] 8.2 Atualizar `gerarSlides` no `slideEngine.ts` para receber e propagar `marcaAguaSvg`
- [x] 8.3 Expandir interface `UseProjectionProps` em `useProjection.ts` para incluir `marcaAguaSvg?: string`. Passar o SVG para `gerarSlides` a cada chamada
- [x] 8.4 Atualizar `ProjectorPage`: buscar `marcaDagua` do roteiro, passar `marcaAguaSvg` ao `useProjection` e renderizar SVG inline (substituir div hardcoded)
- [x] 8.5 Atualizar `PlayModePage` para passar `marcaAguaSvg` ao `useProjection` (buscar do roteiro carregado)
- [x] 8.6 Atualizar `MultiSlidePreview` para receber `marcaAguaSvg?: string` e passar para `gerarSlides`
- [x] 8.7 Atualizar `SlidePreview` para renderizar SVG inline quando `marcaAguaSvg` estiver presente (substituir div hardcoded)
- [x] 8.8 Ajustar CSS `.watermark` e `.projector-watermark` em `index.css` para suportar SVG (remover `text-transform: uppercase`, adicionar estilos para `svg` com `width`/`height`)
