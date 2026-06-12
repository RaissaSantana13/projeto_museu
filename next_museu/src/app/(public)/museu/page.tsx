import { FeaturedArtworks } from '@/components/shared/landing/featured-artworks';
import { RotatingArtworks } from '@/components/shared/landing/rotating-artworks';
import { HighlightCarousel } from '../../../components/shared/landing/carrossel';
import { Faqs } from '../../../components/shared/landing/faq';
import { HeroMuseum } from '../../../components/shared/landing/hero';

export default function Home() {
  const hasHighlightedArtworks = true;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-col flex-grow w-full">
        <HeroMuseum />
        <HighlightCarousel />
        {hasHighlightedArtworks && <FeaturedArtworks />}
        <RotatingArtworks />
        <Faqs />
      </main>
    </div>
  );
}
