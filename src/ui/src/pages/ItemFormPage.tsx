import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { criarItem, atualizarItem, buscarItemPorId, ITEM_TYPES, ItemType } from '../services/api'
import { Layout } from '../components/Layout'
import { BlocoEditor, BlocoForm } from '../components/BlocoEditor'

export function ItemFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<ItemType>(ItemType.Canto)
  const [blocos, setBlocos] = useState<BlocoForm[]>([
    { tipo: 'estrofe' as any, conteudo: '' }
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
              <BlocoEditor
                blocos={blocos}
                onChange={setBlocos}
                errors={errors}
              />
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
      </div>
    </Layout>
  )
}
