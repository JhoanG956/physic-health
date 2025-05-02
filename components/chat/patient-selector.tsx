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
            className="w-full flex justify-between items-center border-mint/30 dark:border-slate-700"
          >
            <div className="flex items-center">
              <UserRound className="mr-2 h-4 w-4 text-mint dark:text-mint/70" />
              <span>{selectedPatient ? selectedPatient.name : "Seleccionar paciente"}</span>
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
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4 mt-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectPatient(patient.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{patient.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {patient.age} años, {patient.gender}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {patient.conditions.map((condition, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`
                          ${condition.severity === "leve" ? "border-mint/50 text-mint dark:text-mint/80" : ""}
                          ${condition.severity === "moderada" ? "border-sky-blue/50 text-sky-blue dark:text-sky-blue/80" : ""}
                          ${condition.severity === "grave" ? "border-soft-coral/50 text-soft-coral dark:text-soft-coral/80" : ""}
                        `}
                      >
                        {condition.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{patient.notes}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
