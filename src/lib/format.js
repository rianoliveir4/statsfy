export const pad2 = (n) => String(n).padStart(2, "0");

export function formatDuration(ms) {
  const seconds = Math.round((ms || 0) / 1000);
  return `${Math.floor(seconds / 60)}:${pad2(seconds % 60)}`;
}

export const formatNumber = (n) => new Intl.NumberFormat("en-US").format(n);
