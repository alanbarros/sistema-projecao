import { BlockType } from '../../shared/enums';
import { MAX_CHARS_PER_SLIDE } from '../../shared/constants';
import { ItemRoteiroBloco } from './ItemRoteiroBloco';

export interface Slide {
  conteudo: string;
  indice: number;
  total: number;
  marcaAguaAtiva: boolean;
}

export function gerarSlides(blocos: ItemRoteiroBloco[], maxConteudoPorSlide: number = MAX_CHARS_PER_SLIDE, marcaAguaAtiva: boolean = false): Slide[] {
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
    } else if (conteudoAtual.length + conteudoBloco.length + 2 > maxConteudoPorSlide) {
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