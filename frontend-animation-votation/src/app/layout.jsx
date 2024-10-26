
import "./globals.css";
import { ModeProvider } from "./context/ModeContext";


export const metadata = {
  title: "Animation Votation",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>
            <ModeProvider>
              {children}
            </ModeProvider>
        </body>
    </html>
  );
}

