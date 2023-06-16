import "./globals.css";
import { Inter } from "next/font/google";

export const runtime = "edge";
export const preferredRegion = "dub1";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PortAventura Waiting Times",
  description: "Waiting times for PortAventura Park attractions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
