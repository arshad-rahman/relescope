export default function Navbar() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-white">
          ReleasePilot
        </h1>

        <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How it Works
          </a>
          <a href="#footer" className="transition hover:text-white">
            Footer
          </a>
        </nav>
      </div>

      <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-white backdrop-blur-xl transition hover:bg-white/10">
        Connect GitHub
      </button>
    </header>
  );
}
