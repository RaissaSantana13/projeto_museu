import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TOUR_FEATURES = [
  {
    title: 'Olhe em todas as direções',
    description: 'Arraste a imagem para observar cada ambiente em 360°.',
    Icon: Compass,
  },
  {
    title: 'Escolha por onde seguir',
    description: 'Use os pontos de navegação para entrar nas salas do museu.',
    Icon: MapPin,
  },
];

export default function TourVirtualPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-background text-foreground">
        <section
          aria-labelledby="tour-title"
          className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20"
        >
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Tour virtual · Museu de Birigui
              </p>
              <h1
                id="tour-title"
                className="mt-4 max-w-[13ch] font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.04] font-semibold tracking-tight"
              >
                Explore o museu em 360°
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                Passeie pelas salas do Museu de Birigui, observe os objetos do
                acervo e conheça espaços que guardam a memória da cidade.
              </p>
              <Button
                asChild
                className="mt-7 min-h-11 gap-3 bg-[#96460a] px-5 text-[#fff4e3] hover:bg-[#7b390b]"
              >
                <Link href="/virtual-tour-360">
                  Iniciar tour virtual
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <figure className="relative isolate flex flex-col overflow-hidden rounded-2xl bg-[#472713] bg-radial-[at_50%_42%] from-[#754018] to-[#321c11] px-5 pt-7 pb-5 text-[#fff4e3] sm:px-7 sm:pt-10 sm:pb-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-[1.6] w-[98%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-[#f3dfaa]/25"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-[1.6] w-[87%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-[#f3dfaa]/20"
              />
              <Image
                src="/images/paco-tour-virtual.jpg"
                alt="Fotografia da fachada do Paço Municipal de Birigui, com fonte e busto na praça"
                width={1300}
                height={867}
                sizes="(min-width: 1280px) 475px, (min-width: 768px) 40vw, 85vw"
                className="mx-auto h-auto w-full rounded-xl border border-[#f3dfaa]/30 shadow-lg shadow-black/40 sm:w-[90%]"
                preload
              />
              <figcaption className="relative mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#f3dfaa]/25 pt-3 text-sm">
                <span>Paço Municipal de Birigui</span>
                <span className="rounded-full border border-[#f3dfaa]/40 px-3 py-1 text-xs font-bold text-[#f3dfaa]">
                  Visão 360°
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-2 lg:mt-12">
            {TOUR_FEATURES.map(({ title, description, Icon }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">{title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
