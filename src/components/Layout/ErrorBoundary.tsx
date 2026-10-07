import React from 'react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Never log PII; error object only in dev console
    if (import.meta.env.DEV) {
      console.error('Route render error:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center" role="alert">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-gray-600">Please refresh the page or go back home.</p>
          <a href="/" className="mt-6 inline-block rounded-lg bg-primary-600 px-5 py-2.5 font-semibold text-white">
            Go home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
