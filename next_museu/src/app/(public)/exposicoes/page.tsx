import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';
import { ExposicaoPage } from '@/components/shared/exposicoes/exposicao-page';

export default function ExposicoesRoute() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ExposicaoPage />
      <Footer />
    </div>
  );
}
