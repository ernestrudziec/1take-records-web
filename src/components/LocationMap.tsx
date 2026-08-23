import { studioLocation } from "@/lib/location";

type LocationMapProps = {
  className?: string;
  height?: string;
};

export function LocationMap({
  className = "",
  height = "h-80 md:h-96",
}: LocationMapProps) {
  const { lat, lng } = studioLocation.coordinates;
  const delta = 0.004;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div
      className={`relative overflow-hidden border border-white/10 bg-zinc-950 ${height} ${className}`}
    >
      <iframe
        title="Mapa — 1take.records, Tęczowa 23 we Wrocławiu"
        src={embedSrc}
        className="h-full w-full border-0 opacity-90 [filter:grayscale(100%)_invert(92%)_contrast(90%)_hue-rotate(180deg)]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
    </div>
  );
}

export function LocationDetails() {
  return (
    <div className="text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        Nasza lokalizacja
      </p>
      <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">
        {studioLocation.fullAddress}
      </h3>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
        Tu mieści się 1take.records — studio nagraniowe we Wrocławiu. Nagrania,
        miks, mastering i produkcja w jednym miejscu, kilka minut od centrum
        miasta.
      </p>
      <a
        href={studioLocation.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/50"
      >
        Wyznacz trasę
      </a>
    </div>
  );
}
