import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-serif text-[#FFFFFF] mb-4">Something went wrong</h1>
          <p className="text-gray-400 font-sans text-sm max-w-md mb-8 leading-relaxed">
            We apologize for the inconvenience. An unexpected error has occurred in the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#D4AF37] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
