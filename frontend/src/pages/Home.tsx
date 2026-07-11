import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#020617]">
      <Background />
      <Navbar />
      <Hero />
    </main>
  );
}
