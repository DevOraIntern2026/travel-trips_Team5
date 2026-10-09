import Footer from "../../Component/home/Footer";
import Faq from "../../Component/how/Faq";
import HowBreadcrumb from "../../Component/how/HowBreadcumb";
import HowCTA from "../../Component/how/HowCTA";
import HowHero from "../../Component/how/HowHero";
import Phases from "../../Component/how/Phases";
import QuoteBanner from "../../Component/how/QuoteBanner";
import TwoPaths from "../../Component/how/TwoPaths";

export default function HowItWorks() {
  return (
    <main>
      <HowBreadcrumb/>
      <HowHero/>
      <Phases/>
      <QuoteBanner/>
      <TwoPaths/>
      <Faq/>
      <HowCTA/>
      <Footer/>
  
    </main>
  );
}