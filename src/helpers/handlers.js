import { getAudioFeatures } from "./api";

// Só features que o Spotify devolve normalizadas em 0..1.
// "loudness" ficou de fora: é dB (-60..0) e não cabe numa barra de progresso.
const FEATURES = [
  "energy",
  "acousticness",
  "danceability",
  "instrumentalness",
  "liveness",
  "speechiness",
  "valence",
];

function average(items, key) {
  if (!items.length) return 0;
  const sum = items.reduce((acc, item) => acc + (item[key] ?? 0), 0);
  return sum / items.length;
}

/**
 * Média das características das faixas tocadas recentemente.
 * Retorna null quando o endpoint /audio-features não está disponível
 * (depreciado pelo Spotify em nov/2024 para apps sem extended quota),
 * e aí a seção de análise some da tela em vez de renderizar vazia.
 */
export async function getTrackAnalysis(token, trackIds) {
  const ids = [...new Set(trackIds.filter(Boolean))].slice(0, 100);
  if (!ids.length) return null;

  const features = await getAudioFeatures(token, ids.join(","));
  // a API devolve null nas posições de faixas que ela não conhece
  const valid = (features || []).filter(Boolean);
  if (!valid.length) return null;

  return FEATURES.reduce((analysis, key) => {
    analysis[key] = average(valid, key);
    return analysis;
  }, {});
}
