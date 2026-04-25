import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Last-resort safety net: if React never mounts, show a visible error
window.onerror = (_msg, _src, _line, _col, err) => {
  const root = document.getElementById("root");
  if (root && root.childElementCount <= 1) {
    const msg = err?.message ?? String(_msg ?? "Unknown error");
    root.innerHTML = `
      <div style="min-height:100vh;background:#0f172a;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;padding:2rem;text-align:center;">
        <div style="background:#1e293b;border:1px solid #334155;border-radius:1rem;padding:2.5rem;max-width:420px;">
          <div style="font-size:2rem;margin-bottom:1rem;">🛡️</div>
          <h1 style="color:#f1f5f9;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem;">ReliefConnect</h1>
          <p style="color:#ef4444;font-size:0.875rem;margin:0 0 1.5rem;">${msg}</p>
          <button onclick="window.location.reload()" style="background:#3b82f6;color:white;border:none;border-radius:0.5rem;padding:0.625rem 1.5rem;font-size:0.875rem;font-weight:600;cursor:pointer;">Retry</button>
        </div>
      </div>`;
  }
};

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "1rem",
              padding: "2.5rem",
              maxWidth: "420px",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
            <h1
              style={{
                color: "#f1f5f9",
                fontSize: "1.25rem",
                fontWeight: "700",
                margin: "0 0 0.5rem",
              }}
            >
              ReliefConnect
            </h1>
            <p
              style={{
                color: "#ef4444",
                fontSize: "0.875rem",
                margin: "0 0 1.5rem",
              }}
            >
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, retryDelay: 1000 },
  },
});

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
