'use client';

import { useDictionary } from '../../service/providers/i18n-providers';
import { SignInForm } from '../forms/auth/SignInForm';
import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from './auth-layout';

export function SignIn() {
  const dict = useDictionary();
  return (
    <section aria-labelledby="sigin-heading">
      <Auth>
        <AuthHeader>
          <AuthTitle headingId="sigin-heading">
            'Entrar no Museu Digital'
          </AuthTitle>
          <AuthDescription>
            Informe seus dados para acessar sua área.
          </AuthDescription>
        </AuthHeader>
        <AuthForm>
          <SignInForm />
        </AuthForm>
      </Auth>
    </section>
  );
}
