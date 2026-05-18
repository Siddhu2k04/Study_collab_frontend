import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex h-full items-center justify-center text-sm text-gray-300 px-4">
                    Something went wrong while loading the notes editor.
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
