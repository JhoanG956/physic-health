import { NextResponse } from "next/server"
import { query } from "@/lib/db" // Asumiendo que tienes una función query en db.ts
import { getServerUser } from "@/lib/services/server-auth-service"
import {
  getPatientProfileByUserId,
  updateFullPatientProfile,
  type CreatePatientProfileData,
  type PatientCondition,
  type PatientMedication,
  type PatientExercise,
  type PatientAllergy,
  type PatientSurgery,
} from "@/lib/services/patient-service"

// GET: Obtener perfil del paciente (usando el userId del usuario autenticado o uno provisto)
export async function GET(request: Request) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const url = new URL(request.url)
    // Permitir obtener perfil de otro usuario si el actual es admin, o siempre el propio.
    // Por ahora, simplificamos y solo permitimos obtener el perfil del usuario autenticado.
    const userIdToFetch = user.id
    // const userIdToFetch = url.searchParams.get("userId") || user.id; // Podrías usar esto si necesitas más flexibilidad

    const patientProfile = await getPatientProfileByUserId(userIdToFetch)

    if (!patientProfile) {
      // Es posible que un usuario exista pero no tenga perfil médico aún.
      // Devolvemos un objeto vacío o un estado específico para que el frontend sepa que debe crear uno.
      return NextResponse.json(
        { profile: null, message: "Perfil no encontrado, se puede crear uno nuevo." },
        { status: 200 },
      )
    }

    return NextResponse.json({ profile: patientProfile })
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 })
  }
}

// PUT: Actualizar perfil completo del paciente
interface UpdateProfilePayload extends CreatePatientProfileData {
  conditions: PatientCondition[]
  medications: PatientMedication[]
  exercises: PatientExercise[]
  allergies: PatientAllergy[]
  surgeries: PatientSurgery[]
}

export async function PUT(request: Request) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const data: UpdateProfilePayload = await request.json()

    // Obtener el patient_id basado en el user.id
    const [existingProfileInfo] = await query(`SELECT id FROM patient_profiles WHERE user_id = $1`, [user.id])

    if (!existingProfileInfo || !existingProfileInfo.id) {
      return NextResponse.json(
        { error: "Perfil no encontrado para este usuario. No se puede actualizar." },
        { status: 404 },
      )
    }
    const patientId = existingProfileInfo.id

    await updateFullPatientProfile(patientId, {
      userId: user.id, // Aunque no se usa directamente en updateFullPatientProfile para la query principal, es bueno tenerlo
      age: data.age,
      gender: data.gender,
      height: data.height,
      weight: data.weight,
      notes: data.notes,
      goals: data.goals,
      lastVisit: data.lastVisit,
      nextVisit: data.nextVisit,
      conditions: data.conditions || [],
      medications: data.medications || [],
      exercises: data.exercises || [],
      allergies: data.allergies || [],
      surgeries: data.surgeries || [],
    })

    return NextResponse.json({ success: true, message: "Perfil actualizado correctamente" })
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 })
  }
}
