export const siteConfig = {
  name: "1take.records",
  tagline: "Studio nagraniowe",
  description:
    "1take.records — studio nagraniowe, artyści, inżynierowie dźwięku i beatmakerzy w jednym miejscu.",
  email: "kontakt@1take.records",
} as const;

export const navLinks = [
  { href: "/artysci", label: "Nasi artyści" },
  { href: "/inzynierowie", label: "Nasi inżynierowie" },
  { href: "/beatmakerzy", label: "Nasi beatmakerzy" },
  { href: "/studio", label: "Nasze studio" },
  { href: "/o-nas", label: "O nas" },
] as const;
