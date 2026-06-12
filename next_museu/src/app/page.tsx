import { FeaturedArtworks } from '@/components/shared/landing/featured-artworks';
import { RotatingArtworks } from '@/components/shared/landing/rotating-artworks';
import { HighlightCarousel } from '../components/shared/landing/carrossel';
import { Faqs } from '../components/shared/landing/faq';
import { Footer } from '../components/shared/landing/footer';
import { HeroMuseum } from '../components/shared/landing/hero';
import { Navbar } from '../components/shared/landing/nav-bar';

export default function Home() {
  const hasHighlightedArtworks = true;

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center w-full overflow-x-hidden">
        <HeroMuseum />
        <HighlightCarousel />
        {hasHighlightedArtworks && <FeaturedArtworks />}
        <RotatingArtworks />
        <Faqs />
      </main>
      <Footer />
    </div>
  );
}
