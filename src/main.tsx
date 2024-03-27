import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Dashboard } from "@/components/layout";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Dashboard />
    <Toaster />
  </React.StrictMode>,
);
