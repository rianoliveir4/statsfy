import { Section } from "@/components/Section";
import { Cover } from "@/components/Cover";
import { EmptyState } from "@/components/EmptyState";
import { pad2 } from "@/lib/format";

export function TopArtists({ artists, note }) {
  const shown = artists.slice(0, 10);
  const leader = shown[0];

  return (
    <Section id="artists" title="Top" accent="Artists">
      {leader ? (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <div className="card flex flex-col overflow-hidden">
            {shown.map((artist, i) => (
              <a
                key={artist.id}
                href={artist.external_urls?.spotify}
                target="_blank"
                rel="noreferrer"
                className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-[10px] border-b border-white/[.05] px-[14px] py-[11px] text-white transition-colors duration-200 last:border-b-0 hover:bg-purple/[.12] hover:text-white md:grid-cols-[44px_minmax(0,1fr)] md:gap-[14px] md:px-5 md:py-[14px]"
              >
                <span className="font-mono text-[11px] font-medium text-purple md:text-[13px]">
                  {pad2(i + 1)}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold tracking-[-.01em] md:text-xl">
                    {artist.name}
                  </div>
                  {artist.genres?.[0] && (
                    <div className="label-mono mt-[3px] truncate text-white/40">
                      {artist.genres[0]}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
          <div className="card hidden flex-col gap-4 p-5 md:flex">
            <Cover src={leader.images?.[0]?.url} alt={leader.name} label="artist image" />
            <div>
              <div className="label-mono text-white/40">#1 THIS RANGE</div>
              <div className="mt-[6px] text-[26px] font-extrabold tracking-[-.02em]">
                {leader.name}
              </div>
              {note && (
                <p className="m-0 mt-[10px] text-sm leading-normal text-white/55">{note}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState>Not enough listening in this range yet.</EmptyState>
      )}
    </Section>
  );
}
