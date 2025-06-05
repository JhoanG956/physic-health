import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getServerUser } from "@/lib/services/server-auth-service"

export async function GET() {
  try {
    // Verificar si el usuario tiene permisos de administración
    const user = await getServerUser()

    if (!user || (user.role !== "admin" && user.role !== "therapist")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener todos los pacientes
    const patients = await executeQuery(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        pp.birth_date, 
        pp.gender,
        pp.height,
        pp.weight,
        pp.emergency_contact_name,
        pp.emergency_contact_phone,
        (SELECT COUNT(*) FROM conversations c WHERE c.patient_id = u.id) as conversation_count,
        (SELECT COUNT(*) FROM conditions c WHERE c.patient_id = u.id) as condition_count,
        (SELECT COUNT(*) FROM exercises e WHERE e.patient_id = u.id) as exercise_count
      FROM 
        users u
      LEFT JOIN 
        patient_profiles pp ON u.id = pp.user_id
      WHERE 
        u.role = 'patient'
      ORDER BY 
        u.name ASC
    `)

    return NextResponse.json({ patients })
  } catch (error: any) {
    console.error("Error al obtener pacientes:", error)
    return NextResponse.json({ error: error.message || "Error al obtener pacientes" }, { status: 500 })
  }
}
