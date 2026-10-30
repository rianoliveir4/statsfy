import { Section } from "@/components/Section";
import { ShareBar } from "@/components/ShareBar";
import { cn } from "@/lib/utils";
import { RANGES } from "@/lib/ranges";

const GENRE_TONES = [
  "bg-purple text-white",
  "bg-[#7a5ee0] text-white",
  "bg-[#9c86ec] text-[#12121a]",
  "bg-[#c0b1f4] text-[#12121a]",
  "bg-track text-white/70",
];

const MIN_LABELED_SHARE = 0.14;

function Movers({ movers }) {
  return (
    <div className="flex flex-col gap-[10px] border-t border-line pt-4">
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,40px)] items-baseline gap-2 md:grid-cols-[minmax(0,1fr)_repeat(3,48px)]">
        <span className="label-mono text-white/[.42]">MOVERS</span>
        {RANGES.map((r) => (
          <span key={r.id} className="label-mono text-center text-white/[.42]">
            {r.short}
          </span>
        ))}
      </div>
      {movers.map((mover) => (
        <div
          key={mover.id}
          className="grid grid-cols-[minmax(0,1fr)_repeat(3,40px)] items-center gap-2 md:grid-cols-[minmax(0,1fr)_repeat(3,48px)]"
        >
          <span className="truncate text-sm font-semibold md:text-[17px]">{mover.name}</span>
          {mover.ranks.map((rank, i) => {
            const isLatest = i === mover.ranks.length - 1;
            return (
              <span
                key={RANGES[i].id}
                className={cn(
                  "label-mono rounded-[7px] py-1 text-center",
                  !rank && "text-white/30",
                  rank && !isLatest && "text-white/55",
                  rank && isLatest && mover.delta > 0 && "bg-purple/[.18] text-purple-light",
                  isLatest && mover.delta < 0 && "bg-coral/[.12] text-coral"
                )}
              >
                {rank ? `#${rank}` : "—"}
              </span>
            );
          })}
        </div>
      ))}
      <p className="m-0 font-mono text-[10px] font-medium leading-normal text-white/35">
        Rank in each period. — means outside your top 50.
      </p>
    </div>
  );
}

function GenreMix({ mix }) {
  return (
    <div className="card flex flex-col gap-4 p-[22px]">
      <div className="label-mono text-white/[.42]">GENRE MIX OVER TIME</div>
      <div className="grid h-[280px] grid-cols-3 gap-[14px]">
        {mix.columns.map((column) => (
          <div key={column.label} className="flex min-h-0 flex-col gap-[3px]">
            <div className="flex min-h-0 flex-1 flex-col justify-end gap-[3px]">
              {column.bands.map((band, i) =>
                band.share > 0 ? (
                  <div
                    key={band.genre}
                    title={`${band.genre} — ${Math.round(band.share * 100)}%`}
                    className={cn(
                      "flex min-h-[4px] items-center justify-center overflow-hidden rounded-md",
                      GENRE_TONES[i]
                    )}
                    style={{ flex: `${band.share} 1 0` }}
                  >
                    {band.share >= MIN_LABELED_SHARE && (
                      <span className="truncate px-1 font-mono text-[10px] font-medium">
                        {band.genre}
                      </span>
                    )}
                  </div>
                ) : null
              )}
            </div>
            <div className="mt-[6px] text-center font-mono text-[10px] font-medium text-white/40">
              {column.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {mix.genres.map((genre, i) => (
          <span key={genre} className="flex items-center gap-[6px] font-mono text-[10px] font-medium text-white/55">
            <span className={cn("h-2 w-2 rounded-sm", GENRE_TONES[i])} />
            {genre}
          </span>
        ))}
      </div>
      <p className="m-0 text-sm leading-normal text-white/55">{mix.note}</p>
    </div>
  );
}

export function TasteDrift({ drift }) {
  return (
    <Section id="drift" title="Taste" accent="Drift" aside="1 YEAR · 6 MONTHS · 4 WEEKS COMPARED">
      <div className={cn("grid gap-6", drift.genreMix && "md:grid-cols-2")}>
        <div className="card flex flex-col gap-4 p-4 md:p-[22px]">
          <div className="flex flex-wrap items-end gap-x-[18px] gap-y-2">
            <div>
              <div className="label-mono text-white/[.42]">DRIFT SCORE</div>
              <div className="text-[40px] font-extrabold leading-none tracking-[-.04em] md:text-[64px]">
                {drift.score}%
              </div>
            </div>
            <div className="min-w-[200px] flex-1 pb-[6px] text-[15px] leading-[1.45] text-white/55">
              {drift.note}
            </div>
          </div>
          <ShareBar value={drift.score / 100} gradient className="h-[6px] w-full" />
          <div className="flex justify-between font-mono text-[10px] font-medium text-white/35">
            <span>SETTLED</span>
            <span>RESTLESS</span>
          </div>
          {drift.movers.length > 0 && <Movers movers={drift.movers} />}
        </div>
        {drift.genreMix && <GenreMix mix={drift.genreMix} />}
      </div>
    </Section>
  );
}
