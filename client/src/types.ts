export type Cell = {
	id: string;
	flagged: boolean;
	mined: boolean | null;
} & ({ opened: false } | { opened: true; danger: number });

type GameState = "PL" | "GO" | "WI";

export type Game = {
	id: string;
	state: GameState;
	width: number;
	height: number;
	mines: number;
	cells: Cell[][];
};
