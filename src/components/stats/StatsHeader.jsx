import { Logo } from "@/components/Logo";
import { RangeToggle } from "@/components/RangeToggle";

export function StatsHeader({ nav, range, onRangeChange }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line-strong bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-5 gap-y-[10px] px-[18px] py-3 md:px-7">
        <Logo className="text-[17px] md:text-xl" />
        <nav className="order-last flex w-full gap-[6px] overflow-x-auto md:order-none md:w-auto md:flex-1 md:gap-[2px]">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="label-mono whitespace-nowrap rounded-full border border-line-strong px-[9px] py-[6px] text-white/55 hover:bg-white/[.06] hover:text-white md:rounded-lg md:border-transparent md:px-[10px] md:py-[7px]"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto md:ml-0">
          <RangeToggle value={range} onChange={onRangeChange} />
        </div>
      </div>
    </header>
  );
}
