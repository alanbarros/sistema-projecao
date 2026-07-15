import Database from 'better-sqlite3';
import { SQLiteItemColetaneaRepository } from './SQLiteItemColetaneaRepository';
import { SQLiteRoteiroRepository } from './SQLiteRoteiroRepository';
import { SQLiteItemRoteiroRepository } from './SQLiteItemRoteiroRepository';
import { SQLiteMarcaDaguaRepository } from './SQLiteMarcaDaguaRepository';
import {
  CREATE_TABLE_MARCA_DAGUA,
  CREATE_INDEX_MARCA_DAGUA_TITULO,
  ALTER_TABLE_ROTEIRO_ADD_MARCA_DAGUA_ID
} from './schemas';

let db: Database.Database | null = null;
let itemColetaneaRepository: SQLiteItemColetaneaRepository | null = null;
let roteiroRepository: SQLiteRoteiroRepository | null = null;
let itemRoteiroRepository: SQLiteItemRoteiroRepository | null = null;
let marcaDaguaRepository: SQLiteMarcaDaguaRepository | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database('./database.sqlite');
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    executarMigrations(db);
  }
  return db;
}

function executarMigrations(database: Database.Database): void {
  database.exec(CREATE_TABLE_MARCA_DAGUA);
  database.exec(CREATE_INDEX_MARCA_DAGUA_TITULO);

  const colunaExiste = database.prepare(
    "SELECT COUNT(*) as total FROM pragma_table_info('roteiro') WHERE name = 'marca_dagua_id'"
  ).get() as { total: number };

  if (colunaExiste.total === 0) {
    database.exec(ALTER_TABLE_ROTEIRO_ADD_MARCA_DAGUA_ID);
  }
}

export function getRepository(): SQLiteItemColetaneaRepository {
  if (!itemColetaneaRepository) {
    itemColetaneaRepository = new SQLiteItemColetaneaRepository('./database.sqlite');
  }
  return itemColetaneaRepository;
}

export function getRoteiroRepository(): SQLiteRoteiroRepository {
  if (!roteiroRepository) {
    roteiroRepository = new SQLiteRoteiroRepository(getDb());
  }
  return roteiroRepository;
}

export function getItemRoteiroRepository(): SQLiteItemRoteiroRepository {
  if (!itemRoteiroRepository) {
    itemRoteiroRepository = new SQLiteItemRoteiroRepository(getDb());
  }
  return itemRoteiroRepository;
}

export function getMarcaDaguaRepository(): SQLiteMarcaDaguaRepository {
  if (!marcaDaguaRepository) {
    marcaDaguaRepository = new SQLiteMarcaDaguaRepository(getDb());
  }
  return marcaDaguaRepository;
}

export async function closeRepository(): Promise<void> {
  if (itemColetaneaRepository) {
    await itemColetaneaRepository.fechar();
    itemColetaneaRepository = null;
  }
  if (db) {
    db.close();
    db = null;
  }
  roteiroRepository = null;
  itemRoteiroRepository = null;
  marcaDaguaRepository = null;
}
