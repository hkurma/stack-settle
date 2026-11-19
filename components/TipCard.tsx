"use client";

import { useTheme } from "@/lib/ThemeContext";
import { TIP_URL } from "@/lib/constants";

type TipCardProps = {
  title: string;
  message: string;
  ctaLabel?: string;
  className?: string;
};

export function TipCard({
  title,
  message,
  ctaLabel = "Buy me a coffee",
  className = "",
}: TipCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 border text-center ${
        isDark
          ? "bg-zinc-900/80 border-zinc-800"
          : "bg-white border-zinc-200 shadow-sm"
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-amber-500/15" : "bg-amber-300/30"
        }`}
      />
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
          <span className="text-3xl" aria-hidden="true">
            ☕
          </span>
        </div>
        <h2
          className={`text-xl font-bold mb-2 ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-sm mb-5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
        >
          {message}
        </p>
        <a
          href={TIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all duration-300 btn-press ${
            isDark
              ? "border-amber-500/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400"
              : "border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100"
          }`}
        >
          <span aria-hidden="true">☕</span>
          <span>{ctaLabel}</span>
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </div>
  );
}
