import { BlockType } from '../../shared/enums';

export interface ItemRoteiroBloco {
  id?: number;
  itemRoteiroId: number;
  tipo: BlockType;
  conteudo: string;
  ordem: number;
  created_at?: Date;
}

export interface CriarItemRoteiroBlocoDTO {
  tipo: BlockType;
  conteudo: string;
}
