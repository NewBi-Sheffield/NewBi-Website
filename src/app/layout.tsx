import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "NewBi — Find Local Service Providers in Sheffield",
  description: "Search and review local service providers in Sheffield. Hairdressers, nail techs, physiotherapists, and more.",
  icons: {
    icon: "/Logo%20full.png",
    apple: "/Logo%20full.png",
  },
  openGraph: {
    title: "NewBi — Find Local Service Providers in Sheffield",
    description: "Search and review local service providers in Sheffield. Hairdressers, nail techs, physiotherapists, and more.",
    images: [{ url: "/Logo%20full.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewBi — Find Local Service Providers in Sheffield",
    description: "Search and review local service providers in Sheffield. Hairdressers, nail techs, physiotherapists, and more.",
    images: ["/Logo%20full.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Faunces:ital,opsz,wght@0,6..72,100..900;1,6..72,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: "url('/beauty-bg.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "500px 800px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <AuthProvider>{children}</AuthProvider>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
