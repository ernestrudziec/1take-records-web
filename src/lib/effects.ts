export type EffectCategory = "vocals" | "general";

export type EffectIcon =
  | "rewind"
  | "sliders"
  | "messages"
  | "ghost"
  | "flame"
  | "flip"
  | "sparkles"
  | "swap"
  | "piano"
  | "heart"
  | "zap"
  | "gap"
  | "flower"
  | "waves"
  | "stretch"
  | "square"
  | "cloud"
  | "phone"
  | "orbit"
  | "move"
  | "bug"
  | "riser"
  | "music"
  | "scan"
  | "shuffle"
  | "distortion"
  | "moon"
  | "ambience"
  | "disc"
  | "megaphone"
  | "mountain"
  | "send"
  | "library"
  | "door"
  | "stutter";

export type ProductionEffect = {
  slug: string;
  name: string;
  description: string;
  category: EffectCategory;
  previewSrc: string;
  tutorialSrc: string;
  icon: EffectIcon;
  gradient: string;
  glow: string;
};

export const effectCategories: {
  id: EffectCategory;
  title: string;
  description: string;
  available: boolean;
}[] = [
  {
    id: "vocals",
    title: "Vocals",
    description: "35 efektów i pomysłów na wokale — preview i tutorial przy każdym kafelku.",
    available: true,
  },
  {
    id: "general",
    title: "General",
    description: "Efekty na bity, instrumenty i pełny mix. Wkrótce.",
    available: false,
  },
];

/** Media: public/tools/effects/{category}/{slug}/preview.mp3 + tutorial.mp4 */
function vocalEffect(
  slug: string,
  name: string,
  description: string,
  icon: EffectIcon,
  gradient: string,
  glow: string,
): ProductionEffect {
  return {
    slug,
    name,
    description,
    category: "vocals",
    previewSrc: `/tools/effects/vocals/${slug}/preview.mp3`,
    tutorialSrc: `/tools/effects/vocals/${slug}/tutorial.mp4`,
    icon,
    gradient,
    glow,
  };
}

export const productionEffects: ProductionEffect[] = [
  vocalEffect(
    "reverse-delay",
    "Reverse Delay",
    "Odbicie wstecz przed frazą",
    "rewind",
    "from-cyan-300 via-sky-500 to-slate-950",
    "#22d3ee",
  ),
  vocalEffect(
    "formant-glide",
    "Formant Glide",
    "Płynna zmiana charakteru głosu",
    "sliders",
    "from-lime-300 via-emerald-500 to-zinc-950",
    "#84cc16",
  ),
  vocalEffect(
    "call-and-response",
    "Call & Response",
    "Odpowiedź na frazę w tle",
    "messages",
    "from-amber-300 via-orange-500 to-stone-950",
    "#f59e0b",
  ),
  vocalEffect(
    "haunting-vocal",
    "Haunting Vocal",
    "Zimny, widmowy ogon",
    "ghost",
    "from-teal-200 via-cyan-600 to-slate-950",
    "#2dd4bf",
  ),
  vocalEffect(
    "demon-time",
    "Demon Time",
    "Nisko, brudno, ciężko",
    "flame",
    "from-orange-400 via-red-600 to-zinc-950",
    "#f97316",
  ),
  vocalEffect(
    "reverse-reverb",
    "Reverse Reverb",
    "Swell przed wejściem",
    "flip",
    "from-fuchsia-300 via-rose-500 to-zinc-950",
    "#e879f9",
  ),
  vocalEffect(
    "reverse-reverb-plus",
    "Reverse Reverb +",
    "Swell z dodatkową warstwą",
    "sparkles",
    "from-rose-300 via-pink-500 to-zinc-950",
    "#fb7185",
  ),
  vocalEffect(
    "delay-transition",
    "Delay Transition",
    "Echo jako most między sekcjami",
    "swap",
    "from-sky-300 via-blue-500 to-slate-950",
    "#38bdf8",
  ),
  vocalEffect(
    "vocal-synth",
    "Vocal Synth",
    "Wokal jak syntezator",
    "piano",
    "from-violet-300 via-indigo-500 to-zinc-950",
    "#a78bfa",
  ),
  vocalEffect(
    "vocal-rapture",
    "Vocal Rapture",
    "Szeroki, emocjonalny stack",
    "heart",
    "from-rose-400 via-red-500 to-zinc-950",
    "#fb7185",
  ),
  vocalEffect(
    "impactful-vocals",
    "Impactful Vocals",
    "Uderzenie i ciężar frazy",
    "zap",
    "from-yellow-300 via-amber-500 to-zinc-950",
    "#facc15",
  ),
  vocalEffect(
    "gap-filler",
    "Gap Filler",
    "Wypełnienie ciszy między linijkami",
    "gap",
    "from-emerald-300 via-teal-500 to-zinc-950",
    "#34d399",
  ),
  vocalEffect(
    "pretty-vocals",
    "Pretty Vocals",
    "Czysty, błyszczący lead",
    "flower",
    "from-pink-300 via-rose-400 to-zinc-950",
    "#f9a8d4",
  ),
  vocalEffect(
    "pretty-slap",
    "Pretty Slap",
    "Krótki, ładny slap delay",
    "waves",
    "from-sky-200 via-cyan-400 to-slate-950",
    "#67e8f9",
  ),
  vocalEffect(
    "stretch-and-stutter",
    "Stretch & Stutter",
    "Rozciągnięcie i cięte powtórki",
    "stretch",
    "from-lime-200 via-green-500 to-zinc-950",
    "#a3e635",
  ),
  vocalEffect(
    "gated-fun",
    "Gated Fun",
    "Rytmiczne cięcie bramką",
    "square",
    "from-yellow-200 via-lime-400 to-zinc-950",
    "#fde047",
  ),
  vocalEffect(
    "ambient-pad",
    "Ambient Pad",
    "Wokal zamieniony w pad",
    "cloud",
    "from-indigo-300 via-blue-600 to-slate-950",
    "#818cf8",
  ),
  vocalEffect(
    "distant-voicemail",
    "Distant Voicemail",
    "Daleki, lo-fi komunikat",
    "phone",
    "from-stone-300 via-neutral-500 to-zinc-950",
    "#a8a29e",
  ),
  vocalEffect(
    "trippy-delays",
    "Trippy Delays",
    "Wirujące, psychodeliczne echa",
    "orbit",
    "from-fuchsia-400 via-purple-600 to-zinc-950",
    "#e879f9",
  ),
  vocalEffect(
    "movements",
    "Movements",
    "Ruch w panoramie i przestrzeni",
    "move",
    "from-cyan-200 via-teal-500 to-zinc-950",
    "#2dd4bf",
  ),
  vocalEffect(
    "buggin-out",
    "Buggin’ Out",
    "Glitch i rozjechany timing",
    "bug",
    "from-lime-300 via-yellow-500 to-zinc-950",
    "#bef264",
  ),
  vocalEffect(
    "transition-riser",
    "Transition Riser",
    "Wznoszenie przed dropem",
    "riser",
    "from-orange-300 via-amber-500 to-zinc-950",
    "#fb923c",
  ),
  vocalEffect(
    "melody-tails",
    "Melody Tails",
    "Melodyjne ogony po frazie",
    "music",
    "from-blue-300 via-indigo-500 to-zinc-950",
    "#60a5fa",
  ),
  vocalEffect(
    "gated-effects",
    "Gated Effects",
    "Efekty cięte do rytmu",
    "scan",
    "from-emerald-200 via-green-600 to-zinc-950",
    "#4ade80",
  ),
  vocalEffect(
    "shifted-slap",
    "Shifted Slap",
    "Slap z przesuniętym pitch",
    "shuffle",
    "from-amber-200 via-orange-400 to-zinc-950",
    "#fbbf24",
  ),
  vocalEffect(
    "distorted-adlibs",
    "Distorted Adlibs",
    "Brudne adliby z tyłu",
    "distortion",
    "from-red-400 via-orange-600 to-zinc-950",
    "#f87171",
  ),
  vocalEffect(
    "dark-reverb",
    "Dark Reverb",
    "Ciemna, głęboka przestrzeń",
    "moon",
    "from-slate-300 via-indigo-700 to-zinc-950",
    "#94a3b8",
  ),
  vocalEffect(
    "dark-ambience",
    "Dark Ambience",
    "Mroczny ambient pod wokal",
    "ambience",
    "from-zinc-300 via-slate-600 to-zinc-950",
    "#cbd5e1",
  ),
  vocalEffect(
    "flanger-delays",
    "Flanger Delays",
    "Delay z ruchem flangera",
    "disc",
    "from-cyan-300 via-violet-500 to-zinc-950",
    "#22d3ee",
  ),
  vocalEffect(
    "megaphone",
    "Megaphone",
    "Wąskie, krzyczące pasmo",
    "megaphone",
    "from-yellow-300 via-orange-500 to-zinc-950",
    "#facc15",
  ),
  vocalEffect(
    "build-up",
    "Build Up",
    "Narastanie przed sekcją",
    "mountain",
    "from-sky-300 via-blue-600 to-zinc-950",
    "#38bdf8",
  ),
  vocalEffect(
    "throw",
    "Throw",
    "Rzut frazy w delay",
    "send",
    "from-lime-300 via-teal-500 to-zinc-950",
    "#4ade80",
  ),
  vocalEffect(
    "vocal-samples",
    "Vocal Samples",
    "Sample wokalne jako tekstura",
    "library",
    "from-amber-300 via-yellow-600 to-zinc-950",
    "#fbbf24",
  ),
  vocalEffect(
    "distorted-room",
    "Distorted Room",
    "Zniekształcony room / przestrzeń",
    "door",
    "from-rose-400 via-red-700 to-zinc-950",
    "#fb7185",
  ),
  vocalEffect(
    "sidechain-stutter",
    "Sidechain Stutter",
    "Pump i cięty stutter",
    "stutter",
    "from-fuchsia-300 via-pink-600 to-zinc-950",
    "#e879f9",
  ),
];

export function effectsByCategory(category: EffectCategory) {
  return productionEffects.filter((effect) => effect.category === category);
}
