"use client"

import { useState } from "react"
import { type Patient, getAllPatients } from "@/lib/data/patients"
import { Button } from "@/components/ui/button"
import { UserRound, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface PatientSelectorProps {
  selectedPatient: Patient | null
  onSelectPatient: (patient: Patient) => void
}

export function PatientSelector({ selectedPatient, onSelectPatient }: PatientSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const patients = getAllPatients()

  const handleSelectPatient = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    if (patient) {
      onSelectPatient(patient)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="mb-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex justify-between items-center rounded-xl px-4 py-3 shadow-sm hover:bg-accent/30 transition-colors border-mint/30 dark:border-slate-700"
          >
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-mint dark:text-mint/70" />
              <span className="text-sm font-medium truncate">
                {selectedPatient ? selectedPatient.name : "Seleccionar paciente"}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seleccionar paciente</DialogTitle>
            <DialogDescription>
              Elige un paciente para personalizar la conversación según su historial médico y necesidades.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-2 mt-4">
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow hover:bg-accent/40 cursor-pointer transition-all"
                  onClick={() => handleSelectPatient(patient.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{patient.name}</h3>
                    <div className="text-xs text-muted-foreground">
                      {patient.age} años, {patient.gender}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {patient.conditions.map((condition, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`
                          text-xs px-2 py-0.5 rounded-full
                          ${condition.severity === "leve" ? "border-mint/50 text-mint dark:text-mint/80" : ""}
                          ${condition.severity === "moderada" ? "border-sky-blue/50 text-sky-blue dark:text-sky-blue/80" : ""}
                          ${condition.severity === "grave" ? "border-soft-coral/50 text-soft-coral dark:text-soft-coral/80" : ""}
                        `}
                      >
                        {condition.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{patient.notes}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}