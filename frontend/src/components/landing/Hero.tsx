import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
      <div className="grid gap-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <HeroLeft />
        <HeroRight />
      </div>
    </section>
  );
}
