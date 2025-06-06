"use client"

import { useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

export type Message = {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
}

interface UseChatProps {
  conversationId?: string
}

export function useChat({ conversationId }: UseChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId)

  // Cargar mensajes de la conversación existente
  useEffect(() => {
    async function loadConversation() {
      if (!conversationId) {
        setMessages([
          {
            id: uuidv4(),
            content: "¡Hola! ¿En qué puedo ayudarte hoy?, comienza escribiendo tu consulta.",
            role: "assistant",
            timestamp: new Date(),
          },
        ])
        setCurrentConversationId(uuidv4())  // Generar un ID de conversación único si no existe uno
        return
      }

      try {
        const response = await fetch(`/api/conversations/${conversationId}`)

        if (!response.ok) {
          throw new Error("Error al cargar la conversación")
        }

        const data = await response.json()

        // Verificar si 'data.conversation' existe y contiene mensajes
        const conversationData = data.conversation

        if (!conversationData || !Array.isArray(conversationData.messages)) {
          throw new Error("No se encontraron mensajes en la conversación")
        }

        // Mapear los mensajes y agruparlos por conversación si es necesario
        const msgArr = conversationData.messages.map((msg: any) => ({
          id: msg.id,
          content: cleanContent(msg.content),
          role: msg.role || "user", // Ajusta si hay información de rol en la respuesta
          timestamp: new Date(msg.created_at),
        }))
        setMessages(msgArr)
        console.log("Mensajes cargados:", msgArr)

        setCurrentConversationId(conversationId)
      } catch (error: any) {
        console.error("Error al cargar la conversación:", error)
        setError(error.message)
      }
    }

    if (conversationId) {
      loadConversation()
    } else {
      // Crear un ID para la conversación si no existe
      setMessages([
        {
          id: uuidv4(),
          content: "¡Hola! ¿En qué puedo ayudarte hoy?, comienza escribiendo tu consulta.",
          role: "assistant",
          timestamp: new Date(),
        },
      ])
      setCurrentConversationId(uuidv4())  // Nuevo ID para conversación
    }
  }, [conversationId])

  const sendMessage = useCallback(
    async (content: string, customPrompt?: string) => {
      if (!content.trim()) return

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

      try {
        // Preparar mensajes para la API
        const apiMessages = messages
          .concat(userMessage)
          .filter((msg) => msg.role !== "system") // Excluimos mensajes de sistema
          .map((msg) => ({
            role: msg.role,
            content: cleanContent(msg.content),  // Limpiar el contenido antes de enviarlo
          }))

        // Log para ver cómo se ve el contenido antes de enviarlo
        //console.log("Contenido de los mensajes antes de enviar:", apiMessages)

        // Llamar a la API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: apiMessages,
            customPrompt,
            conversationId: currentConversationId,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Error: ${response.status}`)
        }

        // Obtener el ID de la conversación si es nueva
        if (!currentConversationId) {
          const newConversationId = response.headers.get("X-Conversation-Id")
          if (newConversationId) {
            setCurrentConversationId(newConversationId)
          }
        }

        // Crear un ID para el mensaje de respuesta
        const responseMessageId = uuidv4()

        // Leer el stream de la respuesta
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let currentText = ""

        if (reader) {
          // Añadir un mensaje vacío que se irá actualizando
          setMessages((prev) => [
            ...prev,
            {
              id: responseMessageId,
              content: "",
              role: "assistant",
              timestamp: new Date(),
            },
          ])

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            currentText += chunk

            // Actualizar el mensaje en tiempo real agregando sólo el nuevo chunk
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === responseMessageId
                  ? { ...msg, content: currentText }
                  : msg
              ),
            )
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
    [messages, currentConversationId],
  )


  console.log("Mensajes:", messages)

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId: currentConversationId,
  }
}

function cleanContent(content: string): string {
  if (
    typeof content === "string" &&
    content.startsWith('"') &&
    content.endsWith('"')
  ) {
    try {
      content = JSON.parse(content)
    } catch {
      content = content.slice(1, -1)
    }
  }

  return content
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/(\d+)\.\s*\n(?=\*\*|\w)/g, "$1. ") // unir número con contenido si está separado por salto
    .replace(/\n{3,}/g, "\n\n") // normalizar múltiples saltos
    .replace(/(?<!\n)\n(?=\d+\.\s)/g, "\n\n") // doble salto antes de listas
    .replace(/(?<!\n)\n(?=\*\s)/g, "\n\n") // doble salto antes de viñetas
    .replace(/([^\n])\n(?=[^\n*])/g, "$1 $2") // unir líneas que no deberían estar separadas
    .trim()
}
