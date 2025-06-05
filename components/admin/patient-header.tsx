import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PatientHeaderProps {
  patient: any
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Button asChild variant="outline" size="sm" className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-deep-blue dark:text-slate-100">{patient.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Información básica</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Edad:</span>
              <p>{patient.age} años</p>
            </div>
            <div>
              <span className="text-muted-foreground">Género:</span>
              <p>
                {patient.gender === "masculino" ? "Masculino" : patient.gender === "femenino" ? "Femenino" : "Otro"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Altura:</span>
              <p>{patient.height} cm</p>
            </div>
            <div>
              <span className="text-muted-foreground">Peso:</span>
              <p>{patient.weight} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Visitas</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-mint" />
              <div>
                <span className="text-muted-foreground block">Última:</span>
                <p>
                  {patient.lastVisit
                    ? format(new Date(patient.lastVisit), "dd/MM/yyyy", { locale: es })
                    : "No registrada"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-sky-blue" />
              <div>
                <span className="text-muted-foreground block">Próxima:</span>
                <p>
                  {patient.nextVisit
                    ? format(new Date(patient.nextVisit), "dd/MM/yyyy", { locale: es })
                    : "No programada"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Objetivos</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {patient.goals.map((goal: string, index: number) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
