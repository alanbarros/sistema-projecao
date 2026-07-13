import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';

export interface ErroValidacao {
  field: string;
  message: string;
}

export class ReordenarItensUseCase {
  constructor(private repository: IItemRoteiroRepository) {}

  async executar(roteiroId: number, itemIds: number[]): Promise<void> {
    const erros = await this.validar(roteiroId, itemIds);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    await this.repository.reordenar(roteiroId, itemIds);
  }

  private async validar(roteiroId: number, itemIds: number[]): Promise<ErroValidacao[]> {
    const erros: ErroValidacao[] = [];

    if (!itemIds || itemIds.length === 0) {
      erros.push({ field: 'item_ids', message: 'Lista de itens é obrigatória' });
      return erros;
    }

    const idsUnicos = new Set(itemIds);
    if (idsUnicos.size !== itemIds.length) {
      erros.push({ field: 'item_ids', message: 'Não podem haver IDs duplicados' });
    }

    const itensExistentes = await this.repository.listarPorRoteiroId(roteiroId);
    const idsExistentes = new Set(itensExistentes.map(i => i.id));

    const idsInvalidos = itemIds.filter(id => !idsExistentes.has(id));
    if (idsInvalidos.length > 0) {
      erros.push({ field: 'item_ids', message: 'Todos os IDs devem pertencer ao roteiro' });
    }

    if (idsExistentes.size !== itemIds.length) {
      erros.push({ field: 'item_ids', message: 'Deve conter todos os itens do roteiro' });
    }

    return erros;
  }
}
