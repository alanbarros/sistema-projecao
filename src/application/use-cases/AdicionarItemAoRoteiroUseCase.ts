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

    if (!dados.item_coletanea_id) {
      erros.push({ field: 'item_coletanea_id', message: 'ID do item do catálogo é obrigatório' });
    } else {
      const itemColetanea = await this.itemColetaneaRepository.buscarPorId(dados.item_coletanea_id);
      if (!itemColetanea) {
        erros.push({ field: 'item_coletanea_id', message: 'Item do catálogo não encontrado' });
      }
    }

    if (dados.momento_liturgico !== undefined && dados.momento_liturgico !== null) {
      if (!MOMENTOS_LITURGICOS.includes(dados.momento_liturgico)) {
        erros.push({ field: 'momento_liturgico', message: 'Momento litúrgico inválido' });
      }
    }

    return erros;
  }
}
