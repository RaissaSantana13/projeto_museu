import { EventDetails } from '@/components/shared/collection/event-details';
import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';
import { PROGRAMACAO } from '@/components/shared/programacao/programacao-data';
import { ProgramacaoEventDetails } from '@/components/shared/programacao/programacao-event-details';

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = PROGRAMACAO.find((item) => item.id === id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {event ? (
        <ProgramacaoEventDetails event={event} />
      ) : (
        <EventDetails eventId={id} />
      )}
      <Footer />
    </div>
  );
}
