import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Dashboard } from "@/components/layout";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
    <Toaster />
    <SpeedInsights />
    <Analytics />
  </React.StrictMode>,
);
