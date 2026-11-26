export type ProgramacaoStatus = 'Em cartaz' | 'Últimos dias' | 'Encerrado';

export interface ProgramacaoSession {
  day: string;
  times: readonly string[];
}

export interface ProgramacaoEvent {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  status?: 'Disponível' | 'Esgotado';
  scheduleStatus: ProgramacaoStatus;
  image: string;
  demonstration?: boolean;
  registrationSessions?: readonly ProgramacaoSession[];
}

export const PROGRAMACAO: ProgramacaoEvent[] = [
  {
    id: 'um-dia-muito-especial',
    title: 'Um dia muito especial',
    summary:
      'Dois vizinhos se encontram num dia comum que muda a vida dos dois. A peça adapta o clássico do cinema italiano de Ettore Scola.',
    category: 'Teatro',
    date: '30 e 31 de maio de 2026',
    location: 'Teatro Paulo Pontes · João Pessoa (PB)',
    status: 'Disponível',
    scheduleStatus: 'Em cartaz',
    image: '/images/evento_1.jpg',
    demonstration: true,
    registrationSessions: [
      { day: '30 de maio', times: ['14h', '17h', '20h'] },
      { day: '31 de maio', times: ['11h', '15h', '18h'] },
    ],
  },
  {
    id: 'terceira-margem',
    title: 'Terceira Margem',
    summary:
      'Espetáculo de teatro do projeto Encenação, do Núcleo de Artes Cênicas do SESI Birigui.',
    category: 'Teatro',
    date: '18 e 19 de setembro',
    time: '20h',
    location: 'Teatro do SESI Birigui',
    scheduleStatus: 'Em cartaz',
    image: '/images/evento-terceira-margem.png',
  },
  {
    id: 'crianceiras',
    title: 'Crianceiras',
    summary:
      'Espetáculo musical gratuito que transforma a poesia de Manoel de Barros em canções.',
    category: 'Musical',
    date: '24 de outubro',
    time: '16h',
    location: 'Sesc Birigui',
    scheduleStatus: 'Últimos dias',
    image: '/images/evento-crianceiras.jpg',
  },
  {
    id: 'festival-literario-de-birigui',
    title: 'Festival Literário de Birigui',
    summary:
      'A 12ª edição do FliBi reuniu literatura, música e convidados, com show do Biquini no Parque do Povo.',
    category: 'Festival',
    date: '5 a 9 de novembro de 2025',
    time: 'show do Biquini em 8 de novembro, às 20h30',
    location: 'Birigui (SP)',
    scheduleStatus: 'Encerrado',
    image: '/images/evento-flibi.jpg',
  },
];
