"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/providers/toasterProvider";
import { SupabaseProvider } from "@/providers/supabaseProvider";
import UserContextProvider from "@/providers/userContextProvider";
import { ModalProvider } from "@/providers/modalProvider";
import { AuthModal } from "@/components/auth-modal/AuthModal";
import { QueryClient, QueryClientProvider } from 'react-query'


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient()

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <QueryClientProvider client={queryClient}>
            <UserContextProvider>
              <ModalProvider />
              <AuthModal />
              {children}
            </UserContextProvider>
          </QueryClientProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
