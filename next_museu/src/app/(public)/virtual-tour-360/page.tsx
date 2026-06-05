import { Footer } from '@/components/shared/landing/footer';
import { Museum360 } from '@/components/shared/landing/musuem_360';
import { Navbar } from '@/components/shared/landing/nav-bar';

export default function Tour360Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Museum360 />
      <Footer />
    </div>
  );
}
