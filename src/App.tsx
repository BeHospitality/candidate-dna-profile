import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import ArchetypeReveal from "./pages/ArchetypeReveal";
import SharedResults from "./pages/SharedResults";
import ResumeAssessment from "./pages/ResumeAssessment";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import { retryPendingPayload } from "./utils/hubIntegration";

const queryClient = new QueryClient();

/** On mount: read ?path= and ?token= from URL, persist to localStorage */
const InitParams = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Path param
    const pathParam = params.get("path");
    const validPaths = ["starting", "growing", "returning", "advancing"];
    localStorage.setItem(
      "beconnect-path",
      validPaths.includes(pathParam || "") ? pathParam! : "growing"
    );

    // Token param (Hub magic-link flow)
    const token = params.get("token");
    if (token) {
      localStorage.setItem("beconnect-token", token);
    }
  }, []);
  return null;
};

const HubRetry = () => {
  useEffect(() => {
    retryPendingPayload();
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InitParams />
      <HubRetry />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assess" element={<Index />} />
          <Route path="/team" element={<Index />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/reveal" element={<ArchetypeReveal />} />
          <Route path="/results/:assessmentId" element={<SharedResults />} />
          <Route path="/resume/:token" element={<ResumeAssessment />} />
          <Route path="/privacy" element={<Privacy />} />
          
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
