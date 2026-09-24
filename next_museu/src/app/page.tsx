import { RotatingArtworks } from '@/components/shared/landing/rotating-artworks';
import { HighlightCarousel } from '../components/shared/landing/carrossel';
import { Faqs } from '../components/shared/landing/faq';
import { Footer } from '../components/shared/landing/footer';
import { HeroMuseum } from '../components/shared/landing/hero';
import { Navbar } from '../components/shared/landing/nav-bar';
import { ProgramacaoCarousel } from '../components/shared/landing/programacao-carousel';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center w-full overflow-x-hidden">
        <HeroMuseum />
        <ProgramacaoCarousel />
        <HighlightCarousel />
        <RotatingArtworks />
        <Faqs />
      </main>
      <Footer />
    </div>
  );
}
