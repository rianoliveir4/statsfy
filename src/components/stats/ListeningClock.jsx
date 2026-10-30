import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";
import { hourLabel } from "@/lib/clock";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const AXIS = ["00", "06", "12", "18", "23"];
const DIAL_LABELS = [
  { label: "00", className: "left-1/2 top-2" },
  { label: "06", className: "left-[calc(100%-10px)] top-1/2" },
  { label: "12", className: "left-1/2 top-[calc(100%-8px)]" },
  { label: "18", className: "left-[10px] top-1/2" },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function dialTone(level) {
  if (level > 0.66) return "bg-purple";
  if (level > 0.33) return "bg-purple/[.62]";
  return "bg-purple/[.26]";
}

function heatTone(level) {
  if (level === 0) return "bg-white/[.05]";
  if (level > 0.7) return "bg-purple";
  if (level > 0.45) return "bg-purple/70";
  if (level > 0.22) return "bg-purple/[.42]";
  return "bg-purple/[.16]";
}

function barTone(level, isPeak) {
  if (isPeak) return "bg-purple";
  if (level > 0.4) return "bg-purple/[.66]";
  return "bg-purple/[.28]";
}

function HourAxis({ className }) {
  return (
    <div className={cn("flex justify-between font-mono text-[9px] font-medium text-white/30", className)}>
      {AXIS.map((h) => (
        <span key={h}>{h}</span>
      ))}
    </div>
  );
}

function Dial({ clock }) {
  return (
    <div className="relative h-[200px] w-[200px] md:h-[300px] md:w-[300px]">
      <div className="absolute inset-0 rounded-full border border-white/[.07]" />
      <div className="absolute inset-[21%] rounded-full border border-dashed border-white/[.07]" />
      {clock.hours.map((plays, hour) => (
        <div
          key={hour}
          title={`${hourLabel(hour)} — ${plural(plays, "play")}`}
          className={cn(
            "absolute left-1/2 top-1/2 -ml-[3.5px] w-[7px] origin-bottom rounded md:-ml-[4.5px] md:w-[9px]",
            dialTone(plays / clock.max)
          )}
          style={{
            height: `${(0.14 + (plays / clock.max) * 0.34) * 100}%`,
            transform: `translateY(-100%) rotate(${hour * 15}deg)`,
          }}
        />
      ))}
      <div className="absolute inset-[35%] rounded-full bg-surface" />
      {DIAL_LABELS.map(({ label, className }) => (
        <span
          key={label}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] font-medium text-white/40",
            className
          )}
        >
          {label}
        </span>
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xl font-extrabold tracking-[-.02em] md:text-[28px]">
          {hourLabel(clock.peakHour)}
        </div>
        <div className="font-mono text-[10px] font-medium text-white/40">PEAK HOUR</div>
      </div>
    </div>
  );
}

function Heatmap({ clock }) {
  return (
    <div className="card p-[22px]">
      <div className="mb-4 flex items-baseline justify-between">
        <div className="label-mono text-white/[.42]">WEEKDAY × HOUR</div>
        <div className="flex items-center gap-[6px] font-mono text-[10px] font-medium text-white/35">
          LOW
          <span className="flex gap-[2px]">
            {["bg-purple/[.16]", "bg-purple/[.42]", "bg-purple/70", "bg-purple"].map((tone) => (
              <span key={tone} className={cn("h-2 w-3", tone)} />
            ))}
          </span>
          HIGH
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {clock.heat.map((row, day) => (
          <div key={DAYS[day]} className="grid grid-cols-[30px_minmax(0,1fr)] items-center gap-2">
            <span className="font-mono text-[10px] font-medium text-white/[.38]">{DAYS[day]}</span>
            <div className="grid grid-cols-[repeat(24,1fr)] gap-[3px]">
              {row.map((plays, hour) => (
                <div
                  key={hour}
                  title={`${DAYS[day]} ${hourLabel(hour)} — ${plural(plays, "play")}`}
                  className={cn("h-4 rounded-[3px]", heatTone(plays / clock.heatMax))}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="mt-[2px] grid grid-cols-[30px_minmax(0,1fr)] gap-2">
          <span />
          <HourAxis />
        </div>
      </div>
    </div>
  );
}

function HourBars({ clock }) {
  return (
    <div className="card p-[22px]">
      <div className="label-mono mb-[18px] text-white/[.42]">PLAYS PER HOUR</div>
      <div className="grid h-[120px] grid-cols-[repeat(24,1fr)] items-end gap-[3px]">
        {clock.hours.map((plays, hour) => (
          <div
            key={hour}
            title={`${hourLabel(hour)} — ${plural(plays, "play")}`}
            className={cn("rounded-t-[3px]", barTone(plays / clock.max, hour === clock.peakHour))}
            style={{ height: `${Math.max(4, (plays / clock.max) * 100)}%` }}
          />
        ))}
      </div>
      <HourAxis className="mt-2" />
      <div className="mt-[14px] text-sm leading-normal text-white/55">{clock.peakNote}</div>
    </div>
  );
}

export function ListeningClock({ clock }) {
  const aside = `FROM ${clock.total} RECENT PLAYS · ${plural(clock.spanDays, "DAY").toUpperCase()} · LOCAL TIME`;

  return (
    <Section id="clock" title="Listening" accent="Clock" aside={aside}>
      <div className="grid items-stretch gap-6 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="card flex flex-col items-center gap-[18px] p-4 md:p-6">
          <Dial clock={clock} />
          <div className="w-full border-t border-line pt-4">
            <div className="label-mono text-purple-light">VERDICT</div>
            <div className="mt-[6px] text-lg font-extrabold tracking-[-.02em] md:text-2xl">
              {clock.verdict}
            </div>
            <p className="m-0 mt-2 text-sm leading-normal text-white/55">{clock.verdictNote}</p>
          </div>
        </div>
        <div className="hidden flex-col gap-6 md:flex">
          <Heatmap clock={clock} />
          <HourBars clock={clock} />
        </div>
      </div>
    </Section>
  );
}
