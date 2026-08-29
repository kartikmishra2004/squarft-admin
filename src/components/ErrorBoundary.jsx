import { Component } from 'react';

// Without this, any uncaught error in a single component (e.g. a third-party
// script like Google Maps failing to initialize) takes down the entire app
// to a blank white screen with no way to recover except a hard refresh.
class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled error caught by ErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA] p-6">
                    <div className="max-w-sm text-center bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                        <h1 className="text-lg font-black text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-sm text-gray-500 font-medium mb-5">
                            This page ran into an unexpected error. Reloading usually fixes it.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-[#6F4BFF] hover:bg-[#5d3fe0]"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
