import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';

interface FallbackProps {
  message: string;
  onRetry?: () => void;
}

function ErrorFallback({ message, onRetry }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <Card glass className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[rgba(255,77,79,0.1)] text-danger-text">
          <AlertTriangle size={28} aria-hidden />
        </span>
        <div>
          <h1 className="text-[1.15rem] font-bold text-text">Something went wrong</h1>
          <p className="mt-1.5 text-[0.88rem] text-muted">{message}</p>
        </div>
        <div className="flex gap-3">
          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
          <Button variant="ghost" size="sm" href={ROUTES.home}>
            Go home
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Top-level catch-all for render errors that escape every route-level
 * boundary (e.g. thrown from a Context provider wrapping the router
 * itself). Class components are the only way to implement
 * `componentDidCatch` — there is no hook equivalent — so this is a
 * deliberate, singular exception to this codebase's function-component
 * convention.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback message={this.state.error.message || 'An unexpected error occurred.'} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

/** React Router's `errorElement` counterpart — catches errors thrown during
 * a route's render/lazy-import/loader, scoped to that route branch. */
export function RouteErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';

  return <ErrorFallback message={message} />;
}
