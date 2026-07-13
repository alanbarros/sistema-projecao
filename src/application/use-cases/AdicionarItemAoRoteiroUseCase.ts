import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';
import { CriarItemRoteiroCatalogoDTO, ItemRoteiro } from '../../domain/entities/ItemRoteiro';
import { IItemColetaneaRepository } from '../../domain/repositories/IItemColetaneaRepository';
import { MOMENTOS_LITURGICOS } from '../../shared/enums';

export interface ErroValidacao {
  field: string;
  message: string;
}

export class AdicionarItemAoRoteiroUseCase {
  constructor(
    private itemRoteiroRepository: IItemRoteiroRepository,
    private itemColetaneaRepository: IItemColetaneaRepository
  ) {}

  async executar(roteiroId: number, dados: CriarItemRoteiroCatalogoDTO): Promise<ItemRoteiro> {
    const erros = await this.validar(roteiroId, dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    return this.itemRoteiroRepository.criarDoCatalogo(roteiroId, dados);
  }

  private async validar(roteiroId: number, dados: CriarItemRoteiroCatalogoDTO): Promise<ErroValidacao[]> {
    const erros: ErroValidacao[] = [];

    if (!dados.itemColetaneaId) {
      erros.push({ field: 'itemColetaneaId', message: 'ID do item do catálogo é obrigatório' });
    } else {
      const itemColetanea = await this.itemColetaneaRepository.buscarPorId(dados.itemColetaneaId);
      if (!itemColetanea) {
        erros.push({ field: 'itemColetaneaId', message: 'Item do catálogo não encontrado' });
      }
    }

    if (dados.momentoLiturgico !== undefined && dados.momentoLiturgico !== null) {
      if (!MOMENTOS_LITURGICOS.includes(dados.momentoLiturgico)) {
        erros.push({ field: 'momentoLiturgico', message: 'Momento litúrgico inválido' });
      }
    }

    return erros;
  }
}
