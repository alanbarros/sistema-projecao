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
  marcaAguaSvg?: string;
}

export function gerarSlides(blocos: ItemRoteiroBloco[], maxChars: number = MAX_CHARS_PER_SLIDE, marcaAguaAtiva: boolean = false, marcaAguaSvg?: string): Slide[] {
  const slides: Slide[] = [];
  let conteudoAtual = '';

  const flush = () => {
    if (conteudoAtual.trim().length > 0) {
      slides.push({
        conteudo: conteudoAtual.trim(),
        indice: slides.length + 1,
        total: 0,
        marcaAguaAtiva,
        marcaAguaSvg,
      });
      conteudoAtual = '';
    }
  };

  const splitLongContent = (conteudo: string) => {
    const partes = conteudo.split(/\n\n+/);
    for (const parte of partes) {
      if (conteudoAtual.length + parte.length + 2 > maxChars && conteudoAtual.length > 0) {
        flush();
      }
      conteudoAtual += (conteudoAtual ? '\n\n' : '') + parte;
    }
  };

  for (let i = 0; i < blocos.length; i++) {
    const bloco = blocos[i];
    const ehRefrão = bloco.tipo === BlockType.Refrao;
    const conteudoBloco = bloco.conteudo.trim();

    if (ehRefrão && i > 0 && blocos[i - 1].tipo !== BlockType.Refrao) {
      flush();
    }

    splitLongContent(conteudoBloco);
    flush();
  }

  const totalSlides = slides.length;
  return slides.map((slide, index) => ({
    ...slide,
    indice: index + 1,
    total: totalSlides,
  }));
}