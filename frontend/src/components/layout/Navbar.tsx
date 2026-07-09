export default function Navbar() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

      <h1 className="text-2xl font-bold text-white">
        ReleasePilot
      </h1>

      <button
        className="
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-5
          py-2
          text-white
          backdrop-blur-xl
          transition
          hover:bg-white/10
        "
      >
        Connect GitHub
      </button>

    </header>
  );
}
