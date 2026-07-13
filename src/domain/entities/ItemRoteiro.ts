import { ItemType, MomentoLiturgico } from '../../shared/enums';
import { ItemRoteiroBloco, CriarItemRoteiroBlocoDTO } from './ItemRoteiroBloco';

export interface ItemRoteiro {
  id?: number;
  roteiroId: number;
  itemColetaneaId?: number | null;
  tituloSnapshot: string;
  tipoSnapshot: ItemType;
  momentoLiturgico?: MomentoLiturgico | null;
  posicao: number;
  isAdHoc: boolean;
  marcaAguaAtiva: boolean;
  blocos: ItemRoteiroBloco[];
  created_at?: Date;
}

export interface CriarItemRoteiroCatalogoDTO {
  itemColetaneaId: number;
  momentoLiturgico?: MomentoLiturgico;
}

export interface CriarItemRoteiroAdHocDTO {
  titulo: string;
  tipo: ItemType;
  blocos: CriarItemRoteiroBlocoDTO[];
}

export interface AtualizarItemRoteiroDTO {
  momentoLiturgico?: MomentoLiturgico | null;
  marcaAguaAtiva?: boolean;
}
