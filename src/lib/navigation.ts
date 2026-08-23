import { studioLocation } from "@/lib/location";

export const siteConfig = {
  name: "1take.records",
  tagline: "Studio nagraniowe",
  url: "https://www.1take.pl",
  vercelUrl: "https://1take-records-site.vercel.app",
  description:
    "1take.records — studio nagraniowe we Wrocławiu. Nagrania, miks, mastering i produkcja.",
  email: "contact@1take.pl",
  phone: "+48 690 754 013",
  phoneTel: "+48690754013",
  whatsapp: "https://wa.me/48690754013",
  telegram: "https://t.me/+48690754013",
  social: {
    instagram: "https://instagram.com/1take.pl",
    facebook: "https://facebook.com/1take.pl",
    linkedin: "https://linkedin.com/company/1take.pl",
  },
  address: studioLocation.fullAddress,
} as const;
