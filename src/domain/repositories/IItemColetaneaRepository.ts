import { ItemColetanea, CriarItemColetaneaDTO, AtualizarItemColetaneaDTO } from '../entities/ItemColetanea';
import { ItemType } from '../../shared/enums';

export interface ListarItensParams {
  q?: string;
  tipo?: ItemType;
  offset?: number;
  limit?: number;
}

export interface ResultadoListagem {
  itens: ItemColetanea[];
  total: number;
  offset: number;
  limit: number;
}

export interface IItemColetaneaRepository {
  buscarPorId(id: number): Promise<ItemColetanea | null>;
  listar(params: ListarItensParams): Promise<ResultadoListagem>;
  criar(dados: CriarItemColetaneaDTO): Promise<ItemColetanea>;
  atualizar(id: number, dados: AtualizarItemColetaneaDTO): Promise<ItemColetanea>;
  excluir(id: number): Promise<void>;
}
