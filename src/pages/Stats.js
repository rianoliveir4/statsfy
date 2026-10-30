import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  handleToken,
  clearSession,
  getRecentlyPlayed,
  getUserPlaylists,
  getTopItems,
} from "@/helpers/api";
import { LoadingScreen } from "@/components/LoadingScreen";
import { EmptyState } from "@/components/EmptyState";
import { StatsHeader } from "@/components/stats/StatsHeader";
import { ReportHero } from "@/components/stats/ReportHero";
import { TopArtists } from "@/components/stats/TopArtists";
import { TopTracks } from "@/components/stats/TopTracks";
import { Playlists } from "@/components/stats/Playlists";
import { DEFAULT_RANGE, RANGES, getRange } from "@/lib/ranges";
import { countGenres, minutesListened, topArtistNote } from "@/lib/stats";
import { formatNumber } from "@/lib/format";

const asList = (value) => (Array.isArray(value) ? value : []);
const isUnauthorized = (value) => Boolean(value?.message?.includes("401"));

async function fetchTopByRange(token) {
  const entries = await Promise.all(
    RANGES.map(async ({ id }) => {
      const [artists, tracks] = await Promise.all([
        getTopItems(token, id, "artists", 50),
        getTopItems(token, id, "tracks"),
      ]);
      return [id, { artists, tracks }];
    })
  );
  return Object.fromEntries(entries);
}

const Stats = () => {
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState("reading your top artists");

  const router = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const token = await handleToken();
        if (!token) {
          clearSession();
          return router.push("/");
        }

        const rawTop = await fetchTopByRange(token);
        if (Object.values(rawTop).some((r) => isUnauthorized(r.artists))) {
          clearSession();
          return router.push("/");
        }
        const top = Object.fromEntries(
          Object.entries(rawTop).map(([id, r]) => [
            id,
            { artists: asList(r.artists), tracks: asList(r.tracks) },
          ])
        );

        setLoadingStep("reading your recent plays");
        const recent = asList(await getRecentlyPlayed(token));

        setLoadingStep("reading your playlists");
        const playlistsPage = await getUserPlaylists(token);
        const playlists = asList(playlistsPage?.items);

        setData({
          top,
          recent,
          playlists,
          playlistTotal: playlistsPage?.total ?? playlists.length,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  if (loading) {
    return <LoadingScreen step={loadingStep} />;
  }

  if (!data) {
    return (
      <main className="mx-auto flex min-h-screen max-w-page items-center px-7">
        <EmptyState>
          We couldn't load your stats. <a href="/">Connect Spotify again</a>.
        </EmptyState>
      </main>
    );
  }

  const current = data.top[range];
  const genres = countGenres(current.artists);
  const heroStats = [
    { value: formatNumber(minutesListened(data.recent)), label: "MIN · LAST 50 PLAYS" },
    { value: genres ? formatNumber(genres) : "—", label: "GENRES IN TOP 50" },
    { value: formatNumber(data.playlistTotal), label: "PLAYLISTS" },
  ];

  return (
    <div className="min-h-screen bg-ink">
      <StatsHeader range={range} onRangeChange={setRange} />
      <main className="mx-auto max-w-page px-[18px] pb-[120px] md:px-7">
        <ReportHero caption={getRange(range).caption} stats={heroStats} />
        <TopArtists artists={current.artists} note={topArtistNote(data.top, range)} />
        <TopTracks tracks={current.tracks} />
        <Playlists items={data.playlists} total={data.playlistTotal} />
      </main>
    </div>
  );
};

export default Stats;
