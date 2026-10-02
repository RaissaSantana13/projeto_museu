'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type CollectionType = 'obra' | 'foto' | 'documento';

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  img: string;
  year?: number;
  date?: string;
  tileClass: string;
  imagePosition?: string;
}

const OBRAS: CollectionItem[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Troféu Locomotiva de Bronze',
    description:
      'Prêmio comemorativo institucional em formato de locomotiva sobre base metálica.',
    img: '/images/train.jpg',
    year: 1910,
    date: '1910-07-10',
    tileClass: 'md:col-span-5 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Microfone Condensador Behringer B-1',
    description:
      'Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.',
    img: '/images/microphone.png',
    year: 1978,
    date: '1978-09-12',
    tileClass: 'md:col-span-3 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Cálice de Madeira Indígena',
    description:
      'Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.',
    img: '/images/cup.jpg',
    year: 1894,
    date: '1894-02-03',
    tileClass: 'md:col-span-4 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Telefone de Parede Antigo',
    description:
      'Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.',
    img: '/images/old_telephone.jpg',
    year: 1922,
    date: '1922-11-18',
    tileClass: 'md:col-span-4 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Jarro de Terracota',
    description:
      'Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.',
    img: '/images/terracota_jug.jpg',
    year: 1905,
    date: '1905-04-26',
    tileClass: 'md:col-span-8 md:row-span-2',
    imagePosition: 'object-center',
  },
];

const FOTOGRAFIAS: CollectionItem[] = [
  {
    id: 'foto-001',
    title: 'Praça Central de Birigui',
    description:
      'Registro fotográfico da praça principal da cidade em meados do século XX.',
    img: '/images/04-%20Pra%C3%A7a%20Dr.%20Gama.jpg',
    year: 1958,
    date: '1958-08-14',
    tileClass: 'md:col-span-7 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: 'foto-002',
    title: 'Família do Bairro Centro',
    description:
      'Imagem histórica de uma família local em ambiente urbano e cotidiano.',
    img: '/images/01-%20Folia%20de%20Reis%20-%20Frei%20Tarc%C3%ADsio%20-%201982.jpg',
    year: 1982,
    date: '1982-01-06',
    tileClass: 'md:col-span-5 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: 'foto-003',
    title: 'Escola Municipal',
    description:
      'Fotografia de alunos e professores em frente à escola da cidade.',
    img: '/images/09.jpg',
    year: 1964,
    date: '1964-10-21',
    tileClass: 'md:col-span-12 md:row-span-2',
    imagePosition: 'object-center',
  },
];

const DOCUMENTOS: CollectionItem[] = [];

const COLLECTIONS: Record<CollectionType, CollectionItem[]> = {
  obra: OBRAS,
  foto: FOTOGRAFIAS,
  documento: DOCUMENTOS,
};

const TYPE_CONFIG: Record<
  CollectionType,
  {
    eyebrow: string;
    title: string;
    sectionLabel: string;
    placeholder: string;
    singular: string;
    plural: string;
    empty: string;
  }
> = {
  obra: {
    eyebrow: 'Acervo',
    title: 'OBRAS E OBJETOS',
    sectionLabel: 'DESTAQUES',
    placeholder: 'Buscar obras...',
    singular: 'obra',
    plural: 'obras',
    empty: 'Nenhuma obra encontrada.',
  },
  foto: {
    eyebrow: 'Acervo',
    title: 'FOTOGRAFIAS',
    sectionLabel: 'DESTAQUES',
    placeholder: 'Buscar fotografias...',
    singular: 'fotografia',
    plural: 'fotografias',
    empty: 'Nenhuma fotografia encontrada.',
  },
  documento: {
    eyebrow: 'Acervo',
    title: 'DOCUMENTOS',
    sectionLabel: 'DESTAQUES',
    placeholder: 'Buscar documentos...',
    singular: 'documento',
    plural: 'documentos',
    empty: 'Nenhum documento encontrado.',
  },
};

export function ArtworkCollection({
  tipo = 'obra',
}: {
  tipo?: CollectionType;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const floatingSearchRef = useRef<HTMLInputElement>(null);

  const currentType: CollectionType = COLLECTIONS[tipo] ? tipo : 'obra';
  const items = COLLECTIONS[currentType];
  const config = TYPE_CONFIG[currentType];

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 320;
      setShowFloatingControls(shouldShow);

      if (!shouldShow) {
        setShowFloatingSearch(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showFloatingSearch) {
      requestAnimationFrame(() => floatingSearchRef.current?.focus());
    }
  }, [showFloatingSearch]);

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.year?.toString().includes(search),
    );
  }, [items, searchTerm]);

  return (
    <section className="min-h-screen w-full bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8 md:pb-12 md:pt-28 lg:px-12">
          <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">
            {config.eyebrow}
          </p>

          <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.92] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {config.title}
          </h1>

          <div className="mt-10">
            <div className="relative">
              <Search
                size={21}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={config.placeholder}
                aria-label={config.placeholder}
                className="
                  w-full rounded-xl border border-border
                  bg-card py-4 pl-12 pr-4
                  text-base text-card-foreground
                  placeholder:text-muted-foreground
                  outline-none transition
                  focus:border-primary
                  focus:ring-1 focus:ring-primary
                "
              />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? config.singular : config.plural}{' '}
              encontrada{filteredItems.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-8 lg:px-12">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-foreground">
          {config.sectionLabel}
        </p>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid auto-rows-[220px] grid-cols-1 gap-[2px] md:grid-cols-12 md:auto-rows-[190px] xl:auto-rows-[230px]">
          {filteredItems.map((item, index) => (
            <Link
              key={item.id}
              href={`/acervo/${item.id}/detalhes`}
              aria-label={`Ver detalhes de ${item.title}`}
              className={`group relative overflow-hidden bg-muted ${item.tileClass}`}
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                priority={index < 3}
                sizes="(max-width: 767px) 100vw, 50vw"
                className={`object-cover transition duration-700 group-hover:scale-[1.035] ${item.imagePosition ?? ''}`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-background/10 opacity-45 transition-opacity duration-300 group-hover:opacity-90" />

              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:p-6">
                {item.year && (
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {item.year}
                  </span>
                )}

                <h2 className="mt-2 max-w-xl text-xl font-bold leading-tight text-foreground md:text-2xl">
                  {item.title}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-6">
          <p className="text-lg text-muted-foreground">{config.empty}</p>
        </div>
      )}

      <div
        className={`
          fixed bottom-5 left-5 z-50
          transition-all duration-300
          ${
            showFloatingControls
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-5 opacity-0'
          }
        `}
      >
        {showFloatingSearch && (
          <div className="mb-3 w-[min(82vw,360px)] rounded-lg border border-border bg-card p-3 shadow-2xl">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                ref={floatingSearchRef}
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={config.placeholder}
                className="
                  w-full rounded-md border border-border
                  bg-background py-2.5 pl-10 pr-10
                  text-sm text-foreground
                  outline-none
                  placeholder:text-muted-foreground
                  focus:border-primary
                  focus:ring-1 focus:ring-primary
                "
              />

              <button
                type="button"
                onClick={() => setShowFloatingSearch(false)}
                aria-label="Fechar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X size={17} />
              </button>
            </div>

            <p className="mt-2 px-1 text-xs text-muted-foreground">
              {filteredItems.length} resultado
              {filteredItems.length === 1 ? '' : 's'}
            </p>
          </div>
        )}

        <div className="inline-flex overflow-hidden rounded-lg border border-border bg-card p-2 shadow-2xl">
          <button
            type="button"
            onClick={() => setShowFloatingSearch((value) => !value)}
            aria-label="Pesquisar"
            className="
              flex h-12 w-14 items-center justify-center
              rounded-md text-card-foreground
              transition-colors
              hover:bg-muted
            "
          >
            <Search size={21} />
          </button>

          <button
            type="button"
            aria-label="Filtros"
            className="
              ml-1 flex h-12 w-14 items-center justify-center
              rounded-md bg-muted
              text-card-foreground
              transition-colors
              hover:bg-secondary
            "
          >
            <SlidersHorizontal size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
