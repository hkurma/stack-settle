// Unit tests for settlement algorithm
import {
  calculatePlayerBalances,
  settleBalances,
  validateGameBalance,
  parseToCents,
  formatCurrency,
} from "./settlement";
import type { Player, Transaction, PlayerBalance } from "./types";

// Test helpers
function createPlayer(id: string, name: string): Player {
  return { id, name };
}

function createTransaction(
  id: string,
  playerId: string,
  amountCents: number,
  type: "BUY_IN" | "CASH_OUT"
): Transaction {
  return { id, playerId, amountCents, type, timestamp: Date.now() };
}

// ============================================
// Balance Calculation Tests
// ============================================

describe("calculatePlayerBalances", () => {
  test("calculates correct balances for simple game", () => {
    const players = [
      createPlayer("1", "Alice"),
      createPlayer("2", "Bob"),
      createPlayer("3", "Charlie"),
    ];

    const transactions: Transaction[] = [
      // Alice: buys in $100, cashes out $180 → net +$80
      createTransaction("t1", "1", 10000, "BUY_IN"),
      createTransaction("t2", "1", 18000, "CASH_OUT"),
      // Bob: buys in $200, cashes out $120 → net -$80
      createTransaction("t3", "2", 20000, "BUY_IN"),
      createTransaction("t4", "2", 12000, "CASH_OUT"),
      // Charlie: buys in $50, cashes out $50 → net $0
      createTransaction("t5", "3", 5000, "BUY_IN"),
      createTransaction("t6", "3", 5000, "CASH_OUT"),
    ];

    const balances = calculatePlayerBalances(players, transactions);

    expect(balances).toHaveLength(3);

    const alice = balances.find((b) => b.playerName === "Alice")!;
    expect(alice.totalBuyInCents).toBe(10000);
    expect(alice.totalCashOutCents).toBe(18000);
    expect(alice.netBalanceCents).toBe(8000); // +$80

    const bob = balances.find((b) => b.playerName === "Bob")!;
    expect(bob.totalBuyInCents).toBe(20000);
    expect(bob.totalCashOutCents).toBe(12000);
    expect(bob.netBalanceCents).toBe(-8000); // -$80

    const charlie = balances.find((b) => b.playerName === "Charlie")!;
    expect(charlie.totalBuyInCents).toBe(5000);
    expect(charlie.totalCashOutCents).toBe(5000);
    expect(charlie.netBalanceCents).toBe(0);
  });

  test("handles multiple buy-ins and cash-outs per player", () => {
    const players = [createPlayer("1", "Alice")];

    const transactions: Transaction[] = [
      createTransaction("t1", "1", 5000, "BUY_IN"), // $50
      createTransaction("t2", "1", 2500, "BUY_IN"), // $25
      createTransaction("t3", "1", 3000, "CASH_OUT"), // $30
      createTransaction("t4", "1", 5500, "CASH_OUT"), // $55
    ];

    const balances = calculatePlayerBalances(players, transactions);
    const alice = balances[0];

    expect(alice.totalBuyInCents).toBe(7500); // $75
    expect(alice.totalCashOutCents).toBe(8500); // $85
    expect(alice.netBalanceCents).toBe(1000); // +$10
  });

  test("handles players with no transactions", () => {
    const players = [createPlayer("1", "Alice")];
    const transactions: Transaction[] = [];

    const balances = calculatePlayerBalances(players, transactions);

    expect(balances[0].totalBuyInCents).toBe(0);
    expect(balances[0].totalCashOutCents).toBe(0);
    expect(balances[0].netBalanceCents).toBe(0);
  });
});

// ============================================
// Game Balance Validation Tests
// ============================================

describe("validateGameBalance", () => {
  test("validates balanced game", () => {
    const balances: PlayerBalance[] = [
      {
        playerId: "1",
        playerName: "Alice",
        totalBuyInCents: 10000,
        totalCashOutCents: 18000,
        netBalanceCents: 8000,
      },
      {
        playerId: "2",
        playerName: "Bob",
        totalBuyInCents: 20000,
        totalCashOutCents: 12000,
        netBalanceCents: -8000,
      },
    ];

    const result = validateGameBalance(balances);

    expect(result.isValid).toBe(true);
    expect(result.totalBuyIns).toBe(30000);
    expect(result.totalCashOuts).toBe(30000);
    expect(result.difference).toBe(0);
  });

  test("detects unbalanced game - more cash out than buy in", () => {
    const balances: PlayerBalance[] = [
      {
        playerId: "1",
        playerName: "Alice",
        totalBuyInCents: 10000,
        totalCashOutCents: 15000,
        netBalanceCents: 5000,
      },
    ];

    const result = validateGameBalance(balances);

    expect(result.isValid).toBe(false);
    expect(result.difference).toBe(5000);
  });
});

// ============================================
// Settlement Algorithm Tests
// ============================================

describe("settleBalances", () => {
  test("simple two-player settlement", () => {
    const balances: PlayerBalance[] = [
      {
        playerId: "1",
        playerName: "Alice",
        totalBuyInCents: 10000,
        totalCashOutCents: 18000,
        netBalanceCents: 8000, // receives $80
      },
      {
        playerId: "2",
        playerName: "Bob",
        totalBuyInCents: 20000,
        totalCashOutCents: 12000,
        netBalanceCents: -8000, // pays $80
      },
    ];

    const settlements = settleBalances(balances);

    expect(settlements).toHaveLength(1);
    expect(settlements[0]).toEqual({
      from: "Bob",
      to: "Alice",
      amountCents: 8000,
    });
  });

  test("excludes zero-balance players from settlement", () => {
    const balances: PlayerBalance[] = [
      {
        playerId: "1",
        playerName: "Alice",
        totalBuyInCents: 10000,
        totalCashOutCents: 18000,
        netBalanceCents: 8000,
      },
      {
        playerId: "2",
        playerName: "Bob",
        totalBuyInCents: 20000,
        totalCashOutCents: 12000,
        netBalanceCents: -8000,
      },
      {
        playerId: "3",
        playerName: "Charlie",
        totalBuyInCents: 5000,
        totalCashOutCents: 5000,
        netBalanceCents: 0, // Should be excluded
      },
    ];

    const settlements = settleBalances(balances);

    expect(settlements).toHaveLength(1);
    expect(settlements.every((s) => s.from !== "Charlie")).toBe(true);
    expect(settlements.every((s) => s.to !== "Charlie")).toBe(true);
  });

  test("multi-player settlement with minimum transactions", () => {
    // 4 players:
    // Alice: +$100 (receives)
    // Bob: +$50 (receives)
    // Charlie: -$80 (pays)
    // Dave: -$70 (pays)
    const balances: PlayerBalance[] = [
      {
        playerId: "1",
        playerName: "Alice",
        totalBuyInCents: 0,
        totalCashOutCents: 10000,
        netBalanceCents: 10000,
      },
      {
        playerId: "2",
        playerName: "Bob",
        totalBuyInCents: 0,
        totalCashOutCents: 5000,
        netBalanceCents: 5000,
      },
      {
        playerId: "3",
        playerName: "Charlie",
        totalBuyInCents: 8000,
        totalCashOutCents: 0,
        netBalanceCents: -8000,
      },
      {
        playerId: "4",
        playerName: "Dave",
        totalBuyInCents: 7000,
        totalCashOutCents: 0,
        netBalanceCents: -7000,
      },
    ];

    const settlements = settleBalances(balances);

    // Verify all settlements are valid
    expect(settlements.length).toBeLessThanOrEqual(3); // At most n-1 transactions for n non-zero players

    // Verify total amounts are correct
    const totalPaid = settlements.reduce((sum, s) => sum + s.amountCents, 0);
    // In a balanced game, this should equal total credits
    expect(totalPaid).toBe(15000);

    // Verify each debtor pays their full amount
    const charliePayments = settlements
      .filter((s) => s.from === "Charlie")
      .reduce((sum, s) => sum + s.amountCents, 0);
    expect(charliePayments).toBe(8000);

    const davePayments = settlements
      .filter((s) => s.from === "Dave")
      .reduce((sum, s) => sum + s.amountCents, 0);
    expect(davePayments).toBe(7000);
  });

  test("handles empty balances", () => {
    const settlements = settleBalances([]);
    expect(settlements).toEqual([]);
  });

  test("handles all zero balances", () => {
    const balances: PlayerBalance[] = [
      {
        playerId: "1",
        playerName: "Alice",
        totalBuyInCents: 5000,
        totalCashOutCents: 5000,
        netBalanceCents: 0,
      },
      {
        playerId: "2",
        playerName: "Bob",
        totalBuyInCents: 5000,
        totalCashOutCents: 5000,
        netBalanceCents: 0,
      },
    ];

    const settlements = settleBalances(balances);
    expect(settlements).toEqual([]);
  });
});

// ============================================
// Currency Parsing Tests
// ============================================

describe("parseToCents", () => {
  test("parses simple numbers", () => {
    expect(parseToCents("50")).toBe(5000);
    expect(parseToCents("100")).toBe(10000);
    expect(parseToCents("1")).toBe(100);
  });

  test("parses decimals", () => {
    expect(parseToCents("50.50")).toBe(5050);
    expect(parseToCents("100.25")).toBe(10025);
    expect(parseToCents("0.50")).toBe(50);
  });

  test("parses with dollar sign", () => {
    expect(parseToCents("$50")).toBe(5000);
    expect(parseToCents("$100.50")).toBe(10050);
  });

  test("handles whitespace", () => {
    expect(parseToCents(" 50 ")).toBe(5000);
    expect(parseToCents("$ 50")).toBe(5000);
  });

  test("rejects invalid input", () => {
    expect(parseToCents("")).toBeNull();
    expect(parseToCents("abc")).toBeNull();
    expect(parseToCents("0")).toBeNull();
    expect(parseToCents("-50")).toBeNull();
  });
});

describe("formatCurrency", () => {
  test("formats cents to dollars", () => {
    expect(formatCurrency(5000)).toBe("$50.00");
    expect(formatCurrency(10025)).toBe("$100.25");
    expect(formatCurrency(50)).toBe("$0.50");
  });

  test("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  test("handles negative amounts", () => {
    expect(formatCurrency(-5000)).toBe("-$50.00");
  });
});

