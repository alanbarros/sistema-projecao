import { ProjectionState } from '../entities/ProjectionState';

export interface IProjectionRepository {
  obterEstado(roteiroId: number): Promise<ProjectionState | null>;
  atualizarEstado(roteiroId: number, estado: ProjectionState): Promise<void>;
  limparEstado(roteiroId: number): Promise<void>;
}