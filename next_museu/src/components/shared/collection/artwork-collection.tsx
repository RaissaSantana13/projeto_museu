'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Format = 'rectangular' | 'square';
type CollectionType = 'obra' | 'foto' | 'documento';

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  img: string;
  format: Format;
  year?: number;
  date?: string;
}

const OBRAS: CollectionItem[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Troféu Locomotiva de Bronze',
    description:
      'Prêmio comemorativo institucional em formato de locomotiva sobre base metálica.',
    img: '/images/train.jpg',
    format: 'rectangular',
    year: 1910,
    date: '1910-07-10',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Microfone Condensador Behringer B-1',
    description:
      'Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.',
    img: '/images/microphone.png',
    format: 'square',
    year: 1978,
    date: '1978-09-12',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Cálice de Madeira Indígena',
    description:
      'Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.',
    img: '/images/cup.jpg',
    format: 'square',
    year: 1894,
    date: '1894-02-03',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Telefone de Parede Antigo',
    description:
      'Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.',
    img: '/images/old_telephone.jpg',
    format: 'rectangular',
    year: 1922,
    date: '1922-11-18',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Jarro de Terracota',
    description:
      'Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.',
    img: '/images/terracota_jug.jpg',
    format: 'square',
    year: 1905,
    date: '1905-04-26',
  },
];

const FOTOGRAFIAS: CollectionItem[] = [
  {
    id: 'foto-001',
    title: 'Praça Central de Birigui',
    description:
      'Registro fotográfico da praça principal da cidade em meados do século XX.',
    img: '/images/04-%20Pra%C3%A7a%20Dr.%20Gama.jpg',
    format: 'rectangular',
    year: 1958,
    date: '1958-08-14',
  },
  {
    id: 'foto-002',
    title: 'Família do Bairro Centro',
    description:
      'Imagem histórica de uma família local em ambiente urbano e cotidiano.',
    img: '/images/01-%20Folia%20de%20Reis%20-%20Frei%20Tarc%C3%ADsio%20-%201982.jpg',
    format: 'square',
    year: 1982,
    date: '1982-01-06',
  },
  {
    id: 'foto-003',
    title: 'Escola Municipal',
    description:
      'Fotografia de alunos e professores em frente à escola da cidade.',
    img: '/images/09.jpg',
    format: 'square',
    year: 1964,
    date: '1964-10-21',
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
  { title: string; singular: string; plural: string; placeholder: string }
> = {
  obra: {
    title: 'Acervo de Obras e Objetos',
    singular: 'obra',
    plural: 'obras',
    placeholder: 'Buscar obras...',
  },
  foto: {
    title: 'Acervo de Fotografias',
    singular: 'foto',
    plural: 'fotos',
    placeholder: 'Buscar fotografias...',
  },
  documento: {
    title: 'Acervo de Documentos Históricos',
    singular: 'documento',
    plural: 'documentos',
    placeholder: 'Buscar documentos...',
  },
};

export function ArtworkCollection({
  tipo = 'obra',
}: {
  tipo?: CollectionType;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const currentType: CollectionType = COLLECTIONS[tipo] ? tipo : 'obra';
  const currentConfig = TYPE_CONFIG[currentType];
  const items = COLLECTIONS[currentType];

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return items;
    }

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.year?.toString().includes(search),
    );
  }, [items, searchTerm]);

  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {currentConfig.title}
          </h1>

          <div className="relative mt-6 max-w-2xl">
            <Search
              size={19}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={currentConfig.placeholder}
              aria-label={currentConfig.placeholder}
              className="
                w-full rounded-xl border border-border
                bg-card py-3 pl-11 pr-4
                text-card-foreground
                placeholder:text-muted-foreground
                outline-none transition
                focus:border-primary
                focus:ring-1 focus:ring-primary
              "
            />
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {filteredItems.length}{' '}
            {filteredItems.length === 1
              ? currentConfig.singular
              : currentConfig.plural}{' '}
            encontrada{filteredItems.length === 1 ? '' : 's'}
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`/acervo/${item.id}/detalhes`}
                aria-label={`Ver detalhes de ${item.title}`}
                className="
                  group flex h-full flex-col overflow-hidden
                  rounded-2xl border border-border
                  bg-card text-card-foreground
                  shadow-sm transition duration-300
                  hover:-translate-y-1
                  hover:border-primary/50
                  hover:shadow-lg
                "
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="
                      object-contain p-3
                      transition-transform duration-500
                      group-hover:scale-[1.03]
                    "
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h2
                      className="
                        text-lg font-semibold leading-snug
                        text-foreground
                        transition-colors
                        group-hover:text-primary
                        md:text-xl
                      "
                    >
                      {item.title}
                    </h2>

                    {item.year && (
                      <span
                        className="
                          shrink-0 rounded-full
                          border border-border
                          bg-secondary px-2.5 py-1
                          text-xs text-secondary-foreground
                        "
                      >
                        {item.year}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <span
                    className="
                      mt-auto pt-4 text-sm font-medium
                      text-muted-foreground
                      transition-colors
                      group-hover:text-primary
                    "
                  >
                    Ver detalhes →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="
              rounded-2xl border border-border
              bg-card px-6 py-16 text-center
            "
          >
            <p className="text-lg text-muted-foreground">
              Nenhuma {currentConfig.singular} encontrada para sua busca.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
