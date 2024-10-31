import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/app/context/SettingsContext";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Animation Votation",
  description: "",
};

export default function RootLayout({  children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es">
      <body>
        <SettingsProvider>
          <div className="flex flex-col w-full h-screen bg-slate-100">
            <Navbar />
            {children}
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}