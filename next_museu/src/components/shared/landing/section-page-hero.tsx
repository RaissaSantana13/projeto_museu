import Image from 'next/image';
import { cn } from '@/lib/utils';

export function SectionPageHero({
  title,
  description,
  image,
  imageAlt,
  imagePosition,
}: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
}) {
  return (
    <header className="relative isolate flex min-h-[clamp(28rem,84svh,60rem)] items-end overflow-hidden bg-neutral-950 text-white">
      <Image
        src={image}
        alt={imageAlt}
        fill
        preload
        sizes="100vw"
        className={cn('-z-20 object-cover', imagePosition)}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/25 via-32% to-transparent to-68%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-36 bg-linear-to-b from-black/75 to-transparent"
      />
      <div className="w-full px-[clamp(1.25rem,5.5vw,8rem)] pt-24 pb-[clamp(2rem,6vh,5rem)]">
        <h1 className="text-[clamp(2.25rem,5.5vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight uppercase">
          {title}
        </h1>
        <p className="mt-3 text-base text-white/95 sm:text-xl">{description}</p>
      </div>
    </header>
  );
}
