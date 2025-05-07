import { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';

function App() {
  // You might add context providers (e.g., for theme, data) here later
  // For now, just render the main dashboard page

  return (
    // Apply dark mode class to the root div or body if needed,
    // or manage it via a context and apply to a higher-level component.
    // Tailwind's dark mode is set up to use the 'dark' class on the HTML element by default.
    <div className="min-h-screen bg-background text-foreground">
      <DashboardPage />
    </div>
  );
}

export default App;