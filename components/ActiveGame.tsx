"use client";

import { useState } from "react";
import { useGame } from "@/lib/GameContext";
import { useTheme } from "@/lib/ThemeContext";
import { formatCurrency, parseToCents } from "@/lib/settlement";

export function ActiveGame() {
  const {
    state,
    addPlayer,
    removePlayer,
    addTransaction,
    removeTransaction,
    endGame,
    backToHome,
    getPlayerBalances,
    validateBalance,
  } = useGame();
  const { theme, toggleTheme } = useTheme();

  const [transactionModal, setTransactionModal] = useState<{
    playerId: string;
    playerName: string;
    type: "BUY_IN" | "CASH_OUT";
  } | null>(null);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(
    new Set()
  );

  const game = state.currentGame;
  if (!game) return null;

  const balances = getPlayerBalances();
  const validation = validateBalance();
  const isDark = theme === "dark";

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName("");
      setShowAddPlayer(false);
    }
  };

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionModal) return;

    const cents = parseToCents(transactionAmount);
    if (cents) {
      addTransaction(transactionModal.playerId, cents, transactionModal.type);
      setTransactionModal(null);
      setTransactionAmount("");
    }
  };

  const handleEndGame = () => {
    if (validation.isValid) {
      endGame();
    }
  };

  const getPlayerTransactions = (playerId: string) => {
    return game.transactions
      .filter((t) => t.playerId === playerId)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const togglePlayerExpanded = (playerId: string) => {
    setExpandedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        next.add(playerId);
      }
      return next;
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate player avatar color based on name
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
    <div className="min-h-screen flex flex-col page-transition">
      {/* Header */}
      <header
        className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
          isDark
            ? "bg-zinc-900/80 border-zinc-800/50"
            : "bg-white/80 border-zinc-200/50"
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-2 ">
          <button
            onClick={backToHome}
            className="flex items-center gap-1 group w-[120px]"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              🃏
            </span>
            <div>
              <span className="gold-text font-bold">Stack</span>
              <span
                className={`font-bold ${
                  isDark ? "text-white" : "text-zinc-800"
                }`}
              >
                Settle
              </span>
            </div>
          </button>
          <h1
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {game.name}
          </h1>
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
        {/* Table Balance Section */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold gold-text flex items-center gap-2">
              <span>💰</span> Table Balance
            </h2>
            {validation.isValid ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Balanced
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {formatCurrency(Math.abs(validation.difference))} off
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-zinc-800/50 border-zinc-700"
                  : "bg-zinc-50 border-zinc-200"
              }`}
            >
              <p
                className={`text-xs mb-1 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Buy-ins
              </p>
              <p className="text-2xl font-bold text-blue-500">
                {formatCurrency(validation.totalBuyIns)}
              </p>
            </div>
            <div
              className={`rounded-xl p-4 border ${
                isDark
                  ? "bg-zinc-800/50 border-zinc-700"
                  : "bg-zinc-50 border-zinc-200"
              }`}
            >
              <p
                className={`text-xs mb-1 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Cash-outs
              </p>
              <p className="text-2xl font-bold text-emerald-500">
                {formatCurrency(validation.totalCashOuts)}
              </p>
            </div>
          </div>
        </div>

        {/* Players Section Header */}
        <div
          className="flex items-center justify-between mb-4 animate-fade-in"
          style={{ animationDelay: "50ms" }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold gold-text flex items-center gap-2">
              <span>👥</span> Players
            </h2>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-zinc-800 text-zinc-400"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {game.players.length}
            </span>
          </div>
          <button
            onClick={() => setShowAddPlayer(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all btn-press ${
              isDark
                ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                : "bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
            }`}
          >
            <span>+</span>
            <span>Add</span>
          </button>
        </div>

        {/* Players List */}
        {game.players.length === 0 ? (
          <div
            className={`text-center py-12 rounded-2xl animate-fade-in border ${
              isDark
                ? "bg-zinc-900/50 border-zinc-800"
                : "bg-zinc-50 border-zinc-200"
            }`}
          >
            <div className="relative inline-block mb-4">
              <span className="text-5xl">🎴</span>
              <span className="absolute -right-1 -bottom-1 text-2xl">♠️</span>
            </div>
            <p
              className={`text-lg font-medium mb-1 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Ready to deal?
            </p>
            <p className={isDark ? "text-zinc-600" : "text-zinc-400"}>
              Add players to start the game
            </p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children mb-8">
            {balances.map((balance, index) => {
              const transactions = getPlayerTransactions(balance.playerId);
              const hasTransactions = transactions.length > 0;
              const isExpanded = expandedPlayers.has(balance.playerId);

              return (
                <div
                  key={balance.playerId}
                  className={`rounded-2xl overflow-hidden card-hover border ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-800"
                      : "bg-white border-zinc-200 shadow-lg shadow-zinc-100"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Player Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlayerColor(
                            balance.playerName
                          )} flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-white font-bold text-lg">
                            {balance.playerName[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3
                            className={`font-bold text-lg ${
                              isDark ? "text-white" : "text-zinc-900"
                            }`}
                          >
                            {balance.playerName}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDark ? "text-zinc-500" : "text-zinc-500"
                            }`}
                          >
                            In: {formatCurrency(balance.totalBuyInCents)} • Out:{" "}
                            {formatCurrency(balance.totalCashOutCents)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            balance.netBalanceCents > 0
                              ? "text-emerald-500"
                              : balance.netBalanceCents < 0
                              ? "text-red-500"
                              : isDark
                              ? "text-zinc-500"
                              : "text-zinc-400"
                          }`}
                        >
                          {balance.netBalanceCents >= 0 ? "+" : ""}
                          {formatCurrency(balance.netBalanceCents)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setTransactionModal({
                            playerId: balance.playerId,
                            playerName: balance.playerName,
                            type: "BUY_IN",
                          })
                        }
                        className={`flex-1 py-2.5 rounded-xl font-medium transition-all btn-press flex items-center justify-center gap-2 ${
                          isDark
                            ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/20"
                            : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                        }`}
                      >
                        <span>💵</span>
                        <span>Buy In</span>
                      </button>
                      <button
                        onClick={() =>
                          setTransactionModal({
                            playerId: balance.playerId,
                            playerName: balance.playerName,
                            type: "CASH_OUT",
                          })
                        }
                        className={`flex-1 py-2.5 rounded-xl font-medium transition-all btn-press flex items-center justify-center gap-2 ${
                          isDark
                            ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200"
                        }`}
                      >
                        <span>💰</span>
                        <span>Cash Out</span>
                      </button>
                      {!hasTransactions && (
                        <button
                          onClick={() => removePlayer(balance.playerId)}
                          className={`w-11 py-2.5 rounded-xl transition-all btn-press flex items-center justify-center border ${
                            isDark
                              ? "bg-zinc-800 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 border-zinc-700"
                              : "bg-zinc-100 hover:bg-red-50 text-zinc-400 hover:text-red-500 border-zinc-200"
                          }`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Transaction History */}
                  {hasTransactions && (
                    <div
                      className={`border-t ${
                        isDark ? "border-zinc-800" : "border-zinc-100"
                      }`}
                    >
                      <button
                        onClick={() => togglePlayerExpanded(balance.playerId)}
                        className={`w-full px-4 py-2.5 flex items-center gap-2 text-xs font-medium transition-colors ${
                          isDark
                            ? "text-zinc-500 hover:text-zinc-300"
                            : "text-zinc-500 hover:text-zinc-700"
                        }`}
                      >
                        <span
                          className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          ▶
                        </span>
                        <span>Transactions ({transactions.length})</span>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-4 pb-3 space-y-1">
                          {transactions.map((tx) => (
                            <div
                              key={tx.id}
                              className="flex items-center justify-between text-sm py-1 group"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={
                                    tx.type === "BUY_IN"
                                      ? "text-blue-500"
                                      : "text-emerald-500"
                                  }
                                >
                                  {tx.type === "BUY_IN" ? "↓" : "↑"}
                                </span>
                                <span
                                  className={
                                    tx.type === "BUY_IN"
                                      ? "text-blue-500"
                                      : "text-emerald-500"
                                  }
                                >
                                  {tx.type === "BUY_IN" ? "Buy In" : "Cash Out"}
                                  : {formatCurrency(tx.amountCents)}
                                </span>
                                <span className="text-zinc-500 text-xs">
                                  {formatTime(tx.timestamp)}
                                </span>
                              </div>
                              <button
                                onClick={() => removeTransaction(tx.id)}
                                className="text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* End Game Button */}
        {game.players.length >= 2 && game.transactions.length > 0 && (
          <button
            onClick={() => setShowEndConfirm(true)}
            className={`w-full py-4 font-bold rounded-2xl transition-all duration-300 btn-press animate-fade-in flex items-center justify-center gap-2 ${
              isDark
                ? "bg-amber-500 hover:bg-amber-400 text-black"
                : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/30"
            }`}
          >
            <span className="text-xl">🏆</span>
            <span>End Game & Settle Up</span>
          </button>
        )}
      </main>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className={`rounded-3xl p-6 w-full max-w-sm animate-scale-in border ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-zinc-200"
            }`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
                <span className="text-3xl">👤</span>
              </div>
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Add Player
              </h2>
            </div>

            <form onSubmit={handleAddPlayer}>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Player name..."
                autoFocus
                className={`w-full px-4 py-4 rounded-xl mb-6 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 border ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                }`}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlayer(false);
                    setNewPlayerName("");
                  }}
                  className={`flex-1 py-3.5 rounded-xl font-medium transition-all btn-press ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlayerName.trim()}
                  className={`flex-1 py-3.5 rounded-xl font-semibold transition-all btn-press ${
                    newPlayerName.trim()
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                      : isDark
                      ? "bg-zinc-800 text-zinc-600"
                      : "bg-zinc-200 text-zinc-400"
                  }`}
                >
                  Add to Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {transactionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className={`rounded-3xl p-6 w-full max-w-sm animate-scale-in border ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-zinc-200"
            }`}
          >
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl ${
                  transactionModal.type === "BUY_IN"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30"
                    : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30"
                }`}
              >
                <span className="text-3xl">
                  {transactionModal.type === "BUY_IN" ? "💵" : "💰"}
                </span>
              </div>
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                {transactionModal.type === "BUY_IN" ? "Buy In" : "Cash Out"}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-zinc-500" : "text-zinc-500"
                }`}
              >
                {transactionModal.playerName}
              </p>
            </div>

            <form onSubmit={handleTransaction}>
              <div className="relative mb-4">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  $
                </span>
                <input
                  type="text"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className={`w-full pl-10 pr-4 py-4 rounded-xl text-center text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 border ${
                    isDark
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-600"
                      : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-300"
                  }`}
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[10, 20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTransactionAmount(amount.toString())}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all btn-press ${
                      isDark
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTransactionModal(null);
                    setTransactionAmount("");
                  }}
                  className={`flex-1 py-3.5 rounded-xl font-medium transition-all btn-press ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!parseToCents(transactionAmount)}
                  className={`flex-1 py-3.5 rounded-xl font-semibold transition-all btn-press ${
                    parseToCents(transactionAmount)
                      ? transactionModal.type === "BUY_IN"
                        ? "bg-blue-500 hover:bg-blue-400 text-white"
                        : "bg-emerald-500 hover:bg-emerald-400 text-white"
                      : isDark
                      ? "bg-zinc-800 text-zinc-600"
                      : "bg-zinc-200 text-zinc-400"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* End Game Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className={`rounded-3xl p-6 w-full max-w-sm animate-scale-in border ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-zinc-200"
            }`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
                <span className="text-3xl">🏆</span>
              </div>
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                End Game?
              </h2>
              <p
                className={`text-sm mt-2 ${
                  isDark ? "text-zinc-500" : "text-zinc-500"
                }`}
              >
                Finalize all transactions and calculate settlements
              </p>
            </div>

            {!validation.isValid && (
              <div
                className={`rounded-xl p-4 mb-6 border ${
                  isDark
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      Game is unbalanced
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? "text-red-400/70" : "text-red-500"
                      }`}
                    >
                      Difference:{" "}
                      {formatCurrency(Math.abs(validation.difference))}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? "text-zinc-500" : "text-zinc-500"
                      }`}
                    >
                      Buy-ins: {formatCurrency(validation.totalBuyIns)} •
                      Cash-outs: {formatCurrency(validation.totalCashOuts)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className={`flex-1 py-3.5 rounded-xl font-medium transition-all btn-press ${
                  isDark
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  setShowEndConfirm(false);
                  handleEndGame();
                }}
                disabled={!validation.isValid}
                className={`flex-1 py-3.5 rounded-xl font-semibold transition-all btn-press ${
                  validation.isValid
                    ? "bg-amber-500 hover:bg-amber-400 text-black"
                    : isDark
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                }`}
              >
                Settle Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
