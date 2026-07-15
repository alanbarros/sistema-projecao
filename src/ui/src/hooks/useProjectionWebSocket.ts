import { useEffect, useRef, useState, useCallback } from 'react';
import { WEBSOCKET_EVENTS } from 'shared';

// ProjectionState do hook — subset do tipo de domínio (sem roteiroId).
// itensComSlide usa Record<number, number> para compatibilidade com JSON.stringify/parse no WebSocket.
interface ProjectionState {
  itemRoteiroId: number;
  slideIndice: number;
  totalSlides: number;
  itensComSlide: Record<number, number>;
}

interface UseProjectionWebSocketProps {
  roteiroId: number;
  onStateUpdate: (state: ProjectionState) => void;
}

export function useProjectionWebSocket({ roteiroId, onStateUpdate }: UseProjectionWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectDelayRef = useRef(1000);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/projection?roteiroId=${roteiroId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectDelayRef.current = 1000;
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === WEBSOCKET_EVENTS.UPDATE || message.type === WEBSOCKET_EVENTS.SYNC) {
          onStateUpdate(message.payload);
        }
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 10000);
        connect();
      }, reconnectDelayRef.current);
    };

    ws.onerror = (error) => {
      console.error('Erro WebSocket:', error);
      ws.close();
    };
  }, [roteiroId, onStateUpdate]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: WEBSOCKET_EVENTS.NAVIGATE,
        payload: { direction },
      }));
    }
  }, []);

  const updateState = useCallback((state: ProjectionState) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: WEBSOCKET_EVENTS.UPDATE,
        payload: state,
      }));
    }
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    isConnected,
    navigate,
    updateState,
    connect,
    disconnect,
  };
}
