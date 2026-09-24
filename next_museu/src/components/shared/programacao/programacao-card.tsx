import Image from 'next/image';

export interface ProgramacaoEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: 'Disponível' | 'Esgotado';
  image: string;
  // Ative quando a tela de detalhes deste evento estiver pronta.
  detailsAvailable?: boolean;
}

export function ProgramacaoCard({ event }: { event: ProgramacaoEvent }) {
  const cardContent = (
    <>
      <div className="relative aspect-[1.65] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white ${
            event.status === 'Esgotado' ? 'bg-[#158b91]' : 'bg-[#8e9b35]'
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="space-y-2 p-3 text-[#312518]">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#98600f]">
          {event.category}
        </p>
        <h2 className="line-clamp-2 text-sm font-bold leading-tight">
          {event.title}
        </h2>
        <div className="border-t border-[#eadfb8] pt-2 text-[10px] leading-relaxed text-[#6b5a43]">
          <p>{event.date} | {event.time}</p>
          <p>{event.location}</p>
        </div>
      </div>
    </>
  );

  // Quando a tela de detalhes estiver pronta, envolva cardContent com um Link.
  return (
    <div className="group block overflow-hidden rounded-xl bg-white shadow-[0_5px_16px_rgba(75,49,20,0.18)]">
      {cardContent}
    </div>
  );
}
