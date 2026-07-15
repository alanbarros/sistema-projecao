## Context

The catalog `ItemFormPage` slide preview concatenates all blocos into a single slide, ignoring the `gerarSlides()` engine's 500-char limit. The ad-hoc item creation in `RoteiroEditorPage` is hardcoded to a single `BlockType.Paragrafo` bloco (line 80). The `AtualizarItemRoteiroDTO` only supports `momentoLiturgico` and `marcaAguaAtiva` — no bloco editing. The `PUT /:id/itens/:itemId` endpoint and repository `atualizar` method do not handle blocos.

## Goals / Non-Goals

**Goals:**
- Fix catalog slide preview to use `gerarSlides()` with multi-slide navigation
- Add multi-bloco ad-hoc creation in the roteiro editor
- Add bloco editing for existing roteiro items (both catalog and ad-hoc)
- Create a shared `BlocoEditor` component reusable across catalog and roteiro contexts

**Non-Goals:**
- Changing the slide engine logic
- Editing title/tipo of roteiro items (only blocos, momento, and marca d'água)

## Decisions

### Shared BlocoEditor component

A new `BlocoEditor.tsx` component encapsulates the full bloco CRUD UI: list of editable bloco cards (type selector + textarea + move up/down buttons + remove button) and an "Add bloco" button. Used in both `ItemFormPage` and `RoteiroEditorPage`.

**Rationale:** Avoids duplicating the multi-bloco form logic. Both contexts need the same UX for managing blocos, including reordering.

### AtualizarItemRoteiroDTO extension

Extend `AtualizarItemRoteiroDTO` with optional `blocos?: CriarItemRoteiroBlocoDTO[]`. When provided, the repository replaces all existing `item_roteiro_bloco` rows in a transaction.

**Rationale:** Clean replacement semantics match how catalog editing works (replace all blocos). The existing `atualizar` method already validates the item exists.

### Slide preview uses gerarSlides()

The catalog preview will call `gerarSlides()` from `slideEngine.ts` and display slides in a paginated view with prev/next buttons. The preview updates live as the user edits blocos.

**Rationale:** Single source of truth for slide generation. No duplication of the splitting logic.

### Ad-hoc items support multi-bloco

Replace the single textarea with the shared `BlocoEditor` component. Each ad-hoc bloco gets a type selector (defaulting to `BlockType.Paragrafo` for first, `BlockType.Estrofe` for subsequent).

**Rationale:** Matches the catalog form experience. Operators creating multi-stanza ad-hoc items (e.g., a temporary hymn) need the same granular control.

## Risks / Trade-offs

- **Blocos replacement is all-or-nothing:** If a user edits a single bloco in a 20-bloco item, they must save all 20. Acceptable for this scope; granular editing would add significant complexity.
- **Preview re-renders on every keystroke:** `gerarSlides()` runs synchronously on each change. For very large blocos this could be noticeable, but the 500-char limit keeps slide counts manageable.
- **No undo for bloco edits:** Once saved, the old blocos are gone. The snapshot isolation still holds — the catalog source is unaffected.
