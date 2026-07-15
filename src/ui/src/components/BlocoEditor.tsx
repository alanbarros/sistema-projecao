import { BlockType, BLOCK_TYPES } from '../services/api';
import { MultiSlidePreview } from './MultiSlidePreview';

export interface BlocoForm {
  tipo: BlockType;
  conteudo: string;
}

interface BlocoEditorProps {
  blocos: BlocoForm[];
  onChange: (blocos: BlocoForm[]) => void;
  errors?: Record<string, string>;
}

export function BlocoEditor({ blocos, onChange, errors }: BlocoEditorProps) {
  const adicionarBloco = () => {
    onChange([...blocos, { tipo: BlockType.Estrofe, conteudo: '' }]);
  };

  const removerBloco = (index: number) => {
    if (blocos.length === 1) return;
    onChange(blocos.filter((_, i) => i !== index));
  };

  const atualizarBloco = (index: number, campo: keyof BlocoForm, valor: string) => {
    const novosBlocos = [...blocos];
    novosBlocos[index] = { ...novosBlocos[index], [campo]: valor };
    onChange(novosBlocos);
  };

  const moverBloco = (index: number, direcao: -1 | 1) => {
    const newIndex = index + direcao;
    if (newIndex < 0 || newIndex >= blocos.length) return;
    const novosBlocos = [...blocos];
    const temp = novosBlocos[index];
    novosBlocos[index] = novosBlocos[newIndex];
    novosBlocos[newIndex] = temp;
    onChange(novosBlocos);
  };

  return (
    <div className="bloco-editor">
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
                {BLOCK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>

              <textarea
                value={bloco.conteudo}
                onChange={(e) => atualizarBloco(index, 'conteudo', e.target.value)}
                placeholder="Conteúdo do bloco..."
                style={{ borderColor: errors?.[`bloco_${index}_conteudo`] ? 'var(--coral)' : undefined }}
                rows={3}
              />
              {errors?.[`bloco_${index}_conteudo`] && (
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

      <div className="bloco-preview">
        <h3 style={{ margin: '16px 0 8px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
          Preview dos Slides
        </h3>
        <MultiSlidePreview blocos={blocos} />
      </div>
    </div>
  );
}
