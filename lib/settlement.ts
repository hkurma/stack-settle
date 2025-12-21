// Settlement algorithm - Greedy debt settlement for minimum transactions
import type { Transaction, PlayerBalance, Settlement, BalanceEntry, Player } from "./types";

/**
 * Calculate balance for each player based on their transactions
 * balance = total_cash_out - total_buy_in
 * - positive balance → player receives money
 * - negative balance → player pays money
 */
export function calculatePlayerBalances(
  players: Player[],
  transactions: Transaction[]
): PlayerBalance[] {
  const balances: PlayerBalance[] = players.map((player) => ({
    playerId: player.id,
    playerName: player.name,
    totalBuyInCents: 0,
    totalCashOutCents: 0,
    netBalanceCents: 0,
  }));

  for (const tx of transactions) {
    const playerBalance = balances.find((b) => b.playerId === tx.playerId);
    if (!playerBalance) continue;

    if (tx.type === "BUY_IN") {
      playerBalance.totalBuyInCents += tx.amountCents;
    } else {
      playerBalance.totalCashOutCents += tx.amountCents;
    }
  }

  // Calculate net balance for each player
  for (const balance of balances) {
    balance.netBalanceCents =
      balance.totalCashOutCents - balance.totalBuyInCents;
  }

  return balances;
}

/**
 * Validate that total buy-ins equal total cash-outs
 * This ensures the game is balanced before settlement
 */
export function validateGameBalance(balances: PlayerBalance[]): {
  isValid: boolean;
  totalBuyIns: number;
  totalCashOuts: number;
  difference: number;
} {
  const totalBuyIns = balances.reduce((sum, b) => sum + b.totalBuyInCents, 0);
  const totalCashOuts = balances.reduce(
    (sum, b) => sum + b.totalCashOutCents,
    0
  );
  const difference = totalCashOuts - totalBuyIns;

  return {
    isValid: difference === 0,
    totalBuyIns,
    totalCashOuts,
    difference,
  };
}

/**
 * Greedy debt-settlement algorithm to minimize number of transactions
 *
 * Algorithm:
 * 1. Build list of creditors (balance > 0, they receive money)
 * 2. Build list of debtors (balance < 0, they pay money)
 * 3. Sort both lists descending by amount
 * 4. Match debtors to creditors greedily
 * 5. Each transaction eliminates at least one balance
 */
export function settleBalances(balances: PlayerBalance[]): Settlement[] {
  const creditors: BalanceEntry[] = [];
  const debtors: BalanceEntry[] = [];

  for (const balance of balances) {
    if (balance.netBalanceCents > 0) {
      creditors.push({
        player: balance.playerName,
        amount: balance.netBalanceCents,
      });
    } else if (balance.netBalanceCents < 0) {
      debtors.push({
        player: balance.playerName,
        amount: -balance.netBalanceCents, // Store as positive for easier math
      });
    }
    // Zero-balance players are excluded from settlement
  }

  // Sort both lists descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const transfer = Math.min(debtors[i].amount, creditors[j].amount);

    settlements.push({
      from: debtors[i].player,
      to: creditors[j].player,
      amountCents: transfer,
    });

    debtors[i].amount -= transfer;
    creditors[j].amount -= transfer;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settlements;
}

/**
 * Format cents to dollars for display
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

/**
 * Parse a dollar amount string to cents
 * Handles formats like "50", "50.00", "$50", "$50.00"
 */
export function parseToCents(input: string): number | null {
  // Remove currency symbols and whitespace
  const cleaned = input.replace(/[$,\s]/g, "").trim();

  if (!cleaned || isNaN(Number(cleaned))) {
    return null;
  }

  const dollars = parseFloat(cleaned);
  if (dollars <= 0) {
    return null;
  }

  // Convert to cents and round to avoid floating point issues
  return Math.round(dollars * 100);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

