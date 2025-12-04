// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from 'next/font/google';
import "./globals.css";

// Stylish font - more modern and professional
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BridgeIT",
  description: "Your platform for connecting academia and industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="BridgeIt - Connecting academia and industry." />
      </head>
      <body className="font-sans">
        
          <main>{children}</main>
  
      </body>
    </html>
  );
}
