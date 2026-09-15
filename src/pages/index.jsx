import Logo from "../images/spotify.png";
import Image from "next/image";
import { redirectToSpotifyLogin } from "@/helpers/auth";

export default function Home() {
  const handleClick = async (e) => {
    e.preventDefault();
    await redirectToSpotifyLogin();
  };
  return (
    <>
      <div className="bg-[url(../images/gifBg.gif)] bg-cover bg-center bg w-screen h-screen flex items-center justify-center bg-blend-saturation ">
        <div className="container text-4xl flex items-center justify-between px-56 w-full h-full backdrop-blur-[3px]">
          <div className="mx-5">
            <h1 className="">
              See stats about your songs, artists, playlists and more!
            </h1>

            <a className="text-xl" onClick={handleClick}>
              <button className="rounded-xl bg-black p-3 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-100 duration-200 mt-6">
                Try now!
              </button>
            </a>
          </div>
          <div className="">
            <Image
              className="drop-shadow-md animate-wiggle animate-infinite animate-ease-in "
              src={Logo}
              width={400}
              height={300}
              alt="Picture of the author"
            />
          </div>
        </div>
      </div>
    </>
  );
}
