import { ArrowLeft, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { EventRegistrationDialog } from './event-registration-dialog';
import type { ProgramacaoEvent } from './programacao-data';

export function ProgramacaoEventDetails({
  event,
}: {
  event: ProgramacaoEvent;
}) {
  const sessions = event.registrationSessions ?? [];
  const canRegister =
    event.demonstration &&
    event.status === 'Disponível' &&
    event.scheduleStatus !== 'Encerrado' &&
    sessions.length > 0;

  return (
    <main className="w-full flex-1 bg-background text-foreground">
      <article className="mx-auto max-w-7xl px-5 pt-6 pb-16 sm:px-8 sm:pt-8 lg:px-12">
        <Link
          href="/programacao"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar à programação
        </Link>

        <div className="mt-5 grid items-center gap-8 rounded-2xl bg-[#472713] bg-linear-to-br from-[#321c11] via-[#472713] to-[#653310] px-6 py-8 text-[#fff4e3] sm:p-9 md:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-12 lg:p-12">
          <header>
            <p className="inline-flex rounded-full border border-[#f7c181]/45 px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-[#f7c181] uppercase">
              {event.category}
            </p>
            <h1 className="mt-5 max-w-[16ch] font-serif text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-[#fff4e3]/85 sm:text-lg">
              {event.summary}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#f3dfaa] px-3 py-2 text-sm font-bold text-[#472713]">
              <CalendarDays
                className="size-4 shrink-0 text-[#9f4d0c]"
                aria-hidden="true"
              />
              {event.date}
            </p>
            {sessions.length > 0 && (
              <div className="mt-4 max-w-md">
                <dl className="grid gap-2 text-sm">
                  {sessions.map(({ day, times }) => (
                    <div
                      key={day}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                    >
                      <dt className="font-semibold text-[#f3dfaa]">{day}</dt>
                      <dd className="text-[#fff4e3]/90">{times.join(' · ')}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {sessions.length === 0 && (
              <dl className="mt-4 grid max-w-md gap-2 text-sm">
                {event.time && (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <dt className="font-semibold text-[#f3dfaa]">Horário</dt>
                    <dd className="text-[#fff4e3]/90">{event.time}</dd>
                  </div>
                )}
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="font-semibold text-[#f3dfaa]">Local</dt>
                  <dd className="text-[#fff4e3]/90">{event.location}</dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="font-semibold text-[#f3dfaa]">Situação</dt>
                  <dd className="text-[#fff4e3]/90">{event.scheduleStatus}</dd>
                </div>
              </dl>
            )}
            {canRegister && (
              <EventRegistrationDialog
                title={event.title}
                image={event.image}
                sessions={sessions}
              />
            )}
          </header>
          <figure className="w-full max-w-[21rem] rounded-xl border border-white/15 bg-white/5 p-2 md:justify-self-end">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={event.image}
                alt={`Cartaz do evento ${event.title}`}
                fill
                preload
                sizes="(min-width: 480px) 318px, 85vw"
                className="object-contain"
              />
            </div>
          </figure>
        </div>
      </article>
    </main>
  );
}
