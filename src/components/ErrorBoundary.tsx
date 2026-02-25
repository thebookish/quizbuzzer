import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0e14",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: "2rem",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <div
            style={{
              background: "#141b24",
              border: "1px solid rgba(255, 68, 68, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h1 style={{ color: "#ff4444", fontSize: "1.25rem", marginBottom: "1rem" }}>
              System Error
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Something went wrong. Please try refreshing the page.
            </p>
            <pre
              style={{
                color: "#ffb627",
                fontSize: "0.75rem",
                background: "#0a0e14",
                padding: "1rem",
                borderRadius: "8px",
                overflow: "auto",
                maxHeight: "200px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "1rem",
                background: "linear-gradient(135deg, #00d9ff, #0099bb)",
                color: "#0a0e14",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                fontWeight: "bold",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
