import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { WixClientContextProvider } from "@/context/wixContext";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "E-Commerce Application",
    description: "E-commerce application with Next.js and Wix",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <WixClientContextProvider>
                    <Navbar />
                    <Suspense>{children}</Suspense>
                    <Footer />
                </WixClientContextProvider>
            </body>
        </html>
    );
}
