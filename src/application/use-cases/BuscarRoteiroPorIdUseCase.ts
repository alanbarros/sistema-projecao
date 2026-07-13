import { IRoteiroRepository } from '../../domain/repositories/IRoteiroRepository';
import { Roteiro } from '../../domain/entities/Roteiro';

export class BuscarRoteiroPorIdUseCase {
  constructor(private repository: IRoteiroRepository) {}

  async executar(id: number): Promise<Roteiro> {
    const roteiro = await this.repository.buscarPorId(id);
    if (!roteiro) {
      throw new Error(JSON.stringify({ error: 'Roteiro não encontrado' }));
    }
    return roteiro;
  }
}
