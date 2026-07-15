import { useState, useMemo } from 'react';
import { BlockType } from '../services/api';
import { gerarSlides } from '../engine/slideEngine';

interface BlocoInput {
  tipo: BlockType;
  conteudo: string;
}

interface MultiSlidePreviewProps {
  blocos: BlocoInput[];
}

export function MultiSlidePreview({ blocos }: MultiSlidePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    const blocosComOrdem = blocos
      .filter(b => b.conteudo.trim())
      .map((b, i) => ({
        id: 0,
        itemRoteiroId: 0,
        tipo: b.tipo,
        conteudo: b.conteudo,
        ordem: i + 1,
      }));
    return gerarSlides(blocosComOrdem);
  }, [blocos]);

  if (slides.length === 0) {
    return (
      <div className="slide-preview">
        <div className="slide-text" style={{ opacity: 0.4 }}>
          Digite o conteúdo dos blocos para visualizar
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(currentSlide, slides.length - 1);
  const slide = slides[safeIndex];

  return (
    <div className="multi-slide-preview">
      <div className="slide-preview">
        <div className="slide-text">
          {slide.conteudo}
        </div>
      </div>

      <div className="multi-slide-controls">
        <button
          type="button"
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={safeIndex === 0}
          className="icon-button"
          title="Slide anterior"
        >
          ←
        </button>
        <span className="multi-slide-indicator">
          Slide {safeIndex + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
          disabled={safeIndex === slides.length - 1}
          className="icon-button"
          title="Próximo slide"
        >
          →
        </button>
      </div>
    </div>
  );
}
