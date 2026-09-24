import { ArtworkCollection } from '@/components/shared/collection/artwork-collection';
import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';

export default function ObrasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ArtworkCollection />
      <Footer />
    </div>
  );
}