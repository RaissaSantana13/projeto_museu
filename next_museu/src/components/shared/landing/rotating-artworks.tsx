'use client';

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
    img: '/images/train.jpg',
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

export function RotatingArtworks() {
  const [screenSize, setScreenSize] = useState<ScreenSize>('large');

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

    // Large screen
    return format === 'rectangular' ? 'col-span-2' : 'col-span-1';
  };

  return (
    <section
      className="w-full py-8 px-2 md:px-4 lg:px-6 bg-black/80"
      style={{ background: 'var(--foreground)' }}
    >
      <div className={`grid ${getGridClass()} auto-rows-max gap-4`}>
        {OBRAS.map((obra) => {
          const colSpan = getColSpanClass(obra.format);

          return (
            <Link
              href={`/acervo/${obra.id}/detalhes`}
              key={obra.id}
              className={`${colSpan} h-[380px] relative overflow-hidden group cursor-pointer block bg-black/5 rounded-lg`}
            >
              <Image
                src={obra.img}
                alt={obra.title}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg" />

              {/* Content - Bottom Left */}
              <div className="absolute bottom-0 left-0 p-3 md:p-5 w-full text-left">
                <h3
                  className="text-lg md:text-xl font-bold mb-0.5 leading-tight"
                  style={{ color: 'rgb(241, 228, 178)' }}
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
    </section>
  );
}
