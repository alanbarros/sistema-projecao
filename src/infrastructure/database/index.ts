import { SQLiteItemColetaneaRepository } from './SQLiteItemColetaneaRepository';

let repository: SQLiteItemColetaneaRepository | null = null;

export function getRepository(): SQLiteItemColetaneaRepository {
  if (!repository) {
    repository = new SQLiteItemColetaneaRepository('./database.sqlite');
  }
  return repository;
}

export async function closeRepository(): Promise<void> {
  if (repository) {
    await repository.fechar();
    repository = null;
  }
}
