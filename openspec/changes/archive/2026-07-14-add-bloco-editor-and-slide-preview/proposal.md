## Why

The catalog ItemFormPage shows a slide preview but it renders all blocos concatenated into a single slide regardless of character count, misleading the operator about how slides will actually appear in Play Mode. Additionally, the ad-hoc item creation in the roteiro editor is hardcoded to exactly one bloco, and there is no way to edit the blocos of an existing roteiro item after creation. These gaps prevent operators from properly controlling multi-stanza content and slide distribution.

## What Changes

- **Fix catalog slide preview**: Replace the concatenated-blocks preview with the real `gerarSlides()` engine so the preview accurately shows how slides will be split (respecting the 500-char limit) with navigation between multiple slides.
- **Multi-bloco ad-hoc items**: Expand ad-hoc item creation in the roteiro editor to support adding/removing/editing multiple blocos with type selection (estrofe, parágrafo, versículo, canto, refrão), matching the catalog form experience.
- **Edit roteiro items**: Allow operators to edit the blocos of an existing ItemRoteiro (both catalog-sourced snapshots and ad-hoc items) directly from the roteiro editor, persisting changes to the `item_roteiro_bloco` table.

## Capabilities

### New Capabilities

- `bloco-editor`: CRUD of semantic blocos across catalog and roteiro contexts — multi-bloco ad-hoc creation, roteiro item bloco editing, and the shared bloco list UI component.

### Modified Capabilities

- `catalogo-de-itens`: Add accurate multi-slide preview to the ItemFormPage using `gerarSlides()` with slide-by-slide navigation and pagination.

## Impact

- **Frontend components**: `ItemFormPage.tsx` (preview rewrite), `RoteiroEditorPage.tsx` (ad-hoc form expansion, edit modal), new shared `BlocoEditor.tsx` component.
- **Hooks**: No new hooks — form state remains managed via `useState` in page components, consistent with current patterns.
- **API**: Extend existing `PUT /roteiros/:id/itens/:itemId` to accept optional `blocos` field in body (no new endpoint).
- **Database**: No schema changes — the existing `item_roteiro_bloco` table already supports this.
- **Slide Engine**: No changes to `gerarSlides()` itself — only consumes its output differently in the preview.
