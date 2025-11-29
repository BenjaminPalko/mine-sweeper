export type Cell = {
	id: string;
	opened: boolean;
	flagged: boolean;
	danger: number | null;
	mined: boolean | null;
};

type GameState = "PL" | "GO" | "WI";

export type Game = {
	id: string;
	state: GameState;
	width: number;
	height: number;
	mines: number;
	cells: Cell[][];
};
