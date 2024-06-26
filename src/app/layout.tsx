"use client"

import { Inter } from "next/font/google";
import { ToasterProvider } from "@/providers/toasterProvider";
import { SupabaseProvider } from "@/providers/supabaseProvider";
import UserContextProvider from "@/providers/userContextProvider";
import { ModalProvider } from "@/providers/modalProvider";
import { AuthModal } from "@/features/auth-modal/AuthModal";
import { QueryClient, QueryClientProvider } from 'react-query'
import BusinessContextProvider, { BusinessContext } from "@/providers/businessContextProvider";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import CityContextProvider from "@/providers/cityContextProvider";


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
              <CityContextProvider>
                <BusinessContextProvider>
                  <ModalProvider />
                  <AuthModal />
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </BusinessContextProvider>
              </CityContextProvider>
            </UserContextProvider>
          </QueryClientProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
