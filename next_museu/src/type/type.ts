import pt from '@/configs/dictionary/pt.json';
import { LucideIcon, icons } from 'lucide-react';
import { ComponentType, SVGAttributes } from 'react';
import { i18n } from '../configs/i18n';
import { radii, themes } from '../configs/themes';

export type LocaleType = (typeof i18n)['locales'][number];

export type DictionaryType = typeof pt;

export type IconType = ComponentType<IconProps> | LucideIcon;

export type LayoutType = 'vertical' | 'horizontal';

export type ModeType = 'light' | 'dark' | 'system';

export type OrientationType = 'vertical' | 'horizontal';

export type ThemeType = keyof typeof themes;

export type RadiusType = (typeof radii)[number];

export type DynamicIconNameType = keyof typeof icons;

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
}

export interface RouteType {
  type: 'guest' | 'public';
  exceptions?: string[];
}

export interface OAuthLinkType {
  href: string;
  label: string;
  icon: IconType;
}

export type SettingsType = {
  theme: ThemeType;
  mode: ModeType;
  radius: RadiusType;
  layout: LayoutType;
  locale: LocaleType;
};

export interface NavigationItem {
  title: string;
  href?: string; // Opcional: Pode ser apenas um pai de menu
  iconName?: DynamicIconNameType; // Opcional: Nem todo sub-item precisa de ícone
  label?: string; // Opcional: Para as Badges/Etiquetas
  items?: NavigationItem[]; // Opcional: Recursividade para níveis infinitos
}

export interface NavigationType {
  title: string;
  href?: string;
  iconName?: DynamicIconNameType;
  items?: NavigationItem[];
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export enum AgendaEvent {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  AGENDA = 'agenda',
}

export interface CalendarEvent {
  idEvent: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  allDay?: boolean;
  color?: EventColor;
  location?: string;
}

export type EventColor = 'sky' | 'amber' | 'violet' | 'rose' | 'brown' | 'orange';

export type VERBO_HTTP = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HateoasLink {
  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export type HateoasLinks = Record<string, HateoasLink>;

// Interface genérica para qualquer objeto que contenha links
export interface WithLinks {
  _links?: HateoasLinks;
  links?: HateoasLinks; // Suporte para ambos os padrões
}
