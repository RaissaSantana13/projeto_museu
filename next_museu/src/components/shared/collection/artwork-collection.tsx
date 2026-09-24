'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ScreenSize = 'small' | 'medium' | 'large';
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
                const colSpan = getColSpanClass(item.format);

                return (
                  <Link
                    href={`/acervo/${item.id}/detalhes`}
                    key={item.id}
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
