import BootIntro from "@/components/BootIntro";
import Hero from "@/components/Hero";
import Section from "@/components/Section";

export default function Home() {
  return (
    <main className="relative z-10">
      <BootIntro />
      <Hero />
      {/* content TBD; shell in place so the page has a second act */}
      <Section
        id="next"
        label="Soon"
        headline={
          <>
            This space is <span className="text-ember">reserved.</span>
          </>
        }
      >
        <p className="max-w-lg text-lg leading-relaxed text-muted md:text-xl">
          Something is being built here. Check back.
        </p>
      </Section>
    </main>
  );
}
