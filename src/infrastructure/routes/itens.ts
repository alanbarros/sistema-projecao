import { Router, Request, Response } from 'express';
import { getRepository } from '../database';
import { CriarItemUseCase } from '../../application/use-cases/CriarItemUseCase';
import { ListarItensUseCase } from '../../application/use-cases/ListarItensUseCase';
import { BuscarItemPorIdUseCase } from '../../application/use-cases/BuscarItemPorIdUseCase';
import { EditarItemUseCase } from '../../application/use-cases/EditarItemUseCase';
import { ExcluirItemUseCase } from '../../application/use-cases/ExcluirItemUseCase';

export const itensRouter = Router();

itensRouter.get('/', async (req: Request, res: Response) => {
  try {
    const repository = getRepository();
    const useCase = new ListarItensUseCase(repository);
    
    const { q, tipo, offset, limit } = req.query;
    
    const resultado = await useCase.executar({
      q: q as string,
      tipo: tipo as any,
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    res.json(resultado);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        res.status(parsed.error === 'Item não encontrado' ? 404 : 400).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

itensRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const repository = getRepository();
    const useCase = new BuscarItemPorIdUseCase(repository);
    
    const id = parseInt(req.params.id);
    const item = await useCase.executar(id);
    
    res.json(item);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        res.status(parsed.error === 'Item não encontrado' ? 404 : 400).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

itensRouter.post('/', async (req: Request, res: Response) => {
  try {
    const repository = getRepository();
    const useCase = new CriarItemUseCase(repository);
    
    const item = await useCase.executar(req.body);
    
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        res.status(parsed.error === 'Dados inválidos' ? 400 : 500).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

itensRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const repository = getRepository();
    const useCase = new EditarItemUseCase(repository);
    
    const id = parseInt(req.params.id);
    const item = await useCase.executar(id, req.body);
    
    res.json(item);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error === 'Item não encontrado') {
          res.status(404).json(parsed);
        } else if (parsed.error === 'Dados inválidos') {
          res.status(400).json(parsed);
        } else {
          res.status(500).json({ error: 'Erro interno do servidor' });
        }
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

itensRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const repository = getRepository();
    const useCase = new ExcluirItemUseCase(repository);
    
    const id = parseInt(req.params.id);
    await useCase.executar(id);
    
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        res.status(parsed.error === 'Item não encontrado' ? 404 : 500).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});
