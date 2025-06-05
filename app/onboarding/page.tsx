import { MedicalProfileForm } from "@/components/onboarding/medical-profile-form"

export default function OnboardingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 text-deep-blue dark:text-slate-100">
          Completa tu perfil médico
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Esta información nos ayudará a personalizar tu experiencia y brindarte recomendaciones más precisas para tu
          fisioterapia. Toda la información que proporciones es confidencial y solo se utilizará para mejorar tu
          atención.
        </p>
        <MedicalProfileForm />
      </div>
    </div>
  )
}
