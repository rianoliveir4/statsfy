import { RANGES } from "@/lib/ranges";

export function countGenres(artists) {
  return new Set(artists.flatMap((a) => a.genres ?? [])).size;
}

export function minutesListened(plays) {
  const ms = plays.reduce((total, p) => total + (p.track?.duration_ms ?? 0), 0);
  return Math.round(ms / 60000);
}

export function rankIn(artists, id) {
  const index = artists.findIndex((a) => a.id === id);
  return index < 0 ? null : index + 1;
}

export function topArtistNote(top, range) {
  const leader = top[range]?.artists[0];
  if (!leader) return "";

  const others = RANGES.filter((r) => r.id !== range).map((r) => ({
    label: r.column.toLowerCase(),
    rank: rankIn(top[r.id]?.artists ?? [], leader.id),
  }));

  if (others.every((o) => o.rank === 1)) return "Held #1 across all three ranges.";

  return others
    .map(({ label, rank }) =>
      rank ? `#${rank} over ${label}.` : `Outside the top 50 over ${label}.`
    )
    .join(" ");
}
