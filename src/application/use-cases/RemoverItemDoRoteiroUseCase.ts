import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';

export class RemoverItemDoRoteiroUseCase {
  constructor(private repository: IItemRoteiroRepository) {}

  async executar(id: number): Promise<void> {
    try {
      await this.repository.excluir(id);
    } catch (error) {
      if (error instanceof Error && error.message === 'Item do roteiro não encontrado') {
        throw new Error(JSON.stringify({ error: 'Item do roteiro não encontrado' }));
      }
      throw error;
    }
  }
}
