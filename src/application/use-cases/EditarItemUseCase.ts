import { IItemColetaneaRepository } from '../../domain/repositories/IItemColetaneaRepository';
import { AtualizarItemColetaneaDTO, ItemColetanea } from '../../domain/entities/ItemColetanea';
import { ITEM_TYPES, BLOCK_TYPES } from '../../shared/enums';
import { ErroValidacao } from './CriarItemUseCase';

export class EditarItemUseCase {
  constructor(private repository: IItemColetaneaRepository) {}

  async executar(id: number, dados: AtualizarItemColetaneaDTO): Promise<ItemColetanea> {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    try {
      return await this.repository.atualizar(id, dados);
    } catch (error) {
      if (error instanceof Error && error.message === 'Item não encontrado') {
        throw new Error(JSON.stringify({ error: 'Item não encontrado' }));
      }
      throw error;
    }
  }

  private validar(dados: AtualizarItemColetaneaDTO): ErroValidacao[] {
    const erros: ErroValidacao[] = [];

    if (dados.titulo !== undefined) {
      if (dados.titulo.trim().length === 0) {
        erros.push({ field: 'titulo', message: 'Título não pode ser vazio' });
      } else if (dados.titulo.length > 255) {
        erros.push({ field: 'titulo', message: 'Título deve ter no máximo 255 caracteres' });
      }
    }

    if (dados.tipo !== undefined && !ITEM_TYPES.includes(dados.tipo)) {
      erros.push({ field: 'tipo', message: 'Tipo deve ser: Canto, Oração, Resposta, Leitura ou Aviso' });
    }

    if (dados.blocos !== undefined) {
      if (dados.blocos.length === 0) {
        erros.push({ field: 'blocos', message: 'Deve haver pelo menos um bloco' });
      } else {
        dados.blocos.forEach((bloco, index) => {
          if (!bloco.tipo || !BLOCK_TYPES.includes(bloco.tipo)) {
            erros.push({ field: `blocos[${index}].tipo`, message: 'Tipo do bloco inválido' });
          }
          if (!bloco.conteudo || bloco.conteudo.trim().length === 0) {
            erros.push({ field: `blocos[${index}].conteudo`, message: 'Conteúdo do bloco é obrigatório' });
          }
        });
      }
    }

    return erros;
  }
}
