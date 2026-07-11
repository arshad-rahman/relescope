import { trusted } from "../../data/trusted";

export default function TrustedBy() {
  return (
    <section className="py-16">

      <p className="mb-8 text-center text-sm uppercase tracking-[0.4em] text-slate-500">
        Built For Modern Engineering Teams
      </p>

      <div className="flex flex-wrap items-center justify-center gap-10">

        {trusted.map((item) => (

          <div
            key={item}
            className="text-lg font-semibold text-slate-500 transition hover:text-white"
          >
            {item}
          </div>

        ))}

      </div>

    </section>
  );
}
