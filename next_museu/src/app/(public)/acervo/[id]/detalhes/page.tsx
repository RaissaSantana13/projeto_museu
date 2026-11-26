import { ArtworkDetails } from '@/components/shared/collection/artwork-details';
import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';

export default async function ArtworkDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ArtworkDetails obraId={id} />
      <Footer />
    </div>
  );
}
