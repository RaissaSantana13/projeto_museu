import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalContact, LegalLayout } from '../legal-layout';

export const metadata: Metadata = {
  title: 'Política de Cookies | Museu Virtual de Birigui',
  description: 'Como o site usa cookies e armazenamento no navegador.',
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" current="/legal/cookies">
      <section>
        <h2>O que o site guarda no navegador?</h2>
        <p>
          Cookies são pequenos registros que um site pode guardar no navegador.
          Alguns recursos também podem usar o armazenamento local do navegador
          para lembrar preferências entre visitas.
        </p>
      </section>
      <section>
        <h2>Para que esses recursos são usados?</h2>
        <ul>
          <li>
            <strong>Sessão:</strong> ao entrar na conta, cookies permitem
            reconhecer e manter sua sessão. Ao sair, os cookies de autenticação
            do site são removidos.
          </li>
          <li>
            <strong>Preferências:</strong> a interface pode guardar escolhas
            como idioma e tema para manter a apresentação escolhida.
          </li>
        </ul>
      </section>
      <section>
        <h2>Serviços de terceiros</h2>
        <p>
          Recursos externos, como login por outro provedor, podem usar seus
          próprios cookies. As regras sobre esses cookies são definidas pelos
          respectivos serviços.
        </p>
      </section>
      <section>
        <h2>Como gerenciar o armazenamento</h2>
        <p>
          Você pode consultar, bloquear ou apagar cookies e outros dados do site
          nas configurações de privacidade do seu navegador. Ao excluir os
          dados, talvez seja necessário entrar novamente e redefinir suas
          preferências. Bloquear cookies de sessão pode impedir o login.
        </p>
      </section>
      <section>
        <h2>Mais informações</h2>
        <p>
          Consulte a <Link href="/legal/privacidade">Política de Privacidade</Link>{' '}
          ou envie sua dúvida pela página de <LegalContact />.
        </p>
      </section>
    </LegalLayout>
  );
}
