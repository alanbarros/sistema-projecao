import { Roteiro, CriarRoteiroDTO, AtualizarRoteiroDTO } from '../entities/Roteiro';

export interface ListarRoteirosParams {
  q?: string;
  offset?: number;
  limit?: number;
}

export interface ResultadoListagemRoteiros {
  roteiros: Roteiro[];
  total: number;
  offset: number;
  limit: number;
}

export interface IRoteiroRepository {
  buscarPorId(id: number): Promise<Roteiro | null>;
  listar(params: ListarRoteirosParams): Promise<ResultadoListagemRoteiros>;
  criar(dados: CriarRoteiroDTO): Promise<Roteiro>;
  atualizar(id: number, dados: AtualizarRoteiroDTO): Promise<Roteiro>;
  excluir(id: number): Promise<void>;
}
