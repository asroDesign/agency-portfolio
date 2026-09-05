import { ChevronDown } from "lucide-react";

export function ScrollIndicator({ target, label }: { target: string; label: string }) {
  return (
    <a
      href={target}
      aria-label={label}
      className="group absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-base-content/45 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span aria-hidden="true" className="relative h-8 w-5 rounded-full border border-current">
        <span className="animate-scroll-dot absolute inset-x-0 top-1.5 mx-auto h-1 w-1 rounded-full bg-current" />
      </span>
      <ChevronDown aria-hidden="true" className="h-4 w-4 animate-bounce" />
    </a>
  );
}
