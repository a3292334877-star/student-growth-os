"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const PostHogAnalytics = dynamic(
  () => import("@/components/analytics/posthog").then((m) => m.PostHogAnalytics),
  { ssr: false },
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <PostHogAnalytics />
        </Suspense>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
