import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getServerUser } from "@/lib/services/server-auth-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar si el usuario tiene permisos de administración
    const user = await getServerUser()

    if (!user || (user.role !== "admin" && user.role !== "therapist")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const conversationId = params.id

    // Obtener información de la conversación
    const conversationResult = await executeQuery(
      `
      SELECT 
        c.id, 
        c.title, 
        c.created_at,
        c.updated_at,
        u.id as patient_id,
        u.name as patient_name,
        u.email as patient_email
      FROM 
        conversations c
      JOIN 
        users u ON c.patient_id = u.id
      WHERE 
        c.id = $1
    `,
      [conversationId],
    )

    if (conversationResult.length === 0) {
      return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 })
    }

    const conversation = conversationResult[0]

    // Obtener mensajes
    const messages = await executeQuery(
      `
      SELECT id, role, content, created_at
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
    `,
      [conversationId],
    )

    return NextResponse.json({
      conversation,
      messages,
    })
  } catch (error: any) {
    console.error("Error al obtener detalles de la conversación:", error)
    return NextResponse.json(
      { error: error.message || "Error al obtener detalles de la conversación" },
      { status: 500 },
    )
  }
}
