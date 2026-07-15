import { useState, useCallback, useEffect } from 'react';
import { gerarSlides } from '../engine/slideEngine';
import { criarEstadoInicial, navegarParaProximo, navegarParaAnterior } from '../engine/projectionState';
import { useProjectionWebSocket } from './useProjectionWebSocket';
import { BlockType } from 'shared';

interface ItemRoteiroBloco {
  id?: number;
  itemRoteiroId: number;
  tipo: BlockType;
  conteudo: string;
  ordem: number;
}

interface ItemRoteiro {
  id: number;
  blocos: ItemRoteiroBloco[];
  marcaAguaAtiva: boolean;
}

interface Slide {
  conteudo: string;
  indice: number;
  total: number;
  marcaAguaAtiva: boolean;
}

// ProjectionState do hook — subset do tipo de domínio (sem roteiroId).
// itensComSlide usa Record<number, number> para compatibilidade com JSON.stringify/parse no WebSocket.
interface ProjectionState {
  itemRoteiroId: number;
  slideIndice: number;
  totalSlides: number;
  itensComSlide: Record<number, number>;
}

interface UseProjectionProps {
  roteiroId: number;
  itens: ItemRoteiro[];
}

function salvarEstadoLocalStorage(roteiroId: number, estado: ProjectionState): void {
  try {
    localStorage.setItem(`projection_state_${roteiroId}`, JSON.stringify(estado));
  } catch (error) {
    console.error('Erro ao salvar estado no localStorage:', error);
  }
}

function carregarEstadoLocalStorage(roteiroId: number): ProjectionState | null {
  try {
    const estadoSalvo = localStorage.getItem(`projection_state_${roteiroId}`);
    if (!estadoSalvo) return null;
    
    const estadoSerializado = JSON.parse(estadoSalvo);

    if (
      !estadoSerializado.itensComSlide ||
      typeof estadoSerializado.itensComSlide !== 'object' ||
      Array.isArray(estadoSerializado.itensComSlide) ||
      Object.keys(estadoSerializado.itensComSlide).length === 0
    ) {
      return null;
    }

    return {
      itemRoteiroId: estadoSerializado.itemRoteiroId,
      slideIndice: estadoSerializado.slideIndice,
      totalSlides: estadoSerializado.totalSlides,
      itensComSlide: estadoSerializado.itensComSlide,
    };
  } catch (error) {
    console.error('Erro ao carregar estado do localStorage:', error);
    return null;
  }
}

export function useProjection({ roteiroId, itens }: UseProjectionProps) {
  const [projectionState, setProjectionState] = useState<ProjectionState | null>(null);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);

  const handleStateUpdate = useCallback((state: ProjectionState) => {
    setProjectionState(state);
    salvarEstadoLocalStorage(roteiroId, state);
  }, [roteiroId]);

  const { isConnected, updateState } = useProjectionWebSocket({
    roteiroId,
    onStateUpdate: handleStateUpdate,
  });

  useEffect(() => {
    if (itens.length > 0 && !projectionState) {
      const estadoSalvo = carregarEstadoLocalStorage(roteiroId);
      
      if (estadoSalvo && itens.some(item => item.id === estadoSalvo.itemRoteiroId)) {
        setProjectionState(estadoSalvo);
        const itemAtual = itens.find(item => item.id === estadoSalvo.itemRoteiroId);
        if (itemAtual) {
          const slides = gerarSlides(itemAtual.blocos, undefined, itemAtual.marcaAguaAtiva);
          setCurrentSlide(slides[estadoSalvo.slideIndice - 1] || null);
        }
      } else {
        const primeiroItem = itens[0];
        const slidesPrimeiroItem = gerarSlides(primeiroItem.blocos, undefined, primeiroItem.marcaAguaAtiva);
        const estadoInicial = criarEstadoInicial(primeiroItem.id, slidesPrimeiroItem.length);
        setProjectionState(estadoInicial);
        setCurrentSlide(slidesPrimeiroItem[0]);
        salvarEstadoLocalStorage(roteiroId, estadoInicial);
      }
    }
  }, [itens, projectionState, roteiroId]);

  useEffect(() => {
    if (projectionState && itens.length > 0) {
      const itemAtual = itens.find((item) => item.id === projectionState.itemRoteiroId);
      if (itemAtual) {
        const slides = gerarSlides(itemAtual.blocos, undefined, itemAtual.marcaAguaAtiva);
        const slideAtual = slides[projectionState.slideIndice - 1];
        setCurrentSlide(slideAtual || null);
      }
    }
  }, [projectionState, itens]);

  const navigateNext = useCallback(() => {
    if (projectionState && itens.length > 0) {
      const itensComSlide: Record<number, number> = {};
      itens.forEach((item) => {
        itensComSlide[item.id] = gerarSlides(item.blocos, undefined, item.marcaAguaAtiva).length;
      });
      const novoEstado = navegarParaProximo(projectionState, itensComSlide);
      setProjectionState(novoEstado);
      updateState(novoEstado);
      salvarEstadoLocalStorage(roteiroId, novoEstado);
    }
  }, [projectionState, itens, updateState, roteiroId]);

  const navigatePrev = useCallback(() => {
    if (projectionState && itens.length > 0) {
      const itensComSlide: Record<number, number> = {};
      itens.forEach((item) => {
        itensComSlide[item.id] = gerarSlides(item.blocos, undefined, item.marcaAguaAtiva).length;
      });
      const novoEstado = navegarParaAnterior(projectionState, itensComSlide);
      setProjectionState(novoEstado);
      updateState(novoEstado);
      salvarEstadoLocalStorage(roteiroId, novoEstado);
    }
  }, [projectionState, itens, updateState, roteiroId]);

  const jumpToItem = useCallback((itemRoteiroId: number) => {
    if (itens.length > 0) {
      const item = itens.find((i) => i.id === itemRoteiroId);
      if (item) {
        const slides = gerarSlides(item.blocos, undefined, item.marcaAguaAtiva);
        const novosItensComSlide: Record<number, number> = {};
        itens.forEach((i) => {
          const s = gerarSlides(i.blocos, undefined, i.marcaAguaAtiva);
          novosItensComSlide[i.id] = s.length;
        });
        const novoEstado: ProjectionState = {
          itemRoteiroId: item.id,
          slideIndice: 1,
          totalSlides: slides.length,
          itensComSlide: novosItensComSlide,
        };
        setProjectionState(novoEstado);
        updateState(novoEstado);
        salvarEstadoLocalStorage(roteiroId, novoEstado);
      }
    }
  }, [itens, updateState, roteiroId]);

  return {
    projectionState,
    currentSlide,
    isConnected,
    navigateNext,
    navigatePrev,
    jumpToItem,
  };
}
