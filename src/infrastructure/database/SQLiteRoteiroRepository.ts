import Database from 'better-sqlite3';
import { Roteiro, CriarRoteiroDTO, AtualizarRoteiroDTO } from '../../domain/entities/Roteiro';
import { IRoteiroRepository, ListarRoteirosParams, ResultadoListagemRoteiros } from '../../domain/repositories/IRoteiroRepository';
import {
  CREATE_TABLE_ROTEIRO,
  CREATE_INDEX_ROTEIRO_TITULO,
  CREATE_INDEX_ROTEIRO_DATA,
  CREATE_TABLE_ITEM_ROTEIRO,
  CREATE_INDEX_ITEM_ROTEIRO_ROTEIRO,
  CREATE_INDEX_ITEM_ROTEIRO_POSICAO,
  CREATE_TABLE_ITEM_ROTEIRO_BLOCO,
  CREATE_INDEX_ROTEIRO_BLOCO_ITEM
} from './schemas';

export class SQLiteRoteiroRepository implements IRoteiroRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
    this.inicializar();
  }

  private inicializar(): void {
    this.db.exec(CREATE_TABLE_ROTEIRO);
    this.db.exec(CREATE_INDEX_ROTEIRO_TITULO);
    this.db.exec(CREATE_INDEX_ROTEIRO_DATA);
    this.db.exec(CREATE_TABLE_ITEM_ROTEIRO);
    this.db.exec(CREATE_INDEX_ITEM_ROTEIRO_ROTEIRO);
    this.db.exec(CREATE_INDEX_ITEM_ROTEIRO_POSICAO);
    this.db.exec(CREATE_TABLE_ITEM_ROTEIRO_BLOCO);
    this.db.exec(CREATE_INDEX_ROTEIRO_BLOCO_ITEM);
  }

  async buscarPorId(id: number): Promise<Roteiro | null> {
    const roteiro = this.db.prepare(
      'SELECT id, titulo, descricao, data_celebracao, marca_dagua_id, created_at, updated_at FROM roteiro WHERE id = ?'
    ).get(id) as any;

    if (!roteiro) {
      return null;
    }

    const itens = this.db.prepare(
      'SELECT id, roteiro_id, item_coletanea_id, titulo_snapshot, tipo_snapshot, momento_liturgico, posicao, is_ad_hoc, marca_agua_ativa, created_at FROM item_roteiro WHERE roteiro_id = ? ORDER BY posicao'
    ).all(id) as any[];

    const itensComBlocos = itens.map(item => {
      const blocos = this.db.prepare(
        'SELECT id, tipo, conteudo, ordem, created_at FROM item_roteiro_bloco WHERE item_roteiro_id = ? ORDER BY ordem'
      ).all(item.id) as any[];

      return {
        id: item.id,
        roteiroId: item.roteiro_id,
        itemColetaneaId: item.item_coletanea_id,
        tituloSnapshot: item.titulo_snapshot,
        tipoSnapshot: item.tipo_snapshot,
        momentoLiturgico: item.momento_liturgico,
        posicao: item.posicao,
        isAdHoc: item.is_ad_hoc === 1,
        marcaAguaAtiva: item.marca_agua_ativa === 1,
        blocos: blocos.map(b => ({
          id: b.id,
          itemRoteiroId: item.id,
          tipo: b.tipo,
          conteudo: b.conteudo,
          ordem: b.ordem,
          created_at: new Date(b.created_at)
        })),
        created_at: new Date(item.created_at)
      };
    });

    return {
      id: roteiro.id,
      titulo: roteiro.titulo,
      descricao: roteiro.descricao,
      dataCelebracao: roteiro.data_celebracao,
      marcaDaguaId: roteiro.marca_dagua_id,
      itens: itensComBlocos,
      created_at: new Date(roteiro.created_at),
      updated_at: new Date(roteiro.updated_at)
    };
  }

  async listar(params: ListarRoteirosParams): Promise<ResultadoListagemRoteiros> {
    const { q, offset = 0, limit = 20 } = params;

    let whereClause = '';
    const queryParams: any[] = [];

    if (q) {
      whereClause = 'WHERE titulo LIKE ?';
      queryParams.push(`%${q}%`);
    }

    const countQuery = `SELECT COUNT(*) as total FROM roteiro ${whereClause}`;
    const { total } = this.db.prepare(countQuery).get(...queryParams) as any;

    const dataQuery = `
      SELECT id, titulo, descricao, data_celebracao, marca_dagua_id, created_at, updated_at
      FROM roteiro
      ${whereClause}
      ORDER BY data_celebracao DESC, created_at DESC
      LIMIT ? OFFSET ?
    `;
    const roteiros = this.db.prepare(dataQuery).all(...queryParams, limit, offset) as any[];

    return {
      roteiros: roteiros.map(r => ({
        id: r.id,
        titulo: r.titulo,
        descricao: r.descricao,
        dataCelebracao: r.data_celebracao,
        marcaDaguaId: r.marca_dagua_id,
        itens: [],
        created_at: new Date(r.created_at),
        updated_at: new Date(r.updated_at)
      })),
      total,
      offset,
      limit
    };
  }

  async criar(dados: CriarRoteiroDTO): Promise<Roteiro> {
    const insertRoteiro = this.db.prepare(
      'INSERT INTO roteiro (titulo, descricao, data_celebracao, marca_dagua_id) VALUES (?, ?, ?, ?)'
    );

    const result = insertRoteiro.run(
      dados.titulo,
      dados.descricao || null,
      dados.data_celebracao || null,
      dados.marca_dagua_id ?? null
    );
    const roteiroId = result.lastInsertRowid as number;

    return this.buscarPorId(roteiroId) as Promise<Roteiro>;
  }

  async atualizar(id: number, dados: AtualizarRoteiroDTO): Promise<Roteiro> {
    const roteiroExistente = await this.buscarPorId(id);
    if (!roteiroExistente) {
      throw new Error('Roteiro não encontrado');
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (dados.titulo !== undefined) {
      updateFields.push('titulo = ?');
      updateValues.push(dados.titulo);
    }

    if (dados.descricao !== undefined) {
      updateFields.push('descricao = ?');
      updateValues.push(dados.descricao);
    }

    if (dados.data_celebracao !== undefined) {
      updateFields.push('data_celebracao = ?');
      updateValues.push(dados.data_celebracao);
    }

    if (dados.marca_dagua_id !== undefined) {
      updateFields.push('marca_dagua_id = ?');
      updateValues.push(dados.marca_dagua_id);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    const updateQuery = this.db.prepare(
      `UPDATE roteiro SET ${updateFields.join(', ')} WHERE id = ?`
    );

    updateQuery.run(...updateValues, id);

    return this.buscarPorId(id) as Promise<Roteiro>;
  }

  async excluir(id: number): Promise<void> {
    const roteiro = await this.buscarPorId(id);
    if (!roteiro) {
      throw new Error('Roteiro não encontrado');
    }

    this.db.prepare('DELETE FROM roteiro WHERE id = ?').run(id);
  }
}
