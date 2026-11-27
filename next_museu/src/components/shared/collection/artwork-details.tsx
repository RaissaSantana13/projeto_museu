import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ModelViewer } from '../landing/models-3d';
import { DOCUMENTOS, FOTOGRAFIAS } from './collection-items';

interface ObraDetalhes {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  img: string;
  categories: string[];
  year?: string;
  artist?: string;
  material?: string;
  model3dFileName?: string;
  model3dScale?: number;
  model3dCameraDistance?: number;
  model3dRotation?: [number, number, number];
}

const OBRAS_DATABASE: Record<string, ObraDetalhes> = {
  '550e8400-e29b-41d4-a716-446655440000': {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Troféu Locomotiva de Bronze',
    description:
      'Prêmio comemorativo institucional em formato de locomotiva sobre base metálica',
    fullDescription:
      "Um troféu ou placa de homenagem institucional intitulado 'Locomotiva de Prata', concedido à Agatha Dafine Velani pelo Real Seguros (agência 123-8 - São Caetano / Sucursal Santo André). A peça traz a inscrição 'Nossa Maior Conquista: Ação do Vida', celebrando metas ou conquistas alcançadas em julho de 2006. Apresenta uma miniatura detalhada de uma locomotiva a vapor sobre trilhos, fixada em uma base retangular robusta, inteiramente com acabamento prateado.",
    img: '/images/train.jpg',
    categories: [
      'Premiações',
      'Memorabilia Corporativa',
      'Anos 2000',
      'Ferromodelismo',
    ],
    year: '2006',
    artist: 'Real Seguros (Institucional)',
    material: 'Metal com acabamento prateado',
    model3dFileName: 'trem.glb',
    model3dScale: 3.5,
    model3dCameraDistance: 4.5,
    model3dRotation: [-Math.PI / 4, -Math.PI / 8, 0.2],
  },
  '550e8400-e29b-41d4-a716-446655440001': {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Microfone Condensador Behringer B-1',
    description:
      'Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.',
    fullDescription:
      'O Behringer B-1 é um microfone condensador de grande diafragma projetado para gravação em estúdio. Possui uma cápsula banhada a ouro, padrão de captação cardioide que reduz ruídos laterais, e chaves físicas no corpo para atenuação de entrada (-10 dB) e filtro de corte de graves (low-cut). É um equipamento clássico de áudio profissional, ideal para vozes e instrumentos acústicos, exigindo alimentação Phantom Power (+48V) para funcionamento.',
    img: '/images/microphone.png',
    categories: ['Áudio Profissional', 'Equipamento de Estúdio', 'Microfones'],
    year: '2000-Presente',
    artist: 'Behringer',
    material: 'Metal niquelado e componentes eletrônicos',
    model3dFileName: 'microfone.glb',
    model3dScale: 1.8,
    model3dCameraDistance: 3.5,
    model3dRotation: [0, 0, 0],
  },
  '550e8400-e29b-41d4-a716-446655440004': {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Cálice de Madeira Indígena',
    description:
      'Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.',
    fullDescription:
      'Um cálice utilitário ou ritualístico, confeccionado artesanalmente a partir de um único bloco de madeira de lei. A peça apresenta linhas orgânicas e elegantes, uma copa ogival profunda e uma base circular de sustentação bem definida. O trabalho de tornearia ou escultura manual destaca os veios naturais escuros da madeira, recebendo um polimento fino que confere um aspecto acetinado e sofisticado ao objeto.',
    img: '/images/cup.jpg',
    categories: [
      'Arte Indígena',
      'Artesanato',
      'Utensílios de Madeira',
      'Arte Sacra e Ritualistica',
    ],
    year: '1600-1800',
    artist: 'Artesão Indígena Desconhecido',
    material: 'Madeira maciça',
    model3dFileName: 'caliceindigena.glb',
    model3dScale: 12.0,
    model3dCameraDistance: 4.0,
    model3dRotation: [Math.PI / 2, 0, 0],
  },
  '550e8400-e29b-41d4-a716-446655440005': {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Telefone de Parede Antigo',
    description:
      'Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.',
    fullDescription:
      'Um clássico telefone de parede do final do século XIX ou início do século XX, montado em uma estrutura de madeira nobre. O aparelho possui um sistema de campainha dupla de metal no topo, um bocal/receptor conectado por cabo de tecido e uma manivela lateral utilizada para gerar corrente e chamar a telefonista. Este tipo de objeto representa um marco na evolução das telecomunicações globais.',
    img: '/images/old_telephone.jpg',
    categories: ['Antiguidades', 'Telecomunicações', 'História da Tecnologia'],
    year: '1890-1920',
    artist: 'LM Ericsson & Co.',
    material: 'Madeira, ferro e latão',
    model3dFileName: 'telefone.glb',
    model3dScale: 2.4,
    model3dCameraDistance: 4.0,
    model3dRotation: [0, 0, 0],
  },
  '550e8400-e29b-41d4-a716-446655440006': {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Jarro de Terracota',
    description:
      'Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.',
    fullDescription:
      'Este recipiente de terracota, marcado pelo tempo e com o bocal quebrado, era utilizado pelos primeiros habitantes de Birigui-SP para armazenar e refrescar água. Hoje, a peça é um importante registro histórico que simboliza o trabalho, a simplicidade e a resiliência dos pioneiros no interior paulista.',
    img: '/images/terracota_jug.jpg',
    categories: [
      'Arte Indígena',
      'Artesanato',
      'Utensílios de Argila',
      'Arte Sacra e Ritualistica',
    ],
    year: '1901-2000',
    artist: 'Artesão Indígena Desconhecido',
    material: 'Argila cozida',
    model3dFileName: 'vazo.glb',
    model3dScale: 4.5,
    model3dCameraDistance: 3.5,
    model3dRotation: [0, 0, 0],
  },
};

export function ArtworkDetails({ obraId }: { obraId: string }) {
  const obra = Object.hasOwn(OBRAS_DATABASE, obraId)
    ? OBRAS_DATABASE[obraId]
    : undefined;
  const fotografia = FOTOGRAFIAS.find((item) => item.id === obraId);
  const documento = DOCUMENTOS.find((item) => item.id === obraId);
  const item = obra ?? fotografia ?? documento;

  if (!item) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-20 sm:px-8 lg:px-12">
        <h1 className="font-serif text-4xl font-semibold">
          Item não encontrado
        </h1>
        <Link
          href="/acervo"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar ao acervo
        </Link>
      </main>
    );
  }

  const tipo = documento ? 'documento' : fotografia ? 'foto' : 'obra';
  const categoria = documento
    ? 'Documentos históricos'
    : fotografia
      ? 'Fotografias'
      : 'Obras e objetos';
  const facts = (
    documento
      ? [
          { label: 'Ano de publicação', value: documento.year },
          { label: 'Edição', value: `Nº ${documento.edition}` },
          {
            label: 'Formato',
            value: `PDF digitalizado · ${documento.pages} páginas`,
          },
        ]
      : [
          { label: 'Período', value: item.year },
          { label: 'Artista ou fabricante', value: obra?.artist },
          { label: 'Material', value: obra?.material },
        ]
  ).filter(({ value }) => value != null);

  return (
    <main className="w-full flex-1 bg-background text-foreground">
      <div className="bg-neutral-950 bg-radial-[at_50%_55%] from-[#35261e] to-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-5 pt-6 pb-8 sm:px-8 sm:pt-8 lg:px-12">
          <Link
            href={`/acervo?tipo=${tipo}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar ao acervo
          </Link>

          <figure className="mt-4">
            <div className="relative mx-auto h-[clamp(17rem,58svh,38rem)] w-full max-w-5xl">
              <Image
                src={item.img}
                alt={documento ? `Capa de ${item.title}` : item.title}
                fill
                sizes="(min-width: 1120px) 1024px, 92vw"
                className="object-contain"
                preload
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1">
              <a
                href={documento?.pdf ?? item.img}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
              >
                {documento ? 'Ler PDF em nova aba' : 'Abrir imagem em nova aba'}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              {documento && (
                <a
                  href={documento.pdf}
                  download
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  Baixar PDF
                  <Download className="size-4" aria-hidden="true" />
                </a>
              )}
            </figcaption>
          </figure>
        </div>
      </div>

      <article className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <header className="max-w-4xl">
          <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Acervo · {categoria}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {item.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {item.description}
          </p>
        </header>

        <div className="mt-8 grid gap-10 border-t border-border pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
          {obra && (
            <section aria-labelledby="obra-sobre">
              <h2 id="obra-sobre" className="font-serif text-2xl font-semibold">
                Sobre esta obra
              </h2>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
                {obra.fullDescription}
              </p>
            </section>
          )}
          <section aria-labelledby="obra-ficha">
            <h2 id="obra-ficha" className="font-serif text-2xl font-semibold">
              Ficha do acervo
            </h2>
            <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
              {facts.map(({ label, value }) => (
                <div key={label} className="grid gap-1 py-3 sm:grid-cols-2">
                  <dt className="font-semibold">{label}</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
              {!!obra?.categories.length && (
                <div className="grid gap-1 py-3 sm:grid-cols-2">
                  <dt className="font-semibold">Categorias</dt>
                  <dd className="text-muted-foreground">
                    {obra.categories.join(' · ')}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        {obra?.model3dFileName && (
          <section
            aria-label="Visualização 3D"
            className="mt-10 border-t border-border pt-8"
          >
            <ModelViewer
              fileName={obra.model3dFileName}
              scale={obra.model3dScale}
              cameraDistance={obra.model3dCameraDistance}
              rotation={obra.model3dRotation}
            />
          </section>
        )}
      </article>
    </main>
  );
}
