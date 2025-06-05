"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, Paperclip, X } from "lucide-react"
import { motion } from "framer-motion"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechRecognitionEvent: any
  }
}

export function ChatInput({ onSend, isLoading, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = "es-ES"
      recognition.continuous = false
      recognition.interimResults = false
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const cleanedTranscript = transcript.replace(/(\b\w+\b)(?=\s+\1)/g, "")
        setInput((prev) => prev + cleanedTranscript)
      }
      recognition.onend = () => setIsRecording(false)
      recognitionRef.current = recognition
    } else {
      console.error("SpeechRecognition no está disponible en este navegador.")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleRecording = () => {
    if (disabled) return
    if (isRecording) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
    setIsRecording((prev) => !prev)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 p-4 shadow-xl"
    >
      <div className="flex gap-3 items-end">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          disabled={disabled}
          aria-label="Adjuntar archivo"
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Selecciona un paciente para comenzar" : "Escribe un mensaje..."}
            className="min-h-[3rem] max-h-40 pr-14 resize-none rounded-2xl bg-white dark:bg-slate-800/90 dark:text-white text-base placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-mint dark:focus-visible:ring-sky-blue border border-slate-300 dark:border-slate-600 w-full px-5 py-3 disabled:opacity-60"
            disabled={isLoading || disabled}
            aria-label="Área de texto para mensaje"
          />
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} className="absolute right-2 bottom-2">
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || disabled}
              className="rounded-full bg-mint text-white hover:bg-mint/90 dark:bg-mint/60 dark:hover:bg-mint/70 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleRecording}
          className={`rounded-full focus-visible:outline-none focus-visible:ring-2 ${
            isRecording
              ? "animate-pulse bg-red-500 text-white ring-2 ring-red-300 dark:ring-red-500"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          disabled={disabled}
          aria-label={isRecording ? "Detener grabación" : "Usar micrófono"}
        >
          {isRecording ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>

      {isRecording && (
        <div className="mt-3 text-center animate-pulse" aria-live="polite">
          <span className="inline-block px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
            Grabando... habla ahora
          </span>
        </div>
      )}
    </form>
  )
}