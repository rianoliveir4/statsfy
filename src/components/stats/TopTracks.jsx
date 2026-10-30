import { Section } from "@/components/Section";
import { Cover } from "@/components/Cover";
import { EmptyState } from "@/components/EmptyState";
import { formatDuration, pad2 } from "@/lib/format";

export function TopTracks({ tracks }) {
  return (
    <Section id="tracks" title="Top" accent="Tracks">
      {tracks.length ? (
        <div className="grid gap-2 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:gap-4">
          {tracks.map((track, i) => (
            <a
              key={track.id}
              href={track.external_urls?.spotify}
              target="_blank"
              rel="noreferrer"
              className="card flex items-center gap-3 rounded-tile p-[10px] text-white transition duration-200 hover:border-purple/55 hover:text-white md:flex-col md:items-stretch md:rounded-2xl md:p-[14px] md:hover:-translate-y-1"
            >
              <span className="w-5 shrink-0 font-mono text-[11px] font-medium text-purple md:hidden">
                {pad2(i + 1)}
              </span>
              <Cover
                src={track.album?.images?.[0]?.url}
                alt={track.album?.name ?? ""}
                label="album cover"
                className="w-12 shrink-0 rounded-lg md:w-auto md:rounded-[11px]"
                labelClassName="hidden md:inline"
              >
                <span className="label-mono absolute left-[9px] top-[9px] hidden rounded-[7px] bg-purple px-[7px] py-[3px] text-white md:block">
                  {pad2(i + 1)}
                </span>
              </Cover>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold md:text-base">{track.name}</div>
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
