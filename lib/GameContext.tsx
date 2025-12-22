"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type {
  Game,
  Player,
  Transaction,
  PlayerBalance,
  Settlement,
} from "./types";
import {
  generateId,
  calculatePlayerBalances,
  settleBalances,
  validateGameBalance,
} from "./settlement";
import { getGames, saveGame, deleteGame as removeGame } from "./storage";

// App state includes current game and game history
interface AppState {
  currentGame: Game | null;
  gameHistory: Game[];
  isLoading: boolean;
}

// Actions for the reducer
type Action =
  | { type: "LOAD_STATE"; games: Game[] }
  | { type: "CREATE_GAME"; game: Game }
  | { type: "LOAD_GAME"; gameId: string }
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; playerId: string }
  | {
      type: "ADD_TRANSACTION";
      playerId: string;
      amountCents: number;
      txType: "BUY_IN" | "CASH_OUT";
    }
  | { type: "REMOVE_TRANSACTION"; transactionId: string }
  | { type: "END_GAME" }
  | { type: "DELETE_GAME"; gameId: string }
  | { type: "BACK_TO_HOME" };

// Context value type
interface GameContextValue {
  state: AppState;
  createGame: (name: string) => string; // Returns game ID
  loadGame: (gameId: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  addTransaction: (
    playerId: string,
    amountCents: number,
    type: "BUY_IN" | "CASH_OUT"
  ) => void;
  removeTransaction: (transactionId: string) => void;
  endGame: () => void;
  deleteGame: (gameId: string) => void;
  backToHome: () => void;
  getPlayerBalances: () => PlayerBalance[];
  getSettlements: () => Settlement[];
  getGameById: (gameId: string) => Game | undefined;
  validateBalance: () => {
    isValid: boolean;
    totalBuyIns: number;
    totalCashOuts: number;
    difference: number;
  };
}

const initialState: AppState = {
  currentGame: null,
  gameHistory: [],
  isLoading: true,
};

function gameReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD_STATE": {
      // Don't auto-load any game - let user pick from the list
      return {
        currentGame: null,
        gameHistory: action.games,
        isLoading: false,
      };
    }

    case "CREATE_GAME": {
      return {
        ...state,
        currentGame: action.game,
        gameHistory: [...state.gameHistory, action.game],
      };
    }

    case "LOAD_GAME": {
      const game = state.gameHistory.find((g) => g.id === action.gameId);
      return {
        ...state,
        currentGame: game || null,
      };
    }

    case "ADD_PLAYER": {
      if (!state.currentGame) return state;
      const newPlayer: Player = {
        id: generateId(),
        name: action.name,
      };
      const updatedGame = {
        ...state.currentGame,
        players: [...state.currentGame.players, newPlayer],
      };
      return {
        ...state,
        currentGame: updatedGame,
        gameHistory: state.gameHistory.map((g) =>
          g.id === updatedGame.id ? updatedGame : g
        ),
      };
    }

    case "REMOVE_PLAYER": {
      if (!state.currentGame) return state;
      // Can't remove player with transactions
      const hasTransactions = state.currentGame.transactions.some(
        (t) => t.playerId === action.playerId
      );
      if (hasTransactions) return state;

      const updatedGame = {
        ...state.currentGame,
        players: state.currentGame.players.filter(
          (p) => p.id !== action.playerId
        ),
      };
      return {
        ...state,
        currentGame: updatedGame,
        gameHistory: state.gameHistory.map((g) =>
          g.id === updatedGame.id ? updatedGame : g
        ),
      };
    }

    case "ADD_TRANSACTION": {
      if (!state.currentGame) return state;
      const newTransaction: Transaction = {
        id: generateId(),
        playerId: action.playerId,
        amountCents: action.amountCents,
        type: action.txType,
        timestamp: Date.now(),
      };
      const updatedGame = {
        ...state.currentGame,
        transactions: [...state.currentGame.transactions, newTransaction],
      };
      return {
        ...state,
        currentGame: updatedGame,
        gameHistory: state.gameHistory.map((g) =>
          g.id === updatedGame.id ? updatedGame : g
        ),
      };
    }

    case "REMOVE_TRANSACTION": {
      if (!state.currentGame) return state;
      const updatedGame = {
        ...state.currentGame,
        transactions: state.currentGame.transactions.filter(
          (t) => t.id !== action.transactionId
        ),
      };
      return {
        ...state,
        currentGame: updatedGame,
        gameHistory: state.gameHistory.map((g) =>
          g.id === updatedGame.id ? updatedGame : g
        ),
      };
    }

    case "END_GAME": {
      if (!state.currentGame) return state;
      const updatedGame = {
        ...state.currentGame,
        status: "ENDED" as const,
        endedAt: Date.now(),
      };
      return {
        ...state,
        currentGame: updatedGame,
        gameHistory: state.gameHistory.map((g) =>
          g.id === updatedGame.id ? updatedGame : g
        ),
      };
    }

    case "DELETE_GAME": {
      const gameHistory = state.gameHistory.filter(
        (g) => g.id !== action.gameId
      );
      return {
        ...state,
        currentGame:
          state.currentGame?.id === action.gameId ? null : state.currentGame,
        gameHistory,
      };
    }

    case "BACK_TO_HOME": {
      return {
        ...state,
        currentGame: null,
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load games from localStorage on mount
  useEffect(() => {
    const games = getGames();
    dispatch({ type: "LOAD_STATE", games });
  }, []);

  // Persist current game to localStorage whenever it changes
  useEffect(() => {
    if (state.currentGame && !state.isLoading) {
      saveGame(state.currentGame);
    }
  }, [state.currentGame, state.isLoading]);

  const createGame = useCallback((name: string): string => {
    const gameId = generateId();
    const newGame: Game = {
      id: gameId,
      name,
      status: "ACTIVE",
      players: [],
      transactions: [],
      createdAt: Date.now(),
    };
    dispatch({ type: "CREATE_GAME", game: newGame });
    return gameId;
  }, []);

  const loadGame = useCallback((gameId: string) => {
    dispatch({ type: "LOAD_GAME", gameId });
  }, []);

  const addPlayer = useCallback((name: string) => {
    dispatch({ type: "ADD_PLAYER", name });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    dispatch({ type: "REMOVE_PLAYER", playerId });
  }, []);

  const addTransaction = useCallback(
    (playerId: string, amountCents: number, type: "BUY_IN" | "CASH_OUT") => {
      dispatch({
        type: "ADD_TRANSACTION",
        playerId,
        amountCents,
        txType: type,
      });
    },
    []
  );

  const removeTransaction = useCallback((transactionId: string) => {
    dispatch({ type: "REMOVE_TRANSACTION", transactionId });
  }, []);

  const endGame = useCallback(() => {
    dispatch({ type: "END_GAME" });
  }, []);

  const deleteGame = useCallback((gameId: string) => {
    removeGame(gameId);
    dispatch({ type: "DELETE_GAME", gameId });
  }, []);

  const backToHome = useCallback(() => {
    dispatch({ type: "BACK_TO_HOME" });
  }, []);

  const getPlayerBalances = useCallback((): PlayerBalance[] => {
    if (!state.currentGame) return [];
    return calculatePlayerBalances(
      state.currentGame.players,
      state.currentGame.transactions
    );
  }, [state.currentGame]);

  const getSettlements = useCallback((): Settlement[] => {
    const balances = getPlayerBalances();
    return settleBalances(balances);
  }, [getPlayerBalances]);

  const validateBalance = useCallback(() => {
    const balances = getPlayerBalances();
    return validateGameBalance(balances);
  }, [getPlayerBalances]);

  const getGameById = useCallback(
    (gameId: string): Game | undefined => {
      return state.gameHistory.find((g) => g.id === gameId);
    },
    [state.gameHistory]
  );

  const value: GameContextValue = {
    state,
    createGame,
    loadGame,
    addPlayer,
    removePlayer,
    addTransaction,
    removeTransaction,
    endGame,
    deleteGame,
    backToHome,
    getPlayerBalances,
    getSettlements,
    getGameById,
    validateBalance,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
