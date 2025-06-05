import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getServerUser } from "@/lib/services/server-auth-service"

// GET: Obtener mensajes de una conversación
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const conversationId = params.id

    // Obtener mensajes
    const messages = await query(
      `SELECT id, conversation_id, content, role, created_at 
       FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId],
    )

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

// POST: Crear un nuevo mensaje
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const conversationId = params.id
    const { content, role } = await request.json()

    if (!content || !role) {
      return NextResponse.json({ error: "Contenido y rol requeridos" }, { status: 400 })
    }

    // Crear mensaje
    const [message] = await query(
      `INSERT INTO messages (conversation_id, content, role, created_at) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING id, conversation_id, content, role, created_at`,
      [conversationId, content, role],
    )

    // Actualizar fecha de actualización de la conversación
    await query(
      `UPDATE conversations 
       SET updated_at = NOW() 
       WHERE id = $1`,
      [conversationId],
    )

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error al crear mensaje:", error)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
