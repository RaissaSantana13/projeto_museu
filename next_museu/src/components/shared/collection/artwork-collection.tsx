'use client';

import {
  FileText,
  Image as ImageIcon,
  Palette,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SectionReveal } from '../motion/section-reveal';
import { ArtworkGallery } from './artwork-gallery';
import { FOTOGRAFIAS, OBRAS, type CollectionItem } from './collection-items';

type CollectionType = 'obra' | 'foto' | 'documento';

const CATEGORIES = [
  { type: 'obra', label: 'Obras e objetos', icon: Palette },
  { type: 'foto', label: 'Fotografias', icon: ImageIcon },
  { type: 'documento', label: 'Documentos históricos', icon: FileText },
] as const;

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
    placeholder: string;
    singular: string;
    plural: string;
    empty: string;
  }
> = {
  obra: {
    eyebrow: 'Acervo',
    title: 'OBRAS E OBJETOS',
    placeholder: 'Buscar obras...',
    singular: 'obra',
    plural: 'obras',
    empty: 'Nenhuma obra encontrada.',
  },
  foto: {
    eyebrow: 'Acervo',
    title: 'FOTOGRAFIAS',
    placeholder: 'Buscar fotografias...',
    singular: 'fotografia',
    plural: 'fotografias',
    empty: 'Nenhuma fotografia encontrada.',
  },
  documento: {
    eyebrow: 'Acervo',
    title: 'DOCUMENTOS',
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
          <SectionReveal>
            <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground">
              {config.eyebrow}
            </p>
            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.92] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              {config.title}
            </h1>
          </SectionReveal>

          <nav aria-label="Categorias do acervo" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ type, label, icon: Icon }) => (
                <li key={type}>
                  <Link
                    href={`/acervo?tipo=${type}`}
                    aria-current={type === currentType ? 'page' : undefined}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6">
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

      {filteredItems.length > 0 ? (
        <ArtworkGallery items={filteredItems} prioritizeImages itemHeading="h2" />
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
