"use client";

import { useState } from "react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    } else {
      setStatus("success");
      setEmail("");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a1628",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
      color: "#e8f2f9",
    }}>

      {/* Logo */}
      <img src="/Logo-Dark.png" alt="NewBi" style={{ width: 220, marginBottom: "1.75rem" }} />

      {/* Badge */}
      <span style={{
        display: "inline-block",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#45c97a",
        background: "rgba(69, 201, 122, 0.12)",
        border: "1px solid rgba(69, 201, 122, 0.25)",
        padding: "0.3rem 0.85rem",
        borderRadius: 999,
        marginBottom: "1.5rem",
      }}>
        Under Construction
      </span>

      <p style={{ fontSize: "1.05rem", color: "#7fa3be", marginBottom: "1.25rem" }}>
        Find trusted local services in Sheffield
      </p>

      {/* Divider */}
      <div style={{
        width: 40,
        height: 3,
        background: "linear-gradient(90deg, #45c97a, #3d88c4)",
        borderRadius: 999,
        margin: "0 auto 1.5rem",
      }} />

      <p style={{ fontSize: "0.95rem", color: "#4a6a85", lineHeight: 1.65, marginBottom: "2rem" }}>
        We're working on something great.<br />Be the first to know when we launch.
      </p>

      {/* Email form */}
      {status === "success" ? (
        <div style={{
          background: "rgba(69, 201, 122, 0.1)",
          border: "1px solid rgba(69, 201, 122, 0.25)",
          borderRadius: "0.875rem",
          padding: "0.875rem 1.5rem",
          color: "#45c97a",
          fontSize: "0.9rem",
          fontWeight: 600,
          maxWidth: 380,
        }}>
          You're on the list! We'll be in touch.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%", maxWidth: 400 }}>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1,
                background: "#091624",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e8f2f9",
                fontSize: "0.875rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                outline: "none",
                minWidth: 0,
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(69, 201, 122, 0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "linear-gradient(135deg, #45c97a, #3d88c4)",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 700,
                padding: "0.75rem 1.25rem",
                border: "none",
                borderRadius: "0.75rem",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                opacity: status === "loading" ? 0.6 : 1,
              }}
            >
              {status === "loading" ? "…" : "Notify me"}
            </button>
          </div>

          {status === "error" && (
            <p style={{ fontSize: "0.78rem", color: "#f87171", background: "rgba(248,113,113,0.1)", padding: "0.4rem 0.75rem", borderRadius: "0.5rem" }}>
              {message}
            </p>
          )}

          <p style={{ fontSize: "0.75rem", color: "#2d4a62" }}>
            No spam. We'll only email you when we launch.
          </p>
        </form>
      )}
    </div>
  );
}
