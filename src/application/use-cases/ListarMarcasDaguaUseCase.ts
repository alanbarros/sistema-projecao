import { IMarcaDaguaRepository } from '../../domain/repositories/IMarcaDaguaRepository';
import { MarcaDagua } from '../../domain/entities/MarcaDagua';

export class ListarMarcasDaguaUseCase {
  constructor(private repository: IMarcaDaguaRepository) {}

  async executar(): Promise<MarcaDagua[]> {
    return this.repository.listar();
  }
}
