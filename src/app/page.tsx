import Hero from "@/components/Hero";
import Principles from "@/components/Principles";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Principles />
      <Footer />
    </main>
  );
}
