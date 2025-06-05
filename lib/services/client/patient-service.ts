export interface PatientProfile {
  id: string
  user_id: string
  age: number
  gender: string
  height: number
  weight: number
  activity_level: string
  medical_history: string
  created_at: string
  updated_at: string
}

export interface Condition {
  id: string
  patient_id: string
  name: string
  description: string
  diagnosed_date: string
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  patient_id: string
  name: string
  dosage: string
  frequency: string
  created_at: string
  updated_at: string
}

export interface Exercise {
  id: string
  patient_id: string
  name: string
  description: string
  frequency: string
  duration: string
  created_at: string
  updated_at: string
}

export interface PatientData {
  profile: PatientProfile
  conditions: Condition[]
  medications: Medication[]
  exercises: Exercise[]
}

// Función para obtener el perfil del paciente
export async function getPatientProfile(): Promise<PatientProfile | null> {
  try {
    const response = await fetch("/api/patients/profile")

    if (!response.ok) {
      throw new Error("Error al obtener el perfil del paciente")
    }

    const data = await response.json()
    return data.profile
  } catch (error) {
    console.error("Error al obtener el perfil del paciente:", error)
    return null
  }
}

// Función para obtener todos los datos del paciente
export async function getPatientData(): Promise<PatientData | null> {
  try {
    const response = await fetch("/api/patients/data")

    if (!response.ok) {
      throw new Error("Error al obtener los datos del paciente")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener los datos del paciente:", error)
    return null
  }
}

// Función para actualizar el perfil del paciente
export async function updatePatientProfile(profile: Partial<PatientProfile>): Promise<boolean> {
  try {
    const response = await fetch("/api/patients/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar el perfil del paciente")
    }

    return true
  } catch (error) {
    console.error("Error al actualizar el perfil del paciente:", error)
    return false
  }
}
