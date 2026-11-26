import { LandingGallery } from '@/components/shared/landing/landing-gallery';
import { LandingSchedule } from '@/components/shared/landing/landing-schedule';
import { HighlightCarousel } from '../components/shared/landing/carrossel';
import { Faqs } from '../components/shared/landing/faq';
import { Footer } from '../components/shared/landing/footer';
import { HeroMuseum } from '../components/shared/landing/hero';
import { Navbar } from '../components/shared/landing/nav-bar';
import AccessibilityToolbar from '@/components/layout/AccessibilityToolbar';
import VLibras from '@/components/layout/VLibras';

export default function Home() {
  return (
    <>
      <AccessibilityToolbar />
      <VLibras />
      <div className="a11y-page-content relative flex min-h-screen flex-col">
        <Navbar overHero />
        <main className="flex-grow flex flex-col items-center w-full overflow-x-hidden">
          <HeroMuseum />
          <LandingSchedule />
          <HighlightCarousel />
          <LandingGallery />
          <Faqs />
        </main>
        <Footer />
      </div>
    </>
  );
}
