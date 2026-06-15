import { Component } from "react";

/**
 * Catches render-time errors anywhere in the tree and shows a branded recovery
 * screen instead of React unmounting everything into a blank white page.
 * Error boundaries must be class components.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log so it shows up in the browser console / any error reporting.
    console.error("Uncaught render error:", error, info?.componentStack);
  }

  handleReload = () => {
    // Full reload clears the broken component state.
    window.location.reload();
  };

  handleHome = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffffc] px-4">
        <div className="text-center max-w-md">
          <span className="QurovaDEMO text-[#ff7f11] text-3xl">Tixwav</span>
          <h1 className="mt-6 text-xl font-semibold text-neutral-800">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            An unexpected error interrupted the page. Reloading usually fixes it.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="bg-[#ff7f11] text-white px-5 py-2.5 rounded-xs text-sm font-semibold hover:bg-[#e66f00] transition-colors"
            >
              Reload page
            </button>
            <button
              onClick={this.handleHome}
              className="border border-neutral-200 text-neutral-600 px-5 py-2.5 rounded-xs text-sm font-semibold hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
