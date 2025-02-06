import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChildrenWithProvider from "./ChildrenWithProvider";
import { GoogleTagManager } from "@next/third-parties/google";

/*
if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("no environment");
}
  */

if (
  !process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID &&
  process.env.NEXT_PUBLIC_ENVIRONMENT === "PRODUCTION"
) {
  throw new Error("no production google tag manager id in production");
}

const inter = Inter({ subsets: ["latin"] });

/*
export const metadata: Metadata = {
  title: "MyFapSheet",
  description: "The place to save your favorite pornstars",
  robots: {
    index:
      process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL_DEVELOPMENT" ||
      process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT"
        ? false
        : true,
    follow:
      process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL_DEVELOPMENT" ||
      process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT"
        ? false
        : true,
  },
};
*/

// no google tag manager for this website
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL_DEVELOPMENT" ||
      process.env.NEXT_PUBLIC_ENVIRONMENT === "DEVELOPMENT" ? (
        <></>
      ) : (
        <>
        {/*        <GoogleTagManager
          gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ""}
        />*/}
        </>
      )}
      <body className={inter.className}>
        <ChildrenWithProvider>{children}</ChildrenWithProvider>
      </body>
    </html>
  );
}
