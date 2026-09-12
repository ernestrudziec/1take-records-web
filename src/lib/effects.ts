export type EffectCategory = "vocals" | "general";

export type ProductionEffect = {
  slug: string;
  name: string;
  description: string;
  category: EffectCategory;
  previewSrc: string;
  tutorialSrc: string;
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
    description: "Efekty i pomysły na wokale — preview i tutorial przy każdym kafelku.",
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
): ProductionEffect {
  return {
    slug,
    name,
    description,
    category: "vocals",
    previewSrc: `/tools/effects/vocals/${slug}/preview.mp3`,
    tutorialSrc: `/tools/effects/vocals/${slug}/tutorial.mp4`,
  };
}

export const productionEffects: ProductionEffect[] = [
  vocalEffect("telephone", "Telephone", "Wąskie pasmo, lo-fi wokal"),
  vocalEffect("reverse-reverb", "Reverse reverb", "Swell przed frazą"),
  vocalEffect("slap-delay", "Slap delay", "Krótkie, rytmiczne echo"),
  vocalEffect("harmony-stack", "Harmony stack", "Warstwy tercji i kwint"),
  vocalEffect("formant-shift", "Formant shift", "Inny charakter głosu"),
  vocalEffect("whisper-double", "Whisper double", "Szept pod leadem"),
  vocalEffect("vocal-chop", "Vocal chop", "Cięte, rytmiczne frazy"),
  vocalEffect("octave-down", "Octave down", "Oktawa w dół pod wokal"),
];

export function effectsByCategory(category: EffectCategory) {
  return productionEffects.filter((effect) => effect.category === category);
}
