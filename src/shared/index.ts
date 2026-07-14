export enum ItemType {
  Canto = 'Canto',
  Oracao = 'Oração',
  Resposta = 'Resposta',
  Leitura = 'Leitura',
  Aviso = 'Aviso'
}

export const ITEM_TYPES = Object.values(ItemType);

export enum BlockType {
  Estrofe = 'estrofe',
  Paragrafo = 'paragrafo',
  Versiculo = 'versiculo',
  Canto = 'canto',
  Refrao = 'refrao'
}

export const BLOCK_TYPES = Object.values(BlockType);

export enum MomentoLiturgico {
  Entrada = 'Entrada',
  Ofertorio = 'Ofertório',
  Comunhao = 'Comunhão',
  Preparacao = 'Preparação',
  AtoPenitencial = 'Ato Penitencial',
  Aclamacao = 'Aclamação',
  OracaoDosFieis = 'Oração dos Fiéis',
  Outro = 'Outro'
}

export const MOMENTOS_LITURGICOS = Object.values(MomentoLiturgico);

export const MAX_CHARS_PER_SLIDE = 500;

export const WEBSOCKET_EVENTS = {
  SYNC: 'projection:sync',
  NAVIGATE: 'projection:navigate',
  UPDATE: 'projection:update',
  ERROR: 'projection:error',
} as const;

export const PROJECTION_DEFAULTS = {
  WATERMARK_OPACITY: 0.15,
  RECONNECT_BASE_DELAY: 1000,
  RECONNECT_MAX_DELAY: 10000,
  LATENCY_TARGET_MS: 100,
} as const;