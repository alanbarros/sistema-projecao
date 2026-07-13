import { IRoteiroRepository } from '../../domain/repositories/IRoteiroRepository';

export class ExcluirRoteiroUseCase {
  constructor(private repository: IRoteiroRepository) {}

  async executar(id: number): Promise<void> {
    try {
      await this.repository.excluir(id);
    } catch (error) {
      if (error instanceof Error && error.message === 'Roteiro não encontrado') {
        throw new Error(JSON.stringify({ error: 'Roteiro não encontrado' }));
      }
      throw error;
    }
  }
}
