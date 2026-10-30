import { RANGES } from "@/lib/ranges";
import { rankIn } from "@/lib/stats";

const TOP = 10;
const OUTSIDE = 51;
const MOVERS = 5;
const GENRE_BANDS = 4;
const NOTABLE_POINTS = 3;

function churnLabel(score) {
  if (score < 25) return "Pretty settled.";
  if (score < 50) return "Moderate churn.";
  if (score < 75) return "Restless.";
  return "A whole new rotation.";
}

function driftNote(changed, compared, score) {
  if (!changed) {
    return `Your top ${compared} from the last 12 months still holds in the last 4 weeks. Very settled.`;
  }
  return `${changed} of your top ${compared} artists from the last 12 months aren't in your top ${compared} for the last 4 weeks. ${churnLabel(score)}`;
}

function buildMovers(long, medium, short) {
  const candidates = new Map();
  for (const list of [long, medium, short]) {
    for (const artist of list.slice(0, TOP)) candidates.set(artist.id, artist);
  }

  const moves = [...candidates.values()].map((artist) => {
    const ranks = [long, medium, short].map((list) => rankIn(list, artist.id));
    const delta = (ranks[0] ?? OUTSIDE) - (ranks[2] ?? OUTSIDE);
    return { id: artist.id, name: artist.name, ranks, delta };
  });
  const risers = moves.filter((m) => m.delta > 0).sort((a, b) => b.delta - a.delta);
  const fallers = moves.filter((m) => m.delta < 0).sort((a, b) => a.delta - b.delta);

  const movers = [];
  for (let i = 0; movers.length < MOVERS && (i < risers.length || i < fallers.length); i++) {
    if (risers[i]) movers.push(risers[i]);
    if (fallers[i] && movers.length < MOVERS) movers.push(fallers[i]);
  }
  return movers;
}

function countGenreTags(artists) {
  const counts = new Map();
  let total = 0;
  for (const artist of artists) {
    for (const genre of artist.genres ?? []) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
      total += 1;
    }
  }
  return { counts, total };
}

function genreNote(columns, genres) {
  const first = columns[0].bands;
  const last = columns[columns.length - 1].bands;
  const deltas = genres.map((genre, i) => ({
    genre,
    points: Math.round((last[i].share - first[i].share) * 100),
  }));
  const gainer = deltas.reduce((a, b) => (b.points > a.points ? b : a));
  const loser = deltas.reduce((a, b) => (b.points < a.points ? b : a));
  const gained = gainer.points >= NOTABLE_POINTS;
  const lost = loser.points <= -NOTABLE_POINTS;

  if (gained && lost) {
    return `${gainer.genre} gained ${gainer.points} points while ${loser.genre} lost ${-loser.points}.`;
  }
  if (gained) return `${gainer.genre} gained ${gainer.points} points.`;
  if (lost) return `${loser.genre} lost ${-loser.points} points.`;
  return "Your genre mix barely moved between the last 12 months and the last 4 weeks.";
}

export function buildGenreMix(top) {
  const perRange = RANGES.map((range) => ({
    range,
    ...countGenreTags(top[range.id]?.artists ?? []),
  }));
  if (perRange.some((p) => !p.total)) return null;

  const overall = new Map();
  for (const p of perRange) {
    p.counts.forEach((count, genre) => {
      overall.set(genre, (overall.get(genre) ?? 0) + count / p.total);
    });
  }
  const leaders = [...overall.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, GENRE_BANDS)
    .map(([genre]) => genre);

  const columns = perRange.map((p) => {
    const bands = leaders.map((genre) => ({
      genre,
      share: (p.counts.get(genre) ?? 0) / p.total,
    }));
    const covered = bands.reduce((sum, b) => sum + b.share, 0);
    return {
      label: p.range.column,
      bands: [...bands, { genre: "other", share: Math.max(0, 1 - covered) }],
    };
  });

  return { columns, genres: [...leaders, "other"], note: genreNote(columns, leaders) };
}

export function buildDrift(top) {
  const long = top.long_term?.artists ?? [];
  const medium = top.medium_term?.artists ?? [];
  const short = top.short_term?.artists ?? [];
  if (!long.length || !short.length) return null;

  const longTop = long.slice(0, TOP);
  const shortTopIds = new Set(short.slice(0, TOP).map((a) => a.id));
  const changed = longTop.filter((a) => !shortTopIds.has(a.id)).length;
  const score = Math.round((changed / longTop.length) * 100);

  return {
    score,
    changed,
    compared: longTop.length,
    note: driftNote(changed, longTop.length, score),
    movers: buildMovers(long, medium, short),
    genreMix: buildGenreMix(top),
  };
}
