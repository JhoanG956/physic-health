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

export function ChatInput({ onSend, isLoading, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Enfocar el textarea cuando el componente se monta
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus()
    }
  }, [disabled])

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

  // Simulación de grabación de voz
  const toggleRecording = () => {
    if (disabled) return

    if (isRecording) {
      // Aquí iría la lógica para detener la grabación y procesar el audio
      setIsRecording(false)
      // Simulamos que se ha reconocido texto
      setTimeout(() => {
        setInput((prev) => prev + " ¿Qué ejercicios me recomiendas para el dolor de espalda?")
      }, 500)
    } else {
      setIsRecording(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white dark:bg-slate-800 dark:border-slate-700">
      <div className="flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full bg-mint/10 dark:bg-slate-700 border-mint/30 dark:border-slate-600"
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4 text-deep-blue dark:text-slate-300" />
          <span className="sr-only">Adjuntar archivo</span>
        </Button>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Selecciona un paciente para comenzar" : "Escribe tu mensaje..."}
          className="min-h-12 resize-none rounded-full px-4 border-mint/30 dark:border-slate-600 focus-visible:ring-mint dark:focus-visible:ring-sky-blue dark:bg-slate-700 dark:text-slate-100"
          disabled={isLoading || disabled}
        />
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "default" : "outline"}
          className={`rounded-full ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-mint/10 dark:bg-slate-700 border-mint/30 dark:border-slate-600"
          }`}
          onClick={toggleRecording}
          disabled={disabled}
        >
          {isRecording ? (
            <X className="h-4 w-4 text-white" />
          ) : (
            <Mic className="h-4 w-4 text-deep-blue dark:text-slate-300" />
          )}
          <span className="sr-only">{isRecording ? "Detener grabación" : "Usar micrófono"}</span>
        </Button>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading || disabled}
            className="rounded-full bg-deep-blue hover:bg-deep-blue/90 dark:bg-mint/30 dark:hover:bg-mint/40 text-white dark:text-slate-100"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </motion.div>
      </div>
      {isRecording && (
        <div className="mt-2 text-xs text-center text-muted-foreground dark:text-slate-400 animate-pulse">
          Grabando audio... Habla ahora
        </div>
      )}
    </form>
  )
}
