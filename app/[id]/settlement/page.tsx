"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGame } from "@/lib/GameContext";
import { SettlementScreen } from "@/components/SettlementScreen";
import { useTheme } from "@/lib/ThemeContext";

export default function SettlementPage() {
  const params = useParams();
  const router = useRouter();
  const { state, loadGame, getGameById } = useGame();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gameId = params.id as string;

  useEffect(() => {
    if (!state.isLoading && gameId) {
      const game = getGameById(gameId);
      if (!game) {
        // Game not found, redirect to home
        router.replace("/");
        return;
      }
      if (game.status === "ACTIVE") {
        // Game is still active, redirect to game page
        router.replace(`/${gameId}/game`);
        return;
      }
      // Load the game if not already loaded
      if (!state.currentGame || state.currentGame.id !== gameId) {
        loadGame(gameId);
      }
    }
  }, [
    gameId,
    state.isLoading,
    state.currentGame,
    loadGame,
    getGameById,
    router,
  ]);

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">🃏</div>
          <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Game not found or not loaded yet
  if (!state.currentGame || state.currentGame.id !== gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">🃏</div>
          <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
            Loading settlement...
          </p>
        </div>
      </div>
    );
  }

  return <SettlementScreen />;
}
