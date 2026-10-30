import { Section } from "@/components/Section";
import { Cover } from "@/components/Cover";
import { EmptyState } from "@/components/EmptyState";
import { formatNumber } from "@/lib/format";

function playlistMeta(playlist) {
  const total = playlist.tracks?.total;
  return [
    typeof total === "number" && `${formatNumber(total)} tracks`,
    playlist.owner?.display_name && `by ${playlist.owner.display_name}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function Playlists({ items, total }) {
  return (
    <Section id="playlists" title="Your" accent="Playlists" aside={`${formatNumber(total)} PLAYLISTS`}>
      {items.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
          {items.map((playlist) => (
            <a
              key={playlist.id}
              href={playlist.external_urls?.spotify}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-[10px] text-white hover:text-white"
            >
              <Cover
                src={playlist.images?.[0]?.url}
                alt={playlist.name}
                label="playlist cover"
                className="border border-line transition-colors duration-200 group-hover:border-purple/60"
              />
              <div className="min-w-0">
                <div className="truncate text-base font-semibold">{playlist.name}</div>
                <div className="label-mono mt-[3px] truncate text-white/40">{playlistMeta(playlist)}</div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState>No playlists on this account yet.</EmptyState>
      )}
    </Section>
  );
}
