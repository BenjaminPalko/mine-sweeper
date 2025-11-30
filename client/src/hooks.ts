import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Game } from "./types";
import { useEffect, useState } from "react";

export const useCell = function () {
	const { mutate: open } = useMutation({
		mutationFn: (args: { gameId: number; cellId: number }) =>
			axios.post(
				`http://localhost:8000/api/${args.gameId}/cell/${args.cellId}/open/`,
			),
	});

	const { mutate: flag } = useMutation({
		mutationFn: (args: { gameId: number; cellId: number }) =>
			axios.post(
				`http://localhost:8000/api/${args.gameId}/cell/${args.cellId}/flag/`,
			),
	});
	return { open, flag };
};

export const useGame = function (gameId?: string) {
	const [game, setGame] = useState<Game | null>(null);

	const { data, refetch } = useQuery({
		queryKey: ["game", gameId],
		queryFn: () => {
			if (gameId === undefined) {
				return undefined;
			}
			return axios
				.get<Game>(`http://localhost:8000/api/${gameId}/`)
				.then((response) => response.data);
		},
		enabled: false,
	});

	const { mutate } = useMutation({
		mutationFn: (args: { width: number; height: number; mines: number }) =>
			axios.post<Game>("http://localhost:8000/api/start/", args),
		onSuccess: ({ data }) => setGame(data),
	});

	return {
		game,
		refetch,
		newGame: mutate,
	};
};
