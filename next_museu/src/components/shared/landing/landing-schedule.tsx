import {
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { DepthDeck, DepthDeckItem } from '../motion/depth-deck';
import { ProgramacaoCard } from '../programacao/programacao-card';
import { PROGRAMACAO } from '../programacao/programacao-data';
import { LandingSectionHeading } from './landing-section-heading';

const EVENTOS_ATIVOS = PROGRAMACAO.filter(
  ({ scheduleStatus }) =>
    scheduleStatus === 'Em cartaz' || scheduleStatus === 'Últimos dias',
);

const arrowClass =
  'static size-11 translate-y-0 border-orange-200/45 bg-transparent text-orange-50 hover:bg-white/10 hover:text-white dark:bg-transparent dark:hover:bg-white/10';

export function LandingSchedule() {
  return (
    <section
      id="programacao"
      aria-labelledby="landing-schedule-title"
      className="w-full scroll-mt-16 bg-[#472713] pb-8 text-orange-50"
    >
      <LandingSectionHeading
        id="landing-schedule-title"
        title="Programação"
        href="/programacao"
        linkLabel="Ver programação completa"
        onDark
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {EVENTOS_ATIVOS.length > 1 ? (
          <DepthDeck
            aria-label="Eventos em cartaz e últimos dias"
            className="w-full"
            opts={{ align: 'start' }}
          >
            <CarouselContent className="-ml-4 cursor-grab py-2 select-none active:cursor-grabbing">
              {EVENTOS_ATIVOS.map((event, index) => (
                <DepthDeckItem
                  key={event.id}
                  index={index}
                  className="basis-[92%] pl-4 sm:basis-[88%]"
                >
                  <ProgramacaoCard event={event} compact />
                </DepthDeckItem>
              ))}
            </CarouselContent>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-orange-100/85">
                Arraste para ver mais eventos
              </p>
              <div className="flex gap-2">
                <CarouselPrevious
                  aria-label="Evento anterior"
                  className={arrowClass}
                />
                <CarouselNext aria-label="Próximo evento" className={arrowClass} />
              </div>
            </div>
          </DepthDeck>
        ) : EVENTOS_ATIVOS.length === 1 ? (
          <div className="w-full">
            <ProgramacaoCard event={EVENTOS_ATIVOS[0]} compact />
          </div>
        ) : (
          <p className="rounded-lg border border-orange-200/25 bg-black/10 px-4 py-3 text-sm">
            Nenhum evento em cartaz no momento.
          </p>
        )}
      </div>
    </section>
  );
}
