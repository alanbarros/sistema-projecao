import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  buscarRoteiroPorId,
  Roteiro,
  listarItens,
  ItemColetanea,
  adicionarItemAoRoteiro,
  criarItemAdHoc,
  removerItemDoRoteiro,
  reordenarItens,
  atualizarItemRoteiro,
  ItemType,
  BlockType,
} from '../services/api';
import { Layout } from '../components/Layout';
import { BlocoEditor, BlocoForm } from '../components/BlocoEditor';
import { Toast } from '../components/Toast';
import { ModalSalvarNoCatalogo } from '../components/ModalSalvarNoCatalogo';

export function RoteiroEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [itensCatalogo, setItensCatalogo] = useState<ItemColetanea[]>([]);
  const [buscaCatalogo, setBuscaCatalogo] = useState('');
  const [showModalCatalogo, setShowModalCatalogo] = useState(false);

  const [showFormAdHoc, setShowFormAdHoc] = useState(false);
  const [adHocTitulo, setAdHocTitulo] = useState('');
  const [adHocTipo, setAdHocTipo] = useState<ItemType>(ItemType.Aviso);
  const [adHocBlocos, setAdHocBlocos] = useState<BlocoForm[]>([
    { tipo: BlockType.Paragrafo, conteudo: '' }
  ]);

  const [editandoItem, setEditandoItem] = useState<number | null>(null);
  const [editBlocos, setEditBlocos] = useState<BlocoForm[]>([]);

  const [salvandoItem, setSalvandoItem] = useState<number | null>(null);
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);

  const carregarRoteiro = useCallback(async () => {
    if (!id) return;
    try {
      const dados = await buscarRoteiroPorId(parseInt(id));
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

  const carregarItensCatalogo = async () => {
    try {
      const resultado = await listarItens({ q: buscaCatalogo || undefined, limit: 50 });
      setItensCatalogo(resultado.itens);
    } catch (error) {
      console.error('Erro ao carregar itens do catálogo:', error);
    }
  };

  const handleAdicionarDoCatalogo = async (itemColetaneaId: number) => {
    if (!id) return;
    try {
      await adicionarItemAoRoteiro(parseInt(id), { itemColetaneaId });
      setShowModalCatalogo(false);
      setBuscaCatalogo('');
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const handleCriarAdHoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !adHocTitulo.trim()) return;

    const blocosValidos = adHocBlocos.filter(b => b.conteudo.trim());
    if (blocosValidos.length === 0) return;

    try {
      await criarItemAdHoc(parseInt(id), {
        titulo: adHocTitulo.trim(),
        tipo: adHocTipo,
        blocos: blocosValidos.map(b => ({ tipo: b.tipo, conteudo: b.conteudo.trim() }))
      });
      setShowFormAdHoc(false);
      setAdHocTitulo('');
      setAdHocBlocos([{ tipo: BlockType.Paragrafo, conteudo: '' }]);
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao criar item ad-hoc:', error);
    }
  };

  const handleRemoverItem = async (itemId: number) => {
    if (!id || !confirm('Tem certeza que deseja remover este item?')) return;
    try {
      await removerItemDoRoteiro(parseInt(id), itemId);
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const handleMover = async (itemId: number, direcao: 'cima' | 'baixo') => {
    if (!roteiro) return;
    const itens = [...roteiro.itens];
    const index = itens.findIndex(i => i.id === itemId);
    
    if (direcao === 'cima' && index > 0) {
      [itens[index - 1], itens[index]] = [itens[index], itens[index - 1]];
    } else if (direcao === 'baixo' && index < itens.length - 1) {
      [itens[index], itens[index + 1]] = [itens[index + 1], itens[index]];
    } else {
      return;
    }

    const novosIds = itens.map(i => i.id);
    try {
      await reordenarItens(parseInt(id!), novosIds);
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao reordenar:', error);
    }
  };

  const handleToggleMarcaAgua = async (itemId: number, marcaAguaAtiva: boolean) => {
    if (!id) return;
    try {
      await atualizarItemRoteiro(parseInt(id), itemId, {
        marcaAguaAtiva: !marcaAguaAtiva
      });
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao atualizar marca d\'água:', error);
    }
  };

  const abrirEdicaoBlocos = (itemId: number) => {
    const item = roteiro?.itens.find(i => i.id === itemId);
    if (!item) return;
    setEditandoItem(itemId);
    setEditBlocos(item.blocos.map(b => ({ tipo: b.tipo, conteudo: b.conteudo })));
  };

  const handleSalvarBlocos = async () => {
    if (!id || editandoItem === null) return;
    try {
      await atualizarItemRoteiro(parseInt(id), editandoItem, {
        blocos: editBlocos.map(b => ({ tipo: b.tipo, conteudo: b.conteudo.trim() }))
      });
      setEditandoItem(null);
      setEditBlocos([]);
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao salvar blocos:', error);
    }
  };

  const abrirModalCatalogo = () => {
    setShowModalCatalogo(true);
    carregarItensCatalogo();
  };

  if (carregando) {
    return (
      <Layout pageTitle="Carregando...">
        <div className="loading">Carregando...</div>
      </Layout>
    );
  }

  if (erro || !roteiro) {
    return (
      <Layout pageTitle="Erro">
        <div className="error-message">{erro || 'Roteiro não encontrado'}</div>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle={roteiro.titulo}
      breadcrumb={[
        { label: 'Celebracoes', to: '/roteiros' },
        { label: roteiro.titulo }
      ]}
    >
      <div className="page-head">
        <div>
          <p className="eyebrow">Editor de Roteiro</p>
          <h2>{roteiro.titulo}</h2>
          {roteiro.dataCelebracao && (
            <p>{roteiro.dataCelebracao}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate(`/roteiros/${id}/play`)} className="button">
            Iniciar Play
          </button>
          <button onClick={abrirModalCatalogo} className="button secondary">
            Adicionar do Catalogo
          </button>
          <button onClick={() => setShowFormAdHoc(true)} className="button ghost">
            Criar Ad-Hoc
          </button>
        </div>
      </div>

      {showFormAdHoc && (
        <div className="modal-overlay" onClick={() => setShowFormAdHoc(false)}>
          <div className="modal modal-grande" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Item Ad-Hoc</h2>
            <form onSubmit={handleCriarAdHoc}>
              <div className="field">
                <label>Titulo *</label>
                <input
                  type="text"
                  value={adHocTitulo}
                  onChange={(e) => setAdHocTitulo(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Tipo *</label>
                <select
                  value={adHocTipo}
                  onChange={(e) => setAdHocTipo(e.target.value as ItemType)}
                >
                  {Object.values(ItemType).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Conteúdo *</label>
                <BlocoEditor
                  blocos={adHocBlocos}
                  onChange={setAdHocBlocos}
                />
              </div>
              <div className="modal-acoes">
                <button
                  type="button"
                  onClick={() => setShowFormAdHoc(false)}
                  className="button secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="button">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editandoItem !== null && (
        <div className="modal-overlay" onClick={() => setEditandoItem(null)}>
          <div className="modal modal-grande" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Blocos</h2>
            <BlocoEditor
              blocos={editBlocos}
              onChange={setEditBlocos}
            />
            <div className="modal-acoes">
              <button
                type="button"
                onClick={() => setEditandoItem(null)}
                className="button secondary"
              >
                Cancelar
              </button>
              <button type="button" onClick={handleSalvarBlocos} className="button">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalCatalogo && (
        <div className="modal-overlay" onClick={() => setShowModalCatalogo(false)}>
          <div className="modal modal-grande" onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar do Catalogo</h2>
            <input
              type="text"
              placeholder="Buscar itens..."
              value={buscaCatalogo}
              onChange={(e) => {
                setBuscaCatalogo(e.target.value);
                carregarItensCatalogo();
              }}
              className="search"
              style={{ maxWidth: '100%', marginBottom: '16px' }}
            />
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {itensCatalogo.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderBottom: '1px solid var(--line)'
                }}>
                  <div>
                    <strong>{item.titulo}</strong>
                    <span className="tag" style={{ marginLeft: '8px' }}>{item.tipo}</span>
                  </div>
                  <button
                    onClick={() => handleAdicionarDoCatalogo(item.id)}
                    className="button"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-acoes">
              <button
                onClick={() => setShowModalCatalogo(false)}
                className="button secondary"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="route-layout">
        <div className="card sequence">
          {roteiro.itens.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum item no roteiro. Adicione itens do catalogo ou crie itens ad-hoc.</p>
            </div>
          ) : (
            roteiro.itens.map((item, index) => (
              <div key={item.id} className="route-item">
                <span className="position">{item.posicao}</span>
                <div style={{ minWidth: 0 }}>
                  <h3>{item.tituloSnapshot}</h3>
                  <p>
                    <span className="tag" style={{ marginRight: '6px' }}>{item.tipoSnapshot}</span>
                    {item.isAdHoc && <span className="origin">Ad-Hoc</span>}
                    {item.momentoLiturgico && (
                      <span style={{ marginLeft: '6px', color: 'var(--muted)' }}>
                        · {item.momentoLiturgico}
                      </span>
                    )}
                  </p>
                </div>
                <div className="route-actions">
                  {item.isAdHoc && (
                    <button
                      onClick={() => setSalvandoItem(item.id)}
                      className="icon-button"
                      title="Salvar no catálogo"
                    >
                      💾
                    </button>
                  )}
                  <button
                    onClick={() => abrirEdicaoBlocos(item.id)}
                    className="icon-button"
                    title="Editar blocos"
                  >
                    ✎
                  </button>
                  <label className="checkbox-label" title="Marca d'Agua">
                    <input
                      type="checkbox"
                      checked={item.marcaAguaAtiva}
                      onChange={() => handleToggleMarcaAgua(item.id, item.marcaAguaAtiva)}
                    />
                  </label>
                  <button
                    onClick={() => handleMover(item.id, 'cima')}
                    disabled={index === 0}
                    className="icon-button"
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMover(item.id, 'baixo')}
                    disabled={index === roteiro.itens.length - 1}
                    className="icon-button"
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleRemoverItem(item.id)}
                    className="icon-button"
                    style={{ color: 'var(--coral)' }}
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card add-panel">
          <h3>Adicionar Item</h3>
          <p className="hint">
            Selecione um item do catalogo ou crie um item ad-hoc para adicionar ao roteiro.
          </p>
          <button onClick={abrirModalCatalogo} className="button" style={{ width: '100%' }}>
            Buscar no Catalogo
          </button>
          <button onClick={() => setShowFormAdHoc(true)} className="button secondary" style={{ width: '100%' }}>
            Criar Item Ad-Hoc
          </button>
        </div>
      </div>

      {salvandoItem !== null && (() => {
        const item = roteiro.itens.find(i => i.id === salvandoItem);
        if (!item) return null;
        return (
          <ModalSalvarNoCatalogo
            roteiroId={parseInt(id!)}
            itemId={item.id}
            tituloInicial={item.tituloSnapshot}
            tipoInicial={item.tipoSnapshot}
            blocos={item.blocos}
            onSucesso={() => {
              setSalvandoItem(null);
              setToastMensagem('Salvo no catálogo!');
              carregarRoteiro();
            }}
            onFechar={() => setSalvandoItem(null)}
          />
        );
      })()}

      {toastMensagem && (
        <Toast mensagem={toastMensagem} onFechar={() => setToastMensagem(null)} />
      )}
    </Layout>
  );
}
