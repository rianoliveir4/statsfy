import { cn } from "@/lib/utils";
import { RANGES } from "@/lib/ranges";

export function RangeToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="label-mono hidden text-white/35 sm:inline">RANGE</span>
      <div
        role="radiogroup"
        aria-label="Time range"
        className="flex rounded-[10px] border border-white/[.07] bg-surface p-[3px]"
      >
        {RANGES.map((range) => {
          const active = range.id === value;
          return (
            <button
              key={range.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(range.id)}
              className={cn(
                "label-mono cursor-pointer rounded-[7px] border-none px-[11px] py-[7px] transition-colors",
                active ? "bg-purple text-white" : "bg-transparent text-white/55 hover:text-white"
              )}
            >
              {range.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
