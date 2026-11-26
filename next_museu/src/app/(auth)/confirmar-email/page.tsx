'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  Auth,
  AuthDescription,
  AuthHeader,
  AuthTitle,
} from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { http } from '@/lib/http';

type ConfirmationStatus = 'loading' | 'success' | 'error';

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<ConfirmationView status="loading" />}>
      <ConfirmEmailContent />
    </Suspense>
  );
}

function ConfirmEmailContent() {
  const token = useSearchParams().get('token');
  const submittedToken = useRef<string | null>(null);
  const [status, setStatus] = useState<ConfirmationStatus>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    if (submittedToken.current === token) return;
    submittedToken.current = token;

    http
      .post('/api/v1/credentials/confirm-email', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return <ConfirmationView status={status} />;
}

function ConfirmationView({ status }: { status: ConfirmationStatus }) {
  const content = {
    loading: {
      title: 'Confirmando seu e-mail',
      description: 'Estamos validando o link de confirmação.',
      Icon: LoaderCircle,
      iconClassName: 'animate-spin text-primary',
    },
    success: {
      title: 'E-mail confirmado',
      description: 'Seu endereço de e-mail foi confirmado com sucesso.',
      Icon: CircleCheck,
      iconClassName: 'text-green-600',
    },
    error: {
      title: 'Não foi possível confirmar seu e-mail',
      description:
        'O link pode ser inválido ou ter expirado. Você pode solicitar um novo link de confirmação.',
      Icon: CircleX,
      iconClassName: 'text-destructive',
    },
  }[status];

  const { Icon } = content;

  return (
    <Auth>
      <AuthHeader>
        <Icon
          aria-hidden="true"
          className={`mx-auto size-12 ${content.iconClassName}`}
        />
        <AuthTitle>{content.title}</AuthTitle>
        <AuthDescription>{content.description}</AuthDescription>
      </AuthHeader>
      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link href="/login">Ir para o login</Link>
        </Button>
        {status === 'error' && (
          <Button asChild className="w-full" variant="outline">
            <Link href="/verificar-email">Solicitar novo link</Link>
          </Button>
        )}
      </div>
    </Auth>
  );
}
