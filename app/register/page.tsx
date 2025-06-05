import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-deep-blue dark:text-slate-100">
          Crea tu cuenta en Physio Health
        </h1>
        <RegisterForm />
      </div>
    </div>
  )
}
