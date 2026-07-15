import { useState, useEffect } from 'react';
import { CriarMarcaDaguaDTO, MarcaDagua } from '../services/api';

interface MarcaDaguaFormProps {
  marca?: MarcaDagua | null;
  onSalvar: (dados: CriarMarcaDaguaDTO) => Promise<void>;
  onFechar: () => void;
}

export function MarcaDaguaForm({ marca, onSalvar, onFechar }: MarcaDaguaFormProps) {
  const [titulo, setTitulo] = useState('');
  const [conteudoSvg, setConteudoSvg] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (marca) {
      setTitulo(marca.titulo);
      setConteudoSvg(marca.conteudo_svg);
    }
  }, [marca]);

  const svgValido = conteudoSvg.trim().length > 0 && conteudoSvg.trim().startsWith('<svg');

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!titulo.trim()) {
      novosErros.titulo = 'Título é obrigatório';
    } else if (titulo.length > 255) {
      novosErros.titulo = 'Título deve ter no máximo 255 caracteres';
    }

    if (!conteudoSvg.trim()) {
      novosErros.conteudo_svg = 'Conteúdo SVG é obrigatório';
    } else if (!svgValido) {
      novosErros.conteudo_svg = 'Conteúdo deve ser um SVG válido';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      await onSalvar({ titulo: titulo.trim(), conteudo_svg: conteudoSvg.trim() });
      onFechar();
    } catch (error) {
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

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{marca ? 'Editar Marca d\'Água' : 'Nova Marca d\'Água'}</h3>
          <button className="icon-button" onClick={onFechar}>×</button>
        </div>

        {erros.geral && (
          <div className="error-message">{erros.geral}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="titulo">Título *</label>
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
            <label htmlFor="svg">Conteúdo SVG *</label>
            <textarea
              id="svg"
              value={conteudoSvg}
              onChange={(e) => setConteudoSvg(e.target.value)}
              style={{ borderColor: erros.conteudo_svg ? 'var(--coral)' : undefined, fontFamily: 'monospace', fontSize: '13px' }}
              rows={8}
              placeholder="<svg>...</svg>"
            />
            {erros.conteudo_svg && <span style={{ color: 'var(--coral)', fontSize: '13px' }}>{erros.conteudo_svg}</span>}
          </div>

          <div className="field">
            <label>Preview</label>
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '16px',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--moss-deep)',
              }}
            >
              {svgValido ? (
                <div
                  style={{ maxWidth: '200px', maxHeight: '100px' }}
                  dangerouslySetInnerHTML={{ __html: conteudoSvg }}
                />
              ) : (
                <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  {conteudoSvg.trim() ? 'SVG inválido' : 'Cole o código SVG para ver o preview'}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onFechar} className="button secondary" disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="button" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
