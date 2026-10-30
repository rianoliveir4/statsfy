export function ReportHero({ caption, stats }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-[30px] border-b border-line-strong pb-8 pt-12 md:pb-[46px] md:pt-[74px]">
      <div>
        <div className="label-mono mb-[14px] text-xs text-purple-light">{caption}</div>
        <h1 className="m-0 text-[clamp(40px,5.6vw,76px)] font-extrabold leading-[.95] tracking-[-.035em]">
          Your listening
          <br />
          report.
        </h1>
      </div>
      <div className="grid w-full grid-cols-3 gap-2 md:flex md:w-auto md:gap-[34px]">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-line bg-surface p-3 md:border-0 md:bg-transparent md:p-0"
          >
            <div className="text-xl font-extrabold tracking-[-.02em] md:text-[34px]">{s.value}</div>
            <div className="label-mono mt-1 text-[9px] text-white/40 md:text-[11px]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
