'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ScreenSize = 'small' | 'medium' | 'large';
type Format = 'rectangular' | 'square';
type CollectionType = 'obra' | 'foto' | 'documento';
type Status = 'active' | 'inactive' | 'draft';

/** Espelha as colunas da tabela `works` no banco de dados. */
interface CollectionItem {
  idWork: string;
  title: string;
  artist: string;
  creationYear: number;
  description: string;
  dimensions: string;
  type: string;
  category: string;
  location: string;
  idImg: string;
  has3d: boolean;
  url3d: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  /** Caminho da imagem resolvido a partir de `idImg`. */
  img: string;
}

const OBRAS: CollectionItem[] = [
  {
    idWork: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Troféu Locomotiva de Bronze',
    artist: 'Fundação Tiradentes',
    creationYear: 1910,
    description:
      'Prêmio comemorativo institucional em formato de locomotiva sobre base metálica.',
    dimensions: '45 x 20 x 18 cm',
    type: 'Objeto',
    category: 'Prêmio',
    location: 'Sala 01 - Vitrine A',
    idImg: 'img-0001',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
    deletedAt: null,
    img: '/images/train.jpg',
  },
  {
    idWork: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Microfone Condensador Behringer B-1',
    artist: 'Behringer',
    creationYear: 1978,
    description:
      'Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.',
    dimensions: '20 x 12 x 12 cm',
    type: 'Equipamento',
    category: 'Áudio',
    location: 'Depósito Técnico',
    idImg: 'img-0002',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-01-11T09:30:00.000Z',
    updatedAt: '2026-01-11T09:30:00.000Z',
    deletedAt: null,
    img: '/images/microphone.png',
  },
  {
    idWork: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Cálice de Madeira Indígena',
    artist: 'Autoria indígena',
    creationYear: 1894,
    description:
      'Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.',
    dimensions: '12 x 8 x 8 cm',
    type: 'Objeto',
    category: 'Arte Indígena',
    location: 'Sala 02 - Vitrine B',
    idImg: 'img-0003',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-01-12T14:15:00.000Z',
    updatedAt: '2026-01-12T14:15:00.000Z',
    deletedAt: null,
    img: '/images/cup.jpg',
  },
  {
    idWork: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Telefone de Parede Antigo',
    artist: 'Companhia Telefônica',
    creationYear: 1922,
    description:
      'Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.',
    dimensions: '35 x 22 x 15 cm',
    type: 'Objeto',
    category: 'Comunicação',
    location: 'Sala 01 - Vitrine C',
    idImg: 'img-0004',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-01-13T11:00:00.000Z',
    updatedAt: '2026-01-13T11:00:00.000Z',
    deletedAt: null,
    img: '/images/old_telephone.jpg',
  },
  {
    idWork: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Jarro de Terracota',
    artist: 'Cerâmica artesanal',
    creationYear: 1905,
    description:
      'Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.',
    dimensions: '30 x 18 x 18 cm',
    type: 'Objeto',
    category: 'Cerâmica',
    location: 'Sala 02 - Vitrine B',
    idImg: 'img-0005',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-01-14T16:45:00.000Z',
    updatedAt: '2026-01-14T16:45:00.000Z',
    deletedAt: null,
    img: '/images/terracota_jug.jpg',
  },
];

const FOTOGRAFIAS: CollectionItem[] = [
  {
    idWork: 'foto-001',
    title: 'Praça Central de Birigui',
    artist: 'Autor desconhecido',
    creationYear: 1958,
    description:
      'Registro fotográfico da praça principal da cidade em meados do século XX.',
    dimensions: '20 x 30 cm',
    type: 'Fotografia',
    category: 'Paisagem urbana',
    location: 'Acervo Fotográfico',
    idImg: 'img-f001',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
    deletedAt: null,
    img: '/images/04-%20Pra%C3%A7a%20Dr.%20Gama.jpg',
  },
  {
    idWork: 'foto-002',
    title: 'Família do Bairro Centro',
    artist: 'Autor desconhecido',
    creationYear: 1982,
    description:
      'Imagem histórica de uma família local em ambiente urbano e cotidiano.',
    dimensions: '15 x 15 cm',
    type: 'Fotografia',
    category: 'Retrato',
    location: 'Acervo Fotográfico',
    idImg: 'img-f002',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-02-02T08:00:00.000Z',
    updatedAt: '2026-02-02T08:00:00.000Z',
    deletedAt: null,
    img: '/images/01-%20Folia%20de%20Reis%20-%20Frei%20Tarc%C3%ADsio%20-%201982.jpg',
  },
  {
    idWork: 'foto-003',
    title: 'Escola Municipal',
    artist: 'Autor desconhecido',
    creationYear: 1964,
    description:
      'Fotografia de alunos e professores em frente à escola da cidade.',
    dimensions: '13 x 18 cm',
    type: 'Fotografia',
    category: 'Institucional',
    location: 'Acervo Fotográfico',
    idImg: 'img-f003',
    has3d: false,
    url3d: null,
    status: 'active',
    createdAt: '2026-02-03T08:00:00.000Z',
    updatedAt: '2026-02-03T08:00:00.000Z',
    deletedAt: null,
    img: '/images/09.jpg',
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

export function ArtworkCollection({ tipo = 'obra' }: { tipo?: CollectionType }) {
  const [screenSize, setScreenSize] = useState<ScreenSize>('large');
  const [searchTerm, setSearchTerm] = useState('');

  const currentType = COLLECTIONS[tipo] ? tipo : 'obra';
  const currentConfig = TYPE_CONFIG[currentType];
  const items = COLLECTIONS[currentType];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('small');
      } else if (window.innerWidth < 1024) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGridClass = () => {
    switch (screenSize) {
      case 'small':
        return 'grid-cols-1';
      case 'medium':
        return 'grid-cols-2';
      default:
        return 'grid-cols-3';
    }
  };

  const getFormat = (item: CollectionItem): Format => {
    const [width, height] = item.dimensions
      .split(/[x×]/i)
      .map((value) => Number.parseFloat(value.trim().replace(',', '.')))
      .filter((value) => !Number.isNaN(value));

    if (width && height && Math.abs(width - height) / Math.max(width, height) < 0.1) {
      return 'square';
    }

    return 'rectangular';
  };

  const getColSpanClass = (format: Format) => {
    if (screenSize === 'small') {
      return 'col-span-1';
    }

    if (screenSize === 'medium') {
      return format === 'rectangular' ? 'col-span-2' : 'col-span-1';
    }

    return format === 'rectangular' ? 'col-span-2' : 'col-span-1';
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="w-full">
      <div className="w-full py-12 px-2 md:px-2 lg:px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-8">
            {currentConfig.title}
          </h1>

          <div className="relative w-full">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={currentConfig.placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-black/20 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black/40 transition-colors"
            />
          </div>

          <p className="text-gray-400 text-sm mt-4">
            {filteredItems.length}{' '}
            {filteredItems.length === 1 ? currentConfig.singular : currentConfig.plural}{' '}
            encontrada{filteredItems.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="w-full py-8 px-2 md:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length > 0 ? (
            <div className={`grid ${getGridClass()} auto-rows-max gap-4`}>
              {filteredItems.map((item) => {
                const colSpan = getColSpanClass(getFormat(item));

                return (
                  <Link
                    href={`/acervo/${item.idWork}/detalhes`}
                    key={item.idWork}
                    className={`${colSpan} h-[380px] relative overflow-hidden group cursor-pointer block bg-black/5 rounded-lg`}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 p-3 md:p-5 w-full text-left">
                      <h3
                        className="text-lg md:text-xl font-bold mb-0.5 leading-tight"
                        style={{ color: 'var(--accent)' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-sm text-white line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Nenhuma {currentConfig.singular} encontrada para sua busca.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
