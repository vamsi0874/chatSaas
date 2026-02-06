"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { FileText, MessageSquare, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <FileText className="h-16 w-16 text-primary" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Upload your PDFs and chat with them using AI
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Powered by LangChain, Gemini, and Vercel Blob. 
            Ask questions, get insights, and unlock the knowledge in your documents.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg">
                Get Started
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="text-lg">
                Sign In
              </Button>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            <div className="p-6 rounded-lg bg-white shadow-lg">
              <FileText className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Upload PDFs</h3>
              <p className="text-muted-foreground">
                Drag and drop your PDF files. We'll process them securely in the cloud.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-lg">
              <Sparkles className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Our AI understands your documents and can answer any questions about them.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-lg">
              <MessageSquare className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Natural Conversations</h3>
              <p className="text-muted-foreground">
                Chat naturally with your PDFs. Get instant, context-aware responses.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
