import { IMarcaDaguaRepository } from '../../domain/repositories/IMarcaDaguaRepository';

export class ExcluirMarcaDaguaUseCase {
  constructor(private repository: IMarcaDaguaRepository) {}

  async executar(id: number): Promise<void> {
    try {
      await this.repository.excluir(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
        throw new Error(JSON.stringify({ error: error.message }));
      }
      throw error;
    }
  }
}
