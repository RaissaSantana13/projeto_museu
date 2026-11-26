export interface Exposicao {
  id: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  status: 'Em cartaz' | 'Encerrada';
}

export const EXPOSICOES: Exposicao[] = [
  {
    id: '743836ab-e940-4c71-828f-b0223d72549c',
    title: 'O solo vira arte',
    description:
      'Explore as cores e texturas naturais do solo como matéria-prima artística.',
    image: '/images/expo_solo.png',
    featured: true,
    status: 'Em cartaz',
  },
  {
    id: 'ae68d180-e62f-4ab2-bf07-8e4f8b4f533a',
    title: 'O mundo em grafite',
    description:
      'Obras que revelam a versatilidade do grafite, dos retratos aos cenários surreais.',
    image: '/images/expo_grafite.png',
    featured: false,
    status: 'Em cartaz',
  },
  {
    id: 'a1514b35-3ff3-4642-81fe-1803ea95acd9',
    title: 'Tipografia urbana',
    description:
      'Conheça a arte das letras que dão identidade às fachadas e aos espaços das cidades.',
    image: '/images/expo_tipografia.png',
    featured: false,
    status: 'Em cartaz',
  },
];
