import { useReveal } from "@/hooks/useReveal";

export function Section({ id, title, accent, aside, children }) {
  const ref = useReveal();

  return (
    <section ref={ref} id={id} data-reveal="" className="scroll-mt-[120px] pt-16 md:pt-[88px]">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 md:mb-[26px]">
        <h2 className="m-0 text-[28px] font-extrabold tracking-[-.025em] md:text-[34px]">
          {title} <span className="text-purple">{accent}</span>
        </h2>
        {aside && <span className="label-mono text-white/40">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
