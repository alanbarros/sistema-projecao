import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';
import { IItemColetaneaRepository } from '../../domain/repositories/IItemColetaneaRepository';
import { ItemColetanea } from '../../domain/entities/ItemColetanea';
import { ItemType } from '../../shared/enums';

export interface ErroValidacao {
  field: string;
  message: string;
}

export class ExtrairAdHocParaCatalogoUseCase {
  constructor(
    private itemRoteiroRepository: IItemRoteiroRepository,
    private itemColetaneaRepository: IItemColetaneaRepository
  ) {}

  async executar(
    roteiroId: number,
    itemRoteiroId: number,
    dados: { titulo: string; tipo: ItemType }
  ): Promise<ItemColetanea> {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    const itemRoteiro = await this.itemRoteiroRepository.buscarPorId(itemRoteiroId);

    if (!itemRoteiro) {
      throw new Error(JSON.stringify({ error: 'Item do roteiro não encontrado' }));
    }

    if (itemRoteiro.roteiroId !== roteiroId) {
      throw new Error(JSON.stringify({ error: 'Item não pertence ao roteiro informado' }));
    }

    if (!itemRoteiro.isAdHoc) {
      throw new Error(JSON.stringify({ error: 'Apenas itens ad-hoc podem ser extraídos para o catálogo' }));
    }

    const itemCriado = await this.itemColetaneaRepository.criar({
      titulo: dados.titulo,
      tipo: dados.tipo,
      blocos: itemRoteiro.blocos.map(b => ({
        tipo: b.tipo,
        conteudo: b.conteudo
      }))
    });

    return itemCriado;
  }

  private validar(dados: { titulo: string; tipo: ItemType }): ErroValidacao[] {
    const erros: ErroValidacao[] = [];

    if (!dados.titulo || dados.titulo.trim().length === 0) {
      erros.push({ field: 'titulo', message: 'Título é obrigatório' });
    } else if (dados.titulo.length > 255) {
      erros.push({ field: 'titulo', message: 'Título deve ter no máximo 255 caracteres' });
    }

    if (!dados.tipo) {
      erros.push({ field: 'tipo', message: 'Tipo é obrigatório' });
    }

    return erros;
  }
}
