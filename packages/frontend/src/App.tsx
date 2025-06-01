import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarketsPage from './pages/MarketsPage';
import EconomicPage from './pages/EconomicPage';
import FinancialStabilityPage from './pages/FinancialStabilityPage';
import IndicatorDetailPage from './pages/IndicatorDetailPage';

function App() {
  // You might add context providers (e.g., for theme, data) here later
  // For now, just render the main dashboard page

  return (
    // Apply dark mode class to the root div or body if needed,
    // or manage it via a context and apply to a higher-level component.
    // Tailwind's dark mode is set up to use the 'dark' class on the HTML element by default.
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto p-4 pt-0">
        <Routes>
          <Route path="/" element={<MarketsPage />} />
          <Route path="/series/:seriesId" element={<IndicatorDetailPage />} />
          <Route path="/crypto/:seriesId" element={<IndicatorDetailPage />} />
          <Route path="/economic" element={<EconomicPage />} />
          <Route path="/stability" element={<FinancialStabilityPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;