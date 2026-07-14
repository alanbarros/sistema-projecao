import { IProjectionRepository } from '../../domain/repositories/IProjectionRepository';
import { ProjectionState } from '../../domain/entities/ProjectionState';

export class InMemoryProjectionRepository implements IProjectionRepository {
  private states: Map<number, ProjectionState> = new Map();

  async obterEstado(roteiroId: number): Promise<ProjectionState | null> {
    return this.states.get(roteiroId) || null;
  }

  async atualizarEstado(roteiroId: number, estado: ProjectionState): Promise<void> {
    this.states.set(roteiroId, estado);
  }

  async limparEstado(roteiroId: number): Promise<void> {
    this.states.delete(roteiroId);
  }
}