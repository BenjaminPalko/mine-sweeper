import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;

const Providers = function ({ children }: Props) {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default Providers;
