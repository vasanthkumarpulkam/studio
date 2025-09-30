import Link from 'next/link';

export default function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-semibold md:text-base">
      <svg
        className="h-7 w-7 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.012 2.25c4.285 0 7.75 3.465 7.75 7.75s-3.465 7.75-7.75 7.75S4.262 14.285 4.262 10s3.465-7.75 7.75-7.75zm0 1.5c-3.451 0-6.25 2.799-6.25 6.25s2.799 6.25 6.25 6.25 6.25-2.799 6.25-6.25-2.799-6.25-6.25-6.25zm.988 1.938c.552 0 1 .448 1 1v.688c.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25h-.5v.688c0 .552-.448 1-1 1s-1-.448-1-1v-.688a1.25 1.25 0 0 1-2.5 0v-.875a.75.75 0 0 1 1.5 0v.875c.276 0 .5.224.5.5s-.224.5-.5.5-.5-.224-.5-.5v-2.375c0-.276.224-.5.5-.5s.5.224.5.5v.875h1.5v-.688c0-.552.448-1 1-1zm1.25 11.062L18 19.5v1.25c0 .69-.56 1.25-1.25 1.25H7.25c-.69 0-1.25-.56-1.25-1.25V19.5l3.75-2.75h2.5z" />
      </svg>
      <span className="text-xl font-bold font-headline text-primary">
        ServiceHub
      </span>
    </Link>
  );
}
