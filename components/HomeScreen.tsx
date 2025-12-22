"use client";

import { useState } from "react";
import { useGame } from "@/lib/GameContext";
import { useTheme } from "@/lib/ThemeContext";
import { formatCurrency } from "@/lib/settlement";

export function HomeScreen() {
  const { state, createGame, loadGame, deleteGame } = useGame();
  const { theme, toggleTheme } = useTheme();
  const [gameName, setGameName] = useState("");
  const [showCurrentGames, setShowCurrentGames] = useState(true);
  const [showPastGames, setShowPastGames] = useState(false);

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName.trim()) {
      createGame(gameName.trim());
      setGameName("");
    }
  };

  const currentGames = state.gameHistory.filter((g) => g.status === "ACTIVE");
  const pastGames = state.gameHistory.filter((g) => g.status === "ENDED");

  const getGamePot = (game: (typeof state.gameHistory)[0]) => {
    return game.transactions
      .filter((t) => t.type === "BUY_IN")
      .reduce((sum, t) => sum + t.amountCents, 0);
  };

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 page-transition">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 btn-press ${
          isDark
            ? "bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700"
            : "bg-white/80 hover:bg-white border border-zinc-200 shadow-sm"
        }`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
      </button>

      {/* Logo and Title */}
      <div className="text-center mb-10 animate-fade-in">
        {/* Animated Card Stack */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 flex items-center justify-center animate-float">
            <div className="text-7xl filter drop-shadow-lg">🃏</div>
          </div>
          {/* Decorative chips */}
          <div
            className="absolute -left-2 top-0 w-6 h-6 rounded-full bg-red-500 chip opacity-80 animate-chip-stack"
            style={{ animationDelay: "100ms" }}
          />
          <div
            className="absolute -right-2 top-2 w-5 h-5 rounded-full bg-blue-500 chip opacity-80 animate-chip-stack"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="absolute left-0 -bottom-1 w-4 h-4 rounded-full bg-green-600 chip opacity-80 animate-chip-stack"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        <h1 className="text-5xl font-black tracking-tight mb-3">
          <span className="gold-text">Stack</span>
          <span className={isDark ? "text-white" : "text-zinc-800"}>
            Settle
          </span>
        </h1>
        <p className={`text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          Track your home poker game & settle up fast
        </p>
      </div>

      {/* Create Game Form */}
      <form
        onSubmit={handleCreateGame}
        className="w-full max-w-md mb-8 animate-fade-in"
        style={{ animationDelay: "100ms" }}
      >
        <div
          className={`flex flex-col sm:flex-row gap-2 p-2 rounded-2xl transition-all duration-300 ${
            isDark
              ? "bg-zinc-900/80 border border-zinc-800"
              : "bg-white/80 border border-zinc-200 shadow-lg shadow-zinc-200/50"
          }`}
        >
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Friday Night Poker..."
            className={`flex-1 px-4 py-3 rounded-xl bg-transparent placeholder-zinc-500 focus:outline-none transition-colors ${
              isDark ? "text-white" : "text-black"
            }`}
          />
          <button
            type="submit"
            disabled={!gameName.trim()}
            className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-xl transition-all duration-300 btn-press ${
              gameName.trim()
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/25"
                : isDark
                ? "bg-zinc-800 text-zinc-600"
                : "bg-zinc-100 text-zinc-400"
            }`}
          >
            Deal In
          </button>
        </div>
      </form>

      {/* Current Games */}
      {currentGames.length > 0 && (
        <div
          className="w-full max-w-md mb-4 animate-fade-in"
          style={{ animationDelay: "150ms" }}
        >
          <button
            onClick={() => setShowCurrentGames(!showCurrentGames)}
            className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors mb-3 group"
          >
            <span
              className={`text-sm transition-transform duration-200 ${
                showCurrentGames ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
            <span className="font-semibold">
              Live Tables ({currentGames.length})
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {showCurrentGames && (
            <div className="space-y-3 stagger-children">
              {currentGames
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((game) => (
                  <div
                    key={game.id}
                    className={`rounded-2xl p-4 card-hover border ${
                      isDark
                        ? "bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-500/20"
                        : "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <span className="text-white text-lg">🎴</span>
                        </div>
                        <div>
                          <h3
                            className={`font-bold ${
                              isDark ? "text-white" : "text-zinc-900"
                            }`}
                          >
                            {game.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            }`}
                          >
                            {game.players.length} players •{" "}
                            {formatCurrency(getGamePot(game))}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadGame(game.id)}
                        className="flex-1 py-2.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all btn-press shadow-lg shadow-emerald-500/25"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => deleteGame(game.id)}
                        className={`px-4 py-2.5 text-sm rounded-xl transition-all btn-press ${
                          isDark
                            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Past Games */}
      {pastGames.length > 0 && (
        <div
          className="w-full max-w-md animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <button
            onClick={() => setShowPastGames(!showPastGames)}
            className={`flex items-center gap-2 transition-colors mb-3 ${
              isDark
                ? "text-zinc-500 hover:text-zinc-300"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <span
              className={`text-sm transition-transform duration-200 ${
                showPastGames ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
            <span className="font-medium">Past Games ({pastGames.length})</span>
          </button>

          {showPastGames && (
            <div className="space-y-2 stagger-children">
              {pastGames
                .sort((a, b) => (b.endedAt || 0) - (a.endedAt || 0))
                .map((game) => (
                  <div
                    key={game.id}
                    className={`rounded-xl p-3 flex items-center justify-between card-hover border ${
                      isDark
                        ? "bg-zinc-900/50 border-zinc-800"
                        : "bg-white/80 border-zinc-200"
                    }`}
                  >
                    <div>
                      <h3
                        className={`font-medium ${
                          isDark ? "text-zinc-300" : "text-zinc-700"
                        }`}
                      >
                        {game.name}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {game.players.length} players •{" "}
                        {formatCurrency(getGamePot(game))} •{" "}
                        {new Date(
                          game.endedAt || game.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadGame(game.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all btn-press ${
                          isDark
                            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteGame(game.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all btn-press ${
                          isDark
                            ? "text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                            : "text-zinc-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="mt-12 text-center animate-fade-in"
        style={{ animationDelay: "250ms" }}
      >
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-2xl">♠️</span>
          <span className="text-2xl">♥️</span>
          <span className="text-2xl">♦️</span>
          <span className="text-2xl">♣️</span>
        </div>
        <p className={`text-sm ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
          Minimal transfers • Maximum fairness
        </p>
      </div>
    </div>
  );
}
