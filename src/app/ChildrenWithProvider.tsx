"use client"; // Declare this as a client component

import "./globals.css";
import SuccessAlertIsOpenContextProvider from "@/contexts/ShowSuccessAlertContext";

export default function ChildrenWithProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <SuccessAlertIsOpenContextProvider>
          {children}
        </SuccessAlertIsOpenContextProvider>
  );
}
