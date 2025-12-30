import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/NotFound";
import DiscoveryHome from "@/pages/desktop/DiscoveryHome";
import ArchivePage from "@/pages/desktop/ArchivePage";
import SpeciesDetailPage from "@/pages/desktop/SpeciesDetailPage";
import MapPage from "@/pages/desktop/MapPage";
import LabPage from "@/pages/desktop/LabPage";
import RecipesPage from "@/pages/desktop/RecipesPage";
import RecipeDetailPage from "@/pages/desktop/RecipeDetailPage";
import NewsPage from "@/pages/desktop/NewsPage";
import NewsDetailPage from "@/pages/desktop/NewsDetailPage";
import ProfilePage from "@/pages/desktop/ProfilePage";
import MobileUploadPage from "@/pages/MobileUploadPage";
import { AuthProvider } from "@/contexts/authContext";
import { UserProgressProvider } from "@/contexts/UserProgressContext";
import OnboardingTour from "@/components/desktop/OnboardingTour";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <UserProgressProvider>
            <Sonner />
            <HashRouter>
              <Routes>
                <Route path="/" element={<DiscoveryHome />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/archive/:id" element={<SpeciesDetailPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/lab" element={<LabPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/upload/:sessionId" element={<MobileUploadPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <OnboardingTour />
            </HashRouter>
          </UserProgressProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
