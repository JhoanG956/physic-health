import type { Message } from "@/hooks/use-chat"
import { v4 as uuidv4 } from "uuid"

export interface Conversation {
  id: string
  patientId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Función para guardar una conversación en localStorage
export function saveConversation(conversation: Conversation): void {
  try {
    // Obtener las conversaciones existentes
    const conversations = getConversations()

    // Buscar si ya existe una conversación con este ID
    const existingIndex = conversations.findIndex((conv) => conv.id === conversation.id)

    if (existingIndex >= 0) {
      // Actualizar la conversación existente
      conversations[existingIndex] = {
        ...conversation,
        updatedAt: new Date(),
      }
    } else {
      // Añadir la nueva conversación
      conversations.push(conversation)
    }

    // Guardar en localStorage
    localStorage.setItem("physio_health_conversations", JSON.stringify(conversations))
  } catch (error) {
    console.error("Error al guardar la conversación:", error)
  }
}

// Función para obtener todas las conversaciones
export function getConversations(): Conversation[] {
  try {
    const conversationsJson = localStorage.getItem("physio_health_conversations")
    if (!conversationsJson) return []

    const conversations = JSON.parse(conversationsJson) as Conversation[]

    // Convertir las fechas de string a Date
    return conversations.map((conv) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }))
  } catch (error) {
    console.error("Error al obtener las conversaciones:", error)
    return []
  }
}

// Función para obtener las conversaciones de un paciente específico
export function getPatientConversations(patientId: string): Conversation[] {
  const conversations = getConversations()
  return conversations.filter((conv) => conv.patientId === patientId)
}

// Función para obtener una conversación específica
export function getConversationById(conversationId: string): Conversation | undefined {
  const conversations = getConversations()
  return conversations.find((conv) => conv.id === conversationId)
}

// Función para crear una nueva conversación
export function createConversation(patientId: string, initialMessage?: Message): Conversation {
  const now = new Date()
  const conversation: Conversation = {
    id: uuidv4(),
    patientId,
    messages: initialMessage ? [initialMessage] : [],
    createdAt: now,
    updatedAt: now,
  }

  saveConversation(conversation)
  return conversation
}

// Función para añadir un mensaje a una conversación
export function addMessageToConversation(conversationId: string, message: Message): Conversation | undefined {
  const conversation = getConversationById(conversationId)
  if (!conversation) return undefined

  conversation.messages.push(message)
  conversation.updatedAt = new Date()

  saveConversation(conversation)
  return conversation
}

// Función para eliminar una conversación
export function deleteConversation(conversationId: string): boolean {
  try {
    const conversations = getConversations()
    const filteredConversations = conversations.filter((conv) => conv.id !== conversationId)

    if (filteredConversations.length === conversations.length) {
      return false // No se encontró la conversación
    }

    localStorage.setItem("physio_health_conversations", JSON.stringify(filteredConversations))
    return true
  } catch (error) {
    console.error("Error al eliminar la conversación:", error)
    return false
  }
}
