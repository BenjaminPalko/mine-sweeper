import { useEffect } from "react";
import type { Cell, Game as GameType } from "../types";
import CellButton from "./CellButton";

type Props = {
  game: GameType;
  cellOpen: (cell: Cell) => void;
  cellFlag: (cell: Cell) => void;
};

const Game = function ({ game, cellOpen, cellFlag }: Props) {
  useEffect(() => {
    console.log(game);
  }, [game]);

  // Had to use flex cause tailwind only loads explicitly defined classes,
  // when using dynamically defined classes it breaks and grid doesn't work rehehehe
  return (
    <>
      <div className="flex bg-accent rounded">
        {game.cells.map((col) => (
          <div className="flex flex-col">
            {col.map((cell) => (
              <CellButton
                key={cell.id}
                cell={cell}
                open={() => cellOpen(cell)}
                flag={() => cellFlag(cell)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Game;
