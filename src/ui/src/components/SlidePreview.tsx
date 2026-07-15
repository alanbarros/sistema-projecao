import { PROJECTION_DEFAULTS } from 'shared';

interface Slide {
  conteudo: string;
  indice: number;
  total: number;
  marcaAguaAtiva: boolean;
  marcaAguaSvg?: string;
}

interface SlidePreviewProps {
  slide: Slide;
}

export function SlidePreview({ slide }: SlidePreviewProps) {
  return (
    <div className="slide-preview">
      <div className="slide-text">
        {slide.conteudo}
      </div>
      
      {slide.marcaAguaAtiva && slide.marcaAguaSvg && (
        <div
          className="watermark"
          style={{ opacity: PROJECTION_DEFAULTS.WATERMARK_OPACITY }}
          dangerouslySetInnerHTML={{ __html: slide.marcaAguaSvg }}
        />
      )}
      
      <div className="pagination">
        {slide.indice}/{slide.total}
      </div>
    </div>
  );
}
