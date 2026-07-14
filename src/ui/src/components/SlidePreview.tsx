import { PROJECTION_DEFAULTS } from 'shared';

interface Slide {
  conteudo: string;
  indice: number;
  total: number;
  marcaAguaAtiva: boolean;
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
      
      {slide.marcaAguaAtiva && (
        <div 
          className="watermark"
          style={{ opacity: PROJECTION_DEFAULTS.WATERMARK_OPACITY }}
        >
          Marca d'Agua
        </div>
      )}
      
      <div className="pagination">
        {slide.indice}/{slide.total}
      </div>
    </div>
  );
}
