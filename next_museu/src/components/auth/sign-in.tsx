'use client';

import Image from 'next/image';
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
          <div className="flex justify-center">
            <Image
              src="/images/85fcd86a-d292-405e-8cba-2f45bb9e55ef (1).png"
              alt="Logo do Museu"
              width={220}
              height={220}
              className="mb-6 h-32 w-auto object-contain"
              priority
            />
          </div>
          <AuthTitle headingId="sigin-heading">
            {dict.auth.login.title}
          </AuthTitle>
          <AuthDescription>
            {dict.auth.login.description}
          </AuthDescription>
        </AuthHeader>
        <AuthForm>
          <SignInForm />
        </AuthForm>
      </Auth>
    </section>
  );
}
