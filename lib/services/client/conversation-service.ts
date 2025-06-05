export interface Conversation {
  id: string
  title: string
  patient_id: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  content: string
  role: string
  created_at: string
}

// Función para obtener las conversaciones de un paciente
export async function getConversations(patientId: string): Promise<Conversation[]> {
  try {
    const response = await fetch(`/api/conversations?patientId=${patientId}`)

    if (!response.ok) {
      throw new Error("Error al obtener las conversaciones")
    }

    const data = await response.json()
    return data.conversations
  } catch (error) {
    console.error("Error al obtener las conversaciones:", error)
    return []
  }
}

// Función para obtener los mensajes de una conversación
export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await fetch(`/api/conversations/${conversationId}/messages`)

    if (!response.ok) {
      throw new Error("Error al obtener los mensajes")
    }

    const data = await response.json()
    return data.messages
  } catch (error) {
    console.error("Error al obtener los mensajes:", error)
    return []
  }
}

// Función para crear una nueva conversación
export async function createConversation(patientId: string, title: string): Promise<Conversation | null> {
  try {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId, title }),
    })

    if (!response.ok) {
      throw new Error("Error al crear la conversación")
    }

    const data = await response.json()
    return data.conversation
  } catch (error) {
    console.error("Error al crear la conversación:", error)
    return null
  }
}

// Función para eliminar una conversación
export async function deleteConversation(conversationId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Error al eliminar la conversación")
    }

    return true
  } catch (error) {
    console.error("Error al eliminar la conversación:", error)
    return false
  }
}
