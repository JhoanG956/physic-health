"use client"

import { ChatInterface } from "@/components/chat/chat-interface"
import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default function ChatPage() {
  return (
    <main className="relative z-10 min-h-screen w-full bg-background text-foreground px-4 py-6 md:px-8 lg:px-12">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Asistente de Fisioterapia
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat personalizado para tus necesidades clínicas y ejercicios.
        </p>
      </motion.div>

      <section className="max-w-6xl mx-auto h-[calc(100vh-10rem)]">
        <ChatInterface />
      </section>
    </main>
  )
}