import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        console.error('App Error Boundary caught an error:', error, info);
    }

    handleReset = () => {
        // Clear potentially corrupted localStorage caches that may have caused the crash
        try {
            localStorage.removeItem('social-tracker-messages-cache-v3');
            localStorage.removeItem('social-tracker-tasks-cache-v3');
        } catch { /* ignore */ }
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6">
                    <div className="text-center max-w-sm">
                        <div className="text-5xl mb-4">🌸</div>
                        <h2 className="text-xl font-bold text-[#2C2C2C] mb-2 tracking-wide">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-[#8B7E6E] mb-6 leading-relaxed">
                            There was an unexpected error. Please try refreshing the page.
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="px-6 py-3 bg-[#2C2C2C] text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#3C3C3C] transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
