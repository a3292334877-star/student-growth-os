"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    posthog?: {
      init: (key: string, config: Record<string, unknown>) => void;
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (id: string, properties?: Record<string, unknown>) => void;
      reset: () => void;
    };
  }
}

export function PostHogAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key || !host) return;

    // Load PostHog script
    const script = document.createElement("script");
    script.src = `${host}/static/array.js`;
    script.async = true;
    script.onload = () => {
      if (window.posthog) {
        window.posthog.init(key, {
          api_host: host,
          capture_pageview: false,
          persistence: "localStorage",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.posthog && pathname) {
      window.posthog.capture("$pageview", {
        path: pathname,
        search: searchParams?.toString() || "",
      });
    }
  }, [pathname, searchParams]);

  return null;
}
