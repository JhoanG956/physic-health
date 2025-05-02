import { v4 as uuidv4 } from "uuid"

export interface PatientCondition {
  name: string
  description: string
  severity: "leve" | "moderada" | "grave"
  dateOfDiagnosis: string
}

export interface PatientMedication {
  name: string
  dosage: string
  frequency: string
  purpose: string
}

export interface PatientExercise {
  name: string
  description: string
  frequency: string
  duration: string
  notes?: string
}

export interface PatientAllergy {
  allergen: string
  reaction: string
  severity: "leve" | "moderada" | "grave"
}

export interface PatientSurgery {
  procedure: string
  date: string
  notes?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: "masculino" | "femenino" | "otro"
  height: number // en cm
  weight: number // en kg
  conditions: PatientCondition[]
  medications: PatientMedication[]
  exercises: PatientExercise[]
  allergies: PatientAllergy[]
  surgeries: PatientSurgery[]
  notes: string
  goals: string[]
  lastVisit?: string
  nextVisit?: string
}

export const patients: Patient[] = [
  {
    id: uuidv4(),
    name: "Carlos Rodríguez",
    age: 42,
    gender: "masculino",
    height: 178,
    weight: 82,
    conditions: [
      {
        name: "Hernia discal L4-L5",
        description: "Hernia discal en la región lumbar que causa dolor irradiado a la pierna izquierda",
        severity: "moderada",
        dateOfDiagnosis: "2024-01-15",
      },
      {
        name: "Hipertensión",
        description: "Hipertensión arterial controlada con medicación",
        severity: "leve",
        dateOfDiagnosis: "2022-05-10",
      },
    ],
    medications: [
      {
        name: "Losartán",
        dosage: "50mg",
        frequency: "1 vez al día",
        purpose: "Control de hipertensión",
      },
      {
        name: "Naproxeno",
        dosage: "500mg",
        frequency: "Cada 12 horas según necesidad",
        purpose: "Dolor lumbar",
      },
    ],
    exercises: [
      {
        name: "Estiramiento de Williams",
        description: "Serie de ejercicios para fortalecer la espalda baja y abdomen",
        frequency: "Diario",
        duration: "15 minutos",
        notes: "Evitar hiperextensión de columna",
      },
      {
        name: "Natación",
        description: "Natación estilo libre o espalda",
        frequency: "3 veces por semana",
        duration: "30 minutos",
        notes: "Evitar estilo mariposa",
      },
    ],
    allergies: [
      {
        allergen: "Ibuprofeno",
        reaction: "Erupción cutánea",
        severity: "moderada",
      },
    ],
    surgeries: [],
    notes:
      "Trabaja como programador, pasa muchas horas sentado. Ha mostrado buena adherencia a los ejercicios recomendados.",
    goals: ["Reducir dolor lumbar", "Mejorar postura", "Volver a jugar tenis recreativo"],
    lastVisit: "2024-04-10",
    nextVisit: "2024-05-15",
  },
  {
    id: uuidv4(),
    name: "Ana Martínez",
    age: 35,
    gender: "femenino",
    height: 165,
    weight: 58,
    conditions: [
      {
        name: "Tendinitis del manguito rotador",
        description: "Inflamación del tendón del hombro derecho",
        severity: "moderada",
        dateOfDiagnosis: "2024-02-20",
      },
      {
        name: "Migraña",
        description: "Episodios de migraña con aura",
        severity: "moderada",
        dateOfDiagnosis: "2020-11-05",
      },
    ],
    medications: [
      {
        name: "Sumatriptán",
        dosage: "50mg",
        frequency: "Durante episodios de migraña",
        purpose: "Control de migraña",
      },
    ],
    exercises: [
      {
        name: "Ejercicios de Codman",
        description: "Ejercicios pendulares para el hombro",
        frequency: "3 veces al día",
        duration: "5 minutos",
      },
      {
        name: "Fortalecimiento con banda elástica",
        description: "Ejercicios de rotación externa e interna",
        frequency: "Días alternos",
        duration: "15 minutos",
        notes: "Usar banda de resistencia ligera",
      },
    ],
    allergies: [],
    surgeries: [],
    notes:
      "Trabaja como diseñadora gráfica. La tendinitis comenzó después de aumentar horas de trabajo en computadora. Practica yoga regularmente.",
    goals: ["Recuperar movilidad completa del hombro", "Prevenir recurrencia", "Mejorar ergonomía en el trabajo"],
    lastVisit: "2024-04-05",
    nextVisit: "2024-04-25",
  },
  {
    id: uuidv4(),
    name: "Miguel Sánchez",
    age: 68,
    gender: "masculino",
    height: 172,
    weight: 78,
    conditions: [
      {
        name: "Artrosis de rodilla",
        description: "Artrosis bilateral de rodilla, más pronunciada en rodilla derecha",
        severity: "moderada",
        dateOfDiagnosis: "2021-06-12",
      },
      {
        name: "Diabetes tipo 2",
        description: "Diabetes controlada con dieta y medicación",
        severity: "moderada",
        dateOfDiagnosis: "2015-03-20",
      },
    ],
    medications: [
      {
        name: "Metformina",
        dosage: "850mg",
        frequency: "2 veces al día",
        purpose: "Control de diabetes",
      },
      {
        name: "Paracetamol",
        dosage: "1g",
        frequency: "Según necesidad, máximo 3 veces al día",
        purpose: "Dolor articular",
      },
    ],
    exercises: [
      {
        name: "Ejercicios isométricos de cuádriceps",
        description: "Contracción de cuádriceps sin movimiento de rodilla",
        frequency: "Diario",
        duration: "10 repeticiones, 3 series",
      },
      {
        name: "Caminata",
        description: "Caminata en terreno plano",
        frequency: "Diario",
        duration: "20 minutos",
        notes: "Usar calzado adecuado con amortiguación",
      },
    ],
    allergies: [],
    surgeries: [
      {
        procedure: "Artroscopia de rodilla derecha",
        date: "2022-02-15",
        notes: "Limpieza articular y reparación de menisco",
      },
    ],
    notes:
      "Jubilado, anteriormente trabajaba como profesor. Le gusta la jardinería pero ha tenido que reducirla por el dolor de rodillas.",
    goals: [
      "Reducir dolor en rodillas",
      "Mejorar capacidad para subir escaleras",
      "Retomar jardinería con adaptaciones",
    ],
    lastVisit: "2024-03-28",
    nextVisit: "2024-05-02",
  },
  {
    id: uuidv4(),
    name: "Laura Gómez",
    age: 29,
    gender: "femenino",
    height: 170,
    weight: 65,
    conditions: [
      {
        name: "Esguince de tobillo grado II",
        description: "Lesión de ligamento lateral externo del tobillo izquierdo",
        severity: "moderada",
        dateOfDiagnosis: "2024-03-10",
      },
    ],
    medications: [
      {
        name: "Ibuprofeno",
        dosage: "400mg",
        frequency: "Cada 8 horas según necesidad",
        purpose: "Inflamación y dolor",
      },
    ],
    exercises: [
      {
        name: "Ejercicios propioceptivos",
        description: "Equilibrio sobre superficie inestable",
        frequency: "Diario",
        duration: "10 minutos",
        notes: "Progresar gradualmente en dificultad",
      },
      {
        name: "Fortalecimiento de peroneos",
        description: "Ejercicios con banda elástica",
        frequency: "Días alternos",
        duration: "3 series de 15 repeticiones",
      },
    ],
    allergies: [],
    surgeries: [],
    notes:
      "Deportista recreativa, juega fútbol los fines de semana. La lesión ocurrió durante un partido. Muy motivada para volver a la actividad deportiva.",
    goals: ["Recuperar estabilidad del tobillo", "Volver a jugar fútbol", "Prevenir recidivas"],
    lastVisit: "2024-04-12",
    nextVisit: "2024-04-26",
  },
]

export function getPatientById(id: string): Patient | undefined {
  return patients.find((patient) => patient.id === id)
}

export function getAllPatients(): Patient[] {
  return patients
}
