import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { WEBSOCKET_EVENTS } from '../../shared/constants';
import { ProjectionState } from '../../domain/entities/ProjectionState';

interface ConnectedClient {
  ws: WebSocket;
  roteiroId: number;
}

export class ProjectionServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ConnectedClient> = new Map();
  private projectionStates: Map<number, ProjectionState> = new Map();

  initialize(server: Server): void {
    this.wss = new WebSocketServer({ server, path: '/ws/projection' });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const roteiroId = parseInt(url.searchParams.get('roteiroId') || '0', 10);

      if (!roteiroId) {
        ws.close(1008, 'roteiroId é obrigatório');
        return;
      }

      const clientId = `${roteiroId}_${Date.now()}`;
      this.clients.set(clientId, { ws, roteiroId });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, roteiroId, message);
        } catch (error) {
          ws.send(JSON.stringify({ type: WEBSOCKET_EVENTS.ERROR, payload: { message: 'Formato de mensagem inválido' } }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
      });

      const estado = this.projectionStates.get(roteiroId);
      if (estado) {
        ws.send(JSON.stringify({ type: WEBSOCKET_EVENTS.SYNC, payload: estado }));
      }
    });
  }

  private handleMessage(clientId: string, roteiroId: number, message: { type: string; payload: any }): void {
    switch (message.type) {
      case WEBSOCKET_EVENTS.NAVIGATE:
        const estado = this.projectionStates.get(roteiroId);
        if (estado) {
          const { direction } = message.payload;
          if (direction === 'next') {
            if (estado.slideIndice < estado.totalSlides) {
              estado.slideIndice++;
            }
          } else if (direction === 'prev') {
            if (estado.slideIndice > 1) {
              estado.slideIndice--;
            }
          }
          this.projectionStates.set(roteiroId, estado);
          this.broadcast(roteiroId, { type: WEBSOCKET_EVENTS.UPDATE, payload: estado });
        }
        break;
      case WEBSOCKET_EVENTS.UPDATE:
        this.projectionStates.set(roteiroId, message.payload);
        this.broadcast(roteiroId, { type: WEBSOCKET_EVENTS.UPDATE, payload: message.payload });
        break;
      default:
        break;
    }
  }

  private broadcast(roteiroId: number, message: object): void {
    this.clients.forEach((client) => {
      if (client.roteiroId === roteiroId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  getEstado(roteiroId: number): ProjectionState | null {
    return this.projectionStates.get(roteiroId) || null;
  }

  setEstado(roteiroId: number, estado: ProjectionState): void {
    this.projectionStates.set(roteiroId, estado);
    this.broadcast(roteiroId, { type: WEBSOCKET_EVENTS.UPDATE, payload: estado });
  }

  close(): void {
    this.clients.forEach((client) => {
      client.ws.close();
    });
    this.clients.clear();
    this.projectionStates.clear();
    if (this.wss) {
      this.wss.close();
    }
  }
}