import { IMarcaDaguaRepository } from '../../domain/repositories/IMarcaDaguaRepository';
import { AtualizarMarcaDaguaDTO, MarcaDagua } from '../../domain/entities/MarcaDagua';

interface ErroValidacao {
  field: string;
  message: string;
}

export class EditarMarcaDaguaUseCase {
  constructor(private repository: IMarcaDaguaRepository) {}

  async executar(id: number, dados: AtualizarMarcaDaguaDTO): Promise<MarcaDagua> {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    try {
      return await this.repository.atualizar(id, dados);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrada')) {
        throw new Error(JSON.stringify({ error: error.message }));
      }
      throw error;
    }
  }

  private validar(dados: AtualizarMarcaDaguaDTO): ErroValidacao[] {
    const erros: ErroValidacao[] = [];

    if (dados.titulo !== undefined) {
      if (dados.titulo.trim().length === 0) {
        erros.push({ field: 'titulo', message: 'Título não pode ser vazio' });
      } else if (dados.titulo.length > 255) {
        erros.push({ field: 'titulo', message: 'Título deve ter no máximo 255 caracteres' });
      }
    }

    if (dados.conteudo_svg !== undefined && dados.conteudo_svg.trim().length === 0) {
      erros.push({ field: 'conteudo_svg', message: 'Conteúdo SVG não pode ser vazio' });
    }

    return erros;
  }
}
