import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarRoteiro, atualizarRoteiro, buscarRoteiroPorId, Roteiro } from '../services/api';
import Layout from '../components/Layout';

export function RoteiroFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdicao = !!id;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataCelebracao, setDataCelebracao] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (isEdicao && id) {
      carregarRoteiro(parseInt(id));
    }
  }, [id, isEdicao]);

  const carregarRoteiro = async (roteiroId: number) => {
    setCarregando(true);
    try {
      const roteiro = await buscarRoteiroPorId(roteiroId);
      setTitulo(roteiro.titulo);
      setDescricao(roteiro.descricao || '');
      setDataCelebracao(roteiro.data_celebracao || '');
    } catch (error) {
      console.error('Erro ao carregar roteiro:', error);
    } finally {
      setCarregando(false);
    }
  };

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!titulo.trim()) {
      novosErros.titulo = 'Título é obrigatório';
    } else if (titulo.length > 255) {
      novosErros.titulo = 'Título deve ter no máximo 255 caracteres';
    }

    if (descricao.length > 500) {
      novosErros.descricao = 'Descrição deve ter no máximo 500 caracteres';
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
        data_celebracao: dataCelebracao || undefined
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
      <Layout>
        <div className="carregando">Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-page">
        <h1>{isEdicao ? 'Editar Roteiro' : 'Novo Roteiro'}</h1>

        {erros.geral && <div className="erro-geral">{erros.geral}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-grupo">
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={erros.titulo ? 'input-erro' : ''}
              maxLength={255}
            />
            {erros.titulo && <span className="erro-campo">{erros.titulo}</span>}
          </div>

          <div className="form-grupo">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={erros.descricao ? 'input-erro' : ''}
              maxLength={500}
              rows={3}
            />
            {erros.descricao && <span className="erro-campo">{erros.descricao}</span>}
          </div>

          <div className="form-grupo">
            <label htmlFor="dataCelebracao">Data de Celebração</label>
            <input
              type="date"
              id="dataCelebracao"
              value={dataCelebracao}
              onChange={(e) => setDataCelebracao(e.target.value)}
            />
          </div>

          <div className="form-acoes">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={salvando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
