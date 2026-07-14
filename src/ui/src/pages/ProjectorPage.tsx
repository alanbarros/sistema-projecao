import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProjection } from '../hooks/useProjection';
import { PROJECTION_DEFAULTS } from 'shared';
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

interface Roteiro {
  id: number;
  titulo: string;
  itens: ItemRoteiro[];
}

export function ProjectorPage() {
  const { roteiroId } = useParams<{ roteiroId: string }>();
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarRoteiro = useCallback(async () => {
    if (!roteiroId) return;
    try {
      const response = await fetch(`/api/roteiros/${roteiroId}`);
      if (!response.ok) throw new Error('Erro ao carregar roteiro');
      const dados = await response.json();
      setRoteiro(dados);
    } catch (error) {
      console.error('Erro ao carregar roteiro:', error);
      setErro('Erro ao carregar roteiro');
    } finally {
      setCarregando(false);
    }
  }, [roteiroId]);

  useEffect(() => {
    carregarRoteiro();
  }, [carregarRoteiro]);

  const { currentSlide } = useProjection({
    roteiroId: parseInt(roteiroId || '0'),
    itens: roteiro?.itens || [],
  });

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F11') {
      e.preventDefault();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    document.documentElement.requestFullscreen();
  }, []);

  if (carregando) {
    return (
      <div className="projector-loading">
        <div>Carregando...</div>
      </div>
    );
  }

  if (erro || !roteiro) {
    return (
      <div className="projector-error">
        <div>{erro || 'Roteiro não encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="projector-page">
      {currentSlide ? (
        <>
          <div className="projector-conteudo">
            {currentSlide.conteudo}
          </div>
          
          {currentSlide.marcaAguaAtiva && (
            <div 
              className="projector-marca-agua"
              style={{ opacity: PROJECTION_DEFAULTS.WATERMARK_OPACITY }}
            >
              Marca d'Água
            </div>
          )}
          
          <div className="projector-paginacao">
            {currentSlide.indice}/{currentSlide.total}
          </div>
        </>
      ) : (
        <div className="projector-empty">
          Aguardando slide...
        </div>
      )}
    </div>
  );
}