import type { Metadata } from "next"
import { PatientList } from "@/components/admin/patient-list"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Panel de Administración | Physio Health",
  description: "Panel de administración para gestionar pacientes y conversaciones",
}

export default async function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader />
      <PatientList />
    </div>
  )
}
