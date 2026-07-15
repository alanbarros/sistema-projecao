## Why

Itens ad-hoc criados diretamente em um Roteiro são voláteis — ficam isolados naquele roteiro e não reaparecem em buscas do catálogo. Quando um operador percebe que um item ad-hoc é recorrente (uma prece comum, um aviso padrão), ele precisa recriá-lo manualmente no catálogo, copiando título, tipo e blocos. Isso é retrabalho e propenso a erros.

## What Changes

- **Nova ação no editor de Roteiro:** Botão "Salvar no catálogo" visível apenas para itens ad-hoc (`isAdHoc = true`).
- **Modal de extração:** Ao clicar, um modal permite revisar título e tipo antes de salvar. Blocos são copiados em read-only (já vieram prontos do ad-hoc).
- **Novo caso de uso no backend:** `ExtrairAdHocParaCatalogoUseCase` — recebe um `itemRoteiroId`, valida que é ad-hoc, e cria um novo `ItemColetanea` com os dados do snapshot.
- **Novo endpoint:** `POST /api/roteiros/:id/itens/:itemId/salvar-no-catalogo`.
- **Feedback visual:** Toast de confirmação "Salvo no catálogo!" após sucesso.
- **Sem vínculo:** O `ItemRoteiro` original NÃO é modificado. Continua ad-hoc, sem `item_coletaneaId`. São gêmeos, não pai-filho.

## Capabilities

### New Capabilities

- `extrair-adhoc-para-catalogo`: Capacidade de extrair dados de um ItemRoteiro ad-hoc e persisti-los como um novo ItemColetanea permanente no catálogo, sem modificar o item de origem.

### Modified Capabilities

- `roteiros`: Adiciona requirement de que itens ad-hoc possuem ação disponível de "salvar no catálogo". Adiciona endpoint e cenário de UI correspondente.
- `catalogo-de-itens`: Adiciona requirement de que um ItemColetanea pode ser criado a partir de dados de um ItemRoteiro ad-hoc existente (via extração).

## Impact

- **Backend:** Novo use case, novo método no repository de ItemColetanea, nova rota na API.
- **Frontend:** Novo botão no card do item ad-hoc no `RoteiroEditorPage`, novo modal, chamada à API, toast de feedback.
- **Sem breaking changes:** Não altera comportamento existente de criação de itens ad-hoc ou de catálogo.
- **Sem novas dependências:** Usa stack existente (React, Express, SQLite).
