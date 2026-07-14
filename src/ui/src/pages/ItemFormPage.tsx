import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { criarItem, atualizarItem, buscarItemPorId, ITEM_TYPES, BLOCK_TYPES, ItemType, BlockType } from '../services/api'
import { Layout } from '../components/Layout'

interface BlocoForm {
  tipo: BlockType
  conteudo: string
}

export function ItemFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<ItemType>(ItemType.Canto)
  const [blocos, setBlocos] = useState<BlocoForm[]>([
    { tipo: BlockType.Estrofe, conteudo: '' }
  ])
  
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && id) {
      buscarItemPorId(parseInt(id))
        .then(item => {
          setTitulo(item.titulo)
          setTipo(item.tipo)
          setBlocos(item.blocos.map(b => ({
            tipo: b.tipo,
            conteudo: b.conteudo
          })))
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Erro ao carregar item')
        })
        .finally(() => {
          setLoadingData(false)
        })
    }
  }, [id, isEditing])

  const validar = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!titulo.trim()) {
      newErrors.titulo = 'Titulo e obrigatorio'
    } else if (titulo.length > 255) {
      newErrors.titulo = 'Titulo deve ter no maximo 255 caracteres'
    }
    
    if (blocos.length === 0) {
      newErrors.blocos = 'Deve haver pelo menos um bloco'
    } else {
      blocos.forEach((bloco, index) => {
        if (!bloco.conteudo.trim()) {
          newErrors[`bloco_${index}_conteudo`] = 'Conteudo do bloco e obrigatorio'
        }
      })
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validar()) {
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const dados = {
        titulo: titulo.trim(),
        tipo,
        blocos: blocos.map((b) => ({
          tipo: b.tipo,
          conteudo: b.conteudo.trim()
        }))
      }
      
      if (isEditing && id) {
        await atualizarItem(parseInt(id), dados)
      } else {
        await criarItem(dados)
      }
      
      navigate('/')
    } catch (err) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message)
          setError(parsed.error)
          if (parsed.details) {
            const newErrors: Record<string, string> = {}
            parsed.details.forEach((d: any) => {
              newErrors[d.field] = d.message
            })
            setErrors(newErrors)
          }
        } catch {
          setError(err.message)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const adicionarBloco = () => {
    setBlocos([...blocos, { tipo: BlockType.Estrofe, conteudo: '' }])
  }

  const removerBloco = (index: number) => {
    if (blocos.length === 1) {
      return
    }
    setBlocos(blocos.filter((_, i) => i !== index))
  }

  const atualizarBloco = (index: number, campo: keyof BlocoForm, valor: string) => {
    const novosBlocos = [...blocos]
    novosBlocos[index] = { ...novosBlocos[index], [campo]: valor }
    setBlocos(novosBlocos)
  }

  const moverBloco = (index: number, direcao: -1 | 1) => {
    const newIndex = index + direcao
    if (newIndex < 0 || newIndex >= blocos.length) {
      return
    }
    
    const novosBlocos = [...blocos]
    const temp = novosBlocos[index]
    novosBlocos[index] = novosBlocos[newIndex]
    novosBlocos[newIndex] = temp
    setBlocos(novosBlocos)
  }

  const preview_blocos = blocos.filter(b => b.conteudo.trim())

  if (loadingData) {
    return (
      <Layout pageTitle="Carregando...">
        <div className="loading">Carregando...</div>
      </Layout>
    )
  }

  return (
    <Layout
      pageTitle={isEditing ? 'Editar Item' : 'Novo Item'}
      breadcrumb={[
        { label: 'Catalogo', to: '/' },
        { label: isEditing ? 'Editar' : 'Novo' }
      ]}
    >
      <div className="page-head">
        <div>
          <p className="eyebrow">Catalogo</p>
          <h2>{isEditing ? 'Editar Item' : 'Novo Item'}</h2>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="form-layout">
        <div className="card form">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="titulo">Titulo *</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                style={{ borderColor: errors.titulo ? 'var(--coral)' : undefined }}
                maxLength={255}
              />
              {errors.titulo && <span style={{ color: 'var(--coral)', fontSize: '13px' }}>{errors.titulo}</span>}
            </div>
            
            <div className="field">
              <label htmlFor="tipo">Tipo *</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as ItemType)}
              >
                {ITEM_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div className="field">
              <label>Blocos *</label>
              {errors.blocos && <span style={{ color: 'var(--coral)', fontSize: '13px' }}>{errors.blocos}</span>}
              
              <div className="blocos-list">
                {blocos.map((bloco, index) => (
                  <div key={index} className="bloco-item">
                    <div className="bloco-header">
                      <span className="bloco-number">Bloco {index + 1}</span>
                      <div className="bloco-actions">
                        <button
                          type="button"
                          onClick={() => moverBloco(index, -1)}
                          disabled={index === 0}
                          className="icon-button"
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moverBloco(index, 1)}
                          disabled={index === blocos.length - 1}
                          className="icon-button"
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removerBloco(index)}
                          disabled={blocos.length === 1}
                          className="icon-button"
                          style={{ color: 'var(--coral)' }}
                          title="Remover bloco"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div className="bloco-fields">
                      <select
                        value={bloco.tipo}
                        onChange={(e) => atualizarBloco(index, 'tipo', e.target.value)}
                      >
                        {BLOCK_TYPES.map(t => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                      
                      <textarea
                        value={bloco.conteudo}
                        onChange={(e) => atualizarBloco(index, 'conteudo', e.target.value)}
                        placeholder="Conteudo do bloco..."
                        style={{ borderColor: errors[`bloco_${index}_conteudo`] ? 'var(--coral)' : undefined }}
                        rows={3}
                      />
                      {errors[`bloco_${index}_conteudo`] && (
                        <span style={{ color: 'var(--coral)', fontSize: '13px' }}>
                          {errors[`bloco_${index}_conteudo`]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={adicionarBloco}
                className="button secondary"
              >
                + Adicionar Bloco
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="button secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="button"
              >
                {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>

        <div className="card preview">
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
            Preview do Slide
          </h3>
          <div className="slide-preview">
            {preview_blocos.length > 0 ? (
              <>
                <div className="slide-text">
                  {preview_blocos.map((b, i) => (
                    <p key={i} style={{ margin: i > 0 ? '1em 0 0' : 0 }}>
                      {b.conteudo}
                    </p>
                  ))}
                </div>
                <div className="pagination">1 / 1</div>
              </>
            ) : (
              <div className="slide-text" style={{ opacity: 0.4 }}>
                Digite o conteudo dos blocos para visualizar
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
