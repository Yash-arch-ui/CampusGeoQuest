"use client";
import { motion } from "motion/react";
import { SpotlightCard } from "./spotlight-card";
import CursorGrid from "./CursorGrid";

type Difficulty = "Easy" | "Medium" | "Tough";

interface Module {
  n: string;
  title: string;
  problem: string;
  how: string;
  difficulty: Difficulty;
  span: string;
}

/**
 * Ten stations, ten pieces of the Earth's story. Three easy, three medium,
 * four tough — every card is a real geological term rather than a riddle.
 */
const MODULES: Module[] = [
  {
    n: "01",
    title: "Strata",
    problem: "Time is stacked in layers.",
    how: "Sedimentary layers build up one after another, oldest at the bottom. Grain size, colour, and fossils mark changes in the environment.",
    difficulty: "Easy",
    span: "md:col-span-2",
  },
  {
    n: "02",
    title: "Fossils",
    problem: "Life leaves a signature in stone.",
    how: "Bones, shells, and traces are buried in sediment and slowly replaced or preserved. The same fossil in two layers links them to the same period.",
    difficulty: "Easy",
    span: "",
  },
  {
    n: "03",
    title: "Weathering & Erosion",
    problem: "The landscape is being edited right now.",
    how: "Water, wind, and temperature break rock down and carry the pieces away. Rounded grains, cracked surfaces, and sediment fans record the process.",
    difficulty: "Easy",
    span: "",
  },
  {
    n: "04",
    title: "Folds",
    problem: "Layers that should be flat are bent.",
    how: "Rock folds when the crust is squeezed slowly over millions of years. Read the bend: anticlines arch up, synclines sag down, and the axis points to the pressure.",
    difficulty: "Medium",
    span: "md:col-span-2",
  },
  {
    n: "05",
    title: "Faults",
    problem: "The ground cracked and one side moved.",
    how: "A fault is a fracture where blocks of crust slide past each other. Compare the offset layers across the break to tell a normal, reverse, or strike-slip fault.",
    difficulty: "Medium",
    span: "",
  },
  {
    n: "06",
    title: "Sedimentary Basins",
    problem: "The ground sank and filled with sediment.",
    how: "A basin subsides slowly while eroded material collects in it. The fill thickens toward the centre and records the region's sinking history.",
    difficulty: "Medium",
    span: "",
  },
  {
    n: "07",
    title: "Unconformity",
    problem: "Two rock stories meet with a gap between them.",
    how: "Erosion can remove millions of years of rock before the next layer is deposited. A surface cutting across older tilted layers is the missing chapter.",
    difficulty: "Tough",
    span: "md:col-span-2",
  },
  {
    n: "08",
    title: "Cross-bedding",
    problem: "Tilted lines hide inside flat layers.",
    how: "Moving water or wind piles sediment on a sloping surface. Each new layer cuts across the last, preserving the direction and strength of the ancient current.",
    difficulty: "Tough",
    span: "",
  },
  {
    n: "09",
    title: "Metamorphism",
    problem: "Rock is cooked and squeezed into something new.",
    how: "Heat and pressure rearrange minerals in the solid state. Foliation, recrystallisation, and index minerals record how deep the rock once travelled.",
    difficulty: "Tough",
    span: "",
  },
  {
    n: "10",
    title: "Orogeny",
    problem: "Mountains are built by collision.",
    how: "Continents collide, crust thickens, and rocks are folded, faulted, and uplifted into a mountain belt. The roots of the range are exposed by later erosion.",
    difficulty: "Tough",
    span: "",
  },
];

export function FieldGuide() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-50">
        <CursorGrid
          cellSize={64}
          color="#00E5FF"
          radius={150}
          falloff="smooth"
          holdTime={400}
          fadeDuration={900}
          lineWidth={1}
          maxOpacity={1}
          fillOpacity={0.02}
          gridOpacity={0}
          cellRadius={0}
          clickPulse
          pulseSpeed={700}
          trackWindow
        />
      </div>

      <div className="relative z-10">
        <p className="tabular text-[10px] uppercase tracking-[0.3em] text-text-secondary">
          / 03 · The Field Guide
        </p>
        <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-tight tracking-tight md:text-5xl">
          Ten stations. Ten pieces of the Earth's story.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
          Fold the map, read the rocks, and follow the evidence. Three easy, three medium, four
          tough — every stop is built on a real geological principle, not a guess.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className={m.span}
            >
              <SpotlightCard className="h-full p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="tabular text-[10px] uppercase tracking-[0.25em] text-text-secondary">
                    {m.n}
                  </span>
                  <span
                    className={`tabular rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${
                      m.difficulty === "Easy"
                        ? "border-[color:var(--safe)]/30 bg-[color:var(--safe)]/10 text-[color:var(--safe)]"
                        : m.difficulty === "Medium"
                          ? "border-[color:var(--caution)]/30 bg-[color:var(--caution)]/10 text-[color:var(--caution)]"
                          : "border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
                    }`}
                  >
                    {m.difficulty}
                  </span>
                </div>

                <h3 className="mt-4 text-lg tracking-tight text-white/90">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{m.problem}</p>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">{m.how}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
