import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside React tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200/60 p-8 max-w-lg w-full text-center relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-black" />

            <div className="flex justify-center mb-6">
              <span className="material-symbols-outlined text-red-600 text-6xl select-none">
                warning
              </span>
            </div>

            <h1 className="text-2xl font-bold font-headline text-slate-900 mb-3 tracking-tight">
              Something went wrong
            </h1>
            
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              We encountered an unexpected error on this page. Please try refreshing or returning to the home page.
            </p>

            {import.meta.env.MODE !== 'production' && this.state.error && (
              <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left border border-slate-200 overflow-x-auto max-h-40">
                <p className="text-xs font-mono text-red-700 font-semibold mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                <p className="text-[10px] font-mono text-slate-500 whitespace-pre">
                  {this.state.error.stack}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-all duration-200 border border-slate-200"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-black hover:bg-slate-900 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-sm"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
