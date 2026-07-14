import { Router, Request, Response } from 'express';
import { getRoteiroRepository, getItemRoteiroRepository, getRepository } from '../database';
import { CriarRoteiroUseCase } from '../../application/use-cases/CriarRoteiroUseCase';
import { ListarRoteirosUseCase } from '../../application/use-cases/ListarRoteirosUseCase';
import { BuscarRoteiroPorIdUseCase } from '../../application/use-cases/BuscarRoteiroPorIdUseCase';
import { EditarRoteiroUseCase } from '../../application/use-cases/EditarRoteiroUseCase';
import { ExcluirRoteiroUseCase } from '../../application/use-cases/ExcluirRoteiroUseCase';
import { AdicionarItemAoRoteiroUseCase } from '../../application/use-cases/AdicionarItemAoRoteiroUseCase';
import { CriarItemAdHocUseCase } from '../../application/use-cases/CriarItemAdHocUseCase';
import { AtualizarItemRoteiroUseCase } from '../../application/use-cases/AtualizarItemRoteiroUseCase';
import { RemoverItemDoRoteiroUseCase } from '../../application/use-cases/RemoverItemDoRoteiroUseCase';
import { ReordenarItensUseCase } from '../../application/use-cases/ReordenarItensUseCase';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const repository = getRoteiroRepository();
    const useCase = new ListarRoteirosUseCase(repository);

    const { q, offset, limit } = req.query;
    const result = await useCase.executar({
      q: q as string,
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });

    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
        res.status(status).json(parsed);
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
    const repository = getRoteiroRepository();
    const useCase = new BuscarRoteiroPorIdUseCase(repository);

    const id = parseInt(req.params.id);
    const roteiro = await useCase.executar(id);

    res.json(roteiro);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
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
    const repository = getRoteiroRepository();
    const useCase = new CriarRoteiroUseCase(repository);

    const roteiro = await useCase.executar(req.body);

    res.status(201).json(roteiro);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
        res.status(status).json(parsed);
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
    const repository = getRoteiroRepository();
    const useCase = new EditarRoteiroUseCase(repository);

    const id = parseInt(req.params.id);
    const roteiro = await useCase.executar(id, req.body);

    res.json(roteiro);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
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
    const repository = getRoteiroRepository();
    const useCase = new ExcluirRoteiroUseCase(repository);

    const id = parseInt(req.params.id);
    await useCase.executar(id);

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.post('/:id/itens', async (req: Request, res: Response) => {
  try {
    const itemRoteiroRepository = getItemRoteiroRepository();
    const itemColetaneaRepository = getRepository();
    const useCase = new AdicionarItemAoRoteiroUseCase(itemRoteiroRepository, itemColetaneaRepository);

    const roteiroId = parseInt(req.params.id);
    const item = await useCase.executar(roteiroId, req.body);

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.post('/:id/itens/ad-hoc', async (req: Request, res: Response) => {
  try {
    const repository = getItemRoteiroRepository();
    const useCase = new CriarItemAdHocUseCase(repository);

    const roteiroId = parseInt(req.params.id);
    const item = await useCase.executar(roteiroId, req.body);

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.put('/:id/itens/reorder', async (req: Request, res: Response) => {
  try {
    const repository = getItemRoteiroRepository();
    const useCase = new ReordenarItensUseCase(repository);

    const roteiroId = parseInt(req.params.id);
    await useCase.executar(roteiroId, req.body.item_ids);

    res.json({ message: 'Ordem atualizada com sucesso' });
  } catch (error: any) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error?.includes('não encontrado') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: String(error) || 'Erro interno do servidor' });
    }
  }
});

router.put('/:id/itens/:itemId', async (req: Request, res: Response) => {
  try {
    const repository = getItemRoteiroRepository();
    const useCase = new AtualizarItemRoteiroUseCase(repository);

    const itemId = parseInt(req.params.itemId);
    const item = await useCase.executar(itemId, req.body);

    res.json(item);
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
        res.status(status).json(parsed);
      } catch {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

router.delete('/:id/itens/:itemId', async (req: Request, res: Response) => {
  try {
    const repository = getItemRoteiroRepository();
    const useCase = new RemoverItemDoRoteiroUseCase(repository);

    const itemId = parseInt(req.params.itemId);
    await useCase.executar(itemId);

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);
        const status = parsed.error.includes('não encontrado') ? 404 : 400;
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
