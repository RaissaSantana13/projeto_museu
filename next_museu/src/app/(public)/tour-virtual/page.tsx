import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';
import Image from 'next/image';
import Link from 'next/link';

export default function TourVirtualpage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section
        id="hero"
        className="relative flex min-h-[600px] w-full items-center overflow-hidden bg-[#96460A] px-6 py-16 md:min-h-[620px] md:px-12 lg:px-20"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-19 md:flex-row md:gap-16">
          <Image
            src="/images/85fcd86a-d292-405e-8cba-2f45bb9e55ef%20(1).png"
            alt="Logo do Museu de Birigui"
            width={180}
            height={180}
              className="h-76 w-auto shrink-0 self-center object-contain md:-translate-y-7 md:h-88"
          />
          <div className="max-w-3xl text-center md:text-left">
          <h2 className="mb-6 font-serif text-4xl font-bold text-[#FFD44A] md:text-5xl">
            O que é o Tour Virtual:
          </h2>
          <p className="mb-5 text-lg leading-relaxed text-[#FFF3C4] md:text-xl">
            Seja bem-vindo ao Museu Virtual de Biriguí. Esta experiência
            imersiva em 360° convida você a explorar os espaços do museu e a
            conhecer os objetos que preservam a memória e a identidade cultural
            da cidade. Navegue livremente pelos ambientes e interaja com os
            pontos de interesse para descobrir informações e curiosidades sobre
            cada item do acervo.
          </p>
          <Link
            href="/virtual-tour-360"
            className="inline-flex rounded-full bg-[#FFD44A] px-14 py-4 font-bold uppercase tracking-widest text-[#6B2F0B] transition-colors hover:bg-[#FFE27A]"
          >
            Tour Virtual
          </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
