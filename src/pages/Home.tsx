import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Nav } from "../components/Nav";
import { Preloader } from "../components/Preloader";
import { Hero } from "../components/Hero";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="noise-overlay" />
      <Nav />
      <Hero />
    </>
  );
}
