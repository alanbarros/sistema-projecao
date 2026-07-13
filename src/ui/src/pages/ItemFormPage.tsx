import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { criarItem, atualizarItem, buscarItemPorId, ItemBloco } from '../services/api'
import { ITEM_TYPES, BLOCK_TYPES, ItemType, BlockType } from '../../../shared/enums'
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
      newErrors.titulo = 'Título é obrigatório'
    } else if (titulo.length > 255) {
      newErrors.titulo = 'Título deve ter no máximo 255 caracteres'
    }
    
    if (blocos.length === 0) {
      newErrors.blocos = 'Deve haver pelo menos um bloco'
    } else {
      blocos.forEach((bloco, index) => {
        if (!bloco.conteudo.trim()) {
          newErrors[`bloco_${index}_conteudo`] = 'Conteúdo do bloco é obrigatório'
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
        blocos: blocos.map((b, index) => ({
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

  if (loadingData) {
    return <Layout><div className="loading">Carregando...</div></Layout>
  }

  return (
    <Layout>
      <div className="item-form-page">
        <h1>{isEditing ? 'Editar Item' : 'Novo Item'}</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-group">
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={errors.titulo ? 'error' : ''}
              maxLength={255}
            />
            {errors.titulo && <span className="field-error">{errors.titulo}</span>}
          </div>
          
          <div className="form-group">
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
          
          <div className="form-group">
            <label>Blocos *</label>
            {errors.blocos && <span className="field-error">{errors.blocos}</span>}
            
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
                        className="btn-icon"
                        title="Mover para cima"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moverBloco(index, 1)}
                        disabled={index === blocos.length - 1}
                        className="btn-icon"
                        title="Mover para baixo"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removerBloco(index)}
                        disabled={blocos.length === 1}
                        className="btn-icon btn-danger"
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
                      placeholder="Conteúdo do bloco..."
                      className={errors[`bloco_${index}_conteudo`] ? 'error' : ''}
                      rows={3}
                    />
                    {errors[`bloco_${index}_conteudo`] && (
                      <span className="field-error">{errors[`bloco_${index}_conteudo`]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={adicionarBloco}
              className="btn btn-secondary"
            >
              + Adicionar Bloco
            </button>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
