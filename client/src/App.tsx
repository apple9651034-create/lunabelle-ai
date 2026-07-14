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
import TarotPage from "./pages/TarotPage";
import ConsultationHistoryPage from "./pages/ConsultationHistoryPage";
import MonthlyFortuneCalendar from "./pages/MonthlyFortuneCalendar";
import ChargePage from "./pages/ChargePage";
import SajuConsultationPage from "./pages/SajuConsultationPage";
import TarotConsultationPage from "./pages/TarotConsultationPage";
import YukConsultationPage from "./pages/YukConsultationPage";
import MyPageDashboard from "./pages/MyPageDashboard";
import MyTalismanVaultPage from "./pages/MyTalismanVaultPage";
import ConsultationBooking from "./pages/ConsultationBooking";
import ConsultationPaymentSuccess from "./pages/ConsultationPaymentSuccess";
function Router() {
  // make sure to consider if you need authentication for certain routes
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
        <Route path="/tarot" component={TarotPage} />
        <Route path="/history" component={ConsultationHistoryPage} />
        <Route path="/calendar" component={MonthlyFortuneCalendar} />
        <Route path="/charge" component={ChargePage} />
        <Route path="/saju-consultation" component={SajuConsultationPage} />
        <Route path="/tarot-consultation" component={TarotConsultationPage} />
        <Route path="/yuk-consultation" component={YukConsultationPage} />
        <Route path="/dashboard" component={MyPageDashboard} />
        <Route path="/vault" component={MyTalismanVaultPage} />
        <Route path="/consultation/:duration" component={ConsultationBooking} />
        <Route path="/consultation/success/:sessionId" component={ConsultationPaymentSuccess} />
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
