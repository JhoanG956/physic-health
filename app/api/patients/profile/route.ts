import { NextResponse } from "next/server"
import { getServerUser } from "@/lib/services/server-auth-service"
import {
  getPatientProfileByUserId,
  updateFullPatientProfile,
  createPatientProfile, // Importar createPatientProfile
  addCondition, // Importar funciones add...
  addMedication,
  addExercise,
  addAllergy,
  addSurgery,
  type CreatePatientProfileData,
  type PatientCondition,
  type PatientMedication,
  type PatientExercise,
  type PatientAllergy,
  type PatientSurgery,
} from "@/lib/services/patient-service"

// GET: Obtener perfil del paciente
export async function GET(request: Request) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    const patientProfile = await getPatientProfileByUserId(user.id)
    if (!patientProfile) {
      return NextResponse.json(
        { profile: null, message: "Perfil no encontrado, se puede crear uno nuevo." },
        { status: 200 }, // Devolver 200 con profile: null para que el frontend sepa que no existe
      )
    }
    return NextResponse.json({ profile: patientProfile })
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 })
  }
}

// Interfaz para el payload de creación y actualización
interface ProfilePayload extends CreatePatientProfileData {
  conditions: PatientCondition[]
  medications: PatientMedication[]
  exercises: PatientExercise[]
  allergies: PatientAllergy[]
  surgeries: PatientSurgery[]
}

// POST: Crear un nuevo perfil de paciente completo
export async function POST(request: Request) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Verificar si ya existe un perfil para este usuario
    const existingProfile = await getPatientProfileByUserId(user.id)
    if (existingProfile) {
      return NextResponse.json({ error: "Ya existe un perfil para este usuario." }, { status: 409 }) // 409 Conflict
    }

    const data: ProfilePayload = await request.json()

    // 1. Crear el perfil básico
    const patientId = await createPatientProfile({
      userId: user.id,
      age: data.age,
      gender: data.gender,
      height: data.height,
      weight: data.weight,
      notes: data.notes,
      goals: data.goals,
      lastVisit: data.lastVisit,
      nextVisit: data.nextVisit,
    })

    // 2. Añadir datos relacionados
    for (const condition of data.conditions || []) {
      if (condition.name.trim()) await addCondition(patientId, condition)
    }
    for (const medication of data.medications || []) {
      if (medication.name.trim()) await addMedication(patientId, medication)
    }
    for (const exercise of data.exercises || []) {
      if (exercise.name.trim()) await addExercise(patientId, exercise)
    }
    for (const allergy of data.allergies || []) {
      if (allergy.allergen.trim()) await addAllergy(patientId, allergy)
    }
    for (const surgery of data.surgeries || []) {
      if (surgery.procedure.trim()) await addSurgery(patientId, surgery)
    }

    return NextResponse.json({ success: true, message: "Perfil creado correctamente", patientId }, { status: 201 })
  } catch (error) {
    console.error("Error al crear perfil:", error)
    return NextResponse.json({ error: "Error al crear perfil" }, { status: 500 })
  }
}

// PUT: Actualizar perfil completo del paciente
export async function PUT(request: Request) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const data: ProfilePayload = await request.json()

    const existingProfile = await getPatientProfileByUserId(user.id)
    if (!existingProfile) {
      return NextResponse.json(
        { error: "Perfil no encontrado para este usuario. No se puede actualizar." },
        { status: 404 },
      )
    }
    const patientId = existingProfile.id

    await updateFullPatientProfile(patientId, {
      userId: user.id,
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
