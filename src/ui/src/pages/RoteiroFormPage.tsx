import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarRoteiro, atualizarRoteiro, buscarRoteiroPorId, listarMarcasDagua, MarcaDagua } from '../services/api';
import { Layout } from '../components/Layout';

export function RoteiroFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdicao = !!id;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataCelebracao, setDataCelebracao] = useState('');
  const [marcaDaguaId, setMarcaDaguaId] = useState<number | null>(null);
  const [marcasDisponiveis, setMarcasDisponiveis] = useState<MarcaDagua[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarMarcas();
    if (isEdicao && id) {
      carregarRoteiro(parseInt(id));
    }
  }, [id, isEdicao]);

  const carregarMarcas = async () => {
    try {
      const marcas = await listarMarcasDagua();
      setMarcasDisponiveis(marcas);
    } catch (error) {
      console.error('Erro ao carregar marcas d\'água:', error);
    }
  };

  const carregarRoteiro = async (roteiroId: number) => {
    setCarregando(true);
    try {
      const roteiro = await buscarRoteiroPorId(roteiroId);
      setTitulo(roteiro.titulo);
      setDescricao(roteiro.descricao || '');
      setDataCelebracao(roteiro.dataCelebracao || '');
      setMarcaDaguaId((roteiro as any).marcaDaguaId ?? null);
    } catch (error) {
      console.error('Erro ao carregar roteiro:', error);
    } finally {
      setCarregando(false);
    }
  };

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!titulo.trim()) {
      novosErros.titulo = 'Titulo e obrigatorio';
    } else if (titulo.length > 255) {
      novosErros.titulo = 'Titulo deve ter no maximo 255 caracteres';
    }

    if (descricao.length > 500) {
      novosErros.descricao = 'Descricao deve ter no maximo 500 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        data_celebracao: dataCelebracao || undefined,
        marca_dagua_id: marcaDaguaId
      };

      if (isEdicao && id) {
        await atualizarRoteiro(parseInt(id), dados);
        navigate(`/roteiros/${id}`);
      } else {
        const novoRoteiro = await criarRoteiro(dados);
        navigate(`/roteiros/${novoRoteiro.id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar roteiro:', error);
      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.details) {
            const errosApi: Record<string, string> = {};
            parsed.details.forEach((erro: { field: string; message: string }) => {
              errosApi[erro.field] = erro.message;
            });
            setErros(errosApi);
          }
        } catch {
          setErros({ geral: error.message });
        }
      }
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <Layout pageTitle="Carregando...">
        <div className="loading">Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle={isEdicao ? 'Editar Roteiro' : 'Novo Roteiro'}
      breadcrumb={[
        { label: 'Celebracoes', to: '/roteiros' },
        { label: isEdicao ? 'Editar' : 'Novo' }
      ]}
    >
      <div className="page-head">
        <div>
          <p className="eyebrow">Roteiros</p>
          <h2>{isEdicao ? 'Editar Roteiro' : 'Nova Celebracao'}</h2>
        </div>
      </div>

      {erros.geral && (
        <div className="error-message">{erros.geral}</div>
      )}

      <div className="card form">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="titulo">Titulo *</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={{ borderColor: erros.titulo ? 'var(--coral)' : undefined }}
              maxLength={255}
            />
            {erros.titulo && <span style={{ color: 'var(--coral)', fontSize: '13px' }}>{erros.titulo}</span>}
          </div>

          <div className="field">
            <label htmlFor="descricao">Descricao</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ borderColor: erros.descricao ? 'var(--coral)' : undefined }}
              maxLength={500}
              rows={3}
            />
            {erros.descricao && <span style={{ color: 'var(--coral)', fontSize: '13px' }}>{erros.descricao}</span>}
          </div>

          <div className="field">
            <label htmlFor="dataCelebracao">Data de Celebração</label>
            <input
              type="date"
              id="dataCelebracao"
              value={dataCelebracao}
              onChange={(e) => setDataCelebracao(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="marcaDagua">Marca d'Água</label>
            <select
              id="marcaDagua"
              value={marcaDaguaId ?? ''}
              onChange={(e) => setMarcaDaguaId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Nenhuma</option>
              {marcasDisponiveis.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.titulo}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="button secondary"
              disabled={salvando}
            >
              Cancelar
            </button>
            <button type="submit" className="button" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
