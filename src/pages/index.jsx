import { redirectToSpotifyLogin } from "@/helpers/auth";
import { Logo } from "@/components/Logo";

const ORBIT_ARTISTS = [
  "Kendrick Lamar",
  "Tame Impala",
  "Caetano Veloso",
  "Frank Ocean",
  "Radiohead",
  "Rosalía",
  "Daft Punk",
  "SZA",
  "Arctic Monkeys",
  "Bad Bunny",
  "Billie Eilish",
  "Gal Costa",
  "Tyler, The Creator",
  "Björk",
];

const ORBIT_WORDS = [
  "top artists",
  "top tracks",
  "listening clock",
  "taste drift",
  "playlists",
  "4 weeks",
  "6 months",
  "12 months",
  "peak hour",
  "drift score",
];

const outerRing = ORBIT_ARTISTS.map((text, i) => ({
  text,
  deg: i * 26,
  r: i % 2 ? 330 : 430,
  size: i % 3 === 0 ? 40 : 26,
  color: i % 4 === 0 ? "rgba(93,63,211,.9)" : "rgba(255,255,255,.13)",
}));

const innerRing = ORBIT_WORDS.map((text, i) => ({
  text,
  deg: i * 36 + 12,
  r: i % 2 ? 230 : 290,
}));

export default function Home() {
  const handleClick = async (e) => {
    e.preventDefault();
    await redirectToSpotifyLogin();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex scale-[.55] items-center justify-center md:scale-100"
      >
        <div className="absolute h-[1200px] w-[1200px] animate-orbit">
          {outerRing.map((o) => (
            <span
              key={o.text}
              className="absolute left-1/2 top-1/2 origin-top-left whitespace-nowrap font-extrabold tracking-[-.02em]"
              style={{
                transform: `rotate(${o.deg}deg) translateX(${o.r}px)`,
                fontSize: o.size,
                color: o.color,
              }}
            >
              {o.text}
            </span>
          ))}
        </div>
        <div className="absolute h-[760px] w-[760px] animate-orbit-reverse">
          {innerRing.map((o) => (
            <span
              key={o.text}
              className="absolute left-1/2 top-1/2 origin-top-left whitespace-nowrap font-mono text-[13px] font-medium text-purple-light/50"
              style={{ transform: `rotate(${o.deg}deg) translateX(${o.r}px)` }}
            >
              {o.text}
            </span>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="absolute h-[360px] w-[360px] rounded-full md:h-[560px] md:w-[560px]"
        style={{
          background:
            "radial-gradient(circle, rgba(9,10,12,.96) 48%, rgba(9,10,12,0) 72%)",
        }}
      />

      <Logo className="absolute left-[22px] top-6 text-[17px] md:left-10 md:top-[26px] md:text-[19px]" />

      <div className="relative px-7 text-center md:p-10">
        <div className="label-mono mb-3 text-[10px] text-purple-light md:mb-[18px] md:text-xs">
          ARTISTS · TRACKS · HOURS · DRIFT
        </div>
        <h1 className="m-0 text-[38px] font-extrabold leading-[.94] tracking-[-.035em] md:text-[clamp(44px,6.4vw,90px)]">
          Everything you
          <br className="hidden md:block" /> played,{" "}
          <span className="text-purple">in orbit</span>.
        </h1>
        <p className="mx-auto mt-[14px] max-w-[260px] text-[15px] leading-normal text-white/80 md:mt-[22px] md:max-w-[420px] md:text-[17px] md:text-white/60">
          One page. Your artists, your hours, your drift.
        </p>
        <button
          type="button"
          onClick={handleClick}
          className="mt-8 w-full max-w-[340px] cursor-pointer rounded-full border border-white/[.16] bg-white px-8 py-4 text-base font-semibold text-ink transition-transform duration-200 hover:-translate-y-[3px] md:w-auto md:text-[17px]"
        >
          Connect Spotify
        </button>
      </div>
    </main>
  );
}
