'use client';

import { useState } from 'react';
import { SectionPageHero } from '../landing/section-page-hero';
import { ExposicaoFilters } from './exposicao-filters';
import { EXPOSICOES } from './exposicoes-data';
import { ExposicoesList } from './exposicoes-list';

const FILTERS = ['Todas', 'Em cartaz', 'Encerradas'];
const EXPOSICOES_ORDENADAS = [...EXPOSICOES].sort(
  (a, b) => Number(b.featured) - Number(a.featured),
);

export function ExposicaoPage() {
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const items =
    selectedFilter === 'Todas'
      ? EXPOSICOES_ORDENADAS
      : EXPOSICOES_ORDENADAS.filter(
          ({ status }) =>
            status ===
            (selectedFilter === 'Encerradas' ? 'Encerrada' : 'Em cartaz'),
        );

  return (
    <main className="w-full flex-1 bg-background text-foreground">
      <SectionPageHero
        title="Exposições"
        description="Conheça as exposições do Museu de Birigui."
        image="/images/capa-exposicoes-editada.jpg"
        imageAlt="Sala de exposições com obras em cavaletes no Museu de Birigui"
        imagePosition="object-[47%_46%] sm:object-center"
      />

      <div className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 sm:pt-10 lg:px-12">
        <section aria-labelledby="exhibitions-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="exhibitions-heading"
              className="text-sm font-bold tracking-[0.12em] uppercase"
            >
              Todas as exposições
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {items.length} {items.length === 1 ? 'exposição' : 'exposições'}
            </p>
          </div>

          <div className="mt-4 mb-5">
            <ExposicaoFilters
              filters={FILTERS}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
          <ExposicoesList key={selectedFilter} items={items} />
        </section>
      </div>
    </main>
  );
}
