import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjection } from '../hooks/useProjection';
import { abrirProjecao } from '../services/projector';
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
  tituloSnapshot: string;
  tipoSnapshot: string;
  momentoLiturgico?: string | null;
  marcaAguaAtiva: boolean;
  blocos: ItemRoteiroBloco[];
}

interface Roteiro {
  id: number;
  titulo: string;
  descricao?: string | null;
  dataCelebracao?: string | null;
  itens: ItemRoteiro[];
}

export function PlayModePage() {
  const { id } = useParams<{ id: string }>();
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [buscaAcervo, setBuscaAcervo] = useState('');

  const carregarRoteiro = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/roteiros/${id}`);
      if (!response.ok) throw new Error('Erro ao carregar roteiro');
      const dados = await response.json();
      setRoteiro(dados);
    } catch (error) {
      console.error('Erro ao carregar roteiro:', error);
      setErro('Erro ao carregar roteiro');
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarRoteiro();
  }, [carregarRoteiro]);

  const { projectionState, currentSlide, isConnected, navigateNext, navigatePrev, jumpToItem } = useProjection({
    roteiroId: parseInt(id || '0'),
    itens: roteiro?.itens.map(item => ({
      id: item.id,
      blocos: item.blocos,
      marcaAguaAtiva: item.marcaAguaAtiva,
    })) || [],
  });

  const handleOpenProjector = () => {
    if (id) {
      abrirProjecao(parseInt(id));
    }
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        navigateNext();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        navigatePrev();
        break;
    }
  }, [navigateNext, navigatePrev]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (carregando) {
    return (
      <div className="play-mode-page">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (erro || !roteiro) {
    return (
      <div className="play-mode-page">
        <div className="error-message">{erro || 'Roteiro nao encontrado'}</div>
      </div>
    );
  }

  const itensFiltrados = roteiro.itens.filter(item =>
    item.tituloSnapshot.toLowerCase().includes(buscaAcervo.toLowerCase())
  );

  return (
    <div className="play-mode-page">
      <div className="play-header">
        <div>
          <Link to={`/roteiros/${id}`} className="voltar-link">
            ← Voltar para Editor
          </Link>
          <h1>{roteiro.titulo}</h1>
        </div>
        <div className="play-acoes">
          <button onClick={handleOpenProjector} className="button">
            Abrir Projetor
          </button>
          <span className={`status-conexao ${isConnected ? 'conectado' : 'desconectado'}`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      <div className="play">
        <div className="play-grid">
          <div className="play-column">
            <div className="column-title">
              <span>Acervo</span>
            </div>
            <input
              type="text"
              placeholder="Buscar itens..."
              value={buscaAcervo}
              onChange={(e) => setBuscaAcervo(e.target.value)}
              className="search compact-search"
            />
            <div>
              {itensFiltrados.map((item) => (
                <button
                  key={item.id}
                  className={`mini-item ${projectionState?.itemRoteiroId === item.id ? 'active' : ''}`}
                  onClick={() => jumpToItem(item.id)}
                >
                  <strong>{item.tituloSnapshot}</strong>
                  <span>{item.tipoSnapshot} · {item.blocos.length} slide(s)</span>
                </button>
              ))}
            </div>
          </div>

          <div className="play-column">
            <div className="column-title">
              <span>Roteiro</span>
              <span style={{ fontSize: '12px', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                {roteiro.itens.length} itens
              </span>
            </div>
            <div>
              {roteiro.itens.map((item) => (
                <button
                  key={item.id}
                  className={`mini-item ${projectionState?.itemRoteiroId === item.id ? 'active' : ''}`}
                  onClick={() => jumpToItem(item.id)}
                >
                  <strong>{item.tituloSnapshot}</strong>
                  <span>
                    {item.tipoSnapshot}
                    {item.momentoLiturgico && ` · ${item.momentoLiturgico}`}
                    {' · '}{item.blocos.length} slide(s)
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="play-column">
            <div className="column-title">
              <span>Preview</span>
            </div>
            <div className="play-preview">
              {currentSlide ? (
                <div className="slide-preview">
                  <div className="slide-text">
                    {currentSlide.conteudo}
                  </div>
                  {currentSlide.marcaAguaAtiva && (
                    <div className="watermark">Marca d'Agua</div>
                  )}
                  <div className="pagination">
                    {currentSlide.indice}/{currentSlide.total}
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--muted)', textAlign: 'center' }}>
                  Selecione um item no roteiro para visualizar
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="play-status">
          <div className="current">
            EM EXIBICAO · <strong>{roteiro.itens.find(i => i.id === projectionState?.itemRoteiroId)?.tituloSnapshot || 'Nenhum item'}</strong>
            {projectionState && (
              <> · Slide {projectionState.slideIndice} / {projectionState.totalSlides}</>
            )}
          </div>
          <div className="keyboard">
            <span className="key">←</span>
            <span className="key">→</span>
            <span>para navegar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
