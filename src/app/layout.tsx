import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import { SidebarProvider } from "@/context/SidebarContext";
import { AlertProvider } from "@/context/AlertContext";
import { AuthProvider } from "@/features/auth";
import { LoadingProvider } from "@/context/LoadingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking Room",
  description: "App For Booking Room",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SidebarProvider>
            <AlertProvider>
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </AlertProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
