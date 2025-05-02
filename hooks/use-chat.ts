"use client"

import { useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Patient } from "@/lib/data/patients"
import {
  type Conversation,
  createConversation,
  getConversationById,
  addMessageToConversation,
} from "@/lib/services/conversation-service"

export type Message = {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
}

interface UseChatProps {
  patient?: Patient
  conversationId?: string
}

export function useChat({ patient, conversationId }: UseChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)

  // Cargar conversación existente o crear una nueva
  useEffect(() => {
    if (!patient) return

    let conversation: Conversation | undefined

    if (conversationId) {
      conversation = getConversationById(conversationId)
    }

    if (!conversation) {
      // Crear mensaje inicial del asistente
      const initialMessage: Message = {
        id: uuidv4(),
        content: `¡Hola ${patient.name}! Soy tu asistente de fisioterapia. ¿En qué puedo ayudarte hoy?`,
        role: "assistant",
        timestamp: new Date(),
      }

      // Crear nueva conversación
      conversation = createConversation(patient.id, initialMessage)
    }

    setCurrentConversation(conversation)
    setMessages(conversation.messages)
  }, [patient, conversationId])

  const sendMessage = useCallback(
    async (content: string, customPrompt?: string) => {
      if (!content.trim() || !patient || !currentConversation) return

      // Crear mensaje del usuario
      const userMessage: Message = {
        id: uuidv4(),
        content,
        role: "user",
        timestamp: new Date(),
      }

      // Actualizar estado local
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      // Actualizar conversación en localStorage
      const updatedConversation = addMessageToConversation(currentConversation.id, userMessage)
      if (updatedConversation) {
        setCurrentConversation(updatedConversation)
      }

      try {
        // Crear contexto del paciente para el prompt
        const patientContext = createPatientContext(patient)

        // Preparar mensajes para la API
        const apiMessages = messages
          .concat(userMessage)
          .filter((msg) => msg.role !== "system") // Excluimos mensajes de sistema
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))

        // Llamar a la API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: apiMessages,
            customPrompt,
            patientContext,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Error: ${response.status}`)
        }

        // Crear un ID para el mensaje de respuesta
        const responseMessageId = uuidv4()

        // Leer el stream de la respuesta
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let responseText = ""

        if (reader) {
          // Añadir un mensaje vacío que se irá actualizando
          const assistantMessage: Message = {
            id: responseMessageId,
            content: "",
            role: "assistant",
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, assistantMessage])

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            responseText += chunk

            // Actualizar el mensaje en tiempo real mientras se recibe
            setMessages((prev) =>
              prev.map((msg) => (msg.id === responseMessageId ? { ...msg, content: responseText } : msg)),
            )
          }

          // Actualizar la conversación en localStorage con la respuesta completa
          const finalAssistantMessage: Message = {
            id: responseMessageId,
            content: responseText,
            role: "assistant",
            timestamp: new Date(),
          }

          if (currentConversation) {
            addMessageToConversation(currentConversation.id, finalAssistantMessage)
          }
        }
      } catch (err: any) {
        console.error("Error al enviar mensaje:", err)
        setError(err.message || "Hubo un error al comunicarse con el asistente. Por favor, intenta de nuevo.")

        // Eliminar el mensaje de respuesta si hubo un error
        setMessages((prev) => prev.filter((msg) => msg.role !== "assistant" || msg.content !== ""))
      } finally {
        setIsLoading(false)
      }
    },
    [messages, patient, currentConversation],
  )

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversation: currentConversation,
  }
}

// Función para crear un contexto del paciente para el prompt
function createPatientContext(patient: Patient): string {
  const conditions = patient.conditions
    .map((c) => `- ${c.name} (${c.severity}): ${c.description}. Diagnosticado: ${c.dateOfDiagnosis}`)
    .join("\n")

  const medications = patient.medications
    .map((m) => `- ${m.name} ${m.dosage}, ${m.frequency}. Propósito: ${m.purpose}`)
    .join("\n")

  const exercises = patient.exercises
    .map(
      (e) =>
        `- ${e.name}: ${e.description}. Frecuencia: ${e.frequency}, Duración: ${e.duration}${e.notes ? `. Notas: ${e.notes}` : ""}`,
    )
    .join("\n")

  const allergies =
    patient.allergies.length > 0
      ? patient.allergies.map((a) => `- ${a.allergen}: ${a.reaction} (${a.severity})`).join("\n")
      : "No se reportan alergias."

  const surgeries =
    patient.surgeries.length > 0
      ? patient.surgeries.map((s) => `- ${s.procedure} (${s.date})${s.notes ? `. Notas: ${s.notes}` : ""}`).join("\n")
      : "No se reportan cirugías previas."

  return `
INFORMACIÓN DEL PACIENTE:
Nombre: ${patient.name}
Edad: ${patient.age} años
Género: ${patient.gender}
Altura: ${patient.height} cm
Peso: ${patient.weight} kg

CONDICIONES MÉDICAS:
${conditions}

MEDICACIÓN ACTUAL:
${medications}

PLAN DE EJERCICIOS:
${exercises}

ALERGIAS:
${allergies}

CIRUGÍAS PREVIAS:
${surgeries}

NOTAS ADICIONALES:
${patient.notes}

OBJETIVOS DEL PACIENTE:
${patient.goals.map((g) => `- ${g}`).join("\n")}

ÚLTIMA VISITA: ${patient.lastVisit || "No registrada"}
PRÓXIMA VISITA: ${patient.nextVisit || "No programada"}
`
}
