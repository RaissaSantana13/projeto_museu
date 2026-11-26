import { CalendarDays, LogIn, Ticket, UserCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PerfilPage() {
  const sessionCookie = (await cookies()).get('Authentication');

  if (!sessionCookie?.value) {
    redirect('/registro');
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserCircle className="size-14 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Minha conta</p>
              <h1 className="font-serif text-3xl font-semibold">
                Meu perfil
              </h1>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/museu">Voltar ao museu</Link>
          </Button>
        </header>

        <section
          aria-labelledby="meus-eventos"
          className="grid gap-6 md:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle id="meus-eventos" className="flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />
                Meus eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-32 flex-col items-center justify-center gap-3 text-center">
              <Ticket className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Você ainda não se inscreveu em nenhum evento.
              </p>
              <Button variant="link" asChild>
                <Link href="/programacao">Ver programação</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="size-5 text-primary" />
                Minhas exposições
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-32 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-muted-foreground">
                Suas exposições salvas aparecerão aqui.
              </p>
              <Button variant="link" asChild>
                <Link href="/exposicoes">Explorar exposições</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <LogIn className="size-4" />
          Os eventos e exposições serão carregados da sua conta quando o
          cadastro dessas atividades estiver disponível na API.
        </p>
      </div>
    </main>
  );
}
