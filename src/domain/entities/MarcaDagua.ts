export interface MarcaDagua {
  id?: number;
  titulo: string;
  conteudo_svg: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CriarMarcaDaguaDTO {
  titulo: string;
  conteudo_svg: string;
}

export interface AtualizarMarcaDaguaDTO {
  titulo?: string;
  conteudo_svg?: string;
}
