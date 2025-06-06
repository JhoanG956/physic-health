import { query } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Interfaces (sin cambios, ya las tienes definidas)
export interface PatientCondition {
  id?: string
  name: string
  description: string
  severity: "leve" | "moderada" | "grave"
  dateOfDiagnosis: string
}

export interface PatientMedication {
  id?: string
  name: string
  dosage: string
  frequency: string
  purpose: string
}

export interface PatientExercise {
  id?: string
  name: string
  description: string
  frequency: string
  duration: string
  notes?: string
}

export interface PatientAllergy {
  id?: string
  allergen: string
  reaction: string
  severity: "leve" | "moderada" | "grave"
}

export interface PatientSurgery {
  id?: string
  procedure: string
  date: string
  notes?: string
}

export interface PatientProfile {
  id: string
  userId: string
  name: string // Nombre del usuario, se obtiene del JOIN con la tabla users
  age: number
  gender: "masculino" | "femenino" | "otro"
  height: number // en cm
  weight: number // en kg
  notes?: string
  goals: string[]
  lastVisit?: string
  nextVisit?: string
  conditions: PatientCondition[]
  medications: PatientMedication[]
  exercises: PatientExercise[]
  allergies: PatientAllergy[]
  surgeries: PatientSurgery[]
  createdAt: Date
  updatedAt: Date
}

export interface CreatePatientProfileData {
  userId: string
  age: number
  gender: "masculino" | "femenino" | "otro"
  height: number
  weight: number
  notes?: string
  goals: string[]
  lastVisit?: string
  nextVisit?: string
}

// --- Funciones existentes (createPatientProfile, addCondition, etc.) sin cambios ---
// Crear un perfil de paciente
export async function createPatientProfile(data: CreatePatientProfileData): Promise<string> {
  const patientId = uuidv4()
  await query(
    `INSERT INTO patient_profiles 
     (id, user_id, age, gender, height, weight, notes, goals, last_visit, next_visit) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      patientId,
      data.userId,
      data.age,
      data.gender,
      data.height,
      data.weight,
      data.notes || null,
      data.goals,
      data.lastVisit ? new Date(data.lastVisit) : null,
      data.nextVisit ? new Date(data.nextVisit) : null,
    ],
  )
  return patientId
}

// Añadir una condición médica
export async function addCondition(patientId: string, condition: PatientCondition): Promise<string> {
  const conditionId = uuidv4()
  await query(
    `INSERT INTO conditions 
     (id, patient_id, name, description, severity, date_of_diagnosis) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      conditionId,
      patientId,
      condition.name,
      condition.description,
      condition.severity,
      new Date(condition.dateOfDiagnosis),
    ],
  )
  return conditionId
}

// Añadir un medicamento
export async function addMedication(patientId: string, medication: PatientMedication): Promise<string> {
  const medicationId = uuidv4()
  await query(
    `INSERT INTO medications 
     (id, patient_id, name, dosage, frequency, purpose) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [medicationId, patientId, medication.name, medication.dosage, medication.frequency, medication.purpose],
  )
  return medicationId
}

// Añadir un ejercicio
export async function addExercise(patientId: string, exercise: PatientExercise): Promise<string> {
  const exerciseId = uuidv4()
  await query(
    `INSERT INTO exercises 
     (id, patient_id, name, description, frequency, duration, notes) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      exerciseId,
      patientId,
      exercise.name,
      exercise.description,
      exercise.frequency,
      exercise.duration,
      exercise.notes || null,
    ],
  )
  return exerciseId
}

// Añadir una alergia
export async function addAllergy(patientId: string, allergy: PatientAllergy): Promise<string> {
  const allergyId = uuidv4()
  await query(
    `INSERT INTO allergies 
     (id, patient_id, allergen, reaction, severity) 
     VALUES ($1, $2, $3, $4, $5)`,
    [allergyId, patientId, allergy.allergen, allergy.reaction, allergy.severity],
  )
  return allergyId
}

// Añadir una cirugía
export async function addSurgery(patientId: string, surgery: PatientSurgery): Promise<string> {
  const surgeryId = uuidv4()
  await query(
    `INSERT INTO surgeries 
     (id, patient_id, procedure, date, notes) 
     VALUES ($1, $2, $3, $4, $5)`,
    [surgeryId, patientId, surgery.procedure, new Date(surgery.date), surgery.notes || null],
  )
  return surgeryId
}

// Obtener un perfil de paciente completo (sin cambios, ya es bastante completo)
export async function getPatientProfile(patientId: string): Promise<PatientProfile | null> {
  try {
    const profiles = await query(
      `SELECT pp.id, pp.user_id, u.name, pp.age, pp.gender, pp.height, pp.weight, pp.notes, pp.goals, pp.last_visit, pp.next_visit, pp.created_at, pp.updated_at
       FROM patient_profiles pp
       JOIN users u ON pp.user_id = u.id
       WHERE pp.id = $1`,
      [patientId],
    )
    if (profiles.length === 0) return null
    const profileData = profiles[0]

    const conditions = await query(
      `SELECT id, name, description, severity, date_of_diagnosis as "dateOfDiagnosis" FROM conditions WHERE patient_id = $1`,
      [patientId],
    )
    const medications = await query(
      `SELECT id, name, dosage, frequency, purpose FROM medications WHERE patient_id = $1`,
      [patientId],
    )
    const exercises = await query(
      `SELECT id, name, description, frequency, duration, notes FROM exercises WHERE patient_id = $1`,
      [patientId],
    )
    const allergies = await query(`SELECT id, allergen, reaction, severity FROM allergies WHERE patient_id = $1`, [
      patientId,
    ])
    const surgeries = await query(`SELECT id, procedure, date, notes FROM surgeries WHERE patient_id = $1`, [patientId])

    return {
      id: profileData.id,
      userId: profileData.user_id,
      name: profileData.name,
      age: profileData.age,
      gender: profileData.gender as "masculino" | "femenino" | "otro",
      height: profileData.height,
      weight: profileData.weight,
      notes: profileData.notes,
      goals: profileData.goals || [],
      lastVisit: profileData.last_visit ? new Date(profileData.last_visit).toISOString().split("T")[0] : undefined,
      nextVisit: profileData.next_visit ? new Date(profileData.next_visit).toISOString().split("T")[0] : undefined,
      conditions: conditions.map((c) => ({
        ...c,
        dateOfDiagnosis: new Date(c.dateOfDiagnosis).toISOString().split("T")[0],
      })),
      medications,
      exercises,
      allergies,
      surgeries: surgeries.map((s) => ({ ...s, date: new Date(s.date).toISOString().split("T")[0] })),
      createdAt: new Date(profileData.created_at),
      updatedAt: new Date(profileData.updated_at),
    }
  } catch (error) {
    console.error("Error al obtener perfil de paciente:", error)
    return null
  }
}

// Obtener el perfil de paciente por ID de usuario (sin cambios)
export async function getPatientProfileByUserId(userId: string): Promise<PatientProfile | null> {
  const profiles = await query(`SELECT id FROM patient_profiles WHERE user_id = $1`, [userId])
  if (profiles.length === 0) return null
  return getPatientProfile(profiles[0].id)
}

// --- NUEVA FUNCIÓN para actualizar el perfil completo ---
interface UpdatePatientProfileData extends CreatePatientProfileData {
  conditions: PatientCondition[]
  medications: PatientMedication[]
  exercises: PatientExercise[]
  allergies: PatientAllergy[]
  surgeries: PatientSurgery[]
}

export async function updateFullPatientProfile(patientId: string, data: UpdatePatientProfileData): Promise<void> {
  // 1. Actualizar patient_profiles
  await query(
    `UPDATE patient_profiles 
     SET age = $1, gender = $2, height = $3, weight = $4, notes = $5, goals = $6, last_visit = $7, next_visit = $8, updated_at = NOW()
     WHERE id = $9`,
    [
      data.age,
      data.gender,
      data.height,
      data.weight,
      data.notes || null,
      data.goals,
      data.lastVisit ? new Date(data.lastVisit) : null,
      data.nextVisit ? new Date(data.nextVisit) : null,
      patientId,
    ],
  )

  // 2. Eliminar y reinsertar condiciones
  await query(`DELETE FROM conditions WHERE patient_id = $1`, [patientId])
  for (const condition of data.conditions) {
    if (condition.name.trim()) await addCondition(patientId, condition)
  }

  // 3. Eliminar y reinsertar medicamentos
  await query(`DELETE FROM medications WHERE patient_id = $1`, [patientId])
  for (const medication of data.medications) {
    if (medication.name.trim()) await addMedication(patientId, medication)
  }

  // 4. Eliminar y reinsertar ejercicios
  await query(`DELETE FROM exercises WHERE patient_id = $1`, [patientId])
  for (const exercise of data.exercises) {
    if (exercise.name.trim()) await addExercise(patientId, exercise)
  }

  // 5. Eliminar y reinsertar alergias
  await query(`DELETE FROM allergies WHERE patient_id = $1`, [patientId])
  for (const allergy of data.allergies) {
    if (allergy.allergen.trim()) await addAllergy(patientId, allergy)
  }

  // 6. Eliminar y reinsertar cirugías
  await query(`DELETE FROM surgeries WHERE patient_id = $1`, [patientId])
  for (const surgery of data.surgeries) {
    if (surgery.procedure.trim()) await addSurgery(patientId, surgery)
  }
}

// Obtener todos los pacientes (sin cambios)
export async function getAllPatients(): Promise<
  Array<{
    id: string
    name: string
    age: number
    gender: string
    lastVisit?: string
    nextVisit?: string
  }>
> {
  const patients = await query(`
    SELECT pp.id, u.name, pp.age, pp.gender, pp.last_visit, pp.next_visit
    FROM patient_profiles pp
    JOIN users u ON pp.user_id = u.id
    ORDER BY u.name ASC
  `)
  return patients.map((p) => ({
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    lastVisit: p.last_visit ? new Date(p.last_visit).toISOString().split("T")[0] : undefined,
    nextVisit: p.next_visit ? new Date(p.next_visit).toISOString().split("T")[0] : undefined,
  }))
}
