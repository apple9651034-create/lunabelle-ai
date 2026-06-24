/* AI 루나 — App.tsx
 * Design: Mystic Dark Luxury — dark theme default
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import ChatInterface from "./pages/ChatInterface";
import MyPage from "./pages/MyPage";
import WishesPage from "./pages/WishesPage";
import TalismanShop from "./pages/TalismanShop";
import YukPage from "./pages/YukPage";
import SajuPage from "./pages/SajuPage";
import SupportPage from "./pages/SupportPage";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/chat" component={ChatInterface} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/wishes" component={WishesPage} />
        <Route path="/shop" component={TalismanShop} />
        <Route path="/yuk" component={YukPage} />
        <Route path="/saju" component={SajuPage} />
        <Route path="/support" component={SupportPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
