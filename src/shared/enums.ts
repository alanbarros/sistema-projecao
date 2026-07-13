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
