import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPatientProfile } from "@/lib/services/patient-service"
import { PatientHeader } from "@/components/admin/patient-header"
import { PatientTabs } from "@/components/admin/patient-tabs"

interface PatientPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PatientPageProps): Promise<Metadata> {
  const patient = await getPatientProfile(params.id)

  if (!patient) {
    return {
      title: "Paciente no encontrado | Physio Health",
    }
  }

  return {
    title: `${patient.name || "Paciente"} | Physio Health`,
    description: `Información detallada del paciente`,
  }
}

export default async function PatientPage({ params }: PatientPageProps) {
  const patient = await getPatientProfile(params.id)

  if (!patient) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientHeader patient={patient} />
      <PatientTabs patient={patient} />
    </div>
  )
}
