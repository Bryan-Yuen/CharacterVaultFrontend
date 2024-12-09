"use client"; // Declare this as a client component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SuccessAlertIsOpenContextProvider from "@/contexts/ShowSuccessAlertContext";


const inter = Inter({ subsets: ["latin"] });

/*
export const metadata: Metadata = {
  title: "MyFapSheet",
  description: "Save your favorite pornstars",
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SuccessAlertIsOpenContextProvider>
          {children}
        </SuccessAlertIsOpenContextProvider>
      </body>
    </html>
  );
}
