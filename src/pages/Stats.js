import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  handleToken,
  clearSession,
  getRecentlyPlayed,
  getUserPlaylists,
  getTopItems,
} from "@/helpers/api";
import { Progress } from "@/components/ui/progress";
import { LoadingScreen } from "@/components/LoadingScreen";

import { useRouter } from "next/router";
import { getTrackAnalysis } from "@/helpers/handlers";
const Stats = () => {
  const [token, setToken] = useState("");
  const [topArtists, setTopArtists] = useState();
  const [topTracks, setTopTracks] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState();
  const [audioFeatures, setAudioFeatures] = useState();
  const [analyzedTracks, setAnalyzedTracks] = useState();
  const [playlists, setPlaylists] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState("reading your top artists");

  const router = useRouter();

  useEffect(() => {
    AOS.init();
    async function getData() {
      try {
        setLoading(true);
        const tokenData = await handleToken();
        if (!tokenData) {
          clearSession();
          return router.push("/");
        }
        setToken(tokenData);
        const topArtistsData = await getTopItems(
          tokenData,
          "long_term",
          "artists"
        );
        if (topArtistsData?.message?.includes("401")) {
          clearSession();
          return router.push("/");
        }
        setTopArtists(topArtistsData);
        setLoadingStep("reading your top tracks");
        const topTrackData = await getTopItems(
          tokenData,
          "long_term",
          "tracks"
        );
        setTopTracks(topTrackData);
        setLoadingStep("reading your recent plays");
        const recentlyPlayedData = await getRecentlyPlayed(tokenData);
        setRecentlyPlayed(recentlyPlayedData);
        const recentlyPlayedArray = recentlyPlayedData.map((e) => e.track.id);
        setAnalyzedTracks(
          await getTrackAnalysis(tokenData, recentlyPlayedArray)
        );
        setLoadingStep("reading your playlists");
        const userPlaylistsData = await getUserPlaylists(tokenData);
        setPlaylists(userPlaylistsData);
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
  return (
    <div className="scroll-smooth bg-[#090a0c]">
      <h1 className="text-7xl font-extrabold text-center my-20">
        Stats
        <span className="text-purple ">Fy</span>
      </h1>
      <div className="mb-40 flex items-center justify-center text-sm flex-col animate-fade-up">
        <h1 className="text-4xl font-extrabold mb-4">
          Top <span className="text-purple">Artists</span>
        </h1>
        <select
          id="time_range"
          className="bg-[#14171c] text-gray-200 text-sm rounded-lg p-3"
          onChange={async (e) => {
            const updatedData = await getTopItems(
              token,
              e.target.value,
              "artists"
            );
            setTopArtists(updatedData);
          }}
        >
          <option defaultValue value="long_term">
            Long Term
          </option>
          <option value="medium_term">Medium Term</option>
          <option value="short_term">Short Term</option>
        </select>
        <div className="container max-w-6xl ">
          <div className="flex justify-center md:justify-between mx-auto flex-wrap ">
            <div className="flex flex-col justify-center mt-4">
              {topArtists !== undefined &&
                topArtists.map((i, index) => (
                  <div key={i.id} className="flex items-center mx-4 my-1">
                    <span className="text-xl font-bold mr-2 text-purple">
                      {index + 1}
                    </span>
                    <p className="text-2xl font-semibold hover:underline decoration-purple cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-100 duration-200">
                      {i.name}
                    </p>
                  </div>
                ))}
            </div>
            <div>
              {topArtists !== undefined && (
                <div>
                  <img
                    src={topArtists[0].images[0].url}
                    className="rounded-xl w-[28rem]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="mb-40 flex items-center justify-center text-sm flex-col "
        data-aos="fade-up"
      >
        <h1 className="text-4xl font-extrabold mb-4">
          Top <span className="text-purple">Tracks</span>
        </h1>
        <select
          id="time_range"
          className="bg-[#14171c] text-gray-200 text-sm rounded-lg p-3"
          onChange={async (e) => {
            const updatedData = await getTopItems(
              token,
              e.target.value,
              "tracks"
            );
            setTopTracks(updatedData);
          }}
        >
          <option defaultValue value="long_term">
            Long Term
          </option>
          <option value="medium_term">Medium Term</option>
          <option value="short_term">Short Term</option>
        </select>
        <div className="container max-w-6xl ">
          <div className="flex justify-center md:justify-between mx-auto flex-wrap ">
            <div className="flex flex-col justify-center">
              {topTracks !== undefined &&
                topTracks.map((i, index) => (
                  <div key={i.id} className="flex items-center mx-4 my-1">
                    <span className="text-xl font-semibold mr-2 text-purple">
                      {index + 1}
                    </span>
                    <p className="text-2xl font-semibold hover:underline decoration-purple cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-100 duration-200">
                      {i.name}
                    </p>
                  </div>
                ))}
            </div>
            <div>
              {topTracks !== undefined && (
                <div>
                  <img
                    src={topTracks[0].album.images[0].url}
                    className="rounded-xl w-[28rem]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex items-center justify-center text-sm flex-col mb-40 mx-6"
        data-aos="fade-up"
      >
        <h1 className="text-4xl font-extrabold mb-4">
          Songs <span className="text-purple">Analisys</span>
        </h1>
        <div className="container place-items-center grid md:grid-cols-3 sm:grid-cols-2  grid-rows-2 rounded-3xl py-4 bg-[#14171c]">
          {analyzedTracks && (
            <>
              <div className="m-4">
                <h1 className="font-extrabold text-lg">Energy</h1>
                <Progress value={analyzedTracks.energy} />
                <p>Music that feels fast, loud, and noisy.</p>
              </div>
              <div className="m-4">
                <h1 className="font-extrabold text-lg">Relaxed</h1>
                <Progress value={1 - analyzedTracks.energy} />
                <p>Music that is slow and calm.</p>
              </div>
              <div className=" m-4">
                <h1 className="font-extrabold text-lg">Acousticness</h1>
                <Progress value={analyzedTracks.acousticness} />
                <p>Music with no electric instruments.</p>
              </div>
              <div className=" m-4">
                <h1 className="font-extrabold text-lg">Danceability</h1>
                <Progress value={analyzedTracks.danceability} />
                <p>Music that makes you want to move it.</p>
              </div>
              <div className=" m-4">
                <h1 className="font-extrabold text-lg">Instrumentallness</h1>
                <Progress value={analyzedTracks.instrumentalness} />
                <p>Music that contains no vocals.</p>
              </div>
              <div className=" m-4">
                <h1 className="font-extrabold text-lg">Liveness</h1>
                <Progress value={analyzedTracks.liveness} />
                <p>Music that is performed live.</p>
              </div>
              <div className=" m-4">
                <h1 className="font-extrabold text-lg">Speechness</h1>
                <Progress value={analyzedTracks.speechiness} />
                <p>Podcasts, Poetries, Talk Shows & etc</p>
              </div>
              <div className=" m-4">
                <h1 className="font-extrabold text-lg">Positiviness</h1>
                <Progress value={analyzedTracks.valence} />
                <p>Music that is happy and cheerful.</p>
              </div>
              <div className=" m-4">
                <h1 className="font-extrabold text-lg">Dark</h1>
                <Progress value={1 - analyzedTracks?.valence} />
                <p>Music that is sad, depressing, or angry.</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className="flex items-center justify-center text-sm flex-col mb-40 mx-6"
        data-aos="fade-up"
      >
        <h1 className="text-4xl font-extrabold mb-4">
          Your <span className="text-purple">Playlists</span>
        </h1>
        <div className="container place-items-center grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 rounded-3xl py-4 bg-[#14171c]">
          {playlists &&
            playlists.items.map((item) => (
              <div key={item.id}>
                <img
                  src={item.images[0].url}
                  className="rounded-xl w-[24rem] h-[18rem]"
                />
                <p className="text-center text-xl font-bold">{item.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
