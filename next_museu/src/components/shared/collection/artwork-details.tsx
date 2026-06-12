import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ModelViewer } from '../landing/models-3d';

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
    img: '/images/metal_train.jpg',
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
  const obra = OBRAS_DATABASE[obraId];

  if (!obra) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Obra não encontrada</h1>
          <p className="text-muted-foreground mb-8">
            Desculpe, não conseguimos encontrar a obra que você está procurando.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Botão voltar e título */}
        <div className="mb-8">
          <Link
            href="/acervo"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar ao Acervo
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">
            Detalhes da Obra:
          </h1>
        </div>

        {/* Seção principal com imagem e informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Imagem da obra */}
          <div className="flex items-start">
            <div className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={obra.img}
                alt={obra.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Informações da obra */}
          <div className="flex flex-col justify-start space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
                {obra.title}
              </h1>

              {/* Categorias */}
              <div className="flex flex-wrap gap-2 mb-6">
                {obra.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="text-xs md:text-sm"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {/* Descrição curta */}
              <p className="text-lg text-muted-foreground mb-6">
                {obra.description}
              </p>
            </div>

            {/* Detalhes técnicos */}
            <div className="space-y-4 border-t pt-6">
              {obra.year && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Período
                    </p>
                    <p className="text-lg font-medium">{obra.year}</p>
                  </div>
                </div>
              )}

              {obra.artist && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Artista / Fabricante
                  </p>
                  <p className="text-lg font-medium">{obra.artist}</p>
                </div>
              )}

              {obra.material && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Material
                  </p>
                  <p className="text-lg font-medium">{obra.material}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descrição completa */}
        <div className="mb-16 border-t pt-12">
          <h2 className="text-3xl font-bold mb-6 font-serif">
            Sobre esta obra
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {obra.fullDescription}
          </p>
        </div>

        {/* Seção de visualização 3D */}
        <div className="border-t pt-12">
          {obra.model3dFileName ? (
            <ModelViewer
              fileName={obra.model3dFileName}
              scale={obra.model3dScale}
              cameraDistance={obra.model3dCameraDistance}
              rotation={obra.model3dRotation}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-16 text-center bg-muted/20">
              <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-muted-foreground/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Visualização 3D em Desenvolvimento
                </h3>
                <p className="text-muted-foreground mb-4">
                  Estamos preparando uma experiência interativa em 3D para esta
                  obra. Em breve, você poderá visualizar e explorar todos os
                  detalhes desta peça sob diferentes ângulos e com zoom
                  avançado.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Esta seção será preenchida com tecnologia 3D de última
                  geração.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
