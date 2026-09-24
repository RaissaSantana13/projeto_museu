import { ArtworkCollection } from '@/components/shared/collection/artwork-collection';
import { Navbar } from '@/components/shared/landing/nav-bar';
import { Footer } from '@/components/shared/landing/footer';

export default async function AcervoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const tipo =
    params.tipo === 'foto' || params.tipo === 'documento' ? params.tipo : 'obra';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ArtworkCollection tipo={tipo} />
      <Footer />
    </div>
  );
}
