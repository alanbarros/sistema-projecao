import { IItemColetaneaRepository } from '../../domain/repositories/IItemColetaneaRepository';
import { ItemColetanea } from '../../domain/entities/ItemColetanea';

export class BuscarItemPorIdUseCase {
  constructor(private repository: IItemColetaneaRepository) {}

  async executar(id: number): Promise<ItemColetanea> {
    const item = await this.repository.buscarPorId(id);
    if (!item) {
      throw new Error(JSON.stringify({ error: 'Item não encontrado' }));
    }
    return item;
  }
}
