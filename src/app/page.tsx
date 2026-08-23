import { HomeHero } from "@/components/HomeHero";
import { HomeArtistsPreview } from "@/components/home/HomeArtistsPreview";
import {
  HomeCta,
  HomeExplore,
  HomeLocation,
} from "@/components/home/HomeSections";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeServices } from "@/components/home/HomeServices";

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeArtistsPreview />
      <HomeProcess />
      <HomeLocation />
      <HomeExplore />
      <HomeCta />
    </>
  );
}
