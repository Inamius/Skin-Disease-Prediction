import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import ArchitecturePage from "./pages/Architecture";
import TournamentPage from "./pages/Tournament";
import DatasetPage from "./pages/Dataset";
import DocsPage from "./pages/Docs";
import HistoryPage from "./pages/History";
import MetricsPage from "./pages/Metrics";
import AssistantPage from "./pages/Assistant";
import ComparePage from "./pages/Compare";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="*" element={<NotFound />} />
        
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;