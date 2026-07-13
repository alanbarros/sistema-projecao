import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';
import { CriarItemRoteiroAdHocDTO, ItemRoteiro } from '../../domain/entities/ItemRoteiro';
import { ITEM_TYPES, BLOCK_TYPES, MOMENTOS_LITURGICOS } from '../../shared/enums';

export interface ErroValidacao {
  field: string;
  message: string;
}

export class CriarItemAdHocUseCase {
  constructor(private repository: IItemRoteiroRepository) {}

  async executar(roteiroId: number, dados: CriarItemRoteiroAdHocDTO): Promise<ItemRoteiro> {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    return this.repository.criarAdHoc(roteiroId, dados);
  }

  private validar(dados: CriarItemRoteiroAdHocDTO): ErroValidacao[] {
    const erros: ErroValidacao[] = [];

    if (!dados.titulo || dados.titulo.trim().length === 0) {
      erros.push({ field: 'titulo', message: 'Título é obrigatório' });
    } else if (dados.titulo.length > 255) {
      erros.push({ field: 'titulo', message: 'Título deve ter no máximo 255 caracteres' });
    }

    if (!dados.tipo || !ITEM_TYPES.includes(dados.tipo)) {
      erros.push({ field: 'tipo', message: 'Tipo deve ser: Canto, Oração, Resposta, Leitura ou Aviso' });
    }

    if (!dados.blocos || dados.blocos.length === 0) {
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

    return erros;
  }
}
