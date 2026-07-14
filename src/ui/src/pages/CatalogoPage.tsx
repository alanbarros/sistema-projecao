import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { listarItens, ItemColetanea, ItemType, ITEM_TYPES } from '../services/api'
import { Layout } from '../components/Layout'

export function CatalogoPage() {
  const [itens, setItens] = useState<ItemColetanea[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<ItemType | ''>('')
  const [offset, setOffset] = useState(0)
  const limit = 20

  const carregarItens = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const resultado = await listarItens({
        q: busca || undefined,
        tipo: filtroTipo as ItemType || undefined,
        offset,
        limit
      })
      
      setItens(resultado.itens)
      setTotal(resultado.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar itens')
    } finally {
      setLoading(false)
    }
  }, [busca, filtroTipo, offset])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      carregarItens()
    }, 300)
    
    return () => clearTimeout(debounceTimer)
  }, [carregarItens])

  const totalPaginas = Math.ceil(total / limit)
  const paginaAtual = Math.floor(offset / limit) + 1

  return (
    <Layout pageTitle="Catalogo de Itens">
      <div className="page-head">
        <div>
          <p className="eyebrow">Acervo</p>
          <h2>Catalogo de Itens</h2>
          <p>Gerencie musicas, oracoes e textos liturgicos</p>
        </div>
        <Link to="/novo" className="button">
          Novo Item
        </Link>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Buscar por titulo ou conteudo..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setOffset(0)
            }}
            className="search"
          />
          
          <select
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value as ItemType | '')
              setOffset(0)
            }}
          >
            <option value="">Todos os tipos</option>
            {ITEM_TYPES.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : itens.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum item encontrado</p>
            <Link to="/novo" className="button">
              Criar primeiro item
            </Link>
          </div>
        ) : (
          <>
            <div className="collection">
              {itens.map(item => (
                <Link
                  to={`/editar/${item.id}`}
                  key={item.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card item-card">
                    <span className="tag">{item.tipo}</span>
                    <h3>{item.titulo}</h3>
                    <p>{item.blocos?.[0]?.conteudo?.substring(0, 80) || 'Sem conteudo'}...</p>
                    <div className="item-meta">
                      <span>{item.blocos?.length || 0} bloco(s)</span>
                      <span>Editar →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="paginacao">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="button secondary"
              >
                Anterior
              </button>
              
              <span className="pagina-info">
                Pagina {paginaAtual} de {totalPaginas} ({total} itens)
              </span>
              
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
                className="button secondary"
              >
                Proxima
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
