import { IRoteiroRepository, ListarRoteirosParams, ResultadoListagemRoteiros } from '../../domain/repositories/IRoteiroRepository';

export class ListarRoteirosUseCase {
  constructor(private repository: IRoteiroRepository) {}

  async executar(params: ListarRoteirosParams): Promise<ResultadoListagemRoteiros> {
    const { q, offset = 0, limit = 20 } = params;

    if (offset < 0) {
      throw new Error(JSON.stringify({ error: 'Offset deve ser maior ou igual a zero' }));
    }

    if (limit < 1 || limit > 100) {
      throw new Error(JSON.stringify({ error: 'Limit deve ser entre 1 e 100' }));
    }

    return this.repository.listar({ q, offset, limit });
  }
}
