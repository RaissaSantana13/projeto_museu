export interface CollectionItem {
  id: string;
  title: string;
  description: string;
  img: string;
  year?: number;
  date?: string;
  tileClass: string;
  imagePosition?: string;
}

interface HistoricalDocument extends CollectionItem {
  pdf: string;
  pages: number;
  edition: number;
}

export const DOCUMENTOS: HistoricalDocument[] = [
  {
    id: 'a-verdade-1946-08-04',
    title: 'Jornal A Verdade — 4 de agosto de 1946',
    description:
      'Edição nº 42 do semanário de Birigui, com notícias locais, anúncios e uma homenagem ao padre Pedro João Dingenouts.',
    img: '/images/a-verdade-1946-08-04.jpg',
    pdf: '/documentos/a-verdade-1946-08-04.pdf',
    pages: 6,
    edition: 42,
    year: 1946,
    date: '1946-08-04',
    tileClass: 'md:col-span-5 md:row-span-2',
    imagePosition: 'object-top',
  },
];

export const OBRAS: CollectionItem[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Troféu Locomotiva de Bronze',
    description:
      'Prêmio comemorativo institucional em formato de locomotiva sobre base metálica.',
    img: '/images/train.jpg',
    year: 1910,
    date: '1910-07-10',
    tileClass: 'md:col-span-5 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Microfone Condensador Behringer B-1',
    description:
      'Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.',
    img: '/images/microphone.png',
    year: 1978,
    date: '1978-09-12',
    tileClass: 'md:col-span-3 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Cálice de Madeira Indígena',
    description:
      'Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.',
    img: '/images/cup.jpg',
    year: 1894,
    date: '1894-02-03',
    tileClass: 'md:col-span-4 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Telefone de Parede Antigo',
    description:
      'Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.',
    img: '/images/old_telephone.jpg',
    year: 1922,
    date: '1922-11-18',
    tileClass: 'md:col-span-4 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Jarro de Terracota',
    description:
      'Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.',
    img: '/images/terracota_jug.jpg',
    year: 1905,
    date: '1905-04-26',
    tileClass: 'md:col-span-8 md:row-span-2',
    imagePosition: 'object-center',
  },
];

export const FOTOGRAFIAS: CollectionItem[] = [
  {
    id: 'foto-001',
    title: 'Praça Central de Birigui',
    description:
      'Registro fotográfico da praça principal da cidade em meados do século XX.',
    img: '/images/04-%20Pra%C3%A7a%20Dr.%20Gama.jpg',
    year: 1958,
    date: '1958-08-14',
    tileClass: 'md:col-span-7 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: 'foto-002',
    title: 'Família do Bairro Centro',
    description:
      'Imagem histórica de uma família local em ambiente urbano e cotidiano.',
    img: '/images/folia-de-reis-1982.jpg',
    year: 1982,
    date: '1982-01-06',
    tileClass: 'md:col-span-5 md:row-span-2',
    imagePosition: 'object-center',
  },
  {
    id: 'foto-003',
    title: 'Escola Municipal',
    description:
      'Fotografia de alunos e professores em frente à escola da cidade.',
    img: '/images/09.jpg',
    year: 1964,
    date: '1964-10-21',
    tileClass: 'md:col-span-12 md:row-span-2',
    imagePosition: 'object-center',
  },
];
