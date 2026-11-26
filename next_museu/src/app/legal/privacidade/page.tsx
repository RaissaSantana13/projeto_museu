import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalContact, LegalLayout } from '../legal-layout';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Museu Virtual de Birigui',
  description: 'Informações sobre dados pessoais no Museu Virtual de Birigui.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Política de Privacidade" current="/legal/privacidade">
      <section>
        <h2>Quando você fornece dados</h2>
        <p>
          A consulta às áreas públicas, como o acervo, não exige cadastro. Ao
          criar uma conta, efetuar login ou preencher o formulário de contato,
          são tratados os dados necessários à função que você escolheu, como
          nome, e-mail e o conteúdo de uma mensagem enviada.
        </p>
      </section>
      <section>
        <h2>Para que os dados são usados</h2>
        <p>
          Os dados podem ser usados para identificar e autenticar usuários,
          manter a sessão, responder a solicitações e proteger o funcionamento
          do site. O navegador também pode guardar preferências de interface,
          como o tema visual.
        </p>
      </section>
      <section>
        <h2>Serviços externos e armazenamento</h2>
        <p>
          Recursos como autenticação externa e conteúdos carregados de outros
          provedores podem envolver serviços de terceiros. Consulte as
          respectivas políticas ao usar esses recursos. Para saber como o site
          usa o armazenamento no navegador, veja a{' '}
          <Link href="/legal/cookies">Política de Cookies</Link>.
        </p>
      </section>
      <section>
        <h2>Seus dados e seus direitos</h2>
        <p>
          Você pode solicitar informações sobre o tratamento, acesso ou
          correção de dados pessoais, conforme a LGPD. Veja a página de{' '}
          <Link href="/legal/lgpd">Proteção de Dados (LGPD)</Link> ou envie uma
          mensagem pelo <LegalContact>canal de contato do site</LegalContact>.
          Não envie senhas ou documentos de identificação sem orientação.
        </p>
      </section>
    </LegalLayout>
  );
}
