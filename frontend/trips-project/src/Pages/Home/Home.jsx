
import Departures from "../../Component/home/Depatures";
import Footer from "../../Component/home/Footer";
import Hero from "../../Component/Home/hero";
import OperatorCTA from "../../Component/home/OperatorCTA";
import WhyChoose from "../../Component/home/WhyChoose";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyChoose />
      <Departures />
      <OperatorCTA />
      <Footer/>
    </main>
  );
}