
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ModelViewer } from "../landing/models-3d";
import { ArtworkImageZoom } from "./artwork-image-zoom";

// ======================================
// TIPAGEM DAS OBRAS
// ======================================

interface ObraDetalhes {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  img: string;
  categories: string[];
  year?: string;
  date?: string;
  artist?: string;
  material?: string;
  model3dFileName?: string;
  model3dScale?: number;
  model3dCameraDistance?: number;
  model3dRotation?: [number, number, number];
}

// ======================================
// BANCO DE DADOS DAS OBRAS
// ======================================

const OBRAS_DATABASE: Record<string, ObraDetalhes> = {

  // ====================================
  // OBRAS E OBJETOS
  // ====================================

  "550e8400-e29b-41d4-a716-446655440000": {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Troféu Locomotiva de Bronze",
    description:
      "Prêmio comemorativo institucional em formato de locomotiva sobre base metálica",
    fullDescription:
      "Um troféu ou placa de homenagem institucional intitulado 'Locomotiva de Prata', concedido à Agatha Dafine Velani pelo Real Seguros (agência 123-8 - São Caetano / Sucursal Santo André). A peça traz a inscrição 'Nossa Maior Conquista: Ação do Vida', celebrando metas ou conquistas alcançadas em julho de 2006. Apresenta uma miniatura detalhada de uma locomotiva a vapor sobre trilhos, fixada em uma base retangular robusta, inteiramente com acabamento prateado.",
    img: "/images/train.jpg",
    categories: [
      "Premiações",
      "Memorabilia Corporativa",
      "Anos 2000",
      "Ferromodelismo",
    ],
    year: "2006",
    artist: "Real Seguros (Institucional)",
    material: "Metal com acabamento prateado",
    model3dFileName: "trem.glb",
    model3dScale: 3.5,
    model3dCameraDistance: 4.5,
    model3dRotation: [-Math.PI / 4, -Math.PI / 8, 0.2],
  },

  "550e8400-e29b-41d4-a716-446655440001": {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Microfone Condensador Behringer B-1",
    description:
      "Microfone de estúdio condensador de grande diafragma com padrão polar cardioide.",
    fullDescription:
      "O Behringer B-1 é um microfone condensador de grande diafragma projetado para gravação em estúdio. Possui uma cápsula banhada a ouro, padrão de captação cardioide que reduz ruídos laterais, e chaves físicas no corpo para atenuação de entrada (-10 dB) e filtro de corte de graves (low-cut). É um equipamento clássico de áudio profissional, ideal para vozes e instrumentos acústicos, exigindo alimentação Phantom Power (+48V) para funcionamento.",
    img: "/images/microphone.png",
    categories: [
      "Áudio Profissional",
      "Equipamento de Estúdio",
      "Microfones",
    ],
    year: "2000-Presente",
    artist: "Behringer",
    material: "Metal niquelado e componentes eletrônicos",
    model3dFileName: "microfone.glb",
    model3dScale: 1.8,
    model3dCameraDistance: 3.5,
    model3dRotation: [0, 0, 0],
  },

  "550e8400-e29b-41d4-a716-446655440004": {
    id: "550e8400-e29b-41d4-a716-446655440004",
    title: "Cálice de Madeira Indígena",
    description:
      "Cálice artesanal esculpido em madeira nobre com acabamento polido, de origem indígena.",
    fullDescription:
      "Um cálice utilitário ou ritualístico, confeccionado artesanalmente a partir de um único bloco de madeira de lei. A peça apresenta linhas orgânicas e elegantes, uma copa ogival profunda e uma base circular de sustentação bem definida. O trabalho de tornearia ou escultura manual destaca os veios naturais escuros da madeira, recebendo um polimento fino que confere um aspecto acetinado e sofisticado ao objeto.",
    img: "/images/cup.jpg",
    categories: [
      "Arte Indígena",
      "Artesanato",
      "Utensílios de Madeira",
      "Arte Sacra e Ritualistica",
    ],
    year: "1600-1800",
    artist: "Artesão Indígena Desconhecido",
    material: "Madeira maciça",
    model3dFileName: "caliceindigena.glb",
    model3dScale: 12.0,
    model3dCameraDistance: 4.0,
    model3dRotation: [Math.PI / 2, 0, 0],
  },

  "550e8400-e29b-41d4-a716-446655440005": {
    id: "550e8400-e29b-41d4-a716-446655440005",
    title: "Telefone de Parede Antigo",
    description:
      "Telefone de parede vintage em madeira e metal com sistema de manivela magnética do início do século XX.",
    fullDescription:
      "Um clássico telefone de parede do final do século XIX ou início do século XX, montado em uma estrutura de madeira nobre. O aparelho possui um sistema de campainha dupla de metal no topo, um bocal/receptor conectado por cabo de tecido e uma manivela lateral utilizada para gerar corrente e chamar a telefonista. Este tipo de objeto representa um marco na evolução das telecomunicações globais.",
    img: "/images/old_telephone.jpg",
    categories: [
      "Antiguidades",
      "Telecomunicações",
      "História da Tecnologia",
    ],
    year: "1890-1920",
    artist: "LM Ericsson & Co.",
    material: "Madeira, ferro e latão",
    model3dFileName: "telefone.glb",
    model3dScale: 2.4,
    model3dCameraDistance: 4.0,
    model3dRotation: [0, 0, 0],
  },

  "550e8400-e29b-41d4-a716-446655440006": {
    id: "550e8400-e29b-41d4-a716-446655440006",
    title: "Jarro de Terracota",
    description:
      "Jarro de terracota artesanal, com acabamento único e detalhes handcrafted.",
    fullDescription:
      "Este recipiente de terracota, marcado pelo tempo e com o bocal quebrado, era utilizado pelos primeiros habitantes de Birigui-SP para armazenar e refrescar água. Hoje, a peça é um importante registro histórico que simboliza o trabalho, a simplicidade e a resiliência dos pioneiros no interior paulista.",
    img: "/images/terracota_jug.jpg",
    categories: [
      "Arte Indígena",
      "Artesanato",
      "Utensílios de Argila",
      "Arte Sacra e Ritualistica",
    ],
    year: "1901-2000",
    artist: "Artesão Indígena Desconhecido",
    material: "Argila cozida",
    model3dFileName: "vazo.glb",
    model3dScale: 4.5,
    model3dCameraDistance: 3.5,
    model3dRotation: [0, 0, 0],
  },

  // ====================================
  // FOTOGRAFIAS HISTÓRICAS
  // ====================================

  "foto-001": {
    id: "foto-001",
    title: "Praça Central de Birigui",
    description:
      "Registro fotográfico da praça principal da cidade em meados do século XX.",
    fullDescription:
      "Registro fotográfico da praça principal da cidade em meados do século XX.",
    img: "/images/04-%20Pra%C3%A7a%20Dr.%20Gama.jpg",
    categories: ["Fotografia"],
    year: "1958",
    date: "1958-08-14",
  },

  "foto-002": {
    id: "foto-002",
    title: "Família do Bairro Centro",
    description:
      "Imagem histórica de uma família local em ambiente urbano e cotidiano.",
    fullDescription:
      "Imagem histórica de uma família local em ambiente urbano e cotidiano.",
    img: "/images/01-%20Folia%20de%20Reis%20-%20Frei%20Tarc%C3%ADsio%20-%201982.jpg",
    categories: ["Fotografia"],
    year: "1982",
    date: "1982-01-06",
  },

  "foto-003": {
    id: "foto-003",
    title: "Escola Municipal",
    description:
      "Fotografia de alunos e professores em frente à escola da cidade.",
    fullDescription:
      "Fotografia de alunos e professores em frente à escola da cidade.",
    img: "/images/09.jpg",
    categories: ["Fotografia"],
    year: "1964",
    date: "1964-10-21",
  },
};

// ======================================
// COMPONENTE PRINCIPAL
// ======================================

export function ArtworkDetails({
  obraId,
}: {
  obraId: string;
}) {
  const [abaAtiva, setAbaAtiva] =
    useState<"sobre" | "dados" | "modelo">("sobre");

  const obra = OBRAS_DATABASE[obraId];

  if (!obra) {
    return (
      <main className="flex min-h-[60vh] flex-grow items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="mb-4 font-serif text-3xl font-bold">
            Obra não encontrada
          </h1>

          <p className="mb-6 text-muted-foreground">
            Não foi possível localizar este item no acervo.
          </p>

          <Link
            href="/acervo"
            className="underline underline-offset-4"
          >
            Voltar ao acervo
          </Link>
        </div>
      </main>
    );
  }

  // ====================================
  // IDENTIFICA O TIPO DE ACERVO
  // ====================================

  const isFoto = obra.id.startsWith("foto-");

  const temModelo3D = Boolean(
    obra.model3dFileName
  );

  const abaExibida =
    !temModelo3D && abaAtiva === "modelo"
      ? "sobre"
      : abaAtiva;

  const abas = [
    { id: "sobre", nome: "Sobre" },
    { id: "dados", nome: "Dados" },
    ...(temModelo3D
      ? [{ id: "modelo", nome: "Modelo 3D" }]
      : []),
  ] as const;

  // ====================================
  // OBRAS RELACIONADAS
  // ====================================

  const relacionadas = Object.values(OBRAS_DATABASE)
    .filter((item) => {
      const itemIsFoto = item.id.startsWith("foto-");

      return (
        item.id !== obra.id &&
        itemIsFoto === isFoto
      );
    })
    .slice(0, 3);

  const linkAcervo = isFoto
    ? "/acervo?tipo=foto"
    : "/acervo?tipo=obra";

  return (
    <main className="w-full min-w-0 flex-grow bg-background text-foreground">

      {/* =====================================
          1. NAVEGAÇÃO SUPERIOR
      ===================================== */}

      <div className="mx-auto max-w-6xl px-4 pb-6 pt-10">
        <Link
          href={linkAcervo}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
        >
          <span aria-hidden="true">←</span>
          Voltar ao Acervo
        </Link>

        <h2 className="font-serif text-2xl font-bold">
          {isFoto
            ? "Detalhes da Fotografia:"
            : "Detalhes da Obra:"}
        </h2>
      </div>

      {/* =====================================
          2. FOTOGRAFIA PRINCIPAL
          COM ZOOM INTERATIVO
      ===================================== */}

      <section
        aria-label="Imagem principal do acervo"
        className="w-full"
      >
        <ArtworkImageZoom
          key={obra.id}
          src={obra.img}
          alt={obra.title}
        />
      </section>

      {/* =====================================
          3. SISTEMA DE ABAS
      ===================================== */}

      <section className="mx-auto max-w-6xl px-4 pb-14 pt-9">

        {/* BOTÕES DAS ABAS */}

        <div
          role="tablist"
          aria-label="Informações do item"
          className="mb-10 flex flex-wrap gap-7 border-b"
        >
          {abas.map((aba) => (
            <button
              key={aba.id}
              type="button"
              role="tab"
              id={`aba-${aba.id}`}
              aria-selected={abaExibida === aba.id}
              aria-controls={`painel-${aba.id}`}
              onClick={() =>
                setAbaAtiva(
                  aba.id as "sobre" | "dados" | "modelo"
                )
              }
              className={`
                -mb-px cursor-pointer
                border-b-2 px-1 pb-4
                text-sm font-bold
                uppercase tracking-wide
                transition-colors
                focus-visible:outline-2
                focus-visible:outline-offset-4
                ${
                  abaExibida === aba.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        {/* =====================================
            ABA SOBRE
        ===================================== */}

        {abaExibida === "sobre" && (
          <div
            id="painel-sobre"
            role="tabpanel"
            aria-labelledby="aba-sobre"
          >
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">

              {/* DESCRIÇÃO */}

              <article>
                <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
                  {obra.title}
                </h1>

                {obra.year && (
                  <p className="mb-6 text-sm text-muted-foreground">
                    {obra.artist
                      ? `${obra.artist}, ${obra.year}`
                      : obra.year}
                  </p>
                )}

                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  {obra.description}
                </p>

                {!isFoto &&
                  obra.fullDescription !== obra.description && (
                    <>
                      <h2 className="mb-4 font-serif text-2xl font-bold">
                        Sobre esta obra
                      </h2>

                      <p className="text-base leading-8 text-muted-foreground">
                        {obra.fullDescription}
                      </p>
                    </>
                  )}
              </article>

              {/* RESUMO TÉCNICO */}

              <aside className="border-t pt-6 lg:border-t-0 lg:pt-0">

                <dl className="space-y-6">

                  {obra.year && (
                    <div>
                      <dt className="text-sm font-semibold">
                        {isFoto ? "Ano" : "Período"}
                      </dt>

                      <dd className="mt-1 text-sm text-muted-foreground">
                        {obra.year}
                      </dd>
                    </div>
                  )}

                  {obra.artist && (
                    <div>
                      <dt className="text-sm font-semibold">
                        Artista / Fabricante
                      </dt>

                      <dd className="mt-1 text-sm text-muted-foreground">
                        {obra.artist}
                      </dd>
                    </div>
                  )}

                  {obra.material && (
                    <div>
                      <dt className="text-sm font-semibold">
                        Material
                      </dt>

                      <dd className="mt-1 text-sm text-muted-foreground">
                        {obra.material}
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-semibold">
                      Tipo de acervo
                    </dt>

                    <dd className="mt-1 text-sm text-muted-foreground">
                      {isFoto
                        ? "Fotografia"
                        : "Obra ou objeto"}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => setAbaAtiva("dados")}
                  className="mt-8 cursor-pointer text-sm font-semibold underline underline-offset-4 hover:opacity-70"
                >
                  Ver todos os dados
                </button>
              </aside>
            </div>
          </div>
        )}

        {/* =====================================
            ABA DADOS
        ===================================== */}

        {abaExibida === "dados" && (
          <div
            id="painel-dados"
            role="tabpanel"
            aria-labelledby="aba-dados"
          >
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(180px,1fr)_minmax(0,2.5fr)] md:gap-14">

              {/* MINIATURA */}

              <div className="relative h-[320px] w-full overflow-hidden rounded-lg bg-black/5 sm:h-[400px]">

                <Image
                  src={obra.img}
                  alt={`Miniatura de ${obra.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-contain p-3"
                />

              </div>

              {/* FICHA TÉCNICA */}

              <div className="min-w-0 space-y-10">

                {/* IDENTIFICAÇÃO */}

                <section className="border-b pb-8">

                  <h2 className="mb-6 font-serif text-xl font-bold uppercase tracking-wide">
                    Identificação
                  </h2>

                  <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[160px_1fr]">

                    <dt className="text-sm font-semibold">
                      Título
                    </dt>

                    <dd className="text-sm text-muted-foreground">
                      {obra.title}
                    </dd>

                    <dt className="text-sm font-semibold">
                      Descrição
                    </dt>

                    <dd className="text-sm leading-relaxed text-muted-foreground">
                      {obra.description}
                    </dd>

                    <dt className="text-sm font-semibold">
                      Identificador digital
                    </dt>

                    <dd className="break-all text-sm text-muted-foreground">
                      {obra.id}
                    </dd>

                    <dt className="text-sm font-semibold">
                      Tipo
                    </dt>

                    <dd className="text-sm text-muted-foreground">
                      {isFoto
                        ? "Fotografia histórica"
                        : "Obra ou objeto"}
                    </dd>

                  </dl>
                </section>

                {/* CRIAÇÃO */}

                <section className="border-b pb-8">

                  <h2 className="mb-6 font-serif text-xl font-bold uppercase tracking-wide">
                    Criação
                  </h2>

                  <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[160px_1fr]">

                    {obra.artist && (
                      <>
                        <dt className="text-sm font-semibold">
                          Artista / Fabricante
                        </dt>

                        <dd className="text-sm text-muted-foreground">
                          {obra.artist}
                        </dd>
                      </>
                    )}

                    {obra.year && (
                      <>
                        <dt className="text-sm font-semibold">
                          {isFoto
                            ? "Ano cadastrado"
                            : "Período"}
                        </dt>

                        <dd className="text-sm text-muted-foreground">
                          {obra.year}
                        </dd>
                      </>
                    )}

                    {obra.date && (
                      <>
                        <dt className="text-sm font-semibold">
                          Data cadastrada
                        </dt>

                        <dd className="text-sm text-muted-foreground">
                          {obra.date
                            .split("-")
                            .reverse()
                            .join("/")}
                        </dd>
                      </>
                    )}

                  </dl>
                </section>

                {/* MATERIAL E CLASSIFICAÇÃO */}

                <section className="border-b pb-8">

                  <h2 className="mb-6 font-serif text-xl font-bold uppercase tracking-wide">
                    {isFoto
                      ? "Classificação"
                      : "Material e classificação"}
                  </h2>

                  <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[160px_1fr]">

                    {obra.material && (
                      <>
                        <dt className="text-sm font-semibold">
                          Material
                        </dt>

                        <dd className="text-sm text-muted-foreground">
                          {obra.material}
                        </dd>
                      </>
                    )}

                    <dt className="text-sm font-semibold">
                      Categorias
                    </dt>

                    <dd className="flex flex-wrap gap-2">

                      {obra.categories.map((categoria) => (
                        <span
                          key={categoria}
                          className="rounded border bg-orange-400/50 px-3 py-1 text-sm font-medium"
                        >
                          {categoria}
                        </span>
                      ))}

                    </dd>

                  </dl>
                </section>

              </div>
            </div>
          </div>
        )}

        {/* =====================================
            ABA MODELO 3D
        ===================================== */}

        {abaExibida === "modelo" &&
          obra.model3dFileName && (
            <div
              id="painel-modelo"
              role="tabpanel"
              aria-labelledby="aba-modelo"
            >
              <ModelViewer
                fileName={obra.model3dFileName}
                title="Exploração Interativa 3D"
                description="Clique e arraste para girar a peça. Use o scroll para aproximar ou afastar."
                scale={obra.model3dScale}
                cameraDistance={obra.model3dCameraDistance}
                rotation={obra.model3dRotation}
              />
            </div>
          )}

      </section>

      {/* =====================================
          4. DESCUBRA MAIS
          ESTILO RIJKSMUSEUM
      ===================================== */}

      {relacionadas.length > 0 && (
        <section
          aria-labelledby="titulo-relacionadas"
          className="w-full border-t border-border bg-background"
        >

          {/* CABEÇALHO */}

          <div className="border-b border-border px-6 py-8 md:px-16">

            <h2
              id="titulo-relacionadas"
              className="text-sm font-bold uppercase tracking-widest"
            >
              Descubra mais
            </h2>

          </div>

          {/* GALERIA */}

          <div
            className={`
              grid grid-cols-1 gap-[2px] bg-border
              sm:grid-cols-2
              ${
                relacionadas.length >= 3
                  ? "lg:grid-cols-3"
                  : "lg:grid-cols-2"
              }
            `}
          >

            {relacionadas.map((item, index) => (
              <Link
                key={item.id}
                href={`/acervo/${item.id}/detalhes`}
                aria-label={`Ver detalhes de ${item.title}`}
                className="group relative block h-[350px] overflow-hidden bg-[#241a12] md:h-[420px]"
              >

                {/* IMAGEM */}

                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* DEGRADÊ */}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35"
                />

                {/* IDENTIFICAÇÃO */}

                {index === 0 && (
                  <p className="absolute left-6 top-8 z-10 text-2xl font-bold uppercase tracking-wide text-[#f6e9d0] md:left-10 md:text-3xl">
                    {isFoto
                      ? "Mais fotografias"
                      : "Mais do acervo"}
                  </p>
                )}

                {/* INFORMAÇÕES DA PEÇA */}

                <div className="absolute bottom-0 left-0 z-10 w-full p-6 md:p-8">

                  <h3 className="mb-2 text-xl font-bold leading-tight text-[#f6e9d0]">
                    {item.title}
                  </h3>

                  <p className="text-sm text-white/90">
                    {item.year || "Peça do acervo"}
                  </p>

                  <span
                    className="
                      mt-4 inline-block
                      translate-y-2
                      text-sm font-medium
                      text-[#e8c995]
                      opacity-0
                      transition-all duration-300
                      group-hover:translate-y-0
                      group-hover:opacity-100
                      group-focus-visible:opacity-100
                      max-md:translate-y-0
                      max-md:opacity-100
                    "
                  >
                    Explorar item →
                  </span>

                </div>
              </Link>
            ))}
          </div>

          {/* BOTÃO FINAL */}

          <div className="flex justify-center px-6 py-12 md:py-16">

            <Link
              href={linkAcervo}
              className="
                border border-border
                px-8 py-3
                text-sm font-semibold
                uppercase tracking-wide
                text-foreground
                transition-colors duration-300
                hover:bg-foreground
                hover:text-background
              "
            >
              {isFoto
                ? "Explorar fotografias"
                : "Explorar todo o acervo"}
            </Link>

          </div>
        </section>
      )}

    </main>
  );
}
