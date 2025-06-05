import { query } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Interfaces para los datos del paciente
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
  name: string
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

// Obtener un perfil de paciente completo
export async function getPatientProfile(patientId: string): Promise<PatientProfile | null> {
  try {
    // Obtener el perfil básico con el nombre del usuario
    const profiles = await query(
      `
      SELECT 
        pp.id, 
        pp.user_id, 
        u.name, 
        pp.age, 
        pp.gender, 
        pp.height, 
        pp.weight, 
        pp.notes, 
        pp.goals, 
        pp.last_visit, 
        pp.next_visit, 
        pp.created_at, 
        pp.updated_at
      FROM 
        patient_profiles pp
      JOIN 
        users u ON pp.user_id = u.id
      WHERE 
        pp.id = $1
    `,
      [patientId],
    )

    if (profiles.length === 0) return null

    const profile = profiles[0]

    // Obtener condiciones
    const conditions = await query(
      `
      SELECT 
        id, 
        name, 
        description, 
        severity, 
        date_of_diagnosis as "dateOfDiagnosis"
      FROM 
        conditions 
      WHERE 
        patient_id = $1
    `,
      [patientId],
    )

    // Obtener medicamentos
    const medications = await query(
      `
      SELECT 
        id, 
        name, 
        dosage, 
        frequency, 
        purpose
      FROM 
        medications 
      WHERE 
        patient_id = $1
    `,
      [patientId],
    )

    // Obtener ejercicios
    const exercises = await query(
      `
      SELECT 
        id, 
        name, 
        description, 
        frequency, 
        duration, 
        notes
      FROM 
        exercises 
      WHERE 
        patient_id = $1
    `,
      [patientId],
    )

    // Obtener alergias
    const allergies = await query(
      `
      SELECT 
        id, 
        allergen, 
        reaction, 
        severity
      FROM 
        allergies 
      WHERE 
        patient_id = $1
    `,
      [patientId],
    )

    // Obtener cirugías
    const surgeries = await query(
      `
      SELECT 
        id, 
        procedure, 
        date, 
        notes
      FROM 
        surgeries 
      WHERE 
        patient_id = $1
    `,
      [patientId],
    )

    return {
      id: profile.id,
      userId: profile.user_id,
      name: profile.name,
      age: profile.age,
      gender: profile.gender as "masculino" | "femenino" | "otro",
      height: profile.height,
      weight: profile.weight,
      notes: profile.notes,
      goals: profile.goals,
      lastVisit: profile.last_visit ? new Date(profile.last_visit).toISOString().split("T")[0] : undefined,
      nextVisit: profile.next_visit ? new Date(profile.next_visit).toISOString().split("T")[0] : undefined,
      conditions: conditions.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        severity: c.severity as "leve" | "moderada" | "grave",
        dateOfDiagnosis: new Date(c.dateOfDiagnosis).toISOString().split("T")[0],
      })),
      medications: medications.map((m) => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        purpose: m.purpose,
      })),
      exercises: exercises.map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        frequency: e.frequency,
        duration: e.duration,
        notes: e.notes,
      })),
      allergies: allergies.map((a) => ({
        id: a.id,
        allergen: a.allergen,
        reaction: a.reaction,
        severity: a.severity as "leve" | "moderada" | "grave",
      })),
      surgeries: surgeries.map((s) => ({
        id: s.id,
        procedure: s.procedure,
        date: new Date(s.date).toISOString().split("T")[0],
        notes: s.notes,
      })),
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
    }
  } catch (error) {
    console.error("Error al obtener perfil de paciente:", error)
    return null
  }
}

// Obtener el perfil de paciente por ID de usuario
export async function getPatientProfileByUserId(userId: string): Promise<PatientProfile | null> {
  const profiles = await query(`SELECT id FROM patient_profiles WHERE user_id = $1`, [userId])

  if (profiles.length === 0) return null

  return getPatientProfile(profiles[0].id)
}

// Actualizar un perfil de paciente
export async function updatePatientProfile(patientId: string, data: Partial<CreatePatientProfileData>): Promise<void> {
  const updates = []
  const values = []
  let paramIndex = 1

  if (data.age !== undefined) {
    updates.push(`age = $${paramIndex}`)
    values.push(data.age)
    paramIndex++
  }

  if (data.gender !== undefined) {
    updates.push(`gender = $${paramIndex}`)
    values.push(data.gender)
    paramIndex++
  }

  if (data.height !== undefined) {
    updates.push(`height = $${paramIndex}`)
    values.push(data.height)
    paramIndex++
  }

  if (data.weight !== undefined) {
    updates.push(`weight = $${paramIndex}`)
    values.push(data.weight)
    paramIndex++
  }

  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex}`)
    values.push(data.notes)
    paramIndex++
  }

  if (data.goals !== undefined) {
    updates.push(`goals = $${paramIndex}`)
    values.push(data.goals)
    paramIndex++
  }

  if (data.lastVisit !== undefined) {
    updates.push(`last_visit = $${paramIndex}`)
    values.push(data.lastVisit ? new Date(data.lastVisit) : null)
    paramIndex++
  }

  if (data.nextVisit !== undefined) {
    updates.push(`next_visit = $${paramIndex}`)
    values.push(data.nextVisit ? new Date(data.nextVisit) : null)
    paramIndex++
  }

  updates.push(`updated_at = $${paramIndex}`)
  values.push(new Date())
  paramIndex++

  if (updates.length === 0) return

  values.push(patientId)

  await query(`UPDATE patient_profiles SET ${updates.join(", ")} WHERE id = $${paramIndex}`, values)
}

// Obtener todos los pacientes (versión simplificada para listados)
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
    SELECT 
      pp.id, 
      u.name, 
      pp.age, 
      pp.gender, 
      pp.last_visit, 
      pp.next_visit
    FROM 
      patient_profiles pp
    JOIN 
      users u ON pp.user_id = u.id
    ORDER BY 
      u.name ASC
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
