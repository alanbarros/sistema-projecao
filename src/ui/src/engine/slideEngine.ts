import { BlockType, MAX_CHARS_PER_SLIDE } from 'shared';

interface ItemRoteiroBloco {
  id?: number;
  itemRoteiroId: number;
  tipo: BlockType;
  conteudo: string;
  ordem: number;
  created_at?: Date;
}

interface Slide {
  conteudo: string;
  indice: number;
  total: number;
  marcaAguaAtiva: boolean;
}

export function gerarSlides(blocos: ItemRoteiroBloco[], maxChars: number = MAX_CHARS_PER_SLIDE, marcaAguaAtiva: boolean = false): Slide[] {
  const slides: Slide[] = [];
  let conteudoAtual = '';

  for (let i = 0; i < blocos.length; i++) {
    const bloco = blocos[i];
    const ehRefrão = bloco.tipo === BlockType.Refrao;
    const conteudoBloco = bloco.conteudo.trim();

    if (ehRefrão && i > 0 && blocos[i - 1].tipo !== BlockType.Refrao) {
      if (conteudoAtual.length > 0) {
        slides.push({
          conteudo: conteudoAtual.trim(),
          indice: slides.length + 1,
          total: 0,
          marcaAguaAtiva,
        });
        conteudoAtual = '';
      }
      conteudoAtual += (conteudoAtual ? '\n\n' : '') + conteudoBloco;
    } else if (conteudoAtual.length + conteudoBloco.length + 2 > maxChars) {
      if (conteudoAtual.length > 0) {
        slides.push({
          conteudo: conteudoAtual.trim(),
          indice: slides.length + 1,
          total: 0,
          marcaAguaAtiva,
        });
        conteudoAtual = '';
      }
      conteudoAtual += conteudoBloco;
    } else {
      conteudoAtual += (conteudoAtual ? '\n\n' : '') + conteudoBloco;
    }
  }

  if (conteudoAtual.trim().length > 0) {
    slides.push({
      conteudo: conteudoAtual.trim(),
      indice: slides.length + 1,
      total: 0,
      marcaAguaAtiva,
    });
  }

  const totalSlides = slides.length;
  return slides.map((slide, index) => ({
    ...slide,
    indice: index + 1,
    total: totalSlides,
  }));
}