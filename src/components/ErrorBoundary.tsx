import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Game crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <h1 className="text-2xl font-bold text-neon-red">Something went wrong</h1>
          <p className="text-sm text-gray-400">{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md border border-neon-green px-4 py-2 text-neon-green hover:bg-neon-green/10"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
