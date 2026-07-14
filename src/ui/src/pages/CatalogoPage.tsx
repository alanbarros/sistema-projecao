import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { listarItens, excluirItem, ItemColetanea, ItemType, ITEM_TYPES } from '../services/api'

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

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) {
      return
    }
    
    try {
      await excluirItem(id)
      carregarItens()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir item')
    }
  }

  const totalPaginas = Math.ceil(total / limit)
  const paginaAtual = Math.floor(offset / limit) + 1

  return (
    <div className="catalogo-page">
      <div className="page-header">
        <h1>Catálogo de Itens</h1>
        <div className="header-actions">
          <Link to="/roteiros" className="btn btn-secondary">
            Roteiros
          </Link>
          <Link to="/novo" className="btn btn-primary">
            Novo Item
          </Link>
        </div>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por título ou conteúdo..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setOffset(0)
          }}
          className="input-busca"
        />
        
        <select
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value as ItemType | '')
            setOffset(0)
          }}
          className="select-tipo"
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
          <Link to="/novo" className="btn btn-primary">
            Criar primeiro item
          </Link>
        </div>
      ) : (
        <>
          <div className="lista-itens">
            {itens.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-info">
                  <h3>{item.titulo}</h3>
                  <span className={`item-tipo tipo-${item.tipo.toLowerCase()}`}>
                    {item.tipo}
                  </span>
                  <p className="item-blocos">
                    {item.blocos?.length || 0} bloco(s)
                  </p>
                </div>
                <div className="item-actions">
                  <Link to={`/editar/${item.id}`} className="btn btn-secondary">
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleExcluir(item.id)}
                    className="btn btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="paginacao">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="btn"
            >
              Anterior
            </button>
            
            <span className="pagina-info">
              Página {paginaAtual} de {totalPaginas} ({total} itens)
            </span>
            
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
              className="btn"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  )
}
