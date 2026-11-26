import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProgramacaoEvent } from './programacao-data';

export function ProgramacaoCard({
  event,
  compact = false,
}: {
  event: ProgramacaoEvent;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs',
        compact && 'min-[480px]:grid min-[480px]:grid-cols-[40%_minmax(0,1fr)]',
      )}
    >
      <div
        className={cn(
          'relative w-full bg-muted',
          compact
            ? 'aspect-[4/3] min-[480px]:aspect-auto min-[480px]:min-h-44 sm:min-h-60 lg:min-h-64'
            : 'aspect-square',
        )}
      >
        <Image
          src={event.image}
          alt={`Cartaz do evento ${event.title}`}
          fill
          sizes={
            compact
              ? '(min-width: 1120px) 410px, (min-width: 480px) 40vw, 100vw'
              : '(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
          }
          className="object-contain"
        />
      </div>

      <div
        className={cn('flex min-w-0 flex-1 flex-col gap-3 p-5', compact && 'sm:p-7')}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <h3
            className={cn(
              'text-lg leading-tight font-semibold',
              compact && 'sm:text-2xl',
            )}
          >
            {event.title}
          </h3>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            {event.scheduleStatus}
          </span>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {event.date}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {event.summary}
        </p>
        {!compact && (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              {event.category}
              {event.time && ` · ${event.time}`}
            </p>
            <p>{event.location}</p>
            {event.scheduleStatus !== 'Encerrado' && event.status && (
              <p className="font-medium">
                {event.status === 'Esgotado'
                  ? 'Ingressos esgotados'
                  : 'Disponível'}
              </p>
            )}
          </div>
        )}
        <Link
          href={`/eventos/${event.id}/detalhes`}
          aria-label={`Ver detalhes do evento ${event.title}`}
          className="mt-auto inline-flex w-fit items-center gap-2 pt-2 text-sm font-semibold text-primary underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:underline"
        >
          Ver detalhes
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
