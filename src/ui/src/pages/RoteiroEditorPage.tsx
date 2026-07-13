import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  buscarRoteiroPorId,
  Roteiro,
  ItemRoteiro,
  listarItens,
  ItemColetanea,
  adicionarItemAoRoteiro,
  criarItemAdHoc,
  removerItemDoRoteiro,
  reordenarItens,
  atualizarItemRoteiro,
  ItemType,
  BlockType
} from '../services/api';
import Layout from '../components/Layout';

export function RoteiroEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [itensCatalogo, setItensCatalogo] = useState<ItemColetanea[]>([]);
  const [buscaCatalogo, setBuscaCatalogo] = useState('');
  const [showModalCatalogo, setShowModalCatalogo] = useState(false);

  const [showFormAdHoc, setShowFormAdHoc] = useState(false);
  const [adHocTitulo, setAdHocTitulo] = useState('');
  const [adHocTipo, setAdHocTipo] = useState<ItemType>(ItemType.Aviso);
  const [adHocConteudo, setAdHocConteudo] = useState('');

  const [momentoEditando, setMomentoEditando] = useState<number | null>(null);
  const [valorMomento, setValorMomento] = useState('');

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
      await adicionarItemAoRoteiro(parseInt(id), { item_coletanea_id: itemColetaneaId });
      setShowModalCatalogo(false);
      setBuscaCatalogo('');
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const handleCriarAdHoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !adHocTitulo.trim() || !adHocConteudo.trim()) return;

    try {
      await criarItemAdHoc(parseInt(id), {
        titulo: adHocTitulo.trim(),
        tipo: adHocTipo,
        blocos: [{ tipo: BlockType.Paragrafo, conteudo: adHocConteudo.trim() }]
      });
      setShowFormAdHoc(false);
      setAdHocTitulo('');
      setAdHocConteudo('');
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

  const handleSalvarMomento = async (itemId: number) => {
    if (!id) return;
    try {
      await atualizarItemRoteiro(parseInt(id), itemId, {
        momento_liturgico: valorMomento || null
      });
      setMomentoEditando(null);
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao salvar momento:', error);
    }
  };

  const handleToggleMarcaAgua = async (itemId: number, marcaAguaAtiva: boolean) => {
    if (!id) return;
    try {
      await atualizarItemRoteiro(parseInt(id), itemId, {
        marca_agua_ativa: !marcaAguaAtiva
      });
      await carregarRoteiro();
    } catch (error) {
      console.error('Erro ao atualizar marca d\'água:', error);
    }
  };

  const abrirModalCatalogo = () => {
    setShowModalCatalogo(true);
    carregarItensCatalogo();
  };

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
      <div className="editor-page">
        <div className="editor-header">
          <div>
            <Link to="/roteiros" className="voltar-link">
              ← Voltar para Roteiros
            </Link>
            <h1>{roteiro.titulo}</h1>
            {roteiro.data_celebracao && (
              <p className="data-celebracao">{roteiro.data_celebracao}</p>
            )}
          </div>
          <div className="editor-acoes">
            <button onClick={abrirModalCatalogo} className="btn btn-primary">
              Adicionar do Catálogo
            </button>
            <button onClick={() => setShowFormAdHoc(true)} className="btn btn-secondary">
              Criar Ad-Hoc
            </button>
          </div>
        </div>

        {showFormAdHoc && (
          <div className="modal-overlay" onClick={() => setShowFormAdHoc(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Criar Item Ad-Hoc</h2>
              <form onSubmit={handleCriarAdHoc}>
                <div className="form-grupo">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={adHocTitulo}
                    onChange={(e) => setAdHocTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="form-grupo">
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
                <div className="form-grupo">
                  <label>Conteúdo *</label>
                  <textarea
                    value={adHocConteudo}
                    onChange={(e) => setAdHocConteudo(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div className="modal-acoes">
                  <button
                    type="button"
                    onClick={() => setShowFormAdHoc(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Criar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModalCatalogo && (
          <div className="modal-overlay" onClick={() => setShowModalCatalogo(false)}>
            <div className="modal modal-grande" onClick={(e) => e.stopPropagation()}>
              <h2>Adicionar do Catálogo</h2>
              <input
                type="text"
                placeholder="Buscar itens..."
                value={buscaCatalogo}
                onChange={(e) => {
                  setBuscaCatalogo(e.target.value);
                  carregarItensCatalogo();
                }}
                className="busca-input"
              />
              <div className="lista-itens-catalogo">
                {itensCatalogo.map((item) => (
                  <div key={item.id} className="item-catalogo">
                    <div>
                      <strong>{item.titulo}</strong>
                      <span className="tipo-badge">{item.tipo}</span>
                    </div>
                    <button
                      onClick={() => handleAdicionarDoCatalogo(item.id)}
                      className="btn btn-small btn-primary"
                    >
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-acoes">
                <button
                  onClick={() => setShowModalCatalogo(false)}
                  className="btn btn-secondary"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="lista-itens-roteiro">
          {roteiro.itens.length === 0 ? (
            <div className="lista-vazia">
              <p>Nenhum item no roteiro. Adicione itens do catálogo ou crie itens ad-hoc.</p>
            </div>
          ) : (
            <table className="tabela">
              <thead>
                <tr>
                  <th width="50">#</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Momento</th>
                  <th>Marca d'Água</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {roteiro.itens.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.posicao}</td>
                    <td>{item.titulo_snapshot}</td>
                    <td>
                      <span className="tipo-badge">{item.tipo_snapshot}</span>
                      {item.is_ad_hoc && <span className="ad-hoc-badge">Ad-Hoc</span>}
                    </td>
                    <td>
                      {momentoEditando === item.id ? (
                        <div className="inline-form">
                          <select
                            value={valorMomento}
                            onChange={(e) => setValorMomento(e.target.value)}
                          >
                            <option value="">Nenhum</option>
                            <option value="Entrada">Entrada</option>
                            <option value="Ofertório">Ofertório</option>
                            <option value="Comunhão">Comunhão</option>
                            <option value="Preparação">Preparação</option>
                            <option value="Ato Penitencial">Ato Penitencial</option>
                            <option value="Aclamação">Aclamação</option>
                            <option value="Oração dos Fiéis">Oração dos Fiéis</option>
                            <option value="Outro">Outro</option>
                          </select>
                          <button
                            onClick={() => handleSalvarMomento(item.id)}
                            className="btn btn-small btn-primary"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setMomentoEditando(null)}
                            className="btn btn-small"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => {
                            setMomentoEditando(item.id);
                            setValorMomento(item.momento_liturgico || '');
                          }}
                          className="editar-link"
                        >
                          {item.momento_liturgico || '-'}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleMarcaAgua(item.id, item.marca_agua_ativa)}
                        className={`toggle-btn ${item.marca_agua_ativa ? 'ativo' : ''}`}
                      >
                        {item.marca_agua_ativa ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td>
                      <div className="acoes">
                        <button
                          onClick={() => handleMover(item.id, 'cima')}
                          disabled={index === 0}
                          className="btn btn-small"
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMover(item.id, 'baixo')}
                          disabled={index === roteiro.itens.length - 1}
                          className="btn btn-small"
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoverItem(item.id)}
                          className="btn btn-small btn-danger"
                          title="Remover"
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
