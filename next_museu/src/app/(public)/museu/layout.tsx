import { Footer } from '../../../components/shared/landing/footer';
import { Navbar } from '../../../components/shared/landing/nav-bar';
import { getClientDictionary } from '../../../lib/get-dictionary';
import { Providers } from '../../../service/providers';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, dict } = await getClientDictionary();
  return (
    <Providers locale={locale} dictionary={dict}>
      <div className="flex min-h-screen flex-col">
        <Navbar overHero />

        <main className="flex-1">{children}</main>

        <Footer />
      </div>
    </Providers>
  );
}
