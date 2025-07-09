import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
// UserProvider import removed as App.tsx now handles UserContext.Provider
import { CoachProvider } from "./context/CoachContext"; // Import CoachProvider

// Register service worker for PWA - Temporarily Disabled
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(registration => {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       })
//       .catch(error => {
//         console.log('ServiceWorker registration failed: ', error);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="maximost-theme">
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <CoachProvider> {/* Added CoachProvider wrapper */}
          {/* UserProvider wrapper removed, App now provides UserContext */}
          <App />
        </CoachProvider>
      </QueryClientProvider>
      <Toaster />
    </TooltipProvider>
  </ThemeProvider>
);
