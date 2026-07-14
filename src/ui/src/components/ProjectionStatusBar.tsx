interface ProjectionStatusBarProps {
  titulo: string;
  slideAtual: number;
  totalSlides: number;
}

export function ProjectionStatusBar({ titulo, slideAtual, totalSlides }: ProjectionStatusBarProps) {
  return (
    <div className="projection-status-bar">
      <div className="status-titulo">{titulo}</div>
      <div className="status-paginacao">
        Slide {slideAtual} / {totalSlides}
      </div>
    </div>
  );
}