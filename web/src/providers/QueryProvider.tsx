"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

// Sync strategy: the web app and the mobile app call the exact same REST API
// backed by the exact same MongoDB database - there is only ever one copy of
// any project/issue/comment. To make changes made on one client show up on
// the other without a manual refresh, every query here:
//   - refetches when the browser tab regains focus (refetchOnWindowFocus)
//   - refetches on network reconnect
//   - polls in the background at a short interval while a screen is open
// This gives near-real-time convergence (a few seconds) purely from the
// shared backend, with no additional infrastructure required. If instant
// (sub-second) push updates are needed later, a WebSocket/Socket.io layer
// can be added to the backend and consumed here without changing the data
// model or any of the screens.
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
