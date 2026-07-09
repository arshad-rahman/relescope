import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";

export default function Home() {
  return (
    <>
      <Background />

      <main className="relative min-h-screen">
        <Navbar />
        <Hero />
      </main>
    </>
  );
}
