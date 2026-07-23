import BootIntro from "@/components/BootIntro";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <BootIntro />
      <Hero />
      <Work />
      <About />
      <Contact />
    </main>
  );
}
