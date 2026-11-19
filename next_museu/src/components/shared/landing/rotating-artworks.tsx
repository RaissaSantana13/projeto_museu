
import Link from "next/link";

const obras = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    titulo: "Troféu Locomotiva de Bronze",
    imagem: "/images/train.jpg",
    tamanho: "md:col-span-5",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    titulo: "Microfone Condensador Behringer B-1",
    imagem: "/images/microphone.png",
    tamanho: "md:col-span-3",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    titulo: "Cálice de Madeira Indígena",
    imagem: "/images/cup.jpg",
    tamanho: "md:col-span-4",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    titulo: "Telefone de Parede Antigo",
    imagem: "/images/old_telephone.jpg",
    tamanho: "md:col-span-4",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    titulo: "Jarro de Terracota",
    imagem: "/images/terracota_jug.jpg",
    tamanho: "md:col-span-8",
  },
];

export function RotatingArtworks() {
  return (
    <section
      id="acervo"
      className="w-full bg-[#1b140e]"
    >
      {/* TÍTULO DA SEÇÃO */}
      <div className="border-b border-[#4a3825] px-6 py-10 md:px-20">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#f5e7c2]">
          DESTAQUES
        </h2>
      </div>

      {/* GALERIA */}
      <div className="grid grid-cols-1 gap-[2px] bg-[#1b140e] md:grid-cols-12">
        {obras.map((obra) => (
          <Link
            key={obra.id}
            href={`/acervo/${obra.id}/detalhes`}
            className={`
              group relative block
              h-[350px] overflow-hidden
              bg-[#30251a]
              md:h-[460px]
              ${obra.tamanho}
            `}
          >
            {/* IMAGEM */}
            <img
              src={obra.imagem}
              alt={obra.titulo}
              loading="lazy"
              className="
                absolute inset-0
                h-full w-full
                object-cover object-center
                transition-transform duration-500
                group-hover:scale-105
              "
            />

            {/* INFORMAÇÕES AO PASSAR O MOUSE */}
            <div
              className="
                absolute inset-0
                flex items-end
                bg-gradient-to-t
                from-black/85
                via-transparent
                to-transparent
                p-6
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
                group-focus-visible:opacity-100
                max-md:opacity-100
              "
            >
              <div>
                <h3 className="text-xl font-bold text-white">
                  {obra.titulo}
                </h3>

                <p className="mt-2 text-sm text-[#f5e7c2]">
                  Ver detalhes →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* BOTÃO FINAL */}
      <div className="flex justify-center py-10">
        <Link
          href="/acervo/obras"
          className="
            border border-[#8b704c]
            px-8 py-3
            text-sm font-semibold
            uppercase
            text-[#f5e7c2]
            transition-colors
            hover:bg-[#f5e7c2]
            hover:text-[#1b140e]
          "
        >
          Explorar todo o acervo
        </Link>
      </div>
    </section>
  );
}
