'use client';

import { EventDetails } from '@/components/shared/collection/event-details';
import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';
import { useParams } from 'next/navigation';

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <EventDetails eventId={id} />
      <Footer />
    </div>
  );
}
