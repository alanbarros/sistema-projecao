interface ProjectionState {
  itemRoteiroId: number;
  slideIndice: number;
  totalSlides: number;
  itensComSlide: Map<number, number>;
}

export function criarEstadoInicial(primeiroItemRoteiroId: number, totalSlidesPrimeiroItem: number): ProjectionState {
  return {
    itemRoteiroId: primeiroItemRoteiroId,
    slideIndice: 1,
    totalSlides: totalSlidesPrimeiroItem,
    itensComSlide: new Map([[primeiroItemRoteiroId, totalSlidesPrimeiroItem]]),
  };
}

export function navegarParaProximo(estado: ProjectionState, itens: Array<{ id: number; totalSlides: number }>): ProjectionState {
  const { itemRoteiroId, slideIndice } = estado;
  const itemAtual = itens.find((item) => item.id === itemRoteiroId);
  const totalSlidesAtual = itemAtual?.totalSlides || 0;

  if (slideIndice < totalSlidesAtual) {
    return {
      ...estado,
      slideIndice: slideIndice + 1,
    };
  }

  const indiceItemAtual = itens.findIndex((item) => item.id === itemRoteiroId);
  if (indiceItemAtual < itens.length - 1) {
    const proximoItem = itens[indiceItemAtual + 1];
    const novosItensComSlide = new Map(estado.itensComSlide);
    novosItensComSlide.set(proximoItem.id, proximoItem.totalSlides);
    return {
      ...estado,
      itemRoteiroId: proximoItem.id,
      slideIndice: 1,
      totalSlides: proximoItem.totalSlides,
      itensComSlide: novosItensComSlide,
    };
  }

  return estado;
}

export function navegarParaAnterior(estado: ProjectionState, itens: Array<{ id: number; totalSlides: number }>): ProjectionState {
  const { itemRoteiroId, slideIndice } = estado;

  if (slideIndice > 1) {
    return {
      ...estado,
      slideIndice: slideIndice - 1,
    };
  }

  const indiceItemAtual = itens.findIndex((item) => item.id === itemRoteiroId);
  if (indiceItemAtual > 0) {
    const itemAnterior = itens[indiceItemAtual - 1];
    const novosItensComSlide = new Map(estado.itensComSlide);
    novosItensComSlide.set(itemAnterior.id, itemAnterior.totalSlides);
    return {
      ...estado,
      itemRoteiroId: itemAnterior.id,
      slideIndice: itemAnterior.totalSlides,
      totalSlides: itemAnterior.totalSlides,
      itensComSlide: novosItensComSlide,
    };
  }

  return estado;
}

export function atualizarTotalSlides(estado: ProjectionState, itemRoteiroId: number, totalSlides: number): ProjectionState {
  const novosItensComSlide = new Map(estado.itensComSlide);
  novosItensComSlide.set(itemRoteiroId, totalSlides);

  return {
    ...estado,
    totalSlides: itemRoteiroId === estado.itemRoteiroId ? totalSlides : estado.totalSlides,
    itensComSlide: novosItensComSlide,
  };
}