import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Chat SaaS - Chat with your PDFs using AI",
  description: "Upload your PDFs and chat with them using AI. Powered by LangChain, Gemini, and Vercel Blob.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
     signInUrl="/sign-in"
     signUpUrl="/sign-out"
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
