export const RANGES = [
  { id: "long_term", short: "1Y", caption: "LAST 12 MONTHS", column: "1 YEAR" },
  { id: "medium_term", short: "6M", caption: "LAST 6 MONTHS", column: "6 MONTHS" },
  { id: "short_term", short: "4W", caption: "LAST 4 WEEKS", column: "4 WEEKS" },
];

export const DEFAULT_RANGE = RANGES[0].id;

export function getRange(id) {
  return RANGES.find((r) => r.id === id) ?? RANGES[0];
}
