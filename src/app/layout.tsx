import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "SIAR-C | Ciberseguridad",
  description: "Plataforma profesional de análisis de ciberseguridad",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
      </head>
      <body className="bg-[#0a0a0a] text-slate-100 min-h-screen font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
