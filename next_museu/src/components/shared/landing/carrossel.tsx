'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PECAS = [
  {
    id: '743836ab-e940-4c71-828f-b0223d72549c',
    title: 'O solo vira arte',
    description:
      'Venha explorar as cores e texturas naturais do solo como matéria-prima artistica.',
    startDate: '24/03/2026',
    endDate: '24/06/2026',
    featured: true,
    img: '/images/expo_solo.png',
  },
  {
    id: 'ae68d180-e62f-4ab2-bf07-8e4f8b4f533a',
    title: 'O mundo em grafite',
    description:
      'A exposição "O Mundo em Grafite" apresenta uma coleção impressionante de obras de arte criadas exclusivamente com grafite, revelando a versatilidade e a expressividade desse material aparentemente simples. Desde retratos detalhados até paisagens surreais, cada peça é uma demonstração do talento e da criatividade dos artistas que transformam o grafite em verdadeiras obras-primas visuais.',
    startDate: '10/04/2026',
    endDate: '18/08/2026',
    featured: false,
    img: '/images/expo_grafite.png',
  },
  {
    id: 'a1514b35-3ff3-4642-81fe-1803ea95acd9',
    title: 'Tipografia urbana',
    description:
      'A exposição "Tipografia Urbana" mergulha no fascinante mundo das letras e fontes que compõem a paisagem urbana. Apresentando uma coleção diversificada de tipografias encontradas em fachadas, placas de rua, grafites e anúncios publicitários, esta exposição celebra a arte da tipografia como um elemento essencial da identidade visual das cidades. Desde estilos clássicos até designs contemporâneos, os visitantes serão convidados a explorar a riqueza e a criatividade presentes nas letras que moldam o ambiente urbano.',
    startDate: '02/05/2026',
    endDate: '30/09/2026',
    featured: false,
    img: '/images/expo_tipografia.png',
  },
];

export function HighlightCarousel() {
  const router = useRouter();

  const handleEventClick = (id: string) => {
    router.push(`/eventos/${id}/detalhes`);
  };

  return (
    <section
      id="exposicoes"
      className="relative py-8 overflow-hidden w-full"
      style={{ backgroundColor: '#96460A' }}
    >
      {/* container MUITO maior */}
      <div className="w-full px-8 xl:px-8 2xl:px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
              Exposições
            </h2>
          </div>

          <Link
            href="/exposicoes"
            className="flex items-center gap-2 text-xs font-bold uppercase text-white tracking-widest px-6 py-4 transition-all duration-200 hover:bg-white/10 rounded-full"
          >
            Confira todas as exposições
            <ArrowRight size={14} />
          </Link>
        </div>

        <Carousel
          opts={{ align: 'start', loop: false }}
          className="w-full [&>div]:overflow-visible"
        >
          <CarouselContent className="-ml-6">
            {PECAS.map((peca, i) => (
              <CarouselItem
                key={i}
                className="pl-6 basis-[70%] sm:basis-[50%] md:basis-[38%] lg:basis-[30%] xl:basis-[24%]"
              >
                <Card
                  onClick={() => handleEventClick(peca.id)}
                  className="overflow-hidden border-0 pt-0 pb-5 rounded-3xl group cursor-pointer bg-white shadow-[0_8px_40px_rgba(0,0,0,0.5)] h-full"
                >
                  <CardContent className="p-0 m-0 h-full flex flex-col gap-0">
                    {/* IMAGEM */}
                    <div className="relative w-full h-[320px] overflow-hidden m-0">
                      {peca.featured && (
                        <div className="absolute top-3 right-3 px-4 py-2 rounded-lg flex items-center justify-center z-20 bg-black/75">
                          <span
                            className="text-white text-sm font-medium tracking-wide"
                            style={{ color: 'rgba(214, 205, 141, 1)' }}
                          >
                            Destaque
                          </span>
                        </div>
                      )}
                      <Image
                        src={peca.img}
                        alt={peca.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{
                          filter: 'sepia(0.18) brightness(0.88)',
                          objectPosition: '50% 20%',
                        }}
                      />
                    </div>

                    {/* INFOS */}
                    <div className="flex flex-col justify-between flex-1 p-4 text-left bg-white">
                      <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-zinc-500">
                          EXPOSIÇÃO | MUSEU HISTÓRICO
                        </p>

                        <div className="w-10 h-[2px] bg-[#96460A] my-4 rounded-full" />

                        <h3 className="text-lg font-bold text-zinc-900 mb-3 leading-snug">
                          {peca.title}
                        </h3>

                        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3 min-h-[54px]">
                          {peca.description}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-col gap-1">
                        <p className="text-xs text-zinc-700">
                          <span className="font-semibold">Início</span> |{' '}
                          {peca.startDate}
                        </p>

                        <p className="text-xs text-zinc-700">
                          <span className="font-semibold">Término</span> |{' '}
                          {peca.endDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="border transition-all duration-200 hover:bg-white/10 -left-2 h-14 w-14"
            style={{
              borderColor: 'rgba(255,240,200,0.40)',
              background: 'rgba(150,70,10,0.70)',
              color: '#fff8ee',
            }}
          />

          <CarouselNext
            className="
              border
              transition-all
              duration-200
              hover:bg-white/10
              -right-2
              h-14
              w-14
            "
            style={{
              borderColor: 'rgba(255,240,200,0.40)',
              background: 'rgba(150,70,10,0.70)',
              color: '#fff8ee',
            }}
          />
        </Carousel>
      </div>
    </section>
  );
}
