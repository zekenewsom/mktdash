import React from 'react';

interface State {
  hasError: boolean;
  message?: string;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] UI crash captured:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-6 bg-red-50 text-red-800">
          <h1 className="text-xl font-semibold">Dashboard crashed</h1>
          <p className="mt-2 text-sm">A recoverable UI error occurred. Please refresh the page.</p>
          {this.state.message && <p className="mt-2 text-xs opacity-80">{this.state.message}</p>}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
