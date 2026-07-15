## 1. Backend — Use Case

- [x] 1.1 Criar `ExtrairAdHocParaCatalogoUseCase` em `src/application/use-cases/` — construtor recebe `IItemRoteiroRepository` e `IItemColetaneaRepository`. Método `executar(roteiroId, itemRoteiroId, dados: { titulo, tipo })`: busca o ItemRoteiro via `buscarPorId`, valida que pertence ao roteiro e que `isAdHoc = true`, monta `CriarItemColetaneaDTO` com titulo/tipo fornecidos e blocos extraídos do snapshot, chama `repository.criar(dados)` do catálogo

## 2. Backend — Rota da API

- [x] 2.1 Criar endpoint `POST /api/roteiros/:id/itens/:itemId/salvar-no-catalogo` em `src/infrastructure/routes/roteiros.ts` — instancia `ExtrairAdHocParaCatalogoUseCase` com os dois repositórios inline (padrão existente), passa `req.body` com titulo/tipo
- [x] 2.2 Validar que o item pertence ao roteiro informado e que é ad-hoc, retornar 404 ou 400 conforme adequado
- [x] 2.3 Retornar 201 com o ItemColetanea criado

## 3. Frontend — Serviço de API

- [x] 3.1 Adicionar função `salvarAdHocNoCatalogo(roteiroId: number, itemId: number, dados: { titulo: string; tipo: ItemType })` em `src/ui/src/services/api.ts`

## 4. Frontend — Componente Toast

- [x] 4.1 Criar componente `Toast` simples em `src/ui/src/components/Toast.tsx` — exibe mensagem por 3 segundos com fade out, controlado por state no componente pai. Sem dependências externas, JSX + CSS inline

## 5. Frontend — Modal de Extração

- [x] 5.1 Criar componente `ModalSalvarNoCatalogo` — modal com campo título editável, seletor de tipo, lista estática dos blocos em modo leitura (texto simples, não `BlocoEditor`), botões cancelar/salvar
- [x] 5.2 Integrar com a API: chamar `salvarAdHocNoCatalogo` ao confirmar, desabilitar botão "Salvando..." durante request, exibir toast de sucesso e fechar modal
- [x] 5.3 Tratar erros da API: exibir mensagem de erro dentro do modal quando a request falhar

## 6. Frontend — Integração no Editor

- [x] 6.1 Adicionar botão "Salvar no catálogo" no card do item ad-hoc no `RoteiroEditorPage` — visível apenas quando `isAdHoc = true`
- [x] 6.2 Abrir `ModalSalvarNoCatalogo` ao clicar no botão, passando titulo, tipo e blocos do item
- [x] 6.3 Integrar componente `Toast` no `RoteiroEditorPage` para exibir "Salvo no catálogo!" após sucesso
