import { IMarcaDaguaRepository } from '../../domain/repositories/IMarcaDaguaRepository';
import { CriarMarcaDaguaDTO, MarcaDagua } from '../../domain/entities/MarcaDagua';

interface ErroValidacao {
  field: string;
  message: string;
}

const LIMITE_MARCAS = 10;

export class CriarMarcaDaguaUseCase {
  constructor(private repository: IMarcaDaguaRepository) {}

  async executar(dados: CriarMarcaDaguaDTO): Promise<MarcaDagua> {
    const erros = this.validar(dados);
    if (erros.length > 0) {
      throw new Error(JSON.stringify({ error: 'Dados inválidos', details: erros }));
    }

    const total = await this.repository.contar();
    if (total >= LIMITE_MARCAS) {
      throw new Error(JSON.stringify({ error: `Limite de ${LIMITE_MARCAS} marcas d'água atingido` }));
    }

    return this.repository.criar(dados);
  }

  private validar(dados: CriarMarcaDaguaDTO): ErroValidacao[] {
    const erros: ErroValidacao[] = [];

    if (!dados.titulo || dados.titulo.trim().length === 0) {
      erros.push({ field: 'titulo', message: 'Título é obrigatório' });
    } else if (dados.titulo.length > 255) {
      erros.push({ field: 'titulo', message: 'Título deve ter no máximo 255 caracteres' });
    }

    if (!dados.conteudo_svg || dados.conteudo_svg.trim().length === 0) {
      erros.push({ field: 'conteudo_svg', message: 'Conteúdo SVG é obrigatório' });
    }

    return erros;
  }
}
