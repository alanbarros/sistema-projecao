import { IItemColetaneaRepository, ListarItensParams, ResultadoListagem } from '../../domain/repositories/IItemColetaneaRepository';
import { ITEM_TYPES } from '../../shared/enums';
import { ItemType } from '../../shared/enums';

export class ListarItensUseCase {
  constructor(private repository: IItemColetaneaRepository) {}

  async executar(params: ListarItensParams): Promise<ResultadoListagem> {
    const { q, tipo, offset = 0, limit = 20 } = params;

    if (tipo && !ITEM_TYPES.includes(tipo as ItemType)) {
      throw new Error(JSON.stringify({ 
        error: 'Tipo inválido', 
        details: [{ field: 'tipo', message: 'Tipo deve ser: Canto, Oração, Resposta, Leitura ou Aviso' }] 
      }));
    }

    return this.repository.listar({ q, tipo: tipo as ItemType, offset, limit });
  }
}
