import { useSearchParams } from "react-router";
import { useGame } from "./hooks";
import { useEffect } from "react";
import Game from "./components/Game";
import type { Cell } from "./types";

function App() {
	const [params, setParams] = useSearchParams();
	const { game, newGame } = useGame(params.get("gameId") ?? undefined);

	useEffect(() => {
		if (!game) {
			newGame({ width: 9, height: 9, mines: 10 });
		} else {
			setParams({ gameId: game.id });
		}
	}, [game, newGame, setParams]);

	function openCell(cell: Cell) {
		console.log(`Open cell ${cell.id}`);
	}

	function flagCell(cell: Cell) {
		console.log(`Flag cell ${cell.id}`);
	}

	return (
		<div className="min-h-screen min-w-screen">
			<div className="flex">
				<h1>Game Id: {game?.id}</h1>
			</div>
			<Game game={game} cellOpen={openCell} cellFlag={flagCell} />
		</div>
	);
}

export default App;
