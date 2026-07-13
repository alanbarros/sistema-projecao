import { IItemColetaneaRepository } from '../../domain/repositories/IItemColetaneaRepository';

export class ExcluirItemUseCase {
  constructor(private repository: IItemColetaneaRepository) {}

  async executar(id: number): Promise<void> {
    try {
      await this.repository.excluir(id);
    } catch (error) {
      if (error instanceof Error && error.message === 'Item não encontrado') {
        throw new Error(JSON.stringify({ error: 'Item não encontrado' }));
      }
      throw error;
    }
  }
}
