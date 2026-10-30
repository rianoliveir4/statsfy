import { useReveal } from "@/hooks/useReveal";

export function Section({ id, title, accent, aside, children }) {
  const ref = useReveal();

  return (
    <section ref={ref} id={id} data-reveal="" className="scroll-mt-[120px] pt-[88px]">
      <div className="mb-[26px] flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="m-0 text-[34px] font-extrabold tracking-[-.025em]">
          {title} <span className="text-purple">{accent}</span>
        </h2>
        {aside && <span className="label-mono text-white/40">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
