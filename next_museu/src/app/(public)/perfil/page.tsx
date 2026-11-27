import { ProfilePhotoForm } from '@/components/forms/usuario/profile-photo-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth-server';
import { getServerDictionary } from '@/lib/get-dictionary';
import { isAdmin } from '@/lib/roles';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PerfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { profilePhoto: labels } = await getServerDictionary();
  const admin = isAdmin(user.roles);

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-lg space-y-5">
        <Button variant="outline" asChild>
          <Link href={admin ? '/dashboard' : '/museu'}>
            {admin ? labels.backToDashboard : labels.backToMuseum}
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <h1 className="font-serif text-3xl font-semibold">{labels.title}</h1>
            <p className="text-sm text-muted-foreground">{user.username}</p>
          </CardHeader>
          <CardContent>
            <ProfilePhotoForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
