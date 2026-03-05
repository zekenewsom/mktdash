import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import MarketsPage from './pages/MarketsPage';
import EconomicPage from './pages/EconomicPage';
import EconomicCalendarPage from './pages/EconomicCalendarPage';
import AnalysisPage from './pages/AnalysisPage';
import NewsPage from './pages/NewsPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/economic" element={<EconomicPage />} />
          <Route path="/calendar" element={<EconomicCalendarPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
