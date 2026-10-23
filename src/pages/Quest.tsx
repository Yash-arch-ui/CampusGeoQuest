import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, MapPin, QrCode, RotateCcw, Upload, X } from "lucide-react";
import QrScanner from "qr-scanner";
import { START_HINT, STATIONS } from "../data/quest";

type Stage = "scan" | "question" | "correct" | "complete";

const STORAGE_KEY = "campus-geoquest-progress-v1";

function loadIndex(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { currentIndex?: number };
    const value = parsed.currentIndex;
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(Math.floor(value), STATIONS.length));
  } catch {
    return 0;
  }
}

export default function Quest() {
  const [currentIndex, setCurrentIndex] = useState<number>(loadIndex);
  const [stage, setStage] = useState<Stage>(() =>
    loadIndex() >= STATIONS.length ? "complete" : "scan",
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const station = STATIONS[Math.min(currentIndex, STATIONS.length - 1)];
  const scanHint = currentIndex === 0 ? START_HINT : STATIONS[currentIndex - 1].nextHint;
  const isLast = currentIndex === STATIONS.length - 1;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex }));
  }, [currentIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage, currentIndex]);

  const handleFile = async (file: File | null | undefined) => {
    if (!file || currentIndex >= STATIONS.length) return;
    setError(null);
    setBusy(true);
    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
        alsoTryWithoutScanRegion: true,
      });
      const token = result.data.trim();
      if (token === station.qrToken) {
        setStage("question");
      } else {
        const known = STATIONS.find((s) => s.qrToken === token);
        setError(
          known
            ? `That's Station ${known.id}. Find Station ${station.id} first.`
            : "That QR code isn't part of the Campus GeoQuest trail.",
        );
      }
    } catch {
      setError("No readable QR code found. Try a clearer, closer photo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const choose = (index: number) => {
    if (stage !== "question") return;
    setSelected(index);
    if (index === station.correctIndex) {
      setWrong(false);
      setStage("correct");
    } else {
      setWrong(true);
    }
  };

  const advance = () => {
    const next = currentIndex + 1;
    setSelected(null);
    setWrong(false);
    setError(null);
    setCurrentIndex(next);
    setStage(next >= STATIONS.length ? "complete" : "scan");
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentIndex(0);
    setStage("scan");
    setSelected(null);
    setWrong(false);
    setError(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080A] text-white">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-25" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 35%, rgba(0,229,255,0.06), transparent 70%)",
        }}
      />
      <div className="noise-overlay" />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-text-secondary transition-colors hover:text-white"
        >
          <ArrowLeft size={13} />
          Campus GeoQuest
        </Link>
        <span className="tabular text-[10px] uppercase tracking-[0.25em] text-text-secondary">
          {stage === "complete"
            ? "Complete"
            : `Station ${String(currentIndex + 1).padStart(2, "0")} / ${STATIONS.length}`}
        </span>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-3xl flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-lg">
          <div className="mb-6 flex gap-1.5">
            {STATIONS.map((s, i) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  i < currentIndex || stage === "complete"
                    ? "bg-white/80"
                    : i === currentIndex
                      ? "bg-white/30"
                      : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md"
            >
              {stage === "scan" && (
                <>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/[0.03]">
                    <QrCode size={22} className="text-white/80" />
                  </div>
                  <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                    Station {String(station.id).padStart(2, "0")}
                  </p>
                  <h1 className="mt-3 text-center font-serif text-4xl tracking-tight">
                    Scan the code.
                  </h1>
                  <p className="mt-3 text-center text-sm leading-relaxed text-text-secondary">
                    Find the QR at this station and upload a photo of it.
                  </p>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-text-secondary">
                      Your clue
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{scanHint}</p>
                  </div>

                  <div
                    className="mt-6"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      void handleFile(e.dataTransfer.files?.[0]);
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      disabled={busy}
                      className="ease-precision flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.01] px-6 py-10 transition-all hover:border-white/30 hover:bg-white/[0.03] disabled:cursor-wait disabled:opacity-60"
                    >
                      <Upload size={18} className="text-white/70" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                        {busy ? "Reading QR…" : "Upload QR photo"}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                        or drag an image here
                      </span>
                    </button>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => void handleFile(e.target.files?.[0])}
                    />
                  </div>

                  {error && (
                    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[color:var(--danger)]">
                      <X size={13} className="mt-0.5 shrink-0" />
                      {error}
                    </p>
                  )}
                </>
              )}

              {stage === "question" && (
                <>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                    Station {String(station.id).padStart(2, "0")}
                  </p>
                  <h1 className="mt-4 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                    {station.question}
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {station.questionHint}
                  </p>

                  <div className="mt-7 space-y-3">
                    {station.options.map((option, i) => {
                      const isWrong = wrong && selected === i;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => choose(i)}
                          className={`ease-precision flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
                            isWrong
                              ? "border-[color:var(--danger)]/50 bg-[color:var(--danger)]/10 text-white"
                              : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/25 hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="tabular text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {wrong && (
                    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[color:var(--danger)]">
                      <X size={13} className="mt-0.5 shrink-0" />
                      Not quite — read the clue again.
                    </p>
                  )}
                </>
              )}

              {stage === "correct" && (
                <>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[color:var(--safe)]/30 bg-[color:var(--safe)]/10">
                    <Check size={22} className="text-[color:var(--safe)]" />
                  </div>
                  <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                    Station {String(station.id).padStart(2, "0")} · Correct
                  </p>
                  <h1 className="mt-3 text-center font-serif text-4xl tracking-tight">
                    Coordinates unlocked.
                  </h1>
                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-text-secondary">
                      Next coordinates
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{station.nextHint}</p>
                  </div>
                  <button
                    type="button"
                    onClick={advance}
                    className="ease-precision mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                  >
                    {isLast ? "Finish the Trail" : `Continue to Station ${station.id + 1}`}
                    <ArrowRight size={14} />
                  </button>
                </>
              )}

              {stage === "complete" && (
                <>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[color:var(--safe)]/30 bg-[color:var(--safe)]/10">
                    <MapPin size={22} className="text-[color:var(--safe)]" />
                  </div>
                  <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-text-secondary">
                    Trail complete
                  </p>
                  <h1 className="mt-3 text-center font-serif text-4xl tracking-tight">
                    You followed the Earth's clues.
                  </h1>
                  <p className="mt-4 text-center text-sm leading-relaxed text-text-secondary">
                    All ten stations cleared. The ground remembers — and now so do you.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/"
                      className="ease-precision flex flex-1 items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/70 transition-all hover:border-white/30 hover:text-white"
                    >
                      Back to the start
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="ease-precision flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                    >
                      <RotateCcw size={13} />
                      Run it again
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {stage !== "complete" && (
            <p className="mt-6 text-center text-[9px] uppercase tracking-[0.25em] text-text-secondary">
              Progress is saved on this device
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
