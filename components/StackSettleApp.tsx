"use client";

import { useGame } from "@/lib/GameContext";
import { HomeScreen } from "./HomeScreen";
import { ActiveGame } from "./ActiveGame";
import { SettlementScreen } from "./SettlementScreen";

export function StackSettleApp() {
  const { state } = useGame();

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">🃏</div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // No current game - show home screen
  if (!state.currentGame) {
    return <HomeScreen />;
  }

  // Game is ended - show settlement screen
  if (state.currentGame.status === "ENDED") {
    return <SettlementScreen />;
  }

  // Active game - show game screen
  return <ActiveGame />;
}

