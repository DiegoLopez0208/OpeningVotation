import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/app/context/SettingsContext";
import Navbar from "./components/Navbar";
import DataContextProvider from "./context/DataContext";

export const metadata: Metadata = {
  title: "Animation Votation",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <SettingsProvider>
          <DataContextProvider>
            <Navbar />
            {children}
          </DataContextProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
