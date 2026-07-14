import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listarRoteiros, Roteiro } from '../services/api';
import { Layout } from '../components/Layout';

export function RoteirosPage() {
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);

  const carregarRoteiros = useCallback(async () => {
    setCarregando(true);
    try {
      const resultado = await listarRoteiros({
        q: busca || undefined,
        offset,
        limit
      });
      setRoteiros(resultado.roteiros);
      setTotal(resultado.total);
    } catch (error) {
      console.error('Erro ao carregar roteiros:', error);
    } finally {
      setCarregando(false);
    }
  }, [busca, offset, limit]);

  useEffect(() => {
    carregarRoteiros();
  }, [carregarRoteiros]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    carregarRoteiros();
  };

  const totalPaginas = Math.ceil(total / limit);

  const formatarData = (data: string | null | undefined) => {
    if (!data) return null;
    const d = new Date(data + 'T00:00:00');
    const dia = d.getDate();
    const mes = d.toLocaleDateString('pt-BR', { month: 'short' });
    const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'short' });
    return { dia, mes, diaSemana };
  };

  return (
    <Layout pageTitle="Celebracoes">
      <div className="page-head">
        <div>
          <p className="eyebrow">Roteiros</p>
          <h2>Celebracoes</h2>
          <p>Gerencie os roteiros das celebracoes</p>
        </div>
        <Link to="/roteiros/novo" className="button">
          Nova Celebracao
        </Link>
      </div>

      <div className="card">
        <div className="toolbar">
          <form onSubmit={handleBusca} style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input
              type="text"
              placeholder="Buscar celebracoes..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="search"
            />
            <button type="submit" className="button secondary">
              Buscar
            </button>
          </form>
        </div>

        {carregando ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <div className="route-list">
              {roteiros.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhuma celebracao encontrada.</p>
                </div>
              ) : (
                roteiros.map((roteiro) => {
                  const data = formatarData(roteiro.dataCelebracao);
                  return (
                    <Link
                      to={`/roteiros/${roteiro.id}`}
                      key={roteiro.id}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="card route-card">
                        {data ? (
                          <div className="route-date">
                            <span>{data.diaSemana}</span>
                            <strong>{data.dia}</strong>
                          </div>
                        ) : (
                          <div className="route-date">
                            <span>--</span>
                            <strong>--</strong>
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <h3>{roteiro.titulo}</h3>
                          <p>
                            {roteiro.dataCelebracao || 'Sem data definida'}
                            {roteiro.descricao ? ` · ${roteiro.descricao}` : ''}
                          </p>
                        </div>
                        <span className="arrow">→</span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {totalPaginas > 1 && (
              <div className="paginacao">
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="button secondary"
                >
                  Anterior
                </button>
                <span className="pagina-info">
                  Pagina {Math.floor(offset / limit) + 1} de {totalPaginas}
                </span>
                <button
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                  className="button secondary"
                >
                  Proxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
