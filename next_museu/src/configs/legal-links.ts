export const LEGAL_LINKS = [
  { href: '/legal/terms', label: 'Termos de Uso' },
  { href: '/legal/privacidade', label: 'Política de Privacidade' },
  { href: '/legal/lgpd', label: 'LGPD' },
  { href: '/legal/cookies', label: 'Política de Cookies' },
] as const;

export type LegalPath = (typeof LEGAL_LINKS)[number]['href'];
