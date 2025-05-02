"use client"

import { ChatInterface } from "@/components/chat/chat-interface"
import { motion } from "framer-motion"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold mb-2 text-deep-blue dark:text-slate-100">Chat de Fisioterapia</h1>
        <p className="text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
          Conversa con nuestro asistente de IA para recibir recomendaciones personalizadas y resolver tus dudas sobre
          fisioterapia.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute -top-10 -right-10 h-20 w-20 blob-shape bg-mint/20 dark:bg-mint/10 animate-float hidden md:block" />
        <div
          className="absolute -bottom-10 -left-10 h-16 w-16 blob-shape bg-sky-blue/20 dark:bg-sky-blue/10 animate-float hidden md:block"
          style={{ animationDelay: "1s" }}
        />
        <ChatInterface />
      </div>
    </div>
  )
}
