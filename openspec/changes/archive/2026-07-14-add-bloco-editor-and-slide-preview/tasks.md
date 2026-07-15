## Tasks

### Backend

- [x] 1. Extend `AtualizarItemRoteiroDTO` in `src/domain/entities/ItemRoteiro.ts` to include optional `blocos?: CriarItemRoteiroBlocoDTO[]`
- [x] 2. Update `SQLiteItemRoteiroRepository.atualizar()` in `src/infrastructure/database/SQLiteItemRoteiroRepository.ts` to delete existing `item_roteiro_bloco` rows and insert new ones when `dados.blocos` is provided (in a transaction)
- [x] 3. Update `AtualizarItemRoteiroUseCase` in `src/application/use-cases/AtualizarItemRoteiroUseCase.ts` to validate blocos when provided (non-empty array, each bloco has tipo and conteudo)
- [x] 4. Update `atualizarItemRoteiro` in `src/ui/src/services/api.ts` to include `blocos` in the `AtualizarItemRoteiroDTO` interface

### Frontend — Shared Component

- [x] 5. Create `src/ui/src/components/BlocoEditor.tsx` with: bloco list (type selector + textarea + move up/down buttons + remove button per card), "Adicionar bloco" button, and slide preview using `gerarSlides()` with pagination
- [x] 6. Create `src/ui/src/components/MultiSlidePreview.tsx` that takes blocos as input, calls `gerarSlides()`, and renders slides with prev/next navigation and "Slide X / Y" indicator
- [x] 7. Add CSS for `BlocoEditor` and `MultiSlidePreview` in `src/ui/src/index.css` (bloco cards, type selector, slide preview with pagination controls)

### Frontend — Catalog

- [x] 8. Refactor `ItemFormPage.tsx` to replace the inline preview (lines 306-328) with the new `MultiSlidePreview` component fed by `gerarSlides()`
- [x] 9. Refactor `ItemFormPage.tsx` to replace the inline bloco form with the `BlocoEditor` component

### Frontend — Roteiro Editor

- [x] 10. Refactor ad-hoc form in `RoteiroEditorPage.tsx` to replace single textarea with `BlocoEditor` component
- [x] 11. Add "Editar blocos" action to each roteiro item card in `RoteiroEditorPage.tsx` that opens an edit modal/drawer with `BlocoEditor` pre-filled with existing blocos
- [x] 12. Implement `handleEditarBlocos` in `RoteiroEditorPage.tsx` that calls `atualizarItemRoteiro` with the new blocos array and reloads the roteiro

### Verification

- [x] 13. Run typecheck in `src/ui` and `src/infrastructure`
- [x] 14. Manual test: create catalog item with multiple stanzas, verify preview shows correct slide count
- [x] 15. Manual test: create ad-hoc item with 3 blocos in roteiro editor
- [x] 16. Manual test: edit blocos of existing roteiro item and verify changes persist
