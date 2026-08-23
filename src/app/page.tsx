import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeStudio } from "@/components/home/HomeStudio";
import { HomeHero } from "@/components/HomeHero";

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeStudio />
      <HomeAbout />
      <HomeContact />
    </>
  );
}
