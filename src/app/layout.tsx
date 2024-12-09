"use client";

import React from "react";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <SessionProvider>
            <ToastContainer
              position="bottom-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <AntdRegistry>{children}</AntdRegistry>
          </SessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
