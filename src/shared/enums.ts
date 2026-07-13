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
