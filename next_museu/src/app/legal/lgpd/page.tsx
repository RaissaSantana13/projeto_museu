import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalContact, LegalLayout } from '../legal-layout';

export const metadata: Metadata = {
  title: 'LGPD | Museu Virtual de Birigui',
  description: 'Orientações sobre os direitos de titulares de dados pessoais.',
};

export default function LGPDPage() {
  return (
    <LegalLayout title="Proteção de Dados (LGPD)" current="/legal/lgpd">
      <section>
        <h2>O que é a LGPD?</h2>
        <p>
          A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)
          estabelece regras para o tratamento de dados pessoais e direitos para
          as pessoas a quem esses dados se referem.
        </p>
      </section>
      <section>
        <h2>Quais direitos posso exercer?</h2>
        <p>Nas condições previstas na Lei, você pode solicitar:</p>
        <ul>
          <li>Confirmação de que seus dados são tratados e acesso a eles.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>
            Informação sobre compartilhamento e, quando aplicável, portabilidade
            dos dados.
          </li>
          <li>
            Anonimização, bloqueio ou eliminação de dados, nas hipóteses
            previstas na Lei.
          </li>
          <li>
            Informações sobre consentimento e sua revogação, quando essa for a
            base do tratamento.
          </li>
        </ul>
      </section>
      <section>
        <h2>Como enviar uma solicitação</h2>
        <p>
          Use a página de <LegalContact /> e indique no início da mensagem
          “Solicitação LGPD”. Explique o que deseja solicitar. Para sua
          segurança, não inclua senhas ou cópias de documentos no primeiro
          contato.
        </p>
      </section>
      <section>
        <h2>Mais informações</h2>
        <p>
          Consulte a <Link href="/legal/privacidade">Política de Privacidade</Link>{' '}
          para conhecer os fluxos do site. Para orientações sobre a legislação e
          os canais da autoridade nacional, acesse o{' '}
          <a href="https://www.gov.br/anpd/pt-br">portal oficial da ANPD</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
