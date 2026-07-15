import { MarcaDagua, CriarMarcaDaguaDTO, AtualizarMarcaDaguaDTO } from '../entities/MarcaDagua';

export interface IMarcaDaguaRepository {
  buscarPorId(id: number): Promise<MarcaDagua | null>;
  listar(): Promise<MarcaDagua[]>;
  criar(dados: CriarMarcaDaguaDTO): Promise<MarcaDagua>;
  atualizar(id: number, dados: AtualizarMarcaDaguaDTO): Promise<MarcaDagua>;
  excluir(id: number): Promise<void>;
  contar(): Promise<number>;
}
