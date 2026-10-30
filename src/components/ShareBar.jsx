import { cn } from "@/lib/utils";

export function ShareBar({ value, gradient = false, className, title }) {
  const pct = Math.round(Math.min(1, Math.max(0, value || 0)) * 100);

  return (
    <div
      title={title}
      className={cn("h-[5px] w-24 overflow-hidden rounded-full bg-track", className)}
    >
      <div
        className={cn(
          "h-full",
          gradient ? "bg-gradient-to-r from-purple to-purple-light" : "bg-purple"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
