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
  stops: [string, string, string];
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
  stops: [string, string, string],
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
    stops,
    glow,
  };
}

export const productionEffects: ProductionEffect[] = [
  vocalEffect("reverse-delay", "Reverse Delay", "Odbicie wstecz przed frazą", "rewind", ["#67e8f9", "#0ea5e9", "#0369a1"], "#22d3ee"),
  vocalEffect("formant-glide", "Formant Glide", "Płynna zmiana charakteru głosu", "sliders", ["#bef264", "#10b981", "#15803d"], "#84cc16"),
  vocalEffect("call-and-response", "Call & Response", "Odpowiedź na frazę w tle", "messages", ["#fcd34d", "#f97316", "#c2410c"], "#f59e0b"),
  vocalEffect("haunting-vocal", "Haunting Vocal", "Zimny, widmowy ogon", "ghost", ["#99f6e4", "#22d3ee", "#0e7490"], "#2dd4bf"),
  vocalEffect("demon-time", "Demon Time", "Nisko, brudno, ciężko", "flame", ["#fb923c", "#ef4444", "#9a3412"], "#f97316"),
  vocalEffect("reverse-reverb", "Reverse Reverb", "Swell przed wejściem", "flip", ["#f0abfc", "#f43f5e", "#a21caf"], "#e879f9"),
  vocalEffect("reverse-reverb-plus", "Reverse Reverb +", "Swell z dodatkową warstwą", "sparkles", ["#fda4af", "#ec4899", "#be123c"], "#fb7185"),
  vocalEffect("delay-transition", "Delay Transition", "Echo jako most między sekcjami", "swap", ["#7dd3fc", "#3b82f6", "#1d4ed8"], "#38bdf8"),
  vocalEffect("vocal-synth", "Vocal Synth", "Wokal jak syntezator", "piano", ["#c4b5fd", "#6366f1", "#5b21b6"], "#a78bfa"),
  vocalEffect("vocal-rapture", "Vocal Rapture", "Szeroki, emocjonalny stack", "heart", ["#fb7185", "#ef4444", "#be123c"], "#fb7185"),
  vocalEffect("impactful-vocals", "Impactful Vocals", "Uderzenie i ciężar frazy", "zap", ["#fde047", "#f59e0b", "#d97706"], "#facc15"),
  vocalEffect("gap-filler", "Gap Filler", "Wypełnienie ciszy między linijkami", "gap", ["#6ee7b7", "#14b8a6", "#0f766e"], "#34d399"),
  vocalEffect("pretty-vocals", "Pretty Vocals", "Czysty, błyszczący lead", "flower", ["#f9a8d4", "#fb7185", "#db2777"], "#f9a8d4"),
  vocalEffect("pretty-slap", "Pretty Slap", "Krótki, ładny slap delay", "waves", ["#a5f3fc", "#22d3ee", "#0891b2"], "#67e8f9"),
  vocalEffect("stretch-and-stutter", "Stretch & Stutter", "Rozciągnięcie i cięte powtórki", "stretch", ["#d9f99d", "#22c55e", "#15803d"], "#a3e635"),
  vocalEffect("gated-fun", "Gated Fun", "Rytmiczne cięcie bramką", "square", ["#fef08a", "#a3e635", "#65a30d"], "#fde047"),
  vocalEffect("ambient-pad", "Ambient Pad", "Wokal zamieniony w pad", "cloud", ["#a5b4fc", "#2563eb", "#3730a3"], "#818cf8"),
  vocalEffect("distant-voicemail", "Distant Voicemail", "Daleki, lo-fi komunikat", "phone", ["#e7e5e4", "#a8a29e", "#57534e"], "#a8a29e"),
  vocalEffect("trippy-delays", "Trippy Delays", "Wirujące, psychodeliczne echa", "orbit", ["#e879f9", "#9333ea", "#6b21a8"], "#e879f9"),
  vocalEffect("movements", "Movements", "Ruch w panoramie i przestrzeni", "move", ["#a5f3fc", "#14b8a6", "#0f766e"], "#2dd4bf"),
  vocalEffect("buggin-out", "Buggin’ Out", "Glitch i rozjechany timing", "bug", ["#bef264", "#eab308", "#ca8a04"], "#bef264"),
  vocalEffect("transition-riser", "Transition Riser", "Wznoszenie przed dropem", "riser", ["#fdba74", "#f59e0b", "#ea580c"], "#fb923c"),
  vocalEffect("melody-tails", "Melody Tails", "Melodyjne ogony po frazie", "music", ["#93c5fd", "#6366f1", "#1d4ed8"], "#60a5fa"),
  vocalEffect("gated-effects", "Gated Effects", "Efekty cięte do rytmu", "scan", ["#bbf7d0", "#16a34a", "#15803d"], "#4ade80"),
  vocalEffect("shifted-slap", "Shifted Slap", "Slap z przesuniętym pitch", "shuffle", ["#fde68a", "#fb923c", "#d97706"], "#fbbf24"),
  vocalEffect("distorted-adlibs", "Distorted Adlibs", "Brudne adliby z tyłu", "distortion", ["#f87171", "#ea580c", "#b91c1c"], "#f87171"),
  vocalEffect("dark-reverb", "Dark Reverb", "Ciemna, głęboka przestrzeń", "moon", ["#cbd5e1", "#818cf8", "#4338ca"], "#94a3b8"),
  vocalEffect("dark-ambience", "Dark Ambience", "Mroczny ambient pod wokal", "ambience", ["#e4e4e7", "#94a3b8", "#475569"], "#cbd5e1"),
  vocalEffect("flanger-delays", "Flanger Delays", "Delay z ruchem flangera", "disc", ["#67e8f9", "#8b5cf6", "#6d28d9"], "#22d3ee"),
  vocalEffect("megaphone", "Megaphone", "Wąskie, krzyczące pasmo", "megaphone", ["#fde047", "#f97316", "#c2410c"], "#facc15"),
  vocalEffect("build-up", "Build Up", "Narastanie przed sekcją", "mountain", ["#7dd3fc", "#2563eb", "#1e40af"], "#38bdf8"),
  vocalEffect("throw", "Throw", "Rzut frazy w delay", "send", ["#bef264", "#14b8a6", "#0f766e"], "#4ade80"),
  vocalEffect("vocal-samples", "Vocal Samples", "Sample wokalne jako tekstura", "library", ["#fcd34d", "#eab308", "#a16207"], "#fbbf24"),
  vocalEffect("distorted-room", "Distorted Room", "Zniekształcony room / przestrzeń", "door", ["#fb7185", "#ef4444", "#9f1239"], "#fb7185"),
  vocalEffect("sidechain-stutter", "Sidechain Stutter", "Pump i cięty stutter", "stutter", ["#f0abfc", "#db2777", "#a21caf"], "#e879f9"),
];

export function effectsByCategory(category: EffectCategory) {
  return productionEffects.filter((effect) => effect.category === category);
}
