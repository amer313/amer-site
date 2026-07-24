import BootIntro from "@/components/BootIntro";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative z-10">
      <BootIntro />
      <Hero />
      {/* playground: open canvas below the fold, the field is the content */}
      <section className="pointer-events-none flex h-svh items-end justify-center pb-12">
        <p className="font-mono text-sm tracking-[0.2em] text-dim">
          CLICK AND HOLD. THE FIELD LISTENS.
        </p>
      </section>
    </main>
  );
}
