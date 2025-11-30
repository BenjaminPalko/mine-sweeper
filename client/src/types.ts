export type Cell = {
  id: number;
  flagged: boolean;
  mined: boolean | null;
} & ({ opened: false } | { opened: true; danger: number });

export type GameState = "PL" | "GO" | "WI";

export type Game = {
  id: number;
  state: GameState;
  width: number;
  height: number;
  mines: number;
  cells: Cell[][];
};
