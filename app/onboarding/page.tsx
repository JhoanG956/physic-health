// No se necesitan cambios directos en app/onboarding/page.tsx
// El componente MedicalProfileForm ya maneja la lógica de carga y actualización.
// Solo asegúrate de que la página esté protegida y solo accesible para usuarios autenticados si es necesario.
import { MedicalProfileForm } from "@/components/onboarding/medical-profile-form"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-deep-blue" />
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* El título y descripción se manejan dentro de MedicalProfileForm ahora */}
        <Suspense fallback={<LoadingFallback />}>
          <MedicalProfileForm />
        </Suspense>
      </div>
    </div>
  )
}
