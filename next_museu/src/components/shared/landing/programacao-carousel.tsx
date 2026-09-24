'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

interface ProgramacaoItem {
  title?: string;
  highlight?: string;
  subtitle?: string;
  image?: string;
  href: string;
  className?: string;
}

const PROGRAMACAO: ProgramacaoItem[] = [
  {
    title: 'Confira a',
    highlight: 'Programação',
    href: '/programacao',
    className: 'bg-[#a54d0b]',
  },
  {

    image: '/images/evento_1.jpg',
    href: '/programacao',
  },

];

export function ProgramacaoCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    initialScrollLeft: 0,
    moved: false,
  });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    dragState.current = {
      active: true,
      startX: event.clientX,
      initialScrollLeft: carousel.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const drag = dragState.current;
    if (!carousel || !drag.active) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) drag.moved = true;
    carousel.scrollLeft = drag.initialScrollLeft - distance;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    dragState.current.active = false;
  };

  return (
    <section className="w-full bg-[#f3dfaa] py-5" aria-label="Programação do museu">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="relative">
          <div
            ref={carouselRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="flex cursor-grab select-none snap-x snap-mandatory gap-3 overflow-x-auto pb-1 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
          {PROGRAMACAO.map((item, index) => (
            <Link
              key={`${item.title}-${index}`}
              href={item.href}
              className={`group relative block h-[145px] min-w-[290px] snap-start overflow-hidden rounded-2xl sm:h-[165px] sm:min-w-[340px] md:h-[185px] md:min-w-[380px] ${
                index === 0 ? item.className : 'bg-black'
              }`}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {item.image && <div className="absolute inset-0 bg-black/25" />}

              <div
                className={`relative z-10 flex h-full flex-col justify-center px-5 ${
                  item.image ? 'text-white drop-shadow-md' : 'text-white'
                }`}
              >
                <span className="text-sm font-medium leading-none sm:text-base">
                  {item.title}
                </span>
                {item.highlight && (
                  <span className="text-2xl font-bold leading-tight sm:text-3xl">
                    {item.highlight}
                  </span>
                )}
                {item.subtitle && (
                  <span className="mt-1 max-w-[260px] text-xs font-medium leading-tight sm:text-sm">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </Link>
          ))}
          </div>

        </div>
      </div>
    </section>
  );
}
