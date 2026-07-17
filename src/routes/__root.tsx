import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl tracking-[-0.02em] text-ink">404</h1>
        <p className="mt-4 text-warm-5">Page not found</p>
        <a
          href="/"
          className="mt-6 inline-block text-ink underline decoration-amber decoration-2 underline-offset-4"
        >
          Home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error("TanStack root error boundary", error);
  }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl tracking-[-0.02em] text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-warm-5">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-none bg-ink px-5 py-2 text-sm text-paper hover:bg-warm-5"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Qfloww — Editorial booking & queue management" },
      {
        name: "description",
        content:
          "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios.",
      },
      { property: "og:site_name", content: "Qfloww" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Qfloww — Editorial booking & queue management" },
      { name: "twitter:title", content: "Qfloww — Editorial booking & queue management" },
      {
        property: "og:description",
        content:
          "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios.",
      },
      {
        name: "twitter:description",
        content:
          "Branded booking pages, a live front-desk queue, and an owner view — one calm workflow for clinics, salons, and consulting studios.",
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2d693c79-8516-4181-955f-e6d1393a11b1",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2d693c79-8516-4181-955f-e6d1393a11b1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Qfloww",
              url: "https://qfloww.pridemarketing.co.in/",
              description:
                "Booking and queue management for clinics, salons, and consulting firms.",
            },
            {
              "@type": "WebSite",
              name: "Qfloww",
              url: "https://qfloww.pridemarketing.co.in/",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        queryClient.invalidateQueries();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
