import Link from 'next/link';

export default function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-semibold md:text-base">
      <span className="text-2xl font-bold font-headline text-primary">
        Grofyy
      </span>
    </Link>
  );
}
