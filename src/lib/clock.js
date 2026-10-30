import { pad2 } from "@/lib/format";

const BUCKETS = [
  { from: 0, to: 5, verdict: "You're a late-night listener.", plural: "Late nights" },
  { from: 5, to: 12, verdict: "You're a morning listener.", plural: "Mornings" },
  { from: 12, to: 18, verdict: "You're an afternoon listener.", plural: "Afternoons" },
  { from: 18, to: 24, verdict: "You're a night listener.", plural: "Evenings" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

export const hourLabel = (hour) => (hour === 24 ? "midnight" : `${pad2(hour)}:00`);

const percent = (part, total) => Math.round((part / total) * 100);

export function buildClock(plays) {
  const times = plays
    .map((p) => new Date(p.played_at))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (!times.length) return null;

  const hours = Array(24).fill(0);
  const heat = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const date of times) {
    const hour = date.getHours();
    hours[hour] += 1;
    heat[(date.getDay() + 6) % 7][hour] += 1;
  }

  const total = times.length;
  const max = Math.max(...hours);
  const peakHour = hours.indexOf(max);

  const buckets = BUCKETS.map((b) => ({
    ...b,
    plays: hours.slice(b.from, b.to).reduce((sum, v) => sum + v, 0),
  })).sort((a, b) => b.plays - a.plays);
  const busiest = buckets[0];
  const quietest = buckets[buckets.length - 1];

  const spanMs = Math.max(...times) - Math.min(...times);

  return {
    total,
    hours,
    max,
    peakHour,
    heat,
    heatMax: Math.max(...heat.flat()),
    spanDays: Math.max(1, Math.ceil(spanMs / DAY_MS)),
    verdict: busiest.verdict,
    verdictNote:
      `${percent(busiest.plays, total)}% of your last ${total} plays land between ` +
      `${hourLabel(busiest.from)} and ${hourLabel(busiest.to)}. ` +
      `${quietest.plural} are the quietest at ${percent(quietest.plays, total)}%.`,
    peakNote: `Peak at ${hourLabel(peakHour)} with ${max} of your last ${total} plays.`,
  };
}
