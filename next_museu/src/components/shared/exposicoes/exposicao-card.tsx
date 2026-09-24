import Image from 'next/image';
import Link from 'next/link';

export interface Exposicao {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  status: 'Em cartaz' | 'Encerrada';
}

export function ExposicaoCard({ exposicao }: { exposicao: Exposicao }) {
  return (
    <Link
      href={`/eventos/${exposicao.id}/detalhes`}
      className="group overflow-hidden rounded-xl bg-white shadow-[0_5px_16px_rgba(75,49,20,0.18)] transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[1.65] overflow-hidden">
        <Image
          src={exposicao.image}
          alt={exposicao.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded bg-yellow-400 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-yellow-950">
          {exposicao.status}
        </span>
      </div>
      <div className="space-y-2 p-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#98600f]">
          Exposição | Museu Histórico
        </p>
        <h3 className="text-sm font-bold leading-tight">{exposicao.title}</h3>
        <p className="text-xs leading-relaxed text-[#6b5a43]">{exposicao.description}</p>
        <div className="border-t border-[#eadfb8] pt-2 text-[10px] leading-relaxed text-[#6b5a43]">
          <p>Início | {exposicao.startDate}</p>
          <p>Término | {exposicao.endDate}</p>
        </div>
      </div>
    </Link>
  );
}
