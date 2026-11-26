'use client';

import { useState } from 'react';
import { SectionPageHero } from '../landing/section-page-hero';
import { ProgramacaoCard } from './programacao-card';
import { PROGRAMACAO } from './programacao-data';
import {
  ProgramacaoFilters,
  type ProgramacaoFilter,
} from './programacao-filters';

export function ProgramacaoPage() {
  const [selectedFilter, setSelectedFilter] = useState<ProgramacaoFilter>('Todos');

  const filteredEvents =
    selectedFilter === 'Todos'
      ? PROGRAMACAO
      : PROGRAMACAO.filter((event) => event.scheduleStatus === selectedFilter);

  return (
    <main className="w-full flex-1 bg-background text-foreground">
      <SectionPageHero
        title="Programação"
        description="Confira os eventos do Museu de Birigui."
        image="/images/capa-programacao-editada.jpg"
        imageAlt="Dois artistas circenses, um com acordeão e outro com megafone"
        imagePosition="object-[42%_38%] sm:object-[center_35%]"
      />

      <div className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 sm:pt-10 lg:px-12">
        <section aria-labelledby="events-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="events-heading"
              className="text-sm font-bold tracking-[0.12em] uppercase"
            >
              Todos os eventos
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {filteredEvents.length}{' '}
              {filteredEvents.length === 1 ? 'evento' : 'eventos'}
            </p>
          </div>

          <div className="mt-4 mb-5">
            <ProgramacaoFilters
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <ProgramacaoCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
              Nenhum evento encontrado para este filtro.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
