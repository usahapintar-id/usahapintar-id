"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || "Terjadi kendala pada aplikasi.",
    };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      const isQuota =
        this.state.errorMessage.toLowerCase().includes("quota exceeded");
      return (
        <div className="mx-auto my-12 max-w-lg rounded-2xl border border-ledger/30 bg-surface p-6 text-center shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-ledger/10 text-ledger">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">
            {isQuota
              ? "Batas Harian Database Tercapai"
              : "Ada Kendala Saat Memuat Data"}
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted">
            {isQuota
              ? "Kuota pembacaan harian database sedang penuh dan akan direset kembali besok."
              : "Silakan muat ulang halaman atau coba masuk kembali dengan akun Google Anda."}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, errorMessage: "" });
              window.location.reload();
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-forest-light"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
