import Database from 'better-sqlite3';
import { MarcaDagua, CriarMarcaDaguaDTO, AtualizarMarcaDaguaDTO } from '../../domain/entities/MarcaDagua';
import { IMarcaDaguaRepository } from '../../domain/repositories/IMarcaDaguaRepository';

export class SQLiteMarcaDaguaRepository implements IMarcaDaguaRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  async buscarPorId(id: number): Promise<MarcaDagua | null> {
    const marca = this.db.prepare(
      'SELECT id, titulo, conteudo_svg, created_at, updated_at FROM marca_dagua WHERE id = ?'
    ).get(id) as any;

    if (!marca) {
      return null;
    }

    return {
      id: marca.id,
      titulo: marca.titulo,
      conteudo_svg: marca.conteudo_svg,
      created_at: new Date(marca.created_at),
      updated_at: new Date(marca.updated_at)
    };
  }

  async listar(): Promise<MarcaDagua[]> {
    const marcas = this.db.prepare(
      'SELECT id, titulo, conteudo_svg, created_at, updated_at FROM marca_dagua ORDER BY titulo'
    ).all() as any[];

    return marcas.map(m => ({
      id: m.id,
      titulo: m.titulo,
      conteudo_svg: m.conteudo_svg,
      created_at: new Date(m.created_at),
      updated_at: new Date(m.updated_at)
    }));
  }

  async criar(dados: CriarMarcaDaguaDTO): Promise<MarcaDagua> {
    const insert = this.db.prepare(
      'INSERT INTO marca_dagua (titulo, conteudo_svg) VALUES (?, ?)'
    );

    const result = insert.run(dados.titulo, dados.conteudo_svg);
    const id = result.lastInsertRowid as number;

    return this.buscarPorId(id) as Promise<MarcaDagua>;
  }

  async atualizar(id: number, dados: AtualizarMarcaDaguaDTO): Promise<MarcaDagua> {
    const existente = await this.buscarPorId(id);
    if (!existente) {
      throw new Error('Marca d\'água não encontrada');
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (dados.titulo !== undefined) {
      updateFields.push('titulo = ?');
      updateValues.push(dados.titulo);
    }

    if (dados.conteudo_svg !== undefined) {
      updateFields.push('conteudo_svg = ?');
      updateValues.push(dados.conteudo_svg);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    const updateQuery = this.db.prepare(
      `UPDATE marca_dagua SET ${updateFields.join(', ')} WHERE id = ?`
    );

    updateQuery.run(...updateValues, id);

    return this.buscarPorId(id) as Promise<MarcaDagua>;
  }

  async excluir(id: number): Promise<void> {
    const existente = await this.buscarPorId(id);
    if (!existente) {
      throw new Error('Marca d\'água não encontrada');
    }

    this.db.prepare('DELETE FROM marca_dagua WHERE id = ?').run(id);
  }

  async contar(): Promise<number> {
    const result = this.db.prepare('SELECT COUNT(*) as total FROM marca_dagua').get() as { total: number };
    return result.total;
  }
}
