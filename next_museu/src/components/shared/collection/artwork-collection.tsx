'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ScreenSize = 'small' | 'medium' | 'large';

type Format = 'rectangular' | 'square';

interface Obra {
  id: string;
  title: string;
  description: string;
  img: string;
  format: Format;
}

const OBRAS: Obra[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Troféu Locomotiva de Bronze',
    description:
      'Prêmio comemorativo institucional em formato de locomotiva sobre base metálica.',
    img: '/images/metal_train.jpg',
    format: 'rectangular',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Microfone Condensador Behringer B-1',
    description:
      'Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.',
    img: '/images/microphone.png',
    format: 'square',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Cálice de Madeira Indígena',
    description:
      'Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.',
    img: '/images/cup.jpg',
    format: 'square',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Telefone de Parede Antigo',
    description:
      'Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.',
    img: '/images/old_telephone.jpg',
    format: 'rectangular',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Jarro de Terracota',
    description:
      'Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.',
    img: '/images/terracota_jug.jpg',
    format: 'square',
  },
];

export function ArtworkCollection() {
  const [screenSize, setScreenSize] = useState<ScreenSize>('large');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredObras = OBRAS.filter(
    (obra) =>
      obra.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="w-full">
      {/* Header */}
      <div className="w-full py-12 px-2 md:px-2 lg:px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-8">
            Acervo de Obras
          </h1>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar obras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-black/20 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black/40 transition-colors"
            />
          </div>

          {/* Results count */}
          <p className="text-gray-400 text-sm mt-4">
            {filteredObras.length}{' '}
            {filteredObras.length === 1 ? 'obra' : 'obras'} encontrada
            {filteredObras.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="w-full py-8 px-2 md:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {filteredObras.length > 0 ? (
            <div className={`grid ${getGridClass()} auto-rows-max gap-4`}>
              {filteredObras.map((obra) => {
                const colSpan = getColSpanClass(obra.format);

                return (
                  <Link
                    href={`/acervo/${obra.id}/detalhes`}
                    key={obra.id}
                    className={`${colSpan} h-[380px] relative overflow-hidden group cursor-pointer block`}
                  >
                    {/* Background Image */}
                    <Image
                      src={obra.img}
                      alt={obra.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Content - Bottom Left */}
                    <div className="absolute bottom-0 left-0 p-3 md:p-5 w-full text-left">
                      <h3
                        className="text-lg md:text-xl font-bold mb-0.5 leading-tight"
                        style={{ color: 'var(--accent)' }}
                      >
                        {obra.title}
                      </h3>
                      <p className="text-sm md:text-sm text-white line-clamp-2">
                        {obra.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Nenhuma obra encontrada para sua busca.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
