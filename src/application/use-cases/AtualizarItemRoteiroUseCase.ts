import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';
import { AtualizarItemRoteiroDTO, ItemRoteiro } from '../../domain/entities/ItemRoteiro';
import { MOMENTOS_LITURGICOS } from '../../shared/enums';

export interface ErroValidacao {
  field: string;
  message: string;
}

export class AtualizarItemRoteiroUseCase {
  constructor(private repository: IItemRoteiroRepository) {}

  async executar(id: number, dados: AtualizarItemRoteiroDTO): Promise<ItemRoteiro> {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    return this.repository.atualizar(id, dados);
  }

  private validar(dados: AtualizarItemRoteiroDTO): ErroValidacao[] {
    const erros: ErroValidacao[] = [];

    if (dados.momentoLiturgico !== undefined && dados.momentoLiturgico !== null) {
      if (!MOMENTOS_LITURGICOS.includes(dados.momentoLiturgico)) {
        erros.push({ field: 'momentoLiturgico', message: 'Momento litúrgico inválido' });
      }
    }

    return erros;
  }
}
