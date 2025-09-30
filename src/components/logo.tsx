import { HandHeart } from "lucide-react";
import Link from 'next/link';

export default function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-semibold md:text-base">
      <HandHeart className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline text-primary">
        ServiceHub
      </span>
    </Link>
  );
}
