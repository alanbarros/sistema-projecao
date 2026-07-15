import { Router, Request, Response } from 'express';
import { getMarcaDaguaRepository } from '../database';
import { CriarMarcaDaguaUseCase } from '../../application/use-cases/CriarMarcaDaguaUseCase';
import { EditarMarcaDaguaUseCase } from '../../application/use-cases/EditarMarcaDaguaUseCase';
import { ExcluirMarcaDaguaUseCase } from '../../application/use-cases/ExcluirMarcaDaguaUseCase';
import { ListarMarcasDaguaUseCase } from '../../application/use-cases/ListarMarcasDaguaUseCase';
import { BuscarMarcaDaguaPorIdUseCase } from '../../application/use-cases/BuscarMarcaDaguaPorIdUseCase';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const repository = getMarcaDaguaRepository();
    const useCase = new ListarMarcasDaguaUseCase(repository);
    const marcas = await useCase.executar();
    res.json(marcas);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        res.status(400).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const repository = getMarcaDaguaRepository();
    const useCase = new BuscarMarcaDaguaPorIdUseCase(repository);
    const id = parseInt(req.params.id);
    const marca = await useCase.executar(id);
    res.json(marca);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error?.includes('não encontrada') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const repository = getMarcaDaguaRepository();
    const useCase = new CriarMarcaDaguaUseCase(repository);
    const marca = await useCase.executar(req.body);
    res.status(201).json(marca);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        res.status(400).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const repository = getMarcaDaguaRepository();
    const useCase = new EditarMarcaDaguaUseCase(repository);
    const id = parseInt(req.params.id);
    const marca = await useCase.executar(id, req.body);
    res.json(marca);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error?.includes('não encontrada') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const repository = getMarcaDaguaRepository();
    const useCase = new ExcluirMarcaDaguaUseCase(repository);
    const id = parseInt(req.params.id);
    await useCase.executar(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error?.includes('não encontrada') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

export default router;
