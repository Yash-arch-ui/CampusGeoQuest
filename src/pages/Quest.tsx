import { Link } from "react-router-dom";
import { ArrowLeft, QrCode } from "lucide-react";

export default function Quest() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080A] px-6">
      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-40" />
      <div className="noise-overlay" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/[0.03]">
          <QrCode size={22} className="text-white/80" />
        </div>
        <p className="tabular mt-8 text-[10px] uppercase tracking-[0.3em] text-text-secondary">
          Station 01 · Scanner
        </p>
        <h1 className="mt-4 font-serif text-4xl tracking-tight">The trail begins here.</h1>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          The QR scanner will live on this page. Point your camera at Station 1 to unlock the first
          question.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white/70 transition-all hover:border-white/30 hover:text-white"
        >
          <ArrowLeft size={13} />
          Back to the start
        </Link>
      </div>
    </main>
  );
}
