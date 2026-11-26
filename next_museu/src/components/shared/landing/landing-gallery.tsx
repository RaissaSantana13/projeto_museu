import { ArtworkGallery } from '@/components/shared/collection/artwork-gallery';
import { OBRAS } from '@/components/shared/collection/collection-items';
import { LandingSectionHeading } from './landing-section-heading';

export function LandingGallery() {
  return (
    <section
      id="acervo"
      aria-labelledby="landing-gallery-title"
      className="w-full scroll-mt-16 bg-background text-foreground"
    >
      <LandingSectionHeading
        id="landing-gallery-title"
        title="Destaques do acervo"
        href="/acervo"
        linkLabel="Ver acervo completo"
      />
      <ArtworkGallery items={OBRAS} />
    </section>
  );
}
