import Image from 'next/image';
import Link from 'next/link';
import type { CollectionItem } from './collection-items';

export function ArtworkGallery({
  items,
  prioritizeImages = false,
  itemHeading: ItemHeading = 'h3',
}: {
  items: CollectionItem[];
  prioritizeImages?: boolean;
  itemHeading?: 'h2' | 'h3';
}) {
  return (
    <div className="grid auto-rows-[220px] grid-cols-1 gap-[2px] md:auto-rows-[190px] md:grid-cols-12 xl:auto-rows-[230px]">
      {items.map((item, index) => (
        <Link
          key={item.id}
          href={`/acervo/${item.id}/detalhes`}
          aria-label={`Ver detalhes de ${item.title}`}
          className={`group relative overflow-hidden bg-muted focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${item.tileClass}`}
        >
          <Image
            src={item.img}
            alt={item.title}
            fill
            priority={prioritizeImages && index < 3}
            sizes="(max-width: 767px) 100vw, 66vw"
            className={`object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.035] ${item.imagePosition ?? ''}`}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/90 from-5% via-black/45 to-transparent transition-opacity duration-300 motion-reduce:transition-none [@media(hover:hover)]:opacity-45 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100"
          />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white transition-opacity duration-300 motion-reduce:transition-none md:p-6 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
            {item.year && (
              <span className="text-xs font-semibold tracking-[0.18em]">
                {item.year}
              </span>
            )}
            <ItemHeading className="mt-2 max-w-xl text-xl leading-tight font-bold md:text-2xl">
              {item.title}
            </ItemHeading>
            <p className="mt-2 line-clamp-3 max-w-xl text-sm leading-6 text-white/90">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
