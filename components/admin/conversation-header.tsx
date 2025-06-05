import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ConversationHeaderProps {
  conversation: any
  patient: any
}

export function ConversationHeader({ conversation, patient }: ConversationHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Button asChild variant="outline" size="sm" className="mr-4">
          <Link href={`/admin/patients/${patient.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al paciente
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-deep-blue dark:text-slate-100">
          {conversation.title || "Conversación"}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-mint/20 dark:bg-mint/10 p-2 rounded-full mr-3">
            <User className="h-5 w-5 text-mint dark:text-mint/80" />
          </div>
          <div>
            <h3 className="font-medium">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.age} años,{" "}
              {patient.gender === "masculino" ? "Masculino" : patient.gender === "femenino" ? "Femenino" : "Otro"}
            </p>
          </div>
        </div>

        <div className="text-sm">
          <div className="text-muted-foreground">Fecha de la conversación:</div>
          <div>{format(new Date(conversation.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</div>
        </div>
      </div>
    </div>
  )
}
