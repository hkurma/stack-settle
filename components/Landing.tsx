"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function Landing() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration - covers entire page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-amber-500" : "bg-amber-300"
          }`}
        />
        <div
          className={`absolute bottom-1/3 -left-32 w-80 h-80 rounded-full blur-3xl opacity-15 ${
            isDark ? "bg-emerald-500" : "bg-emerald-300"
          }`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          }`}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 btn-press ${
          isDark
            ? "bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700"
            : "bg-white/80 hover:bg-white border border-zinc-200 shadow-sm"
        }`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
      </button>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative">
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Animated Logo */}
          <div className="relative w-32 h-32 mx-auto mb-8 animate-fade-in">
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              <div className="text-8xl filter drop-shadow-2xl">🃏</div>
            </div>
            {/* Decorative chips */}
            <div
              className="absolute -left-4 top-2 w-8 h-8 rounded-full bg-red-500 chip opacity-90 animate-chip-stack"
              style={{ animationDelay: "100ms" }}
            />
            <div
              className="absolute -right-4 top-4 w-7 h-7 rounded-full bg-blue-500 chip opacity-90 animate-chip-stack"
              style={{ animationDelay: "200ms" }}
            />
            <div
              className="absolute left-2 -bottom-2 w-6 h-6 rounded-full bg-green-500 chip opacity-90 animate-chip-stack"
              style={{ animationDelay: "300ms" }}
            />
            <div
              className="absolute right-0 -bottom-1 w-5 h-5 rounded-full bg-purple-500 chip opacity-90 animate-chip-stack"
              style={{ animationDelay: "400ms" }}
            />
          </div>

          {/* Title */}
          <h1
            className="text-6xl sm:text-7xl font-black tracking-tight mb-4 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <span className="gold-text">Stack</span>
            <span className={isDark ? "text-white" : "text-zinc-900"}>
              Settle
            </span>
          </h1>

          {/* Tagline */}
          <p
            className={`text-xl sm:text-2xl mb-8 animate-fade-in ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            {APP_TAGLINE}
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <button
              onClick={() => router.push("/games")}
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-lg rounded-2xl transition-all duration-300 btn-press hover:shadow-2xl hover:shadow-amber-500/25"
            >
              <span className="flex items-center gap-3">
                Start a Game
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-3xl font-bold text-center mb-12 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            Why {APP_NAME}?
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div
              className={`p-6 rounded-2xl text-center card-hover ${
                isDark
                  ? "bg-zinc-800/50 border border-zinc-700/50"
                  : "bg-white border border-zinc-200 shadow-sm"
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Track Everything
              </h3>
              <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                Multiple buy-ins and cash-outs per player. Never lose track of
                who owes what.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`p-6 rounded-2xl text-center card-hover ${
                isDark
                  ? "bg-zinc-800/50 border border-zinc-700/50"
                  : "bg-white border border-zinc-200 shadow-sm"
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Minimal Transfers
              </h3>
              <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                Our smart algorithm calculates the fewest payments needed to
                settle up.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`p-6 rounded-2xl text-center card-hover ${
                isDark
                  ? "bg-zinc-800/50 border border-zinc-700/50"
                  : "bg-white border border-zinc-200 shadow-sm"
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Works Offline
              </h3>
              <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                Install as an app. Works without internet. Your data stays on
                your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-3xl font-bold text-center mb-12 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            How It Works
          </h2>

          <div className="grid sm:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                step: "1",
                icon: "🎲",
                title: "Create Game",
                desc: "Name your poker night",
              },
              {
                step: "2",
                icon: "👥",
                title: "Add Players",
                desc: "Everyone at the table",
              },
              {
                step: "3",
                icon: "💵",
                title: "Track Money",
                desc: "Buy-ins & cash-outs",
              },
              {
                step: "4",
                icon: "✅",
                title: "Settle Up",
                desc: "See who pays whom",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className={`relative w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                    isDark
                      ? "bg-zinc-800 border border-zinc-700"
                      : "bg-zinc-100 border border-zinc-200"
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isDark
                        ? "bg-amber-500 text-black"
                        : "bg-amber-400 text-black"
                    }`}
                  >
                    {item.step}
                  </span>
                </div>
                <h3
                  className={`font-bold mb-1 ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-zinc-500" : "text-zinc-600"
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-md mx-auto text-center">
          <h2
            className={`text-3xl font-bold text-center mb-8 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            Get Started
          </h2>
          <button
            onClick={() => router.push("/games")}
            className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-lg rounded-2xl transition-all duration-300 btn-press hover:shadow-xl hover:shadow-amber-500/25"
          >
            It&apos;s Free
          </button>
          <p
            className={`mt-4 text-sm ${
              isDark ? "text-zinc-500" : "text-zinc-500"
            }`}
          >
            No signup required • Works offline • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-xl">♠️</span>
          <span className="text-xl">♥️</span>
          <span className="text-xl">♦️</span>
          <span className="text-xl">♣️</span>
        </div>
        <p className={`text-sm ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
          Settle smarter, not harder
        </p>
      </footer>
    </div>
  );
}
