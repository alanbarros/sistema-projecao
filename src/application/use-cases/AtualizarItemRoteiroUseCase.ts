import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';
import { AtualizarItemRoteiroDTO, ItemRoteiro } from '../../domain/entities/ItemRoteiro';
import { MOMENTOS_LITURGICOS, BLOCK_TYPES } from '../../shared/enums';

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

    if (dados.blocos !== undefined) {
      if (!Array.isArray(dados.blocos) || dados.blocos.length === 0) {
        erros.push({ field: 'blocos', message: 'Deve haver pelo menos um bloco' });
      } else {
        dados.blocos.forEach((bloco, index) => {
          if (!bloco.tipo || !BLOCK_TYPES.includes(bloco.tipo)) {
            erros.push({ field: `blocos[${index}].tipo`, message: 'Tipo do bloco inválido' });
          }
          if (!bloco.conteudo || !bloco.conteudo.trim()) {
            erros.push({ field: `blocos[${index}].conteudo`, message: 'Conteúdo do bloco é obrigatório' });
          }
        });
      }
    }

    return erros;
  }
}
