import { useState, useEffect } from 'react';

interface ToastProps {
  mensagem: string;
  onFechar: () => void;
  duracao?: number;
}

export function Toast({ mensagem, onFechar, duracao = 3000 }: ToastProps) {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisivel(false);
      setTimeout(onFechar, 300);
    }, duracao);

    return () => clearTimeout(timer);
  }, [duracao, onFechar]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'var(--ink)',
        color: 'var(--paper)',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        zIndex: 2000,
        opacity: visivel ? 1 : 0,
        transition: 'opacity 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      {mensagem}
    </div>
  );
}
