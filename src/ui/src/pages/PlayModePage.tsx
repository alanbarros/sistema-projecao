import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useProjection } from '../hooks/useProjection';
import { SlidePreview } from '../components/SlidePreview';
import { ProjectionStatusBar } from '../components/ProjectionStatusBar';
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
  const [activeTab, setActiveTab] = useState<'acervo' | 'roteiro' | 'preview'>('roteiro');

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
      <Layout>
        <div className="carregando">Carregando...</div>
      </Layout>
    );
  }

  if (erro || !roteiro) {
    return (
      <Layout>
        <div className="erro">{erro || 'Roteiro não encontrado'}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="play-mode-page">
        <div className="play-header">
          <div>
            <Link to={`/roteiros/${id}`} className="voltar-link">
              ← Voltar para Editor
            </Link>
            <h1>Modo Play: {roteiro.titulo}</h1>
          </div>
          <div className="play-acoes">
            <button onClick={handleOpenProjector} className="btn btn-primary">
              Abrir Projetor
            </button>
            <span className={`status-conexao ${isConnected ? 'conectado' : 'desconectado'}`}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="play-tabs">
          <button
            className={`tab ${activeTab === 'acervo' ? 'active' : ''}`}
            onClick={() => setActiveTab('acervo')}
          >
            Acervo
          </button>
          <button
            className={`tab ${activeTab === 'roteiro' ? 'active' : ''}`}
            onClick={() => setActiveTab('roteiro')}
          >
            Roteiro
          </button>
          <button
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        <div className="play-content">
          {activeTab === 'acervo' && (
            <div className="acervo-panel">
              <h2>Acervo</h2>
              <input
                type="text"
                placeholder="Buscar itens..."
                className="busca-input"
              />
              <div className="lista-itens-catalogo">
                <p>Itens do catálogo disponíveis para adição ao roteiro</p>
              </div>
            </div>
          )}

          {activeTab === 'roteiro' && (
            <div className="roteiro-panel">
              <h2>Itens do Roteiro</h2>
              <div className="lista-itens-roteiro">
                {roteiro.itens.map((item) => (
                  <div
                    key={item.id}
                    className={`item-roteiro ${projectionState?.itemRoteiroId === item.id ? 'ativo' : ''}`}
                    onClick={() => jumpToItem(item.id)}
                  >
                    <span className="item-titulo">{item.tituloSnapshot}</span>
                    <span className="item-tipo">{item.tipoSnapshot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="preview-panel">
              {currentSlide ? (
                <SlidePreview slide={currentSlide} />
              ) : (
                <div className="preview-vazio">
                  Selecione um item no roteiro para visualizar
                </div>
              )}
            </div>
          )}
        </div>

        {projectionState && (
          <ProjectionStatusBar
            titulo={roteiro.itens.find(i => i.id === projectionState.itemRoteiroId)?.tituloSnapshot || ''}
            slideAtual={projectionState.slideIndice}
            totalSlides={projectionState.totalSlides}
          />
        )}
      </div>
    </Layout>
  );
}