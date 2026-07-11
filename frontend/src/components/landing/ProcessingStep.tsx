import { CheckCircle2, LoaderCircle } from "lucide-react";

interface Props {
  title: string;
  status: string;
}

export default function ProcessingStep({
  title,
  status,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      {status === "done" ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      ) : (
        <LoaderCircle className="h-5 w-5 animate-spin text-cyan-400" />
      )}

      <span className="text-sm text-slate-300">
        {title}
      </span>

    </div>
  );
}
