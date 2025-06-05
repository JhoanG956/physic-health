import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getServerUser } from "@/lib/services/server-auth-service"

// GET: Obtener una conversación específica con mensajes
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Asegúrate de que params.id esté accesible
    const conversationId = params.id

    // Obtener conversación y mensajes asociados
    const conversationRows = await query(
      `SELECT c.id, c.title, c.patient_id, c.created_at, c.updated_at, 
              m.id AS message_id, m.content, m.role, m.timestamp AS message_created_at
       FROM conversations c
       INNER JOIN messages m ON m.conversation_id = c.id
       WHERE c.id = $1`,
      [conversationId],
    )

    if (!conversationRows || conversationRows.length === 0) {
      return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 })
    }

    // Agrupar los mensajes bajo la conversación
    const { id, title, patient_id, created_at, updated_at } = conversationRows[0]
    const messages = conversationRows.map(row => ({
      id: row.message_id,
      content: row.content,
      role: row.role,
      created_at: row.message_created_at,
    }))
    const conversation = { id, title, patient_id, created_at, updated_at, messages }

    //console.log("Conversación obtenida:", conversation)
    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error al obtener conversación:", error)
    return NextResponse.json({ error: "Error al obtener conversación" }, { status: 500 })
  }
}

// DELETE: Eliminar una conversación
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const conversationId = params.id

    // Eliminar mensajes de la conversación
    await query(`DELETE FROM messages WHERE conversation_id = $1`, [conversationId])

    // Eliminar conversación
    await query(`DELETE FROM conversations WHERE id = $1`, [conversationId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar conversación:", error)
    return NextResponse.json({ error: "Error al eliminar conversación" }, { status: 500 })
  }
}

// PUT: Actualizar una conversación
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const conversationId = params.id
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Título requerido" }, { status: 400 })
    }

    // Actualizar conversación
    await query(
      `UPDATE conversations 
       SET title = $1, updated_at = NOW() 
       WHERE id = $2`,
      [title, conversationId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar conversación:", error)
    return NextResponse.json({ error: "Error al actualizar conversación" }, { status: 500 })
  }
}
