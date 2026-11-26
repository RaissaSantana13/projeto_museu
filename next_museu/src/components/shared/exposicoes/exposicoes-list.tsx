import {
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DepthDeck, DepthDeckItem } from '../motion/depth-deck';
import type { Exposicao } from './exposicoes-data';

export function ExposicoesList({ items }: { items: Exposicao[] }) {
  if (!items.length) {
    return (
      <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
        Nenhuma exposição nesta categoria.
      </p>
    );
  }

  return (
    <DepthDeck aria-label="Cartazes das exposições" opts={{ align: 'start' }}>
      <CarouselContent className="-ml-5 py-2">
        {items.map((exposicao, index) => (
          <DepthDeckItem
            key={exposicao.id}
            index={index}
            className="basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
          >
            <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs">
              <div className="relative aspect-square w-full bg-muted">
                <Image
                  src={exposicao.image}
                  alt={`Cartaz da exposição ${exposicao.title}`}
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <h3 className="text-lg leading-tight font-semibold">
                    {exposicao.title}
                  </h3>
                  {exposicao.featured && (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      Destaque
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Período a confirmar
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {exposicao.description}
                </p>
                <Link
                  href={`/eventos/${exposicao.id}/detalhes`}
                  aria-label={`Ver detalhes da exposição ${exposicao.title}`}
                  className="mt-auto inline-flex w-fit items-center gap-2 pt-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:underline"
                >
                  Ver detalhes
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </DepthDeckItem>
        ))}
      </CarouselContent>

      {items.length > 1 && (
        <div
          className={`mt-4 flex justify-center gap-3 ${items.length === 2 ? 'sm:hidden' : items.length === 3 ? 'lg:hidden' : ''}`}
        >
          <CarouselPrevious
            aria-label="Exposição anterior"
            className="static size-11 translate-y-0"
          />
          <CarouselNext
            aria-label="Próxima exposição"
            className="static size-11 translate-y-0"
          />
        </div>
      )}
    </DepthDeck>
  );
}
