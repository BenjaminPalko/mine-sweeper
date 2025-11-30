import { Bomb, FlagTriangleRight } from "lucide-react";
import type { Cell, Game as GameType } from "../types";
import { useEffect } from "react";

type Props = {
	game: GameType | null;
	cellOpen: (cell: Cell) => void;
	cellFlag: (cell: Cell) => void;
};

function cellIcon(cell: Cell) {
	if (cell.mined) {
		return <Bomb />;
	} else if (cell.opened) {
		return cell.danger > 0 && <p>{cell.danger}</p>;
	} else if (cell.flagged) {
		return <FlagTriangleRight />;
	} else {
		return "";
	}
}

const Game = function ({ game, cellOpen, cellFlag }: Props) {
	useEffect(() => {
		console.log(game);
	}, [game]);

	if (game == null) {
		return <></>;
	}

	// Had to use flex cause tailwind only loads explicitly defined classes,
	// when using dynamically defined classes it breaks and grid doesn't work rehehehe
	return (
		<>
			<div className="flex">
				{game.cells.map((col) => (
					<div className="flex flex-col">
						{col.map((cell) => (
							<button
								key={cell.id}
								disabled={cell.opened || game.state == "GO"}
								className="btn btn-square"
								onClick={(e) => {
									e.preventDefault();
									cellOpen(cell);
								}}
								onContextMenu={(e) => {
									e.preventDefault();
									cellFlag(cell);
								}}
							>
								{cellIcon(cell)}
							</button>
						))}
					</div>
				))}
			</div>
		</>
	);
};

export default Game;
