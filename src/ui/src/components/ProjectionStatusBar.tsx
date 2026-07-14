interface ProjectionStatusBarProps {
  titulo: string;
  slideAtual: number;
  totalSlides: number;
}

export function ProjectionStatusBar({ titulo, slideAtual, totalSlides }: ProjectionStatusBarProps) {
  return (
    <div className="play-status">
      <div className="current">
        EM EXIBICAO · <strong>{titulo}</strong> · Slide {slideAtual} / {totalSlides}
      </div>
      <div className="keyboard">
        <span className="key">←</span>
        <span className="key">→</span>
        <span>para navegar</span>
      </div>
    </div>
  );
}
