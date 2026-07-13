export const CREATE_TABLE_ITEM_COLETANEA = `
  CREATE TABLE IF NOT EXISTS item_coletanea (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('Canto', 'Oração', 'Resposta', 'Leitura', 'Aviso')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_INDEX_ITEM_TIPO = `
  CREATE INDEX IF NOT EXISTS idx_item_tipo ON item_coletanea(tipo)
`;

export const CREATE_INDEX_ITEM_TITULO = `
  CREATE INDEX IF NOT EXISTS idx_item_titulo ON item_coletanea(titulo)
`;

export const CREATE_TABLE_ITEM_BLOCO = `
  CREATE TABLE IF NOT EXISTS item_bloco (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_coletanea_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('estrofe', 'paragrafo', 'versiculo', 'canto', 'refrao')),
    conteudo TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    FOREIGN KEY (item_coletanea_id) REFERENCES item_coletanea(id) ON DELETE CASCADE
  )
`;

export const CREATE_INDEX_BLOCO_ITEM = `
  CREATE INDEX IF NOT EXISTS idx_bloco_item ON item_bloco(item_coletanea_id)
`;

export const CREATE_INDEX_BLOCO_CONTEUDO = `
  CREATE INDEX IF NOT EXISTS idx_bloco_conteudo ON item_bloco(conteudo)
`;
