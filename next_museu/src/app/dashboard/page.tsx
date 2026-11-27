import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getI18nData } from '@/lib/get-dictionary';
import { ArrowUpRight, FileText, Image, Library, Palette } from 'lucide-react';
import Link from 'next/link';
import {
  DOCUMENTOS,
  FOTOGRAFIAS,
  OBRAS,
} from '../../components/shared/collection/collection-items';
import { PageShell } from '../../components/shared/pageshell/page-shell';

const counters = [
  {
    label: 'total',
    count: OBRAS.length + FOTOGRAFIAS.length + DOCUMENTOS.length,
    icon: Library,
  },
  { label: 'objects', count: OBRAS.length, icon: Palette },
  { label: 'photographs', count: FOTOGRAFIAS.length, icon: Image },
  { label: 'documents', count: DOCUMENTOS.length, icon: FileText },
] as const;

export default async function DashboardPage() {
  const { dict, locale } = await getI18nData();
  const labels = dict.dashboard;
  const formatNumber = new Intl.NumberFormat(locale);
  return (
    <PageShell
      title={labels.title}
      description={labels.description}
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {counters.map(({ label, count, icon: Icon }) => (
            <Card key={label} className="border-sidebar-border">
              <CardHeader className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm font-medium">{labels[label]}</CardTitle>
                <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">
                  {formatNumber.format(count)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">{labels.recent}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {DOCUMENTOS.slice(0, 5).map((documento) => (
                <li key={documento.id}>
                  <Link
                    href={`/acervo/${documento.id}/detalhes`}
                    className="group flex items-center gap-3 rounded-md px-2 py-3 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <FileText className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium group-hover:underline">
                        {documento.title}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {labels.documentType} ·{' '}
                        {(documento.pages === 1 ? labels.pdfPage : labels.pdfPages).replace(
                          '{count}',
                          formatNumber.format(documento.pages),
                        )}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
