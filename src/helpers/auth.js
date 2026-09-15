const CLIENT_ID = "287c949757504329b8508ecd7671196c";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

// Precisa bater exatamente com o que está cadastrado no Spotify Developer Dashboard
export const REDIRECT_URI =
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
  "https://statssfy.netlify.app/stats/";

const SCOPES = [
  "user-top-read",
  "user-read-recently-played",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-email",
].join(" ");

const VERIFIER_KEY = "code_verifier";
const STATE_KEY = "auth_state";
const TOKEN_KEY = "token";
const REFRESH_KEY = "refresh_token";
const EXPIRES_KEY = "token_expires_at";

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomString(length = 64) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

async function createCodeChallenge(verifier) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  return base64UrlEncode(digest);
}

export function clearSession() {
  [TOKEN_KEY, REFRESH_KEY, EXPIRES_KEY, VERIFIER_KEY, STATE_KEY].forEach((k) =>
    window.localStorage.removeItem(k)
  );
}

function saveTokens(data) {
  window.localStorage.setItem(TOKEN_KEY, data.access_token);
  window.localStorage.setItem(
    EXPIRES_KEY,
    String(Date.now() + data.expires_in * 1000)
  );
  if (data.refresh_token) {
    window.localStorage.setItem(REFRESH_KEY, data.refresh_token);
  }
}

// Passo 1: manda o usuário pro Spotify com response_type=code + PKCE
export async function redirectToSpotifyLogin() {
  const verifier = randomString();
  const state = randomString(16);
  const challenge = await createCodeChallenge(verifier);

  clearSession();
  window.localStorage.setItem(VERIFIER_KEY, verifier);
  window.localStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.assign(`${AUTH_ENDPOINT}?${params.toString()}`);
}

async function postToken(body) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || "token request failed");
  }
  return data;
}

// Passo 2: troca o ?code= da URL por um access_token
async function exchangeCodeForToken(code) {
  const verifier = window.localStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error("code_verifier ausente");

  const data = await postToken({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });

  window.localStorage.removeItem(VERIFIER_KEY);
  window.localStorage.removeItem(STATE_KEY);
  saveTokens(data);
  return data.access_token;
}

// Passo 3: o access_token dura 1h, então renovamos com o refresh_token
async function refreshAccessToken() {
  const refresh = window.localStorage.getItem(REFRESH_KEY);
  if (!refresh) return null;

  try {
    const data = await postToken({
      grant_type: "refresh_token",
      refresh_token: refresh,
      client_id: CLIENT_ID,
    });
    saveTokens(data);
    return data.access_token;
  } catch (error) {
    clearSession();
    return null;
  }
}

// O code do OAuth e de uso unico. Com reactStrictMode o useEffect roda duas
// vezes em dev e dispararia duas trocas: a segunda falharia. Compartilhamos
// a mesma promise entre chamadas concorrentes.
let pendingExchange = null;

/**
 * Devolve um access_token válido, ou null se o usuário precisa logar de novo.
 * Substitui o antigo handleToken() que lia o #access_token da hash.
 */
export async function handleToken() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const returnedState = url.searchParams.get("state");

  if (error) {
    clearSession();
    return null;
  }

  if (code) {
    const expectedState = window.localStorage.getItem(STATE_KEY);
    if (expectedState && returnedState !== expectedState) {
      clearSession();
      return null;
    }

    if (!pendingExchange) pendingExchange = exchangeCodeForToken(code);

    let token;
    try {
      token = await pendingExchange;
    } catch (err) {
      console.error("falha ao trocar o code por token:", err.message);
      pendingExchange = null;
      clearSession();
      return null;
    }

    // limpa o ?code=... da barra de endereços
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    return token;
  }

  const stored = window.localStorage.getItem(TOKEN_KEY);
  const expiresAt = Number(window.localStorage.getItem(EXPIRES_KEY) || 0);

  if (stored && Date.now() < expiresAt - 60_000) return stored;

  return refreshAccessToken();
}
