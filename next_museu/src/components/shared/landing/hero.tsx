import Image from 'next/image';

export function HeroMuseum() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[max(32rem,100svh)] w-full items-end overflow-hidden bg-neutral-900"
    >
      <Image
        src="/images/capa-paco-municipal.jpg"
        alt="Paço Municipal de Birigui, com a fonte e o busto na praça"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[58%_55%] sm:object-[center_55%]"
        priority
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/95 via-black/65 via-35% to-transparent to-80%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-36 bg-linear-to-b from-black/85 via-black/55 to-transparent"
      />

      <div className="grid w-full items-start gap-4 px-[clamp(1.25rem,5.5vw,8rem)] pt-20 pb-[clamp(2rem,6vh,5rem)] text-left text-white md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <h1 className="text-[clamp(2rem,5.15vw,7.25rem)] leading-[0.95] font-extrabold tracking-tight wrap-break-word drop-shadow-lg">
            MUSEU VIRTUAL DE BIRIGUI
          </h1>

          <p className="mt-2 text-base drop-shadow sm:text-xl">
            Aberto hoje das 8h às 17h
          </p>
        </div>

        <div className="flex items-center justify-self-end gap-3">
          <div className="relative h-14 w-[4.25rem] shrink-0 sm:h-16 sm:w-[4.75rem]">
            <Image
              src="/images/logos/logo_birigui.png"
              alt="Prefeitura de Birigui"
              fill
              sizes="(min-width: 640px) 76px, 68px"
              className="object-contain object-left"
            />
          </div>
          <div className="relative h-14 w-12 shrink-0 sm:h-16 sm:w-14">
            <Image
              src="/images/logos/logo_if.png"
              alt="Instituto Federal"
              fill
              sizes="(min-width: 640px) 56px, 48px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
