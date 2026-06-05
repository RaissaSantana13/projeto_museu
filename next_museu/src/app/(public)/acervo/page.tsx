import { ArtworkCollection } from '@/components/shared/collection/artwork-collection';
import { Navbar } from '@/components/shared/landing/nav-bar';
import { Footer } from '@/components/shared/landing/footer';

export default function AcervoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ArtworkCollection />
      <Footer />
    </div>
  );
}
