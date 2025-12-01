import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useCell, useGame } from "../hooks";
import Game from "./Game";

const GameWrapper = function () {
  const [params, setParams] = useSearchParams();

  // parse game id query string param to number
  const gameId = useMemo(() => {
    const id = Number(params.get("gameId"));
    return isNaN(id) ? undefined : id;
  }, [params]);

  const { game, newGame } = useGame(gameId);

  // if no game id was found on query string params, create game
  useEffect(() => {
    if (!params.get("gameId")) {
      if (game) {
        setParams({ gameId: String(game.id) });
      } else {
        newGame({ width: 9, height: 9, mines: 10 });
      }
    }
  }, [params, setParams, game, newGame]);

  // if (q.s.p) game id is not set/does not equal our game details, set the query string param
  useEffect(() => {
    if (game && game.id != gameId) {
      setParams({
        gameId: String(game.id),
      });
    }
  }, [gameId, game, setParams]);

  const { open, flag } = useCell();

  if (!game) {
    return <div>Creating game...</div>;
  }

  return (
    <div className="relative h-fit w-fit mx-auto mt-16">
      <p className="absolute top-0 right-2">Game Id: {game?.id}</p>

      <div className="bg-base-300 rounded-box p-8 flex flex-col gap-4">
        <h1 className="text-2xl text-center">
          Minesweeper <span className="text-sm">(By Benjamin)</span>
        </h1>

        <div className="flex items-center">
          <span className="text-lg">Timer: 00:00</span>
          <div className="flex-1" />
          <button className="btn btn-primary">New Game</button>
        </div>

        <Game
          game={game}
          cellOpen={(cell) => open({ gameId: game.id, cellId: cell.id })}
          cellFlag={(cell) => flag({ gameId: game.id, cellId: cell.id })}
        />
      </div>
    </div>
  );
};

export default GameWrapper;
