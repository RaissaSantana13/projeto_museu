
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
} from "lucide-react";

interface ArtworkImageZoomProps {
  src: string;
  alt: string;
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_PASSO = 0.5;

export function ArtworkImageZoom({
  src,
  alt,
}: ArtworkImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const arrastoRef = useRef<{
    inicioX: number;
    inicioY: number;
    posicaoX: number;
    posicaoY: number;
  } | null>(null);

  const [zoom, setZoom] = useState(1);

  const [posicao, setPosicao] = useState({
    x: 0,
    y: 0,
  });

  const [arrastando, setArrastando] = useState(false);
  const [telaCheia, setTelaCheia] = useState(false);

  // =====================================
  // LIMITAR O MOVIMENTO DA IMAGEM
  // =====================================

  function limitarPosicao(
    x: number,
    y: number,
    escala: number
  ) {
    const container = containerRef.current;

    if (!container || escala <= 1) {
      return { x: 0, y: 0 };
    }

    const largura = container.clientWidth;
    const altura = container.clientHeight;

    const limiteX = (largura * (escala - 1)) / 2;
    const limiteY = (altura * (escala - 1)) / 2;

    return {
      x: Math.max(-limiteX, Math.min(limiteX, x)),
      y: Math.max(-limiteY, Math.min(limiteY, y)),
    };
  }

  // =====================================
  // APLICAR ZOOM
  // =====================================

  function alterarZoom(novaEscala: number) {
    const escala = Math.max(
      ZOOM_MIN,
      Math.min(ZOOM_MAX, novaEscala)
    );

    setZoom(escala);

    setPosicao((atual) =>
      limitarPosicao(atual.x, atual.y, escala)
    );
  }

  function ampliar() {
    alterarZoom(zoom + ZOOM_PASSO);
  }

  function diminuir() {
    alterarZoom(zoom - ZOOM_PASSO);
  }

  function restaurar() {
    arrastoRef.current = null;
    setArrastando(false);
    setZoom(1);
    setPosicao({ x: 0, y: 0 });
  }

  // =====================================
  // ARRASTAR COM O MOUSE OU TOQUE
  // =====================================

  function iniciarArrasto(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (zoom <= 1) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    arrastoRef.current = {
      inicioX: event.clientX,
      inicioY: event.clientY,
      posicaoX: posicao.x,
      posicaoY: posicao.y,
    };

    setArrastando(true);
  }

  function moverImagem(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const arrasto = arrastoRef.current;

    if (!arrasto || zoom <= 1) return;

    const deslocamentoX =
      event.clientX - arrasto.inicioX;

    const deslocamentoY =
      event.clientY - arrasto.inicioY;

    const novaPosicao = limitarPosicao(
      arrasto.posicaoX + deslocamentoX,
      arrasto.posicaoY + deslocamentoY,
      zoom
    );

    setPosicao(novaPosicao);
  }

  function finalizarArrasto(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    arrastoRef.current = null;
    setArrastando(false);
  }

  // =====================================
  // TELA CHEIA
  // =====================================

  useEffect(() => {
    function verificarTelaCheia() {
      setTelaCheia(
        document.fullscreenElement ===
          containerRef.current
      );
    }

    document.addEventListener(
      "fullscreenchange",
      verificarTelaCheia
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        verificarTelaCheia
      );
    };
  }, []);

  async function alternarTelaCheia() {
    if (!containerRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }

      restaurar();
    } catch (erro) {
      console.error(
        "Não foi possível alterar o modo de tela cheia:",
        erro
      );
    }
  }

  // =====================================
  // COMPONENTE VISUAL
  // =====================================

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full overflow-hidden
        bg-background
        ${telaCheia ? "h-screen" : ""}
      `}
    >
      {/* ÁREA INTERATIVA DA IMAGEM */}
      <div
        className={`
          relative w-full overflow-hidden
          ${telaCheia ? "h-full" : ""}
        `}
        style={{
          cursor:
            zoom > 1
              ? arrastando
                ? "grabbing"
                : "grab"
              : "zoom-in",
          touchAction: zoom > 1 ? "none" : "auto",
        }}
        onPointerDown={iniciarArrasto}
        onPointerMove={moverImagem}
        onPointerUp={finalizarArrasto}
        onPointerCancel={finalizarArrasto}
        onDoubleClick={() => {
          if (zoom === 1) {
            alterarZoom(2);
          } else {
            restaurar();
          }
        }}
      >
        {/* FOTOGRAFIA */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`
            block w-full select-none
            ${
              telaCheia
                ? "h-full object-contain"
                : "h-auto"
            }
            ${
              arrastando
                ? ""
                : "transition-transform duration-200"
            }
          `}
          style={{
            transform: `
              translate3d(
                ${posicao.x}px,
                ${posicao.y}px,
                0
              )
              scale(${zoom})
            `,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* INDICADOR DE AMPLIAÇÃO */}
      {zoom > 1 && (
        <div
          className="
            pointer-events-none
            absolute bottom-5 left-5 z-20
            rounded-md bg-black/75
            px-3 py-2
            text-xs font-semibold text-white
          "
        >
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* =====================================
          CONTROLES LATERAIS
      ===================================== */}

      <div
        className="
          absolute right-3 top-1/2 z-30
          flex -translate-y-1/2
          flex-col overflow-hidden
          rounded-md border
          border-white/10
          bg-[#241a12]/95
          shadow-xl
          md:right-5
        "
      >
        {/* AMPLIAR */}
        <button
          type="button"
          onClick={ampliar}
          disabled={zoom >= ZOOM_MAX}
          aria-label="Ampliar imagem"
          title="Ampliar imagem"
          className="
            flex h-12 w-12 items-center
            justify-center
            text-[#f5e7c2]
            transition-colors
            hover:bg-[#49351f]
            disabled:cursor-not-allowed
            disabled:opacity-35
          "
        >
          <ZoomIn size={21} />
        </button>

        {/* DIMINUIR */}
        <button
          type="button"
          onClick={diminuir}
          disabled={zoom <= ZOOM_MIN}
          aria-label="Diminuir imagem"
          title="Diminuir imagem"
          className="
            flex h-12 w-12 items-center
            justify-center
            border-t border-white/10
            text-[#f5e7c2]
            transition-colors
            hover:bg-[#49351f]
            disabled:cursor-not-allowed
            disabled:opacity-35
          "
        >
          <ZoomOut size={21} />
        </button>

        {/* RESTAURAR TAMANHO ORIGINAL */}
        <button
          type="button"
          onClick={restaurar}
          aria-label="Restaurar imagem"
          title="Restaurar tamanho e posição"
          className="
            flex h-12 w-12 items-center
            justify-center
            border-t border-white/10
            text-[#f5e7c2]
            transition-colors
            hover:bg-[#49351f]
          "
        >
          <RotateCcw size={20} />
        </button>

        {/* TELA CHEIA */}
        <button
          type="button"
          onClick={alternarTelaCheia}
          aria-label={
            telaCheia
              ? "Sair da tela cheia"
              : "Abrir em tela cheia"
          }
          title={
            telaCheia
              ? "Sair da tela cheia"
              : "Abrir em tela cheia"
          }
          className="
            flex h-12 w-12 items-center
            justify-center
            border-t border-white/10
            bg-[#8a5217]
            text-white
            transition-colors
            hover:bg-[#a4641d]
          "
        >
          {telaCheia ? (
            <Minimize size={20} />
          ) : (
            <Maximize size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
