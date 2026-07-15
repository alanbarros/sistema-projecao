import { ItemRoteiro } from './ItemRoteiro';

export interface Roteiro {
  id?: number;
  titulo: string;
  descricao?: string | null;
  dataCelebracao?: string | null;
  marcaDaguaId?: number | null;
  itens: ItemRoteiro[];
  created_at?: Date;
  updated_at?: Date;
}

export interface CriarRoteiroDTO {
  titulo: string;
  descricao?: string;
  data_celebracao?: string;
  marca_dagua_id?: number | null;
}

export interface AtualizarRoteiroDTO {
  titulo?: string;
  descricao?: string;
  data_celebracao?: string;
  marca_dagua_id?: number | null;
}
