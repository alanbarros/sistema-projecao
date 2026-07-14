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

  return (
    <Layout>
      <div className="catalogo-page">
        <div className="catalogo-header">
          <h1>Roteiros</h1>
          <div className="header-actions">
            <Link to="/" className="btn btn-secondary">
              Catálogo
            </Link>
            <Link to="/roteiros/novo" className="btn btn-primary">
              Novo Roteiro
            </Link>
          </div>
        </div>

        <div className="catalogo-filtros">
          <form onSubmit={handleBusca} className="busca-form">
            <input
              type="text"
              placeholder="Buscar roteiros..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="busca-input"
            />
            <button type="submit" className="btn btn-secondary">
              Buscar
            </button>
          </form>
        </div>

        {carregando ? (
          <div className="carregando">Carregando...</div>
        ) : (
          <>
            <div className="catalogo-lista">
              {roteiros.length === 0 ? (
                <div className="lista-vazia">
                  <p>Nenhum roteiro encontrado.</p>
                </div>
              ) : (
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roteiros.map((roteiro) => (
                      <tr key={roteiro.id}>
                        <td>{roteiro.titulo}</td>
                        <td>{roteiro.dataCelebracao || '-'}</td>
                        <td>
                          <div className="acoes">
                            <Link
                              to={`/roteiros/${roteiro.id}`}
                              className="btn btn-small"
                            >
                              Editar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {totalPaginas > 1 && (
              <div className="paginacao">
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="btn btn-secondary"
                >
                  Anterior
                </button>
                <span className="paginacao-info">
                  Página {Math.floor(offset / limit) + 1} de {totalPaginas}
                </span>
                <button
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                  className="btn btn-secondary"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
