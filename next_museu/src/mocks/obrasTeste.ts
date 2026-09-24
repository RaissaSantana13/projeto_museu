export interface Work {
  id_work: number;
  title: string;
  artist: string;
  creation_year: number;
  description: string;
  dimensions: string;
  type: string;
  category: string;
  location: string;
  id_img: number;
  has_3d: boolean;
  url_3d: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const bancoDeDadosTeste: Work[] = [
  {
    id_work: 1,
    title: 'Abaporu',
    artist: 'Tarsila do Amaral',
    creation_year: 1928,
    description:
      'Uma das principais obras do movimento antropofágico brasileiro.',
    dimensions: '85 cm × 73 cm',
    type: 'Pintura',
    category: 'Modernismo',
    location: 'Sessão Brasil - Ala A',
    id_img: 101,
    has_3d: true,
    url_3d: '/models/abaporu.gltf',
    status: 'Exibição',
    created_at: '2026-01-15T10:00:00.000Z',
    updated_at: '2026-01-15T10:00:00.000Z',
    deleted_at: null,
  },
  {
    id_work: 2,
    title: 'A Noite Estrelada',
    artist: 'Vincent van Gogh',
    creation_year: 1889,
    description:
      'Pintura a óleo sobre tela retratando a vista da janela do quarto do asilo.',
    dimensions: '73.7 cm × 92.1 cm',
    type: 'Pintura',
    category: 'Pós-Impressionismo',
    location: 'Galeria Principal - Sala 3',
    id_img: 102,
    has_3d: false,
    url_3d: null,
    status: 'Exibição',
    created_at: '2026-02-01T14:30:00.000Z',
    updated_at: '2026-02-01T14:30:00.000Z',
    deleted_at: null,
  },
];
