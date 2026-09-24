import Image from 'next/image';

export function HeroMuseum() {
  return (
    <section
      id="hero"
      className="relative w-full h-[500px] md:h-[450px] lg:h-[500px] overflow-hidden"
    >
      {/* Imagem de fundo */}
      <Image
        src="/images/capa_dashboard.png"
        alt="Capa do Museu de Birigui"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay escuro para melhorar legibilidade do texto */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Título centralizado */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <h1 className="font-inter text-center text-4xl font-bold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
          MUSEU VIRTUAL DE BIRIGUI
        </h1>
      </div>

      {/* Bloco inferior — texto à esquerda, imagens à direita */}
      <div className="absolute bottom-8 left-8 right-8 z-10 flex items-end justify-between">
        {/* Texto */}
        <div>
          <p className="text-white text-sm md:text-base font-bold drop-shadow-lg">
            DESTAQUES E INGRESSOS
          </p>
          <p className=" text-white/80 text-sm md:text-base mt-1 drop-shadow">
            Aberto hoje das 8h às 17h
          </p>
        </div>

        {/* Duas imagens pequenas */}
        <div className="flex gap-3">
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
      </div>
    </section>
  );
}
