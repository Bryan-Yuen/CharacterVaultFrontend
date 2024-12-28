import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChildrenWithProvider from "./ChildrenWithProvider";
import { GoogleAnalytics, GoogleTagManager  } from "@next/third-parties/google";

/*
if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && process.env.NEXT_PUBLIC_ENVIRONMENT === "PRODUCTION") {
  throw new Error("no production google analytics id in production");
}
  */

if (!process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && process.env.NEXT_PUBLIC_ENVIRONMENT === "PRODUCTION") {
  throw new Error("no production google tag manager id in production");
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyFapSheet",
  description: "The place to save your favorite pornstars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ""} />
      <body className={inter.className}>
        <ChildrenWithProvider>{children}</ChildrenWithProvider>
      </body>
      {/*<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />*/ }
    </html>
  );
}
