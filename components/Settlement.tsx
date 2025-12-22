"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { useTheme } from "@/lib/ThemeContext";
import { formatCurrency } from "@/lib/settlement";

export function Settlement() {
  const router = useRouter();
  const { state, getPlayerBalances, getSettlements } = useGame();
  const { theme, toggleTheme } = useTheme();

  const game = state.currentGame;
  if (!game) return null;

  const balances = getPlayerBalances();
  const settlements = getSettlements();
  const totalPot = game.transactions
    .filter((t) => t.type === "BUY_IN")
    .reduce((sum, t) => sum + t.amountCents, 0);

  // Sort balances: winners first (positive), then losers (negative)
  const sortedBalances = [...balances].sort(
    (a, b) => b.netBalanceCents - a.netBalanceCents
  );

  const isDark = theme === "dark";

  // Get color based on player name
  const getPlayerColor = (name: string) => {
    const colors = [
      "from-red-500 to-red-600",
      "from-blue-500 to-blue-600",
      "from-emerald-500 to-emerald-600",
      "from-purple-500 to-purple-600",
      "from-amber-500 to-amber-600",
      "from-pink-500 to-pink-600",
      "from-cyan-500 to-cyan-600",
      "from-orange-500 to-orange-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen flex flex-col page-transition relative overflow-hidden">
      {/* Background gradient */}
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

      {/* Header */}
      <header
        className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
          isDark
            ? "bg-zinc-900/80 border-zinc-800/50"
            : "bg-white/80 border-zinc-200/50"
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-2">
          <button
            onClick={() => router.push("/games")}
            className="flex items-center gap-1 group w-[120px]"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🃏
            </span>
            <div>
              <span className="gold-text font-bold text-2xl">Stack</span>
              <span
                className={`font-bold text-2xl ${
                  isDark ? "text-white" : "text-zinc-800"
                }`}
              >
                Settle
              </span>
            </div>
          </button>
          <div className="w-[120px] flex justify-end">
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-press ${
                isDark
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Game Name */}
        <h1
          className={`text-2xl font-bold text-center mb-4 animate-fade-in ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        >
          {game.name}
        </h1>

        {/* Hero Section */}
        <div className="text-center py-6 animate-fade-in">
          <div className="relative inline-block">
            <div className="text-7xl animate-float">🏆</div>
            <div className="absolute -right-2 -top-2 text-2xl animate-pulse">
              ✨
            </div>
          </div>
          <h2
            className={`text-3xl font-black mt-4 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            Game Over!
          </h2>
        </div>

        {/* Game Stats */}
        <div
          className="mb-6 animate-fade-in"
          style={{ animationDelay: "50ms" }}
        >
          <h3 className="text-lg font-bold gold-text flex items-center gap-2 mb-4">
            <span>📊</span> Game Stats
          </h3>
          <div className="space-y-4">
            {/* Row 1: Players, Duration, Total Pot */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`rounded-xl p-4 border ${
                  isDark
                    ? "bg-zinc-800/50 border-zinc-700"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <p className="text-xs text-zinc-500 mb-1">Players</p>
                <p
                  className={`font-bold ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {game.players.length}
                </p>
              </div>
              <div
                className={`rounded-xl p-4 border ${
                  isDark
                    ? "bg-zinc-800/50 border-zinc-700"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <p className="text-xs text-zinc-500 mb-1">Duration</p>
                <p
                  className={`font-bold ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {game.endedAt
                    ? formatDuration(game.endedAt - game.createdAt)
                    : "N/A"}
                </p>
              </div>
              <div
                className={`rounded-xl p-4 border ${
                  isDark
                    ? "bg-zinc-800/50 border-zinc-700"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <p className="text-xs text-zinc-500 mb-1">Total Pot</p>
                <p className="font-bold text-amber-500">
                  {formatCurrency(totalPot)}
                </p>
              </div>
            </div>

            {/* Row 2: Biggest Winner, Biggest Loser */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`rounded-xl p-4 border ${
                  isDark
                    ? "bg-zinc-800/50 border-zinc-700"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <p className="text-xs text-zinc-500 mb-1">Biggest Winner</p>
                <p className="font-bold text-emerald-500 truncate">
                  {sortedBalances[0]?.netBalanceCents > 0
                    ? `${sortedBalances[0].playerName}`
                    : "—"}
                </p>
                {sortedBalances[0]?.netBalanceCents > 0 && (
                  <p className="text-xs text-emerald-500/70">
                    +{formatCurrency(sortedBalances[0].netBalanceCents)}
                  </p>
                )}
              </div>
              <div
                className={`rounded-xl p-4 border ${
                  isDark
                    ? "bg-zinc-800/50 border-zinc-700"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <p className="text-xs text-zinc-500 mb-1">Biggest Loser</p>
                <p className="font-bold text-red-500 truncate">
                  {sortedBalances[sortedBalances.length - 1]?.netBalanceCents <
                  0
                    ? `${sortedBalances[sortedBalances.length - 1].playerName}`
                    : "—"}
                </p>
                {sortedBalances[sortedBalances.length - 1]?.netBalanceCents <
                  0 && (
                  <p className="text-xs text-red-500/70">
                    {formatCurrency(
                      sortedBalances[sortedBalances.length - 1].netBalanceCents
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settlements */}
        <div
          className="mb-6 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold gold-text flex items-center gap-2">
              <span>💸</span> Settlements
            </h3>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                isDark
                  ? "bg-zinc-800 text-zinc-400"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {settlements.length} transfer{settlements.length !== 1 ? "s" : ""}
            </span>
          </div>

          {settlements.length > 0 ? (
            <div className="space-y-3 stagger-children">
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-4 card-hover border ${
                    isDark
                      ? "bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border-amber-500/20"
                      : "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* From Player */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br ${getPlayerColor(
                          settlement.from
                        )} flex items-center justify-center`}
                      >
                        <span className="text-white font-bold">
                          {settlement.from[0].toUpperCase()}
                        </span>
                      </div>
                      <span
                        className={`font-medium truncate ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {settlement.from}
                      </span>
                    </div>

                    {/* Arrow & Amount */}
                    <div className="flex flex-col items-center flex-shrink-0 px-2">
                      <div className="text-lg font-bold gold-text">
                        {formatCurrency(settlement.amountCents)}
                      </div>
                      <span className="text-amber-500 text-lg">→</span>
                    </div>

                    {/* To Player */}
                    <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                      <span
                        className={`font-medium truncate text-right ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {settlement.to}
                      </span>
                      <div
                        className={`w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br ${getPlayerColor(
                          settlement.to
                        )} flex items-center justify-center`}
                      >
                        <span className="text-white font-bold">
                          {settlement.to[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-8 rounded-2xl border ${
                isDark
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-zinc-50 border-zinc-200"
              }`}
            >
              <div className="text-4xl mb-2">🤝</div>
              <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                Everyone broke even — no transfers needed!
              </p>
            </div>
          )}
        </div>

        {/* Final Standings */}
        <div
          className="mb-8 animate-fade-in"
          style={{ animationDelay: "150ms" }}
        >
          <h3 className="text-lg font-bold gold-text flex items-center gap-2 mb-4">
            <span>🏅</span> Final Standings
          </h3>
          <div
            className={`rounded-2xl overflow-hidden border ${
              isDark
                ? "bg-zinc-900/80 border-zinc-800"
                : "bg-white border-zinc-200 shadow-xl shadow-zinc-100"
            }`}
          >
            <div className="stagger-children">
              {sortedBalances.map((balance, index) => (
                <div
                  key={balance.playerId}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    index !== sortedBalances.length - 1
                      ? isDark
                        ? "border-b border-zinc-800"
                        : "border-b border-zinc-100"
                      : ""
                  } ${isDark ? "hover:bg-zinc-800/30" : "hover:bg-zinc-50"}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        index === 0 && balance.netBalanceCents > 0
                          ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-black"
                          : index === 1 && balance.netBalanceCents > 0
                          ? "bg-gradient-to-br from-zinc-300 to-zinc-400 text-black"
                          : index === 2 && balance.netBalanceCents > 0
                          ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                          : balance.netBalanceCents < 0
                          ? isDark
                            ? "bg-red-500/20 text-red-400"
                            : "bg-red-100 text-red-600"
                          : isDark
                          ? "bg-zinc-800 text-zinc-500"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Player Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getPlayerColor(
                        balance.playerName
                      )} flex items-center justify-center`}
                    >
                      <span className="text-white font-bold">
                        {balance.playerName[0].toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {balance.playerName}
                        {index === 0 && balance.netBalanceCents > 0 && " 👑"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        In: {formatCurrency(balance.totalBuyInCents)} • Out:{" "}
                        {formatCurrency(balance.totalCashOutCents)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      balance.netBalanceCents > 0
                        ? "text-emerald-500"
                        : balance.netBalanceCents < 0
                        ? "text-red-500"
                        : "text-zinc-500"
                    }`}
                  >
                    {balance.netBalanceCents >= 0 ? "+" : ""}
                    {formatCurrency(balance.netBalanceCents)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Game Button */}
        <button
          onClick={() => router.push("/games")}
          className={`w-full py-4 font-bold rounded-2xl transition-all duration-300 btn-press animate-fade-in flex items-center justify-center gap-2 ${
            isDark
              ? "bg-amber-500 hover:bg-amber-400 text-black"
              : "bg-amber-500 hover:bg-amber-400 text-black hover:shadow-lg hover:shadow-amber-500/30"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <span className="text-xl">🃏</span>
          <span>New Game</span>
        </button>
      </main>
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}
