import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';

export default function FotosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <section className="max-w-2xl text-center">
          <h1 className="font-serif text-4xl font-bold">Fotos</h1>
          <p className="mt-4 text-muted-foreground">
            Consulte o registro fotográfico do acervo do Museu de Birigui.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}