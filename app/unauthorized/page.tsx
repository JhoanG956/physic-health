import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-deep-blue dark:text-slate-100">Acceso no autorizado</h1>
        <p className="mb-8 text-muted-foreground">
          No tienes permisos para acceder a esta sección. Esta área está reservada para administradores y
          fisioterapeutas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Iniciar sesión con otra cuenta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
