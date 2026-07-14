import { Router } from 'express';
import { InMemoryProjectionRepository } from '../repositories/InMemoryProjectionRepository';

const router = Router();
const projectionRepository = new InMemoryProjectionRepository();

router.get('/:roteiroId/estado', async (req, res) => {
  const { roteiroId } = req.params;
  const estado = await projectionRepository.obterEstado(parseInt(roteiroId, 10));
  
  if (!estado) {
    return res.status(404).json({ error: 'Estado de projeção não encontrado' });
  }
  
  res.json(estado);
});

router.put('/:roteiroId/estado', async (req, res) => {
  const { roteiroId } = req.params;
  const estado = req.body;
  
  await projectionRepository.atualizarEstado(parseInt(roteiroId, 10), estado);
  
  res.json(estado);
});

router.delete('/:roteiroId/estado', async (req, res) => {
  const { roteiroId } = req.params;
  
  await projectionRepository.limparEstado(parseInt(roteiroId, 10));
  
  res.status(204).send();
});

export default router;