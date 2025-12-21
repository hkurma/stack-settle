"use client";

import { GameProvider } from "@/lib/GameContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { StackSettleApp } from "@/components/StackSettleApp";

export default function Home() {
  return (
    <ThemeProvider>
      <GameProvider>
        <StackSettleApp />
      </GameProvider>
    </ThemeProvider>
  );
}
