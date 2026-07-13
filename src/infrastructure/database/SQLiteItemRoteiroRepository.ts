import Database from 'better-sqlite3';
import { ItemRoteiro, CriarItemRoteiroCatalogoDTO, CriarItemRoteiroAdHocDTO, AtualizarItemRoteiroDTO } from '../../domain/entities/ItemRoteiro';
import { IItemRoteiroRepository } from '../../domain/repositories/IItemRoteiroRepository';
import { ItemType } from '../../shared/enums';

export class SQLiteItemRoteiroRepository implements IItemRoteiroRepository {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  async buscarPorId(id: number): Promise<ItemRoteiro | null> {
    const item = this.db.prepare(
      'SELECT id, roteiro_id, item_coletanea_id, titulo_snapshot, tipo_snapshot, momento_liturgico, posicao, is_ad_hoc, marca_agua_ativa, created_at FROM item_roteiro WHERE id = ?'
    ).get(id) as any;

    if (!item) {
      return null;
    }

    const blocos = this.db.prepare(
      'SELECT id, tipo, conteudo, ordem, created_at FROM item_roteiro_bloco WHERE item_roteiro_id = ? ORDER BY ordem'
    ).all(id) as any[];

    return {
      id: item.id,
      roteiroId: item.roteiro_id,
      itemColetaneaId: item.item_coletanea_id,
      tituloSnapshot: item.titulo_snapshot,
      tipoSnapshot: item.tipo_snapshot as ItemType,
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
  }

  async listarPorRoteiroId(roteiroId: number): Promise<ItemRoteiro[]> {
    const itens = this.db.prepare(
      'SELECT id, roteiro_id, item_coletanea_id, titulo_snapshot, tipo_snapshot, momento_liturgico, posicao, is_ad_hoc, marca_agua_ativa, created_at FROM item_roteiro WHERE roteiro_id = ? ORDER BY posicao'
    ).all(roteiroId) as any[];

    return Promise.all(itens.map(item => this.buscarPorId(item.id) as Promise<ItemRoteiro>));
  }

  async criarDoCatalogo(roteiroId: number, dados: CriarItemRoteiroCatalogoDTO): Promise<ItemRoteiro> {
    const itemColetanea = this.db.prepare(
      'SELECT id, titulo, tipo FROM item_coletanea WHERE id = ?'
    ).get(dados.itemColetaneaId) as any;

    if (!itemColetanea) {
      throw new Error('Item do catálogo não encontrado');
    }

    const posicao = await this.obterProximaPosicao(roteiroId);

    const insertItem = this.db.prepare(
      'INSERT INTO item_roteiro (roteiro_id, item_coletanea_id, titulo_snapshot, tipo_snapshot, momento_liturgico, posicao, is_ad_hoc, marca_agua_ativa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    const insertBloco = this.db.prepare(
      'INSERT INTO item_roteiro_bloco (item_roteiro_id, tipo, conteudo, ordem) VALUES (?, ?, ?, ?)'
    );

    const resultado = this.db.transaction(() => {
      const result = insertItem.run(
        roteiroId,
        dados.itemColetaneaId,
        itemColetanea.titulo,
        itemColetanea.tipo,
        dados.momentoLiturgico || null,
        posicao,
        0,
        1
      );
      const itemRoteiroId = result.lastInsertRowid as number;

      const blocos = this.db.prepare(
        'SELECT tipo, conteudo, ordem FROM item_bloco WHERE item_coletanea_id = ? ORDER BY ordem'
      ).all(dados.itemColetaneaId) as any[];

      blocos.forEach(bloco => {
        insertBloco.run(itemRoteiroId, bloco.tipo, bloco.conteudo, bloco.ordem);
      });

      return itemRoteiroId;
    })();

    return this.buscarPorId(resultado as number) as Promise<ItemRoteiro>;
  }

  async criarAdHoc(roteiroId: number, dados: CriarItemRoteiroAdHocDTO): Promise<ItemRoteiro> {
    const posicao = await this.obterProximaPosicao(roteiroId);

    const insertItem = this.db.prepare(
      'INSERT INTO item_roteiro (roteiro_id, titulo_snapshot, tipo_snapshot, posicao, is_ad_hoc, marca_agua_ativa) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const insertBloco = this.db.prepare(
      'INSERT INTO item_roteiro_bloco (item_roteiro_id, tipo, conteudo, ordem) VALUES (?, ?, ?, ?)'
    );

    const resultado = this.db.transaction(() => {
      const result = insertItem.run(
        roteiroId,
        dados.titulo,
        dados.tipo,
        posicao,
        1,
        1
      );
      const itemRoteiroId = result.lastInsertRowid as number;

      dados.blocos.forEach((bloco, index) => {
        insertBloco.run(itemRoteiroId, bloco.tipo, bloco.conteudo, index + 1);
      });

      return itemRoteiroId;
    })();

    return this.buscarPorId(resultado as number) as Promise<ItemRoteiro>;
  }

  async atualizar(id: number, dados: AtualizarItemRoteiroDTO): Promise<ItemRoteiro> {
    const itemExistente = await this.buscarPorId(id);
    if (!itemExistente) {
      throw new Error('Item do roteiro não encontrado');
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (dados.momentoLiturgico !== undefined) {
      updateFields.push('momento_liturgico = ?');
      updateValues.push(dados.momentoLiturgico);
    }

    if (dados.marcaAguaAtiva !== undefined) {
      updateFields.push('marca_agua_ativa = ?');
      updateValues.push(dados.marcaAguaAtiva ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return itemExistente;
    }

    const updateQuery = this.db.prepare(
      `UPDATE item_roteiro SET ${updateFields.join(', ')} WHERE id = ?`
    );

    updateQuery.run(...updateValues, id);

    return this.buscarPorId(id) as Promise<ItemRoteiro>;
  }

  async excluir(id: number): Promise<void> {
    const item = await this.buscarPorId(id);
    if (!item) {
      throw new Error('Item do roteiro não encontrado');
    }

    this.db.prepare('DELETE FROM item_roteiro WHERE id = ?').run(id);
  }

  async reordenar(roteiroId: number, itemIds: number[]): Promise<void> {
    const itensExistentes = this.db.prepare(
      'SELECT id FROM item_roteiro WHERE roteiro_id = ?'
    ).all(roteiroId) as any[];

    const idsExistentes = itensExistentes.map(i => i.id).sort();
    const idsRecebidos = [...itemIds].sort();

    if (JSON.stringify(idsExistentes) !== JSON.stringify(idsRecebidos)) {
      throw new Error('A lista de itens deve conter todos os itens do roteiro');
    }

    const updatePosicao = this.db.prepare(
      'UPDATE item_roteiro SET posicao = ? WHERE id = ?'
    );

    this.db.transaction(() => {
      itemIds.forEach((id, index) => {
        updatePosicao.run(index + 1, id);
      });
    })();
  }

  async obterProximaPosicao(roteiroId: number): Promise<number> {
    const result = this.db.prepare(
      'SELECT COALESCE(MAX(posicao), 0) + 1 as proxima_posicao FROM item_roteiro WHERE roteiro_id = ?'
    ).get(roteiroId) as any;

    return result.proxima_posicao;
  }
}
