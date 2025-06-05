import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
}

export interface Conversation {
  id: string
  patientId: string
  title?: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Crear una nueva conversación
export async function createConversation(patientId: string, title?: string): Promise<string> {
  const conversationId = uuidv4()

  await executeQuery(`INSERT INTO conversations (id, patient_id, title) VALUES ($1, $2, $3)`, [
    conversationId,
    patientId,
    title || null,
  ])

  return conversationId
}

// Añadir un mensaje a una conversación
export async function addMessage(conversationId: string, message: Omit<Message, "id">): Promise<string> {
  const messageId = uuidv4()

  await executeQuery(
    `INSERT INTO messages (id, conversation_id, role, content, timestamp) 
     VALUES ($1, $2, $3, $4, $5)`,
    [messageId, conversationId, message.role, message.content, message.timestamp],
  )

  // Actualizar la fecha de actualización de la conversación
  await executeQuery(`UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [conversationId])

  return messageId
}

// Obtener una conversación por ID
export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const conversations = await executeQuery(`SELECT * FROM conversations WHERE id = $1`, [conversationId])

  if (conversations.length === 0) return null

  const conversation = conversations[0]

  const messages = await executeQuery(`SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC`, [
    conversationId,
  ])

  return {
    id: conversation.id,
    patientId: conversation.patient_id,
    title: conversation.title,
    messages: messages.map((m) => ({
      id: m.id,
      content: m.content,
      role: m.role as "user" | "assistant" | "system",
      timestamp: new Date(m.timestamp),
    })),
    createdAt: new Date(conversation.created_at),
    updatedAt: new Date(conversation.updated_at),
  }
}

// Obtener todas las conversaciones de un paciente
export async function getPatientConversations(patientId: string): Promise<Conversation[]> {
  const conversations = await executeQuery(
    `SELECT * FROM conversations WHERE patient_id = $1 ORDER BY updated_at DESC`,
    [patientId],
  )

  const result: Conversation[] = []

  for (const conversation of conversations) {
    const messages = await executeQuery(`SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC`, [
      conversation.id,
    ])

    result.push({
      id: conversation.id,
      patientId: conversation.patient_id,
      title: conversation.title,
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        role: m.role as "user" | "assistant" | "system",
        timestamp: new Date(m.timestamp),
      })),
      createdAt: new Date(conversation.created_at),
      updatedAt: new Date(conversation.updated_at),
    })
  }

  return result
}

// Eliminar una conversación
export async function deleteConversation(conversationId: string): Promise<boolean> {
  try {
    // Los mensajes se eliminarán automáticamente por la restricción ON DELETE CASCADE
    await executeQuery(`DELETE FROM conversations WHERE id = $1`, [conversationId])
    return true
  } catch (error) {
    console.error("Error al eliminar la conversación:", error)
    return false
  }
}
