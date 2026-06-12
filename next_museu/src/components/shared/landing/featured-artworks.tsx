'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';

interface ObraDestaque {
  id: string;
  title: string;
  description: string;
  img: string;
}

const OBRAS_DESTAQUE: ObraDestaque[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Troféu Locomotiva de Bronze',
    description:
      'Prêmio comemorativo institucional em formato de locomotiva sobre base metálica.',
    img: '/images/metal_train.jpg',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Microfone Condensador Behringer B-1',
    description:
      'Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.',
    img: '/images/microphone.png',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Cálice de Madeira Indígena',
    description:
      'Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.',
    img: '/images/cup.jpg',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Telefone de Parede Antigo',
    description:
      'Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.',
    img: '/images/old_telephone.jpg',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Jarro de Terracota',
    description:
      'Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.',
    img: '/images/terracota_jug.jpg',
  },
];

export function FeaturedArtworks() {
  return (
    <section
      className="w-full py-5 px-2 md:px-4 lg:px-6 bg-black/80"
      style={{ background: 'var(--foreground)' }}
    >
      <div className="mb-6">
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ color: 'var(--accent)' }}
        >
          Obras em Destaque
        </h2>
      </div>

      <div className="relative px-10">
        <Carousel opts={{ align: 'start', loop: false }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4 lg:-ml-8">
            {OBRAS_DESTAQUE.map((obra) => (
              <CarouselItem
                key={obra.id}
                className="pl-2 md:pl-4 lg:pl-8 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/2"
              >
                <Link
                  href={`/acervo/${obra.id}/detalhes`}
                  className="h-[320px] relative overflow-hidden group cursor-pointer block"
                >
                  <div className="absolute top-3 right-3 px-4 py-2 rounded-lg flex items-center justify-center z-20 bg-black/75">
                    <span
                      className="text-white text-sm font-medium tracking-wide"
                      style={{ color: 'rgba(214, 205, 141, 1)' }}
                    >
                      Destaque
                    </span>
                  </div>

                  <Image
                    src={obra.img}
                    alt={obra.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

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
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="border transition-all duration-200 hover:bg-white/20 -left-12" />
          <CarouselNext className="border transition-all duration-200 hover:bg-white/20 -right-12" />
        </Carousel>
      </div>
    </section>
  );
}
