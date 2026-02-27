import DashboardPage from './pages/DashboardPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // You might add context providers (e.g., for theme, data) here later
  // For now, just render the main dashboard page

  return (
    // Apply dark mode class to the root div or body if needed,
    // or manage it via a context and apply to a higher-level component.
    // Tailwind's dark mode is set up to use the 'dark' class on the HTML element by default.
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardPage />
      </div>
    </ErrorBoundary>
  );
}

export default App;