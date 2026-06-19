import Image from 'next/image';
import Link from 'next/link';

interface EventoDetalhes {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  img: string;
  categories: string[];
  indicativeRating: string;
  dates: { date: string; day: string; time: string }[];
  available: boolean;
}

function getIndicativeRatingColor(rating: string): string {
  switch (rating) {
    case 'L':
      return 'bg-green-100 text-green-800 border border-green-300';
    case '10':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case '12':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case '14':
      return 'bg-orange-100 text-orange-800 border border-orange-300';
    case '16':
      return 'bg-red-100 text-red-800 border border-red-300';
    case '18':
      return 'bg-black text-white border border-white';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
}

const EVENTOS_DATABASE: Record<string, EventoDetalhes> = {
  '743836ab-e940-4c71-828f-b0223d72549c': {
    id: '743836ab-e940-4c71-828f-b0223d72549c',
    title: 'O solo vira arte',
    description:
      'Venha explorar as cores e texturas naturais do solo como matéria-prima artistica.',
    fullDescription:
      'Uma seleção impressionante de fotografias contemporâneas que documentam a vida urbana e rural no Brasil. Os fotógrafos utilizaram técnicas inovadoras para capturar momentos únicos que refletem a diversidade cultural do país.',
    img: '/images/expo_solo.png',
    categories: ['Fotografia', 'Contemporâneo'],
    indicativeRating: '10',
    dates: [
      { date: '13/05', day: 'Segunda', time: '14h' },
      { date: '14/05', day: 'Terça', time: '14h' },
    ],
    available: true,
  },
  'ae68d180-e62f-4ab2-bf07-8e4f8b4f533a': {
    id: 'ae68d180-e62f-4ab2-bf07-8e4f8b4f533a',
    title: 'O mundo em grafite',
    description: 'O mundo em grafite',
    fullDescription:
      'A exposição "O Mundo em Grafite" apresenta uma coleção impressionante de obras de arte criadas exclusivamente com grafite, revelando a versatilidade e a expressividade desse material aparentemente simples. Desde retratos detalhados até paisagens surreais, cada peça é uma demonstração do talento e da criatividade dos artistas que transformam o grafite em verdadeiras obras-primas visuais.',
    img: '/images/expo_grafite.png',
    categories: ['Escultura', 'Clássico', 'Moderno'],
    indicativeRating: '12',
    dates: [
      { date: '15/05', day: 'Quarta', time: '10h' },
      { date: '16/05', day: 'Quinta', time: '10h' },
    ],
    available: false,
  },
  'a1514b35-3ff3-4642-81fe-1803ea95acd9': {
    id: 'a1514b35-3ff3-4642-81fe-1803ea95acd9',
    title: 'Tipografia urbana',
    description: 'Tipografia urbana',
    fullDescription:
      'A exposição "Tipografia Urbana" mergulha no fascinante mundo das letras e fontes que compõem a paisagem urbana. Apresentando uma coleção diversificada de tipografias encontradas em fachadas, placas de rua, grafites e anúncios publicitários, esta exposição celebra a arte da tipografia como um elemento essencial da identidade visual das cidades. Desde estilos clássicos até designs contemporâneos, os visitantes serão convidados a explorar a riqueza e a criatividade presentes nas letras que moldam o ambiente urbano.',
    img: '/images/expo_tipografia.png',
    categories: ['Arte Digital', 'Interativa', 'Contemporânea'],
    indicativeRating: '14',
    dates: [
      { date: '17/05', day: 'Sexta', time: '16h' },
      { date: '18/05', day: 'Sábado', time: '16h' },
      { date: '19/05', day: 'Domingo', time: '11h' },
    ],
    available: true,
  },
};

export function EventDetails({ eventId }: { eventId: string }) {
  const evento = EVENTOS_DATABASE[eventId];

  if (!evento) {
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
            href="/eventos"
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
            Voltar aos Eventos
          </Link>
          <h1 className="text-2xl font-bold font-serif">Detalhes do Evento:</h1>
        </div>

        {/* Seção principal com imagem e informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Informações da obra */}
          <div className="flex flex-col justify-start space-y-6">
            {/* Disponibilidade */}
            <div>
              <span
                className={`inline-block px-4 py-2 rounded text-sm font-semibold ${
                  evento.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {evento.available ? 'DISPONÍVEL' : 'ESGOTADO'}
              </span>
            </div>

            {/* Título e Classificação Indicativa + Categorias */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
                {evento.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 mt-6">
                {/* Classificação Indicativa */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${getIndicativeRatingColor(
                    evento.indicativeRating,
                  )}`}
                >
                  {evento.indicativeRating}
                </div>

                {/* Categorias */}
                <div className="flex flex-wrap gap-2">
                  {evento.categories.map((category) => (
                    <span
                      key={category}
                      className={`px-3 py-1 rounded text-sm font-medium border bg-gray-100/20`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Descrição curta */}
            <div>
              <p className="text-lg text-muted-foreground">
                {evento.description}
              </p>
            </div>

            {/* Datas e Horários */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Datas e Horários:
              </h3>
              <div className="space-y-3">
                {evento.dates.map((dateInfo, index) => (
                  <div key={index}>
                    <p className="font-semibold text-sm">{dateInfo.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {dateInfo.day}, às {dateInfo.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Imagem da obra */}
          <div className="flex items-start">
            <div className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={evento.img}
                alt={evento.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Descrição completa */}
        <div className="mb-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-6 font-serif">
            Sobre este evento
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {evento.fullDescription}
          </p>
        </div>
      </div>
    </main>
  );
}
