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
      background: "#0e1821",
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
      <svg style={{ width: 110, height: 110, marginBottom: "1.75rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" x1="246.694" y1="240.656" x2="246.694" y2="330.84" id="cs-g3" gradientTransform="matrix(1, 0, 0, 1, -102.824549, -68.758758)">
            <stop offset="0" stopColor="rgb(165, 222, 87)"/>
            <stop offset="1" stopColor="rgb(18, 90, 64)"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" x1="203.042" y1="272.894" x2="203.042" y2="352.299" id="cs-g2" gradientTransform="matrix(1, 0, 0, 1, -102.824549, -68.758758)">
            <stop offset="0" stopColor="rgb(165, 222, 87)"/>
            <stop offset="1" stopColor="rgb(18, 90, 64)"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" x1="159.992" y1="307.783" x2="159.992" y2="358" id="cs-g1" gradientTransform="matrix(1, 0, 0, 1, -102.824549, -68.758758)">
            <stop offset="0" stopColor="rgb(165, 222, 87)"/>
            <stop offset="1" stopColor="rgb(18, 90, 64)"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" x1="248.145" y1="175.472" x2="248.145" y2="362.228" id="cs-g0" gradientTransform="matrix(0.948919, 0.597357, -0.575366, 0.913985, 91.632636, -195.756132)">
            <stop offset="0" stopColor="rgb(186, 218, 85)"/>
            <stop offset="1" stopColor="rgb(18, 90, 64)"/>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" x1="346.584" y1="69.791" x2="346.584" y2="189.761" id="cs-g4" gradientTransform="matrix(1.162833, 0, 0, 1.162833, -243.625228, -58.998284)">
            <stop offset="0" stopColor="rgb(11, 76, 67)"/>
            <stop offset="1" stopColor="rgb(207, 242, 98)"/>
          </linearGradient>
        </defs>
        <g transform="matrix(1, 0, 0, 1, 4.571205, -10.313158)">
          <path d="M 143.864 171.897 C 154.909 171.897 163.864 180.852 163.864 191.897 L 163.87 225.915 C 153.263 237.521 138.378 250.686 128.834 256.712 C 127.298 257.682 125.64 258.715 123.876 259.792 L 123.864 191.897 C 123.864 180.852 132.818 171.897 143.864 171.897 Z" style={{strokeWidth: 0, fill: "url(#cs-g3)"}}/>
          <path d="M 100.223 204.135 C 111.269 204.135 120.223 213.089 120.223 224.135 L 120.217 261.994 C 109.164 268.549 94.836 276.148 80.214 280.944 L 80.223 224.135 C 80.223 213.089 89.177 204.135 100.223 204.135 Z" style={{strokeWidth: 0, fill: "url(#cs-g2)"}}/>
          <path d="M 57.159 239.024 C 68.205 239.024 77.159 247.978 77.159 259.024 L 77.172 281.9 C 76.166 282.201 75.161 282.488 74.155 282.759 C 58.994 286.848 44.126 288.085 37.176 288.732 L 37.159 259.024 C 37.159 247.978 46.113 239.024 57.159 239.024 Z" style={{paintOrder: "fill", strokeWidth: 0, fill: "url(#cs-g1)"}}/>
          <path style={{fillRule: "nonzero", fill: "url(#cs-g0)", strokeLinecap: "round", paintOrder: "stroke", strokeWidth: 9}} d="M 257.721 171.356 C 257.721 171.356 234.24 166.315 234.125 166.88 C 234.01 167.445 229.745 193.86 205.802 230.514 C 198.234 242.1 186.205 252.734 173.836 262.716 C 161.466 272.698 147.756 281.311 133.829 286.702 C 119.183 292.371 98.107 298.742 73.188 298.46 C 48.269 298.178 33.245 295.063 33.137 294.344 C 33.029 293.625 53.333 293.398 74.192 287.772 C 95.051 282.146 116.147 269.76 128.871 261.725 C 139.665 254.91 157.292 238.962 167.834 226.466 C 178.376 213.97 197.933 179.697 199.917 161.017 C 199.983 160.394 178.11 156.047 176.555 155.667 C 175 155.287 226.332 111.713 226.332 111.713 L 257.721 171.356"/>
          <path style={{strokeWidth: 1.417, paintOrder: "stroke", strokeLinecap: "round", strokeLinejoin: "round", fill: "url(#cs-g4)", transformOrigin: "159.394px 91.91px"}} d="M 159.157 22.162 L 153.076 22.158 C 153.126 38.459 152.764 61.442 151.867 68.137 C 150.789 75.292 149.779 81.898 147.573 87.291 C 145.366 92.683 140.284 104.496 133.795 112.287 C 127.307 120.079 110.692 130.197 110.597 129.826 C 110.5 129.456 118.418 123.54 125.864 114.756 C 133.312 105.97 143.177 84.87 140.368 85.082 C 137.559 85.297 120.931 86.922 115.209 89.696 C 109.488 92.468 102.719 95.544 97.48 101.212 C 92.241 106.881 86.491 115.008 83.081 121.215 C 79.671 127.421 77.49 137.666 77.493 142.564 C 77.496 147.463 76.93 161.108 77.903 161.492 C 78.878 161.877 96.244 161.804 106.501 158.632 C 116.757 155.461 126.53 150.479 133.305 144.601 C 140.082 138.723 142.674 136.564 150.622 122.765 C 158.571 108.968 159.394 90.626 159.394 90.626 C 159.394 90.626 160.217 108.976 168.165 122.775 C 176.113 136.573 178.706 138.732 185.482 144.609 C 192.258 150.487 202.03 155.469 212.287 158.641 C 222.545 161.813 239.911 161.886 240.884 161.501 C 241.858 161.116 241.291 147.47 241.294 142.573 C 241.298 137.674 239.116 127.43 235.707 121.223 C 232.297 115.018 226.547 106.89 221.308 101.221 C 216.07 95.553 209.299 92.477 203.578 89.705 C 197.857 86.931 181.228 85.305 178.42 85.092 C 175.611 84.878 185.474 105.98 192.922 114.765 C 200.37 123.549 208.288 129.465 208.191 129.835 C 208.096 130.205 191.48 120.087 184.994 112.296 C 178.505 104.505 173.422 92.692 171.215 87.3 C 169.009 81.908 167.999 75.301 166.92 68.145 C 166.024 61.451 164.129 34.489 164.482 22.173 L 159.157 22.162 Z" transform="matrix(-1, 0, 0, -1, -0.000005, -0.000015)"/>
        </g>
      </svg>

      {/* Badge */}
      <span style={{
        display: "inline-block",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#a5de57",
        background: "rgba(165, 222, 87, 0.12)",
        border: "1px solid rgba(165, 222, 87, 0.25)",
        padding: "0.3rem 0.85rem",
        borderRadius: 999,
        marginBottom: "1.5rem",
      }}>
        Under Construction
      </span>

      {/* Title */}
      <h1 style={{
        fontSize: "clamp(2.4rem, 8vw, 3.5rem)",
        fontWeight: 900,
        letterSpacing: "-0.03em",
        background: "linear-gradient(135deg, #a5de57, #cff262)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "0.6rem",
      }}>
        NewBi
      </h1>

      <p style={{ fontSize: "1.05rem", color: "#7fa3be", marginBottom: "1.25rem" }}>
        Find trusted local services in Sheffield
      </p>

      {/* Divider */}
      <div style={{
        width: 40,
        height: 3,
        background: "linear-gradient(90deg, #125a40, #a5de57)",
        borderRadius: 999,
        margin: "0 auto 1.5rem",
      }} />

      <p style={{ fontSize: "0.95rem", color: "#4a6a85", lineHeight: 1.65, marginBottom: "2rem" }}>
        We're working on something great.<br />Be the first to know when we launch.
      </p>

      {/* Email form */}
      {status === "success" ? (
        <div style={{
          background: "rgba(165, 222, 87, 0.1)",
          border: "1px solid rgba(165, 222, 87, 0.25)",
          borderRadius: "0.875rem",
          padding: "0.875rem 1.5rem",
          color: "#a5de57",
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
              onFocus={e => (e.target.style.borderColor = "rgba(165, 222, 87, 0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "linear-gradient(135deg, #125a40, #a5de57)",
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
