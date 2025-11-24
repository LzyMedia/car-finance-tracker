import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JDM Finance Tracker - Car Enthusiast Finance App",
  description: "Track your savings, manage budgets, and find deals on car parts and mods. Built with 90s JDM aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
