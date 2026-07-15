import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { itensRouter } from './routes/itens';
import roteirosRouter from './routes/roteiros';
import projecaoRouter from './routes/projecao';
import marcasDaguaRouter from './routes/marcas-dagua';
import { getRepository, closeRepository } from './database';
import { ProjectionServer } from './websocket/ProjectionServer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/itens', itensRouter);
app.use('/api/roteiros', roteirosRouter);
app.use('/api/projecao', projecaoRouter);
app.use('/api/marcas-dagua', marcasDaguaRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = createServer(app);
const projectionServer = new ProjectionServer();
projectionServer.initialize(server);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  getRepository();
});

process.on('SIGINT', async () => {
  console.log('Encerrando servidor...');
  projectionServer.close();
  await closeRepository();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  projectionServer.close();
  await closeRepository();
  server.close();
  process.exit(0);
});

export default app;
