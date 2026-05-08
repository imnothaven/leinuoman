import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <span className="error-boundary-icon">⚠️</span>
            <h3>出错了</h3>
            <p>页面遇到了一些问题，请尝试刷新或重试。</p>
            {this.props.fallback || (
              <button className="btn btn-primary" onClick={this.handleRetry}>
                重试
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
