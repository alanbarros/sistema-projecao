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

export const CREATE_TABLE_ROTEIRO = `
  CREATE TABLE IF NOT EXISTS roteiro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_celebracao DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_INDEX_ROTEIRO_TITULO = `
  CREATE INDEX IF NOT EXISTS idx_roteiro_titulo ON roteiro(titulo)
`;

export const CREATE_INDEX_ROTEIRO_DATA = `
  CREATE INDEX IF NOT EXISTS idx_roteiro_data ON roteiro(data_celebracao)
`;

export const CREATE_TABLE_ITEM_ROTEIRO = `
  CREATE TABLE IF NOT EXISTS item_roteiro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roteiro_id INTEGER NOT NULL,
    item_coletanea_id INTEGER,
    titulo_snapshot TEXT NOT NULL,
    tipo_snapshot TEXT NOT NULL CHECK(tipo_snapshot IN ('Canto', 'Oração', 'Resposta', 'Leitura', 'Aviso')),
    momento_liturgico TEXT CHECK(momento_liturgico IN ('Entrada', 'Ofertório', 'Comunhão', 'Preparação', 'Ato Penitencial', 'Aclamação', 'Oração dos Fiéis', 'Outro')),
    posicao INTEGER NOT NULL,
    is_ad_hoc BOOLEAN DEFAULT FALSE,
    marca_agua_ativa BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roteiro_id) REFERENCES roteiro(id) ON DELETE CASCADE,
    FOREIGN KEY (item_coletanea_id) REFERENCES item_coletanea(id) ON DELETE SET NULL
  )
`;

export const CREATE_INDEX_ITEM_ROTEIRO_ROTEIRO = `
  CREATE INDEX IF NOT EXISTS idx_item_roteiro_roteiro ON item_roteiro(roteiro_id)
`;

export const CREATE_INDEX_ITEM_ROTEIRO_POSICAO = `
  CREATE INDEX IF NOT EXISTS idx_item_roteiro_posicao ON item_roteiro(roteiro_id, posicao)
`;

export const CREATE_TABLE_ITEM_ROTEIRO_BLOCO = `
  CREATE TABLE IF NOT EXISTS item_roteiro_bloco (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_roteiro_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('estrofe', 'paragrafo', 'versiculo', 'canto', 'refrao')),
    conteudo TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_roteiro_id) REFERENCES item_roteiro(id) ON DELETE CASCADE
  )
`;

export const CREATE_INDEX_ROTEIRO_BLOCO_ITEM = `
  CREATE INDEX IF NOT EXISTS idx_roteiro_bloco_item ON item_roteiro_bloco(item_roteiro_id)
`;

export const CREATE_TABLE_MARCA_DAGUA = `
  CREATE TABLE IF NOT EXISTS marca_dagua (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    conteudo_svg TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_INDEX_MARCA_DAGUA_TITULO = `
  CREATE INDEX IF NOT EXISTS idx_marca_dagua_titulo ON marca_dagua(titulo)
`;

export const ALTER_TABLE_ROTEIRO_ADD_MARCA_DAGUA_ID = `
  ALTER TABLE roteiro ADD COLUMN marca_dagua_id INTEGER REFERENCES marca_dagua(id) ON DELETE SET NULL
`;
