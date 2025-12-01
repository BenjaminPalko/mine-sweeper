import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { Game } from "./types";

export function useTimer() {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  function start() {
    setRunning(true);
    if (intervalId) return;
    const interval = setInterval(() => setTimer((value) => value + 1), 1000);
    setIntervalId(interval);
  }

  function stop() {
    setRunning(false);
    if (intervalId) clearInterval(intervalId);
  }

  function reset() {
    setRunning(false);
    if (intervalId) clearInterval(intervalId);
    setTimer(0);
  }

  const minutes = useMemo(() => Math.floor(timer / 60), [timer]);
  const seconds = useMemo(() => Math.floor(timer % 60), [timer]);

  return {
    start,
    stop,
    reset,
    minutes,
    seconds,
    running,
  };
}

export function useGame({
  id,
  onNewGame,
}: {
  id?: number;
  onNewGame?: () => void;
}) {
  const [, setParams] = useSearchParams();

  const { data: game } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      return axios
        .get<Game>(`http://localhost:8000/api/${id}/`)
        .then((response) => response.data);
    },
    enabled: !!id,
  });

  const { mutate: newGame } = useMutation({
    mutationFn: (args: { width: number; height: number; mines: number }) =>
      axios
        .post<Game>("http://localhost:8000/api/start/", args)
        .then(({ data }) => data),
    onSuccess: (data) => {
      setParams({ gameId: String(data.id) });
      if (onNewGame) onNewGame();
    },
  });

  return { game, newGame };
}

export function useCell() {
  const queryClient = useQueryClient();

  const { mutate: open } = useMutation({
    mutationFn: (args: { gameId: number; cellId: number }) =>
      axios.post(
        `http://localhost:8000/api/${args.gameId}/cell/${args.cellId}/open`,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["game"] });
    },
  });

  const { mutate: flag } = useMutation({
    mutationFn: (args: { gameId: number; cellId: number }) =>
      axios.post(
        `http://localhost:8000/api/${args.gameId}/cell/${args.cellId}/flag`,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["game"] });
    },
  });

  return { open, flag };
}
