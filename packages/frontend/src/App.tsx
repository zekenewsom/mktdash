import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import MarketsPage from './pages/MarketsPage';
import EconomicPage from './pages/EconomicPage';
import EconomicCalendarPage from './pages/EconomicCalendarPage';
import AnalysisPage from './pages/AnalysisPage';
import NewsPage from './pages/NewsPage';
import IndicatorDetailPage from './pages/IndicatorDetailPage';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <div className="container mx-auto px-4 pb-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/economic" element={<EconomicPage />} />
            <Route path="/calendar" element={<EconomicCalendarPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/series/:id" element={<IndicatorDetailPage />} />
            <Route path="/crypto/:id" element={<IndicatorDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
