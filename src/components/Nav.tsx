"use client";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/5 bg-[#08080A]/70 py-3 backdrop-blur-xl" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-end px-6">
        <Link
          to="/quest"
          className="rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
        >
          Explore Campus
        </Link>
      </div>
    </header>
  );
}
