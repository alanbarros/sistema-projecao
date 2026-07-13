import { ItemType } from '../shared/enums';
import { ItemBloco, CriarItemBlocoDTO } from './ItemBloco';

export interface ItemColetanea {
  id?: number;
  titulo: string;
  tipo: ItemType;
  blocos: ItemBloco[];
  created_at?: Date;
  updated_at?: Date;
}

export interface CriarItemColetaneaDTO {
  titulo: string;
  tipo: ItemType;
  blocos: CriarItemBlocoDTO[];
}

export interface AtualizarItemColetaneaDTO {
  titulo?: string;
  tipo?: ItemType;
  blocos?: CriarItemBlocoDTO[];
}
