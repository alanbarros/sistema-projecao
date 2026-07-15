// ProjectionState local do engine — subset do tipo de domínio (sem roteiroId).
// itensComSlide usa Record<number, number> para compatibilidade com JSON.stringify/parse no WebSocket.
interface ProjectionState {
  itemRoteiroId: number;
  slideIndice: number;
  totalSlides: number;
  itensComSlide: Record<number, number>;
}

export function criarEstadoInicial(primeiroItemRoteiroId: number, totalSlidesPrimeiroItem: number): ProjectionState {
  return {
    itemRoteiroId: primeiroItemRoteiroId,
    slideIndice: 1,
    totalSlides: totalSlidesPrimeiroItem,
    itensComSlide: { [primeiroItemRoteiroId]: totalSlidesPrimeiroItem },
  };
}

export function navegarParaProximo(estado: ProjectionState, itens: Record<number, number>): ProjectionState {
  const { itemRoteiroId, slideIndice } = estado;
  const totalSlidesAtual = itens[itemRoteiroId] || 0;

  if (slideIndice < totalSlidesAtual) {
    return {
      ...estado,
      slideIndice: slideIndice + 1,
    };
  }

  const itemIds = Object.keys(itens).map(Number);
  const indiceItemAtual = itemIds.indexOf(itemRoteiroId);
  if (indiceItemAtual < itemIds.length - 1) {
    const proximoItemId = itemIds[indiceItemAtual + 1];
    const proximoTotalSlides = itens[proximoItemId];
    return {
      ...estado,
      itemRoteiroId: proximoItemId,
      slideIndice: 1,
      totalSlides: proximoTotalSlides,
      itensComSlide: { ...estado.itensComSlide, [proximoItemId]: proximoTotalSlides },
    };
  }

  return estado;
}

export function navegarParaAnterior(estado: ProjectionState, itens: Record<number, number>): ProjectionState {
  const { itemRoteiroId, slideIndice } = estado;

  if (slideIndice > 1) {
    return {
      ...estado,
      slideIndice: slideIndice - 1,
    };
  }

  const itemIds = Object.keys(itens).map(Number);
  const indiceItemAtual = itemIds.indexOf(itemRoteiroId);
  if (indiceItemAtual > 0) {
    const itemAnteriorId = itemIds[indiceItemAtual - 1];
    const itemAnteriorTotalSlides = itens[itemAnteriorId];
    return {
      ...estado,
      itemRoteiroId: itemAnteriorId,
      slideIndice: itemAnteriorTotalSlides,
      totalSlides: itemAnteriorTotalSlides,
      itensComSlide: { ...estado.itensComSlide, [itemAnteriorId]: itemAnteriorTotalSlides },
    };
  }

  return estado;
}

export function atualizarTotalSlides(estado: ProjectionState, itemRoteiroId: number, totalSlides: number): ProjectionState {
  return {
    ...estado,
    totalSlides: itemRoteiroId === estado.itemRoteiroId ? totalSlides : estado.totalSlides,
    itensComSlide: { ...estado.itensComSlide, [itemRoteiroId]: totalSlides },
  };
}
