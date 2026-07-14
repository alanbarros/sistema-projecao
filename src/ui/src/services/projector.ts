let projectorWindow: Window | null = null;

export function abrirProjecao(roteiroId: number): Window | null {
  if (projectorWindow && !projectorWindow.closed) {
    projectorWindow.focus();
    return projectorWindow;
  }

  const width = screen.availWidth;
  const height = screen.availHeight;
  const left = 0;
  const top = 0;

  const features = `width=${width},height=${height},left=${left},top=${top},fullscreen=yes,toolbar=no,menubar=no,location=no,status=no`;

  projectorWindow = window.open(`/projetor/${roteiroId}`, 'projector', features);
  
  return projectorWindow;
}

export function fecharProjecao(): void {
  if (projectorWindow && !projectorWindow.closed) {
    projectorWindow.close();
    projectorWindow = null;
  }
}

export function isProjecaoAberta(): boolean {
  return projectorWindow !== null && !projectorWindow.closed;
}