import { BlockType } from '../../shared/enums';

export interface ItemBloco {
  id?: number;
  itemColetaneaId: number;
  tipo: BlockType;
  conteudo: string;
  ordem: number;
}

export interface CriarItemBlocoDTO {
  tipo: BlockType;
  conteudo: string;
}
