import AboutCTA from "../../Component/about/AboutCTA";
import AboutHero from "../../Component/about/AboutHero";
import Accreditations from "../../Component/about/Accerditaion";
import BreadcrumbBar from "../../Component/about/BreadcumBar";
import MissionSection from "../../Component/about/MissionSection";
import Pillars from "../../Component/about/Pillars";
import StatsStrip from "../../Component/about/StatsStrip";
import Team from "../../Component/about/Team";
import TribalAccord from "../../Component/about/TribalAccord";
import Footer from "../../Component/home/Footer";

export default function About() {
  return (
    <main>
      <BreadcrumbBar/>
      <AboutHero />
      <StatsStrip/>
      <MissionSection/>
      <Pillars/>
      <TribalAccord/>
      <Team/>
      <Accreditations/>
      <AboutCTA/>
      <Footer/>

    </main>
  );
}