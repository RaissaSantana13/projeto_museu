import { SiGoogle } from "react-icons/si";
import { OAuthLinkType } from "../type/type";

export const oauthLinksData: OAuthLinkType[] = [
  { href: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'}/auth/oauth/google`, label: 'Continuar com Google', icon: SiGoogle },
];
