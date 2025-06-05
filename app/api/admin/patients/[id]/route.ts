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

    const patientId = params.id

    // Obtener información del paciente
    const patientResult = await executeQuery(
      `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.created_at,
        pp.birth_date, 
        pp.gender,
        pp.height,
        pp.weight,
        pp.blood_type,
        pp.emergency_contact_name,
        pp.emergency_contact_phone,
        pp.medical_history
      FROM 
        users u
      LEFT JOIN 
        patient_profiles pp ON u.id = pp.user_id
      WHERE 
        u.id = $1 AND u.role = 'patient'
    `,
      [patientId],
    )

    if (patientResult.length === 0) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })
    }

    const patient = patientResult[0]

    // Obtener condiciones médicas
    const conditions = await executeQuery(
      `
      SELECT id, name, description, severity, date_of_diagnosis, created_at
      FROM conditions
      WHERE patient_id = $1
      ORDER BY date_of_diagnosis DESC
    `,
      [patientId],
    )

    // Obtener medicamentos
    const medications = await executeQuery(
      `
      SELECT id, name, dosage, frequency, start_date, end_date, notes
      FROM medications
      WHERE patient_id = $1
      ORDER BY start_date DESC
    `,
      [patientId],
    )

    // Obtener ejercicios
    const exercises = await executeQuery(
      `
      SELECT id, name, description, frequency, duration, notes
      FROM exercises
      WHERE patient_id = $1
    `,
      [patientId],
    )

    // Obtener alergias
    const allergies = await executeQuery(
      `
      SELECT id, allergen, severity, reaction
      FROM allergies
      WHERE patient_id = $1
    `,
      [patientId],
    )

    // Obtener cirugías
    const surgeries = await executeQuery(
      `
      SELECT id, name, date, notes
      FROM surgeries
      WHERE patient_id = $1
      ORDER BY date DESC
    `,
      [patientId],
    )

    // Obtener conversaciones
    const conversations = await executeQuery(
      `
      SELECT id, title, created_at, updated_at
      FROM conversations
      WHERE patient_id = $1
      ORDER BY updated_at DESC
    `,
      [patientId],
    )

    return NextResponse.json({
      patient,
      conditions,
      medications,
      exercises,
      allergies,
      surgeries,
      conversations,
    })
  } catch (error: any) {
    console.error("Error al obtener detalles del paciente:", error)
    return NextResponse.json({ error: error.message || "Error al obtener detalles del paciente" }, { status: 500 })
  }
}
