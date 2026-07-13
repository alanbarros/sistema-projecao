import { IRoteiroRepository } from '../../domain/repositories/IRoteiroRepository';
import { AtualizarRoteiroDTO, Roteiro } from '../../domain/entities/Roteiro';

export interface ErroValidacao {
  field: string;
  message: string;
}

export class EditarRoteiroUseCase {
  constructor(private repository: IRoteiroRepository) {}

  async executar(id: number, dados: AtualizarRoteiroDTO): Promise<Roteiro> {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    return this.repository.atualizar(id, dados);
  }

  private validar(dados: AtualizarRoteiroDTO): ErroValidacao[] {
    const erros: ErroValidacao[] = [];

    if (dados.titulo !== undefined) {
      if (!dados.titulo || dados.titulo.trim().length === 0) {
        erros.push({ field: 'titulo', message: 'Título é obrigatório' });
      } else if (dados.titulo.length > 255) {
        erros.push({ field: 'titulo', message: 'Título deve ter no máximo 255 caracteres' });
      }
    }

    if (dados.descricao !== undefined && dados.descricao.length > 500) {
      erros.push({ field: 'descricao', message: 'Descrição deve ter no máximo 500 caracteres' });
    }

    return erros;
  }
}
