'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ProgramacaoCard, type ProgramacaoEvent } from './programacao-card';
import { ProgramacaoFilters } from './programacao-filters';

const EVENTS: ProgramacaoEvent[] = [
  {
    id: 'ae68d180-e62f-4ab2-bf07-8e4f8b4f533a',
    title: 'Um dia muito especial',
    category: 'Teatro',
    date: '30 e 31 de maio',
    time: '20h',
    location: 'Teatro Paulo Pontes',
    status: 'Esgotado',
    image: '/images/evento_1.jpg',
  },
  
];

const CATEGORIES = ['Todos', ...new Set(EVENTS.map((event) => event.category))];

export function ProgramacaoPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredEvents = useMemo(
    () =>
      selectedCategory === 'Todos'
        ? EVENTS
        : EVENTS.filter((event) => event.category === selectedCategory),
    [selectedCategory],
  );

  return (
    <main className="flex-1 bg-[#f3dfaa] px-4 py-5 text-[#312518] md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl">
        <section className="relative h-[190px] overflow-hidden rounded-2xl sm:h-[260px] md:h-[330px]">
          <Image
            src="/images/evento_1.jpg"
            alt="Divulgação do evento Um dia muito especial"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-7">
            <div className="text-white drop-shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs">
                Em destaque
              </p>
              <h1 className="mt-1 max-w-md text-2xl font-bold leading-tight sm:text-4xl">
                Um dia muito especial
              </h1>
            </div>
            <Link
              href="/eventos/ae68d180-e62f-4ab2-bf07-8e4f8b4f533a/detalhes"
              className="shrink-0 rounded bg-white px-3 py-2 text-[9px] font-bold uppercase text-[#8e4a10] transition-colors hover:bg-[#f3dfaa] sm:px-4 sm:text-[10px]"
            >
              Ver evento
            </Link>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="events-heading">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 id="events-heading" className="text-2xl font-black uppercase sm:text-3xl">
              Eventos
            </h2>
            <span className="text-xs font-semibold text-[#806b4c]">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>

          <ProgramacaoFilters
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {filteredEvents.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <ProgramacaoCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-white/60 p-8 text-center text-sm text-[#6b5a43]">
              Nenhum evento encontrado nesta categoria.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
