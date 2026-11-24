import { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

// 1. Definição das rotas públicas e o comportamento quando o utilizador está autenticado
const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/registro', whenAuthenticated: 'redirect' },
  { path: '/recuperar-senha', whenAuthenticated: 'redirect' },
  { path: '/verificar-email', whenAuthenticated: 'redirect' },
  { path: '/nova-senha', whenAuthenticated: 'redirect' },
  { path: '/dashboard', whenAuthenticated: 'next' }, // Exemplo de rota pública que logado pode ver
] as const;

//const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivate = pathname.startsWith('/dashboard');
  const hasCookie = request.cookies.has('Authentication');

  if (isPrivate && !hasCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Procura se a rota atual é pública
  //const publicRoute = publicRoutes.find(route => route.path === pathName);

  // Tenta obter o token dos cookies (ajuste o nome 'token' conforme o seu sistema)
  //const authToken = request.cookies.get('token');

  // CASO 1: Utilizador NÃO está autenticado e tenta aceder a uma rota PRIVADA
  /* if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  } */

  // CASO 2: Utilizador ESTÁ autenticado e tenta aceder a uma rota pública restrita (ex: Login)
  // if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
  //   const redirectUrl = request.nextUrl.clone();
  //   redirectUrl.pathname = '/'; // Redireciona para o Dashboard/Home
  //   return NextResponse.redirect(redirectUrl);
  // }

  // CASO 3: Permite a navegação normal
  return NextResponse.next();
}

// Configuração para evitar que o middleware corra em ficheiros estáticos ou APIs
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
