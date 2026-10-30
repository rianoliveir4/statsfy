import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <span className={cn("font-extrabold tracking-[-.02em]", className)}>
      Stats<span className="text-purple">Fy</span>
    </span>
  );
}
