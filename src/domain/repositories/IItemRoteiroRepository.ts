import { ItemRoteiro, CriarItemRoteiroCatalogoDTO, CriarItemRoteiroAdHocDTO, AtualizarItemRoteiroDTO } from '../entities/ItemRoteiro';

export interface IItemRoteiroRepository {
  buscarPorId(id: number): Promise<ItemRoteiro | null>;
  listarPorRoteiroId(roteiroId: number): Promise<ItemRoteiro[]>;
  criarDoCatalogo(roteiroId: number, dados: CriarItemRoteiroCatalogoDTO): Promise<ItemRoteiro>;
  criarAdHoc(roteiroId: number, dados: CriarItemRoteiroAdHocDTO): Promise<ItemRoteiro>;
  atualizar(id: number, dados: AtualizarItemRoteiroDTO): Promise<ItemRoteiro>;
  excluir(id: number): Promise<void>;
  reordenar(roteiroId: number, itemIds: number[]): Promise<void>;
  obterProximaPosicao(roteiroId: number): Promise<number>;
}
