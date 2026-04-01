import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "NewBi — Find Local Service Providers in Sheffield",
  description: "Search and review local service providers in Sheffield. Hairdressers, nail techs, physiotherapists, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
