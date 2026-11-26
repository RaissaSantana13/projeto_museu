import Link from 'next/link';

export function LandingSectionHeading({
  id,
  title,
  href,
  linkLabel,
  onDark = false,
}: {
  id: string;
  title: string;
  href: string;
  linkLabel: string;
  onDark?: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-4 px-5 pt-10 pb-8 sm:px-8 lg:px-12">
      <h2 id={id} className="text-sm font-bold tracking-[0.12em] uppercase">
        {title}
      </h2>
      <Link
        href={href}
        className={`text-sm font-medium underline-offset-4 hover:underline focus-visible:underline ${onDark ? 'text-orange-200' : 'text-primary'}`}
      >
        {linkLabel}
      </Link>
    </div>
  );
}
