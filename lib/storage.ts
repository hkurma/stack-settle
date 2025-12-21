// localStorage persistence layer for StackSettle
import type { Game } from "./types";

const STORAGE_KEY = "stacksettle_games";

/**
 * Get all games from localStorage
 */
export function getGames(): Game[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error("Failed to load games from localStorage");
    return [];
  }
}

/**
 * Save all games to localStorage
 */
export function saveGames(games: Game[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch {
    console.error("Failed to save games to localStorage");
  }
}

/**
 * Get a single game by ID
 */
export function getGame(id: string): Game | null {
  const games = getGames();
  return games.find((g) => g.id === id) || null;
}

/**
 * Save or update a single game
 */
export function saveGame(game: Game): void {
  const games = getGames();
  const index = games.findIndex((g) => g.id === game.id);

  if (index >= 0) {
    games[index] = game;
  } else {
    games.push(game);
  }

  saveGames(games);
}

/**
 * Delete a game by ID
 */
export function deleteGame(id: string): void {
  const games = getGames();
  const filtered = games.filter((g) => g.id !== id);
  saveGames(filtered);
}

/**
 * Get the active game (most recent ACTIVE game)
 */
export function getActiveGame(): Game | null {
  const games = getGames();
  const activeGames = games.filter((g) => g.status === "ACTIVE");
  
  if (activeGames.length === 0) return null;
  
  // Return the most recently created active game
  return activeGames.sort((a, b) => b.createdAt - a.createdAt)[0];
}

