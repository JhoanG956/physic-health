import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getServerUser } from "@/lib/services/server-auth-service"

// GET: Obtener perfil del paciente
// GET: Obtener perfil del paciente
export async function GET(request: Request) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Obtener userId de la query string de la solicitud
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId") || user.id

    // Obtener perfil
    const [profile] = await query(`SELECT * FROM patient_profiles WHERE user_id = $1`, [userId])

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 })
  }
}

// PUT: Actualizar perfil del paciente
export async function PUT(request: Request) {
  try {
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const data = await request.json()

    // Verificar si el perfil existe
    const [existingProfile] = await query(`SELECT id FROM patient_profiles WHERE user_id = $1`, [user.id])

    if (!existingProfile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
    }

    // Actualizar perfil
    await query(
      `UPDATE patient_profiles 
       SET 
         age = $1, 
         gender = $2, 
         height = $3, 
         weight = $4, 
         activity_level = $5, 
         medical_history = $6, 
         updated_at = NOW() 
       WHERE id = $7`,
      [data.age, data.gender, data.height, data.weight, data.activity_level, data.medical_history, existingProfile.id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 })
  }
}
