import { QueryClient } from "@tanstack/react-query";

type WindowWithQueryClient = { __queryClient: QueryClient };

const globalWithQueryClient = window as unknown as WindowWithQueryClient;

export function getQueryClient(): QueryClient {
  if (globalWithQueryClient.__queryClient != null) {
    return globalWithQueryClient.__queryClient;
  }
  globalWithQueryClient.__queryClient = new QueryClient();
  return globalWithQueryClient.__queryClient;
}
