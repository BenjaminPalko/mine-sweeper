import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useCell, useGame, useTimer } from "../hooks";
import Game from "./Game";
import { Smile } from "lucide-react";

const defaultGame = { width: 9, height: 9, mines: 10 };

const GameWrapper = function () {
  const [params, setParams] = useSearchParams();

  // parse game id query string param to number
  const gameId = useMemo(() => {
    const id = Number(params.get("gameId"));
    return isNaN(id) ? undefined : id;
  }, [params]);

  const { game, newGame } = useGame({ id: gameId });
  const { open, flag } = useCell();
  const { start, stop, running, reset, minutes, seconds } = useTimer();

  function windowFocusChange(e: FocusEvent) {
    if (e.currentTarget == null) {
      console.log("window unfocused");
    }
  }

  useEffect(() => {
    window.addEventListener("focus", windowFocusChange);
    return () => window.removeEventListener("focus", windowFocusChange);
  }, []);

  // if no game id was found on query string params, create game
  useEffect(() => {
    if (!params.get("gameId")) {
      if (game) {
        setParams({ gameId: String(game.id) });
      } else {
        newGame(defaultGame);
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

  if (!game) {
    return <div>Creating game...</div>;
  }

  return (
    <div className="relative h-fit w-fit mx-auto mt-16">
      <p className="absolute top-1 right-2">Game Id: {game?.id}</p>

      <div className="bg-base-200 border-2 border-base-300 rounded-box p-8 flex flex-col gap-4">
        <h1 className="text-2xl text-center">
          Minesweeper <span className="text-sm">(By Benjamin)</span>
        </h1>

        <div className="flex items-center justify-between">
          <span className="text-lg border rounded p-2 border-secondary text-secondary font-mono bg-base-200">
            {game.mines.toString().padStart(3, "0")}
          </span>

          <button
            className="btn btn-outline btn-primary"
            onClick={() => {
              reset();
              newGame(defaultGame);
            }}
          >
            <Smile />
          </button>
          <span className="text-lg border rounded p-2 border-secondary text-secondary font-mono bg-base-200">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <Game
          game={game}
          cellOpen={(cell) => {
            if (!running) start();
            open({ gameId: game.id, cellId: cell.id });
          }}
          cellFlag={(cell) => {
            if (!running) start();
            flag({ gameId: game.id, cellId: cell.id });
          }}
        />
      </div>
    </div>
  );
};

export default GameWrapper;
