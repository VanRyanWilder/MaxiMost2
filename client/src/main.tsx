import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "./context/user-context";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="beastmode-theme">
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <App />
        </UserProvider>
      </QueryClientProvider>
      <Toaster />
    </TooltipProvider>
  </ThemeProvider>
);
