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
        className="relative w-full h-[700px] md:h-[600px] lg:h-[700px] overflow-hidden"
      >
        {/* Imagem de fundo */}
        <Image
          src="/images/capa_dashboard.png"
          alt="Capa do Museu de Birigui"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Título no topo */}
        <div className="absolute top-6 left-0 right-0 z-10 flex justify-center px-4">
          <h1 className="font-inter text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center drop-shadow-lg">
            MUSEU VIRTUAL DE BIRIGUI
          </h1>
        </div>

        {/* Texto e botão centralizados */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-justify px-6">
          <h2 className="text-5xl text-4xl font-serif font-bold text-white mb-6">
            O que é o Tour Virtual
          </h2>
          <p className="text-lg md:text-xl text-white max-w-3xl leading-relaxed mb-10">
            Seja bem-vindo ao Museu Virtual de Biriguí. Esta experiência
            imersiva em 360° convida você a explorar os espaços do museu e a
            conhecer os objetos que preservam a memória e a identidade cultural
            da cidade. Navegue livremente pelos ambientes e interaja com os
            pontos de interesse para descobrir informações e curiosidades sobre
            cada item do acervo.
          </p>
          <Link
            href="/virtual-tour-360"
            className="bg-amber-800 hover:bg-amber-900 transition-colors text-white font-bold tracking-widest py-4 px-14 rounded-full uppercase"
          >
            Tour Virtual
          </Link>
        </div>

        {/* Logos no canto inferior DIREITO */}
        <div className="absolute bottom-8 right-8 z-10 flex gap-3">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden">
            <Image
              src="/images/logos/logo_birigui.png"
              alt="Logo Birigui"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden">
            <Image
              src="/images/logos/logo_if.png"
              alt="Logo IF"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
