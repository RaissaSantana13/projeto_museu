import type { Metadata } from 'next';
import { LegalContact, LegalLayout } from '../legal-layout';

export const metadata: Metadata = {
  title: 'Termos de Uso | Museu Virtual de Birigui',
  description: 'Condições de uso do site do Museu Virtual de Birigui.',
};

export default function TermsPage() {
  return (
    <LegalLayout title="Termos de Uso" current="/legal/terms">
      <section>
        <h2>Sobre o site</h2>
        <p>
          O Museu Virtual de Birigui apresenta o acervo, as exposições, a
          programação cultural e o passeio virtual do museu. As informações
          publicadas podem ser atualizadas. Quando houver atividades
          presenciais, verifique as datas e as condições de participação com a
          organização antes de se deslocar.
        </p>
      </section>
      <section>
        <h2>Uso da plataforma</h2>
        <p>
          Use os conteúdos e os recursos de forma lícita, sem prejudicar o
          funcionamento do site nem violar direitos de outras pessoas. Nos
          recursos que exigem conta, mantenha os dados de acesso em segurança e
          não compartilhe a senha.
        </p>
      </section>
      <section>
        <h2>Imagens, textos e acervo</h2>
        <p>
          Os direitos sobre imagens, textos e outros materiais pertencem aos
          respectivos titulares. A disponibilidade de uma obra para consulta
          não implica autorização para reprodução ou uso comercial. Observe os
          créditos e as licenças indicadas em cada item, quando houver.
        </p>
      </section>
      <section>
        <h2>Links externos e disponibilidade</h2>
        <p>
          Alguns recursos podem depender de serviços externos ou direcionar a
          outros sites. Esses serviços têm suas próprias condições de uso. O
          acesso ao Museu Virtual também pode sofrer interrupções para
          manutenção ou por indisponibilidade técnica, sem prejuízo dos direitos
          previstos na legislação brasileira.
        </p>
      </section>
      <section>
        <h2>Dúvidas e correções</h2>
        <p>
          Para informar um erro ou tirar dúvidas sobre estes termos, use a
          página de <LegalContact />.
        </p>
      </section>
    </LegalLayout>
  );
}
