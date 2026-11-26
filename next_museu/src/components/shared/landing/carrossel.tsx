import { EXPOSICOES } from '@/components/shared/exposicoes/exposicoes-data';
import { ExposicoesList } from '@/components/shared/exposicoes/exposicoes-list';
import { LandingSectionHeading } from './landing-section-heading';

export function HighlightCarousel() {
  return (
    <section
      id="exposicoes"
      aria-labelledby="landing-exhibitions-title"
      className="w-full scroll-mt-16 bg-background pb-8 text-foreground"
    >
      <LandingSectionHeading
        id="landing-exhibitions-title"
        title="Exposições"
        href="/exposicoes"
        linkLabel="Ver todas as exposições"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <ExposicoesList items={EXPOSICOES} />
      </div>
    </section>
  );
}
