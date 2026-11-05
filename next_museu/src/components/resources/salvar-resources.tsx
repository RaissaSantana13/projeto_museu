'use client';

import Link from 'next/link';
import { useDictionary } from '../../service/providers/i18n-providers';
import { PageShell } from '../pageshell/page-shell';
import { Button } from '../ui/button';
import SalvarResourcesForm from '../forms/resources/SalvarResourcesForm';

export function SalvarResources() {
  const dict = useDictionary();
  return (
    <>
      <section aria-labelledby="resources-heading">
        <PageShell
          title={dict.resources.management.title}
          description={dict.resources.management.description}
          headingId='resources-heading'
          actions={
            <Button
              asChild
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-sans"
            >
              <Link href="/dashboard/resources">
                {dict.resources.management.lista_resources}
              </Link>
            </Button>
          }
        >
          <SalvarResourcesForm />
        </PageShell>
      </section>
      ,
    </>
  );
}
