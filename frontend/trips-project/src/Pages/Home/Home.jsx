
import Departures from "../../Component/home/Depatures";
import Footer from "../../Component/home/Footer";
import Hero from "../../Component/home/Hero";
import OperatorCTA from "../../Component/home/OperatorCTA";
import WhyChoose from "../../Component/home/WhyChoose";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full bg-slate-50">
      <Hero />
      <WhyChoose />
      <Departures />
      <OperatorCTA />
      <Footer />
    </main>
  );
}