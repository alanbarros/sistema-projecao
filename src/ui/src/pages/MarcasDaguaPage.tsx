import { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { Toast } from '../components/Toast';
import { MarcaDaguaForm } from '../components/MarcaDaguaForm';
import {
  listarMarcasDagua,
  criarMarcaDagua,
  atualizarMarcaDagua,
  excluirMarcaDagua,
  MarcaDagua,
  CriarMarcaDaguaDTO
} from '../services/api';

const LIMITE_MARCAS = 10;

export function MarcasDaguaPage() {
  const [marcas, setMarcas] = useState<MarcaDagua[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<MarcaDagua | null>(null);
  const [toastMensagem, setToastMensagem] = useState('');

  const carregarMarcas = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await listarMarcasDagua();
      setMarcas(dados);
    } catch (error) {
      console.error('Erro ao carregar marcas d\'água:', error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarMarcas();
  }, [carregarMarcas]);

  const handleSalvar = async (dados: CriarMarcaDaguaDTO) => {
    if (editando) {
      await atualizarMarcaDagua(editando.id, dados);
      setToastMensagem('Marca d\'água atualizada com sucesso!');
    } else {
      await criarMarcaDagua(dados);
      setToastMensagem('Marca d\'água criada com sucesso!');
    }
    await carregarMarcas();
  };

  const handleEditar = (marca: MarcaDagua) => {
    setEditando(marca);
    setShowForm(true);
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta marca d\'água?')) return;
    try {
      await excluirMarcaDagua(id);
      setToastMensagem('Marca d\'água excluída com sucesso!');
      await carregarMarcas();
    } catch (error) {
      console.error('Erro ao excluir marca d\'água:', error);
    }
  };

  const handleNovo = () => {
    setEditando(null);
    setShowForm(true);
  };

  const handleFecharForm = () => {
    setShowForm(false);
    setEditando(null);
  };

  return (
    <Layout
      pageTitle="Marcas d'Água"
      breadcrumb={[{ label: 'Marcas d\'Água' }]}
    >
      <div className="page-head">
        <div>
          <p className="eyebrow">Configurações</p>
          <h2>Marcas d'Água</h2>
        </div>
        <button
          className="button"
          onClick={handleNovo}
          disabled={marcas.length >= LIMITE_MARCAS}
          title={marcas.length >= LIMITE_MARCAS ? `Limite de ${LIMITE_MARCAS} marcas atingido` : 'Nova marca d\'água'}
        >
          Nova Marca d'Água
        </button>
      </div>

      <div style={{ marginBottom: '16px', color: 'var(--muted)', fontSize: '14px' }}>
        {marcas.length} de {LIMITE_MARCAS} marcas d'água cadastradas
        {marcas.length >= LIMITE_MARCAS && (
          <span style={{ color: 'var(--coral)', marginLeft: '8px' }}>(limite atingido)</span>
        )}
      </div>

      {carregando ? (
        <div className="loading">Carregando...</div>
      ) : marcas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          Nenhuma marca d'água cadastrada. Clique em "Nova Marca d'Água" para criar.
        </div>
      ) : (
        <div className="route-list">
          {marcas.map((marca) => (
            <div key={marca.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
              <div
                style={{
                  width: '80px',
                  height: '60px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--moss-deep)',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
                dangerouslySetInnerHTML={{ __html: marca.conteudo_svg }}
              />
              <div style={{ flex: 1 }}>
                <strong>{marca.titulo}</strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="button secondary" onClick={() => handleEditar(marca)}>
                  Editar
                </button>
                <button className="button secondary" onClick={() => handleExcluir(marca.id)} style={{ color: 'var(--coral)' }}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <MarcaDaguaForm
          marca={editando}
          onSalvar={handleSalvar}
          onFechar={handleFecharForm}
        />
      )}

      {toastMensagem && (
        <Toast mensagem={toastMensagem} onFechar={() => setToastMensagem('')} />
      )}
    </Layout>
  );
}
