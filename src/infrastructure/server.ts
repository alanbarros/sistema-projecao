import express from 'express';
import cors from 'cors';
import { itensRouter } from './routes/itens';
import { getRepository, closeRepository } from './database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/itens', itensRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  getRepository();
});

process.on('SIGINT', async () => {
  console.log('Encerrando servidor...');
  await closeRepository();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRepository();
  server.close();
  process.exit(0);
});

export default app;
