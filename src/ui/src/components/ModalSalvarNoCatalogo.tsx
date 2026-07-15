import { useState } from 'react';
import { ItemType, salvarAdHocNoCatalogo, ItemRoteiroBloco } from '../services/api';

interface ModalSalvarNoCatalogoProps {
  roteiroId: number;
  itemId: number;
  tituloInicial: string;
  tipoInicial: ItemType;
  blocos: ItemRoteiroBloco[];
  onSucesso: () => void;
  onFechar: () => void;
}

export function ModalSalvarNoCatalogo({
  roteiroId,
  itemId,
  tituloInicial,
  tipoInicial,
  blocos,
  onSucesso,
  onFechar,
}: ModalSalvarNoCatalogoProps) {
  const [titulo, setTitulo] = useState(tituloInicial);
  const [tipo, setTipo] = useState<ItemType>(tipoInicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      setErro('Título é obrigatório');
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      await salvarAdHocNoCatalogo(roteiroId, itemId, {
        titulo: titulo.trim(),
        tipo,
      });
      onSucesso();
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message);
          setErro(parsed.error || 'Erro ao salvar no catálogo');
        } catch {
          setErro('Erro ao salvar no catálogo');
        }
      } else {
        setErro('Erro ao salvar no catálogo');
      }
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Salvar no Catálogo</h2>

        <div className="field">
          <label>Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={salvando}
          />
        </div>

        <div className="field">
          <label>Tipo *</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as ItemType)}
            disabled={salvando}
          >
            {Object.values(ItemType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Conteúdo</label>
          <div style={{
            maxHeight: '200px',
            overflow: 'auto',
            padding: '12px',
            background: 'var(--bg)',
            borderRadius: '6px',
            border: '1px solid var(--line)',
          }}>
            {blocos.length === 0 ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Nenhum bloco</p>
            ) : (
              blocos.map((bloco, index) => (
                <div key={bloco.id || index} style={{ marginBottom: index < blocos.length - 1 ? '12px' : 0 }}>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {bloco.tipo}
                  </span>
                  <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{bloco.conteudo}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {erro && (
          <div style={{
            padding: '10px 14px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {erro}
          </div>
        )}

        <div className="modal-acoes">
          <button
            type="button"
            onClick={onFechar}
            className="button secondary"
            disabled={salvando}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSalvar}
            className="button"
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar no catálogo'}
          </button>
        </div>
      </div>
    </div>
  );
}
