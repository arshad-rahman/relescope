import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Logo />

        <div className="text-sm text-slate-400">
          Version 1.0
        </div>
      </div>
    </header>
  );
}
