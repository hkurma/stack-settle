// Core domain types for StackSettle

export interface Player {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  playerId: string;
  amountCents: number; // Currency-safe: use integers for cents
  type: "BUY_IN" | "CASH_OUT";
  timestamp: number;
}

export interface Game {
  id: string;
  name: string;
  status: "ACTIVE" | "ENDED";
  players: Player[];
  transactions: Transaction[];
  createdAt: number;
  endedAt?: number;
}

export interface PlayerBalance {
  playerId: string;
  playerName: string;
  totalBuyInCents: number;
  totalCashOutCents: number;
  netBalanceCents: number; // positive = receives money, negative = pays money
}

export interface Settlement {
  from: string; // player name
  to: string; // player name
  amountCents: number;
}

// Helper type for the settlement algorithm
export interface BalanceEntry {
  player: string;
  amount: number;
}
