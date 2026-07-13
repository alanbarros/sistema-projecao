import Database from 'better-sqlite3';
import { ItemColetanea, CriarItemColetaneaDTO, AtualizarItemColetaneaDTO } from '../../domain/entities/ItemColetanea';
import { ItemBloco } from '../../domain/entities/ItemBloco';
import { IItemColetaneaRepository, ListarItensParams, ResultadoListagem } from '../../domain/repositories/IItemColetaneaRepository';
import { ItemType } from '../../shared/enums';
import {
  CREATE_TABLE_ITEM_COLETANEA,
  CREATE_INDEX_ITEM_TIPO,
  CREATE_INDEX_ITEM_TITULO,
  CREATE_TABLE_ITEM_BLOCO,
  CREATE_INDEX_BLOCO_ITEM,
  CREATE_INDEX_BLOCO_CONTEUDO
} from './schemas';

export class SQLiteItemColetaneaRepository implements IItemColetaneaRepository {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.inicializar();
  }

  private inicializar(): void {
    this.db.exec(CREATE_TABLE_ITEM_COLETANEA);
    this.db.exec(CREATE_INDEX_ITEM_TIPO);
    this.db.exec(CREATE_INDEX_ITEM_TITULO);
    this.db.exec(CREATE_TABLE_ITEM_BLOCO);
    this.db.exec(CREATE_INDEX_BLOCO_ITEM);
    this.db.exec(CREATE_INDEX_BLOCO_CONTEUDO);
  }

  async buscarPorId(id: number): Promise<ItemColetanea | null> {
    const item = this.db.prepare(
      'SELECT id, titulo, tipo, created_at, updated_at FROM item_coletanea WHERE id = ?'
    ).get(id) as any;

    if (!item) {
      return null;
    }

    const blocos = this.db.prepare(
      'SELECT id, tipo, conteudo, ordem FROM item_bloco WHERE item_coletanea_id = ? ORDER BY ordem'
    ).all(id) as ItemBloco[];

    return {
      id: item.id,
      titulo: item.titulo,
      tipo: item.tipo as ItemType,
      blocos,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at)
    };
  }

  async listar(params: ListarItensParams): Promise<ResultadoListagem> {
    const { q, tipo, offset = 0, limit = 20 } = params;

    let whereClause = '';
    const queryParams: any[] = [];

    if (q) {
      whereClause = `WHERE (item.titulo LIKE ? OR EXISTS (
        SELECT 1 FROM item_bloco bloco 
        WHERE bloco.item_coletanea_id = item.id 
        AND bloco.conteudo LIKE ?
      ))`;
      queryParams.push(`%${q}%`, `%${q}%`);
    }

    if (tipo) {
      whereClause += whereClause ? ' AND item.tipo = ?' : 'WHERE item.tipo = ?';
      queryParams.push(tipo);
    }

    const countQuery = `SELECT COUNT(*) as total FROM item_coletanea item ${whereClause}`;
    const { total } = this.db.prepare(countQuery).get(...queryParams) as any;

    const dataQuery = `
      SELECT item.id, item.titulo, item.tipo, item.created_at, item.updated_at
      FROM item_coletanea item
      ${whereClause}
      ORDER BY item.id
      LIMIT ? OFFSET ?
    `;
    const itens = this.db.prepare(dataQuery).all(...queryParams, limit, offset) as any[];

    return {
      itens: itens.map(item => ({
        id: item.id,
        titulo: item.titulo,
        tipo: item.tipo as ItemType,
        blocos: [],
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      })),
      total,
      offset,
      limit
    };
  }

  async criar(dados: CriarItemColetaneaDTO): Promise<ItemColetanea> {
    const insertItem = this.db.prepare(
      'INSERT INTO item_coletanea (titulo, tipo) VALUES (?, ?)'
    );

    const insertBloco = this.db.prepare(
      'INSERT INTO item_bloco (item_coletanea_id, tipo, conteudo, ordem) VALUES (?, ?, ?, ?)'
    );

    const resultado = this.db.transaction(() => {
      const result = insertItem.run(dados.titulo, dados.tipo);
      const itemId = result.lastInsertRowid as number;

      dados.blocos.forEach((bloco, index) => {
        insertBloco.run(itemId, bloco.tipo, bloco.conteudo, index + 1);
      });

      return itemId;
    })();

    return this.buscarPorId(resultado as number) as Promise<ItemColetanea>;
  }

  async atualizar(id: number, dados: AtualizarItemColetaneaDTO): Promise<ItemColetanea> {
    const itemExistente = await this.buscarPorId(id);
    if (!itemExistente) {
      throw new Error('Item não encontrado');
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (dados.titulo !== undefined) {
      updateFields.push('titulo = ?');
      updateValues.push(dados.titulo);
    }

    if (dados.tipo !== undefined) {
      updateFields.push('tipo = ?');
      updateValues.push(dados.tipo);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    const updateItem = this.db.prepare(
      `UPDATE item_coletanea SET ${updateFields.join(', ')} WHERE id = ?`
    );

    const deleteBlocos = this.db.prepare(
      'DELETE FROM item_bloco WHERE item_coletanea_id = ?'
    );

    const insertBloco = this.db.prepare(
      'INSERT INTO item_bloco (item_coletanea_id, tipo, conteudo, ordem) VALUES (?, ?, ?, ?)'
    );

    this.db.transaction(() => {
      updateItem.run(...updateValues, id);

      if (dados.blocos) {
        deleteBlocos.run(id);
        dados.blocos.forEach((bloco, index) => {
          insertBloco.run(id, bloco.tipo, bloco.conteudo, index + 1);
        });
      }
    })();

    return this.buscarPorId(id) as Promise<ItemColetanea>;
  }

  async excluir(id: number): Promise<void> {
    const item = await this.buscarPorId(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }

    this.db.prepare('DELETE FROM item_coletanea WHERE id = ?').run(id);
  }

  async fechar(): Promise<void> {
    this.db.close();
  }
}
