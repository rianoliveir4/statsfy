import { Section } from "@/components/Section";
import { Cover } from "@/components/Cover";
import { EmptyState } from "@/components/EmptyState";
import { formatDuration, pad2 } from "@/lib/format";

export function TopTracks({ tracks }) {
  return (
    <Section id="tracks" title="Top" accent="Tracks">
      {tracks.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
          {tracks.map((track, i) => (
            <a
              key={track.id}
              href={track.external_urls?.spotify}
              target="_blank"
              rel="noreferrer"
              className="card flex flex-col gap-3 rounded-2xl p-[14px] text-white transition duration-200 hover:-translate-y-1 hover:border-purple/55 hover:text-white"
            >
              <Cover
                src={track.album?.images?.[0]?.url}
                alt={track.album?.name ?? ""}
                label="album cover"
                className="rounded-[11px]"
              >
                <span className="label-mono absolute left-[9px] top-[9px] rounded-[7px] bg-purple px-[7px] py-[3px] text-white">
                  {pad2(i + 1)}
                </span>
              </Cover>
              <div className="min-w-0">
                <div className="truncate text-base font-semibold">{track.name}</div>
                <div className="label-mono mt-1 truncate text-white/40">
                  {track.artists?.map((a) => a.name).join(", ")} · {formatDuration(track.duration_ms)}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState>Not enough listening in this range yet.</EmptyState>
      )}
    </Section>
  );
}
