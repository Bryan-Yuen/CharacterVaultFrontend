import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChildrenWithProvider from "./ChildrenWithProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

if (!process.env.NEXT_PUBLIC_PRODUCTION_GOOGLE_ANALYTICS_ID && process.env.NEXT_PUBLIC_ENVIRONMENT === "PRODUCTION") {
  throw new Error("no production ga id");
}

if (!process.env.NEXT_PUBLIC_DEVELOPMENT_GOOGLE_ANALYTICS_ID && process.env.NEXT_PUBLIC_ENVIRONMENT !== "PRODUCTION") {
  throw new Error("no development ga id");
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyFapSheet",
  description: "The place to save your favorite pornstars",
};

const gaId =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "PRODUCTION"
    ? process.env.NEXT_PUBLIC_PRODUCTION_GOOGLE_ANALYTICS_ID || ""
    : process.env.NEXT_PUBLIC_DEVELOPMENT_GOOGLE_ANALYTICS_ID || "";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChildrenWithProvider>{children}</ChildrenWithProvider>
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
