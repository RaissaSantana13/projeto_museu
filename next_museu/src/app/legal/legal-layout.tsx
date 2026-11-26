import { LEGAL_LINKS, type LegalPath } from '@/configs/legal-links';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function LegalLayout({
  title,
  current,
  children,
}: {
  title: string;
  current: LegalPath;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar à página inicial
        </Link>
        <header className="mt-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Museu Virtual de Birigui
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
        </header>
        <nav aria-label="Páginas legais" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {LEGAL_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={href === current ? 'page' : undefined}
                  className="inline-flex min-h-10 items-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="mt-7 space-y-7 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-card-foreground sm:p-8 sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mb-1 [&_section+p]:mt-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </article>
      </div>
    </main>
  );
}

export function LegalContact({
  children = 'Contato',
}: {
  children?: ReactNode;
}) {
  return <Link href="/contato">{children}</Link>;
}
