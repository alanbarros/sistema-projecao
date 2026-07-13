import Database from 'better-sqlite3';
import { SQLiteItemColetaneaRepository } from './SQLiteItemColetaneaRepository';
import { SQLiteRoteiroRepository } from './SQLiteRoteiroRepository';
import { SQLiteItemRoteiroRepository } from './SQLiteItemRoteiroRepository';

let db: Database.Database | null = null;
let itemColetaneaRepository: SQLiteItemColetaneaRepository | null = null;
let roteiroRepository: SQLiteRoteiroRepository | null = null;
let itemRoteiroRepository: SQLiteItemRoteiroRepository | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database('./database.sqlite');
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
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
}
