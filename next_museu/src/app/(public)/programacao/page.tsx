import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';
import { ProgramacaoPage } from '@/components/shared/programacao/programacao-page';

export default function ProgramacaoRoute() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ProgramacaoPage />
      <Footer />
    </div>
  );
}
