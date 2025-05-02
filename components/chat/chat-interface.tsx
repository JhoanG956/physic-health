"use client"

import { useState } from "react"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { PromptEditor } from "./prompt-editor"
import { PatientSelector } from "./patient-selector"
import { ConversationHistory } from "./conversation-history"
import { useChat } from "@/hooks/use-chat"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Patient } from "@/lib/data/patients"

// Prompt del sistema predeterminado
const DEFAULT_SYSTEM_PROMPT = `Eres un asistente de fisioterapia profesional llamado PhysioBot. 
Tu objetivo es ayudar a los usuarios con recomendaciones personalizadas, ejercicios y consejos relacionados con la fisioterapia.

Debes:
- Ser amable, profesional y empático
- Proporcionar información precisa basada en conocimientos de fisioterapia
- Sugerir ejercicios adecuados según las necesidades del usuario
- Recordar siempre que no reemplazas a un fisioterapeuta real
- Animar a los usuarios a consultar con profesionales para casos específicos
- Usar un lenguaje claro y accesible

Cuando recomiendes ejercicios, describe brevemente cómo realizarlos correctamente.
Si el usuario menciona dolor agudo o síntomas graves, recomienda siempre buscar atención médica profesional.`

export function ChatInterface() {
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [conversationId, setConversationId] = useState<string | undefined>(undefined)

  const { messages, isLoading, error, sendMessage } = useChat({
    patient: selectedPatient || undefined,
    conversationId,
  })

  const handleSendMessage = (content: string) => {
    if (selectedPatient) {
      sendMessage(content, customPrompt)
    } else {
      alert("Por favor, selecciona un paciente antes de enviar un mensaje.")
    }
  }

  const handleSavePrompt = (newPrompt: string) => {
    setCustomPrompt(newPrompt)
  }

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setConversationId(undefined) // Iniciar una nueva conversación
  }

  const handleSelectConversation = (convId: string) => {
    setConversationId(convId)
  }

  const handleRetry = () => {
    // Obtener el último mensaje del usuario
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")
    if (lastUserMessage && selectedPatient) {
      sendMessage(lastUserMessage.content, customPrompt)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-[70vh] rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800"
    >
      <div className="bg-gradient-to-r from-mint/30 to-sky-blue/30 dark:from-slate-800 dark:to-slate-700 p-4 text-deep-blue dark:text-slate-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-medium">Asistente de Fisioterapia</h2>
            <p className="text-xs opacity-80 dark:text-slate-300">
              {selectedPatient ? `Conversando con ${selectedPatient.name}` : "Selecciona un paciente para comenzar"}
            </p>
          </div>
          <PromptEditor defaultPrompt={DEFAULT_SYSTEM_PROMPT} onSave={handleSavePrompt} />
        </div>
      </div>

      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <PatientSelector selectedPatient={selectedPatient} onSelectPatient={handleSelectPatient} />
        {selectedPatient && (
          <ConversationHistory patient={selectedPatient} onSelectConversation={handleSelectConversation} />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-warm-gray/10 dark:bg-slate-900/50">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2">
                <RefreshCw className="h-3 w-3 mr-1" /> Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <AnimatePresence initial={false}>
          {selectedPatient ? (
            <ChatMessages messages={messages} isLoading={isLoading} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p>Selecciona un paciente para comenzar la conversación</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} disabled={!selectedPatient} />
    </motion.div>
  )
}
