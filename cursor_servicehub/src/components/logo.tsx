import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-semibold md:text-base">
       <div className="bg-primary p-2 rounded-md">
        <Bot className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold font-headline text-primary">
        ServiceHub
      </span>
    </Link>
  );
}
