import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ExhibitionDetails {
  title: string;
  summary: string;
  description: string;
  img: string;
}

const EXHIBITIONS: Record<string, ExhibitionDetails | undefined> = {
  '743836ab-e940-4c71-828f-b0223d72549c': {
    title: 'O solo vira arte',
    summary:
      'Explore as cores e texturas naturais do solo como matéria-prima artística.',
    description:
      'O que muda quando olhamos para o chão como matéria-prima? A exposição convida a observar as tonalidades e texturas da terra e a descobrir como elas podem ser usadas na criação artística.',
    img: '/images/expo_solo.png',
  },
  'ae68d180-e62f-4ab2-bf07-8e4f8b4f533a': {
    title: 'O mundo em grafite',
    summary:
      'Obras que revelam a versatilidade do grafite, dos retratos aos cenários surreais.',
    description:
      'Dos retratos às paisagens surreais, a exposição reúne obras feitas em grafite. Observe como o contraste entre luz e sombra e a variedade de traços criam volume, textura e expressão.',
    img: '/images/expo_grafite.png',
  },
  'a1514b35-3ff3-4642-81fe-1803ea95acd9': {
    title: 'Tipografia urbana',
    summary:
      'Conheça a arte das letras que dão identidade às fachadas e aos espaços das cidades.',
    description:
      'A exposição propõe um olhar atento para as letras presentes no espaço urbano. Em placas, fachadas e anúncios, a forma de escrever ajuda a contar a história e a revelar a identidade de cada lugar.',
    img: '/images/expo_tipografia.png',
  },
};

export function EventDetails({ eventId }: { eventId: string }) {
  const exhibition = Object.hasOwn(EXHIBITIONS, eventId)
    ? EXHIBITIONS[eventId]
    : undefined;

  if (!exhibition) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-20 sm:px-8 lg:px-12">
        <h1 className="font-serif text-4xl font-semibold">
          Exposição não encontrada
        </h1>
        <Link
          href="/exposicoes"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar às exposições
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full flex-1 bg-background text-foreground">
      <article className="mx-auto max-w-6xl px-5 pt-6 pb-16 sm:px-8 sm:pt-8 sm:pb-24 lg:px-12">
        <Link
          href="/exposicoes"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar às exposições
        </Link>

        <div className="mt-6 grid items-start gap-x-12 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
          <header className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
              Exposição · Museu de Birigui
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {exhibition.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {exhibition.summary}
            </p>
          </header>

          <figure className="w-full max-w-60 rounded-xl bg-muted p-3 md:row-span-2 md:max-w-none">
            <Image
              src={exhibition.img}
              alt={`Cartaz da exposição ${exhibition.title}`}
              width={427}
              height={430}
              sizes="(min-width: 768px) 232px, 216px"
              className="h-auto w-full rounded-md object-contain"
              preload
            />
          </figure>

          <section
            aria-labelledby="sobre-titulo"
            className="max-w-2xl border-t border-border pt-6"
          >
            <h2
              id="sobre-titulo"
              className="font-serif text-2xl font-semibold sm:text-3xl"
            >
              Sobre a exposição
            </h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
              {exhibition.description}
            </p>
          </section>
        </div>

        <section
          aria-labelledby="informacoes-titulo"
          className="mt-8 rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-7"
        >
          <h2
            id="informacoes-titulo"
            className="font-serif text-2xl font-semibold"
          >
            Informações para a visita
          </h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Local</dt>
              <dd className="mt-1 text-muted-foreground">
                Museu Histórico “Dr. Renato Cordeiro”
                <br />
                Praça James Mellor, s/n · Birigui
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Período e horários</dt>
              <dd className="mt-1 text-muted-foreground">A confirmar</dd>
            </div>
          </dl>
        </section>
      </article>
    </main>
  );
}
