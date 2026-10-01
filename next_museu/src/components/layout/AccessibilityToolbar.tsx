'use client';

import { useEffect, useRef, useState } from 'react';

const TAMANHO_MIN = 100;
const TAMANHO_MAX = 160;
const TAMANHO_PASSO = 10;

type Estado = {
  tamanhoFonte: number; // percentual, 100 = normal
  escalaCinza: boolean;
  altoContraste: boolean;
  contrasteNegativo: boolean;
  fundoClaro: boolean;
  linksSublinhados: boolean;
  fonteLegivel: boolean;
};

const ESTADO_INICIAL: Estado = {
  tamanhoFonte: 100,
  escalaCinza: false,
  altoContraste: false,
  contrasteNegativo: false,
  fundoClaro: false,
  linksSublinhados: false,
  fonteLegivel: false,
};

export default function AccessibilityToolbar() {
  const [aberto, setAberto] = useState(false);
  const [estado, setEstado] = useState<Estado>(ESTADO_INICIAL);
  const painelRef = useRef<HTMLDivElement>(null);

  // Aplica cada opção como atributo/estilo no <html>, pra valer o site inteiro
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.style.setProperty('--a11y-escala-fonte', `${estado.tamanhoFonte}%`);
    raiz.setAttribute('data-escala-cinza', String(estado.escalaCinza));
    raiz.setAttribute('data-alto-contraste', String(estado.altoContraste));
    raiz.setAttribute('data-contraste-negativo', String(estado.contrasteNegativo));
    raiz.setAttribute('data-fundo-claro', String(estado.fundoClaro));
    raiz.setAttribute('data-links-sublinhados', String(estado.linksSublinhados));
    raiz.setAttribute('data-fonte-legivel', String(estado.fonteLegivel));

    return () => {
      raiz.style.removeProperty('--a11y-escala-fonte');
      raiz.removeAttribute('data-escala-cinza');
      raiz.removeAttribute('data-alto-contraste');
      raiz.removeAttribute('data-contraste-negativo');
      raiz.removeAttribute('data-fundo-claro');
      raiz.removeAttribute('data-links-sublinhados');
      raiz.removeAttribute('data-fonte-legivel');
    };
  }, [estado]);

  // Fecha o painel ao clicar fora ou apertar Esc — importante pra quem navega por teclado
  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (painelRef.current && !painelRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    function aoApertarEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setAberto(false);
    }
    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoApertarEsc);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoApertarEsc);
    };
  }, []);

  function alternar(chave: keyof Omit<Estado, 'tamanhoFonte'>) {
    setEstado((atual) => ({ ...atual, [chave]: !atual[chave] }));
  }

  function mudarFonte(delta: number) {
    setEstado((atual) => ({
      ...atual,
      tamanhoFonte: Math.min(TAMANHO_MAX, Math.max(TAMANHO_MIN, atual.tamanhoFonte + delta)),
    }));
  }

  function redefinir() {
    setEstado(ESTADO_INICIAL);
  }

  return (
    <div className="a11y-widget" ref={painelRef}>
      <button
        type="button"
        className="a11y-widget__botao"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="true"
        aria-label="Abrir ferramentas de acessibilidade"
      >
        <span aria-hidden="true">♿</span>
      </button>

      {aberto && (
        <div className="a11y-widget__painel" role="menu">
          <h2 className="a11y-widget__titulo">Ferramentas de acessibilidade</h2>

          <button type="button" className="a11y-widget__item" onClick={() => mudarFonte(TAMANHO_PASSO)}>
            <span aria-hidden="true">🔍+</span> Aumentar texto
          </button>
          <button type="button" className="a11y-widget__item" onClick={() => mudarFonte(-TAMANHO_PASSO)}>
            <span aria-hidden="true">🔍−</span> Diminuir texto
          </button>
          <button
            type="button"
            className="a11y-widget__item"
            aria-pressed={estado.escalaCinza}
            onClick={() => alternar('escalaCinza')}
          >
            <span aria-hidden="true">▤</span> Escala de cinza
          </button>
          <button
            type="button"
            className="a11y-widget__item"
            aria-pressed={estado.altoContraste}
            onClick={() => alternar('altoContraste')}
          >
            <span aria-hidden="true">◐</span> Alto contraste
          </button>
          <button
            type="button"
            className="a11y-widget__item"
            aria-pressed={estado.contrasteNegativo}
            onClick={() => alternar('contrasteNegativo')}
          >
            <span aria-hidden="true">◑</span> Contraste negativo
          </button>
          <button
            type="button"
            className="a11y-widget__item"
            aria-pressed={estado.fundoClaro}
            onClick={() => alternar('fundoClaro')}
          >
            <span aria-hidden="true">💡</span> Fundo claro
          </button>
          <button
            type="button"
            className="a11y-widget__item"
            aria-pressed={estado.linksSublinhados}
            onClick={() => alternar('linksSublinhados')}
          >
            <span aria-hidden="true">🔗</span> Links sublinhados
          </button>
          <button
            type="button"
            className="a11y-widget__item"
            aria-pressed={estado.fonteLegivel}
            onClick={() => alternar('fonteLegivel')}
          >
            <span aria-hidden="true">A</span> Legibilidade da fonte
          </button>

          <button type="button" className="a11y-widget__item a11y-widget__item--redefinir" onClick={redefinir}>
            <span aria-hidden="true">↺</span> Redefinir
          </button>
        </div>
      )}
    </div>
  );
}
