import { IMarcaDaguaRepository } from '../../domain/repositories/IMarcaDaguaRepository';
import { MarcaDagua } from '../../domain/entities/MarcaDagua';

export class BuscarMarcaDaguaPorIdUseCase {
  constructor(private repository: IMarcaDaguaRepository) {}

  async executar(id: number): Promise<MarcaDagua> {
    const marca = await this.repository.buscarPorId(id);
    if (!marca) {
      throw new Error(JSON.stringify({ error: 'Marca d\'água não encontrada' }));
    }
    return marca;
  }
}
