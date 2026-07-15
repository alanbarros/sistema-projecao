// ProjectionState do domínio inclui roteiroId para uso no server-side (ProjectionServer).
// O hook useProjection usa uma interface local sem roteiroId (o roteiroId está no closure via props).
// Ambas usam Record<number, number> para itensComSlide, compatível com JSON.stringify/parse.
export interface ProjectionState {
  roteiroId?: number;
  itemRoteiroId: number;
  slideIndice: number;
  totalSlides: number;
  itensComSlide: Record<number, number>;
}