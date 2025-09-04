import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { createResponseError } from "./response-utils";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Clone the response to prevent "body stream already read" errors
    const error = await createResponseError(res.clone());
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // Clone the response before checking if it's ok to prevent stream consumption
  const clonedRes = res.clone();
  await throwIfResNotOk(clonedRes);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    // Clone the response before error checking to prevent stream consumption
    const clonedRes = res.clone();
    await throwIfResNotOk(clonedRes);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
