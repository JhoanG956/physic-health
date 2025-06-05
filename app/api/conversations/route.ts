import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getServerUser } from "@/lib/services/server-auth-service"
import { v4 as uuidv4 } from "uuid"

// GET: Obtener conversaciones de un paciente
export async function GET(request: Request) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    console.log("ID de paciente:", patientId)

    if (!patientId) {
      return NextResponse.json({ error: "ID de paciente requerido" }, { status: 400 })
    }

    // Obtener conversaciones y mensajes
    const conversations = await query(
      `SELECT c.id, c.title, c.patient_id, c.created_at, c.updated_at, m.id AS message_id, m.content, m.timestamp AS message_created_at
       FROM conversations c
       INNER JOIN messages m ON m.conversation_id = c.id
       WHERE c.patient_id = $1
       ORDER BY c.updated_at DESC`,
      [patientId],
    )

  
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error al obtener conversaciones:", error)
    return NextResponse.json({ error: "Error al obtener conversaciones" }, { status: 500 })
  }
}

// POST: Crear una nueva conversación
export async function POST(request: Request) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { patientId, title } = await request.json()

    if (!patientId) {
      return NextResponse.json({ error: "ID de paciente requerido" }, { status: 400 })
    }

    // Generar ID único
    const conversationId = uuidv4()
    const conversationTitle = title || `Conversación ${new Date().toLocaleDateString()}`

    // Crear conversación
    await query(
      `INSERT INTO conversations (id, patient_id, title, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [conversationId, patientId, conversationTitle],
    )

    // Obtener la conversación creada
    const [conversation] = await query(
      `SELECT id, title, patient_id, created_at, updated_at 
       FROM conversations 
       WHERE id = $1`,
      [conversationId],
    )

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error al crear conversación:", error)
    return NextResponse.json({ error: "Error al crear conversación" }, { status: 500 })
  }
}
