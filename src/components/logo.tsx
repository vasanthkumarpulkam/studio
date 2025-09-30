import { HandHeart } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <HandHeart className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline text-primary">
        HandyConnect
      </span>
    </div>
  );
}
