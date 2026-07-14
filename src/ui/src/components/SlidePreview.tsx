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
      <div className="slide-conteudo">
        {slide.conteudo}
      </div>
      
      {slide.marcaAguaAtiva && (
        <div 
          className="slide-marca-agua"
          style={{ opacity: PROJECTION_DEFAULTS.WATERMARK_OPACITY }}
        >
          Marca d'Água
        </div>
      )}
      
      <div className="slide-paginacao">
        {slide.indice}/{slide.total}
      </div>
    </div>
  );
}