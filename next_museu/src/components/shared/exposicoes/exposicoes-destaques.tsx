'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Exposicao } from './exposicoes-data';

function Destaque({ item, preload }: { item: Exposicao; preload: boolean }) {
  return (
    <article className="grid min-w-0 items-center gap-6 rounded-xl border border-border bg-card p-5 text-card-foreground sm:gap-10 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:p-12">
      <div className="max-w-xl">
        <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
          Exposição em destaque
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-6xl">
          {item.title}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {item.description}
        </p>
        <Button asChild className="mt-5 min-h-11 sm:mt-7">
          <Link href={`/eventos/${item.id}/detalhes`}>
            Ver exposição <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[25rem] overflow-hidden rounded-lg bg-muted">
        <Image
          src={item.image}
          alt={`Cartaz da exposição ${item.title}`}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 40vw, 85vw"
          className="object-contain"
          preload={preload}
        />
      </div>
    </article>
  );
}

export function ExposicoesDestaques({ items }: { items: Exposicao[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;

    const sync = () => setSelected(api.selectedScrollSnap());
    sync();
    api.on('select', sync);
    api.on('reInit', sync);
    return () => {
      api.off('select', sync);
      api.off('reInit', sync);
    };
  }, [api]);

  if (!items.length) return null;

  if (items.length === 1) return <Destaque item={items[0]} preload />;

  return (
    <Carousel
      aria-label="Exposições em destaque"
      opts={{ align: 'start' }}
      setApi={setApi}
    >
      <CarouselContent className="ml-0">
        {items.map((item, index) => (
          <CarouselItem key={item.id} className="flex pl-0 [&>article]:w-full">
            <Destaque item={item} preload={index === 0} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div
        role="group"
        aria-label="Escolher destaque"
        className="mt-3 flex flex-wrap justify-center"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Mostrar destaque: ${item.title}`}
            aria-current={selected === index ? 'true' : undefined}
            onClick={() =>
              api?.scrollTo(
                index,
                window.matchMedia('(prefers-reduced-motion: reduce)').matches,
              )
            }
            className="group flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full bg-muted-foreground/55 group-hover:bg-primary group-aria-[current=true]:bg-primary"
            />
          </button>
        ))}
      </div>
    </Carousel>
  );
}
