import { Logo } from "@/components/Logo";

export function LoadingScreen({ step = "reading your top artists" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-[26px] bg-ink"
    >
      <Logo className="text-[30px]" />
      <div className="h-[3px] w-[260px] overflow-hidden rounded-full bg-surface-raised">
        <div className="h-full w-[42%] animate-loading-bar rounded-full bg-purple" />
      </div>
      <div className="label-mono flex items-center gap-[10px] text-xs text-white/45">
        <span>{step}</span>
        <span aria-hidden className="flex gap-1">
          {[0, 0.2, 0.4].map((delay) => (
            <span
              key={delay}
              className="h-[5px] w-[5px] animate-blink rounded-full bg-purple"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
