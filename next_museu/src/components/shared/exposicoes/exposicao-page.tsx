'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ExposicaoCard, type Exposicao } from './exposicao-card';
import { ExposicaoFilters } from './exposicao-filters';

const EXPOSICOES: Exposicao[] = [
  {
    id: '743836ab-e940-4c71-828f-b0223d72549c',
    title: 'O solo vira arte',
    description: 'Explore as cores e texturas naturais do solo como matéria-prima artística.',
    startDate: '24/03/2026',
    endDate: '24/06/2026',
    image: '/images/expo_solo.png',
    status: 'Em cartaz',
  },
  {
    id: 'ae68d180-e62f-4ab2-bf07-8e4f8b4f533a',
    title: 'O mundo em grafite',
    description: 'Obras que revelam a versatilidade e a expressividade do grafite.',
    startDate: '10/04/2026',
    endDate: '18/08/2026',
    image: '/images/expo_grafite.png',
    status: 'Em cartaz',
  },
  {
    id: 'a1514b35-3ff3-4642-81fe-1803ea95acd9',
    title: 'Tipografia urbana',
    description: 'A arte das letras que compõem a paisagem e a identidade das cidades.',
    startDate: '02/05/2026',
    endDate: '30/09/2026',
    image: '/images/expo_tipografia.png',
    status: 'Em cartaz',
  },
];

const FILTERS = ['Todas', 'Em cartaz', 'Encerradas'];

export function ExposicaoPage() {
  const [selectedFilter, setSelectedFilter] = useState('Todas');

  const filteredExposicoes = useMemo(
    () =>
      selectedFilter === 'Todas'
        ? EXPOSICOES
        : EXPOSICOES.filter((exposicao) => exposicao.status === selectedFilter.replace('s', '')),
    [selectedFilter],
  );

  return (
    <main className="flex-1 bg-[#f3dfaa] px-4 py-5 text-[#312518] md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl">
        <section className="relative h-[190px] overflow-hidden rounded-2xl sm:h-[260px] md:h-[330px]">
          <Image
            src="/images/expo_solo.png"
            alt="Exposição O solo vira arte"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white drop-shadow-md sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs">
              Exposição em destaque
            </p>
            <h1 className="mt-1 max-w-md text-2xl font-bold leading-tight sm:text-4xl">
              O solo vira arte
            </h1>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="exhibitions-heading">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 id="exhibitions-heading" className="text-2xl font-black uppercase sm:text-3xl">
              Exposições
            </h2>
            <span className="text-xs font-semibold text-[#806b4c]">
              {filteredExposicoes.length}{' '}
              {filteredExposicoes.length === 1 ? 'exposição' : 'exposições'}
            </span>
          </div>

          <ExposicaoFilters
            filters={FILTERS}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExposicoes.map((exposicao) => (
              <ExposicaoCard
                key={exposicao.id}
                exposicao={exposicao}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
