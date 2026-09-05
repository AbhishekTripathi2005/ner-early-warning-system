import React from "react";
import "./globals.css";

export const metadata = {
  title: "NER Landslide Early Warning & Risk Monitoring System | SIH 2026",
  description: "Cloud-based GIS Early Warning System for North Eastern Region (MDoNER, SIH26001)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
