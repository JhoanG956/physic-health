"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PatientTabsProps {
  patient: any
}

export function PatientTabs({ patient }: PatientTabsProps) {
  const [activeTab, setActiveTab] = useState("medical")

  return (
    <Tabs defaultValue="medical" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="medical">Información Médica</TabsTrigger>
        <TabsTrigger value="conversations">Conversaciones</TabsTrigger>
        <TabsTrigger value="notes">Notas</TabsTrigger>
      </TabsList>

      <TabsContent value="medical" className="space-y-6">
        {/* Condiciones médicas */}
        <Card>
          <CardHeader>
            <CardTitle>Condiciones Médicas</CardTitle>
            <CardDescription>Diagnósticos y condiciones del paciente</CardDescription>
          </CardHeader>
          <CardContent>
            {patient.conditions.length === 0 ? (
              <p className="text-muted-foreground">No hay condiciones médicas registradas</p>
            ) : (
              <div className="space-y-4">
                {patient.conditions.map((condition: any) => (
                  <div key={condition.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{condition.name}</h4>
                      <Badge
                        variant="outline"
                        className={
                          condition.severity === "leve"
                            ? "border-mint/50 text-mint dark:text-mint/80"
                            : condition.severity === "moderada"
                              ? "border-sky-blue/50 text-sky-blue dark:text-sky-blue/80"
                              : "border-soft-coral/50 text-soft-coral dark:text-soft-coral/80"
                        }
                      >
                        {condition.severity}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{condition.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Diagnosticado: {format(new Date(condition.dateOfDiagnosis), "dd/MM/yyyy", { locale: es })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medicamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Medicamentos</CardTitle>
            <CardDescription>Medicamentos actuales del paciente</CardDescription>
          </CardHeader>
          <CardContent>
            {patient.medications.length === 0 ? (
              <p className="text-muted-foreground">No hay medicamentos registrados</p>
            ) : (
              <div className="space-y-4">
                {patient.medications.map((medication: any) => (
                  <div key={medication.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{medication.name}</h4>
                      <div className="text-sm font-medium">{medication.dosage}</div>
                    </div>
                    <p className="text-sm mb-2">Propósito: {medication.purpose}</p>
                    <div className="text-xs text-muted-foreground">Frecuencia: {medication.frequency}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ejercicios */}
        <Card>
          <CardHeader>
            <CardTitle>Ejercicios</CardTitle>
            <CardDescription>Plan de ejercicios del paciente</CardDescription>
          </CardHeader>
          <CardContent>
            {patient.exercises.length === 0 ? (
              <p className="text-muted-foreground">No hay ejercicios registrados</p>
            ) : (
              <div className="space-y-4">
                {patient.exercises.map((exercise: any) => (
                  <div key={exercise.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {exercise.duration}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{exercise.description}</p>
                    <div className="text-xs text-muted-foreground mb-2">Frecuencia: {exercise.frequency}</div>
                    {exercise.notes && (
                      <div className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <span className="font-medium">Notas:</span> {exercise.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alergias y Cirugías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Alergias</CardTitle>
              <CardDescription>Alergias registradas</CardDescription>
            </CardHeader>
            <CardContent>
              {patient.allergies.length === 0 ? (
                <p className="text-muted-foreground">No hay alergias registradas</p>
              ) : (
                <div className="space-y-4">
                  {patient.allergies.map((allergy: any) => (
                    <div key={allergy.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{allergy.allergen}</h4>
                        <Badge
                          variant="outline"
                          className={
                            allergy.severity === "leve"
                              ? "border-mint/50 text-mint dark:text-mint/80"
                              : allergy.severity === "moderada"
                                ? "border-sky-blue/50 text-sky-blue dark:text-sky-blue/80"
                                : "border-soft-coral/50 text-soft-coral dark:text-soft-coral/80"
                          }
                        >
                          {allergy.severity}
                        </Badge>
                      </div>
                      <p className="text-sm">{allergy.reaction}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cirugías</CardTitle>
              <CardDescription>Historial de cirugías</CardDescription>
            </CardHeader>
            <CardContent>
              {patient.surgeries.length === 0 ? (
                <p className="text-muted-foreground">No hay cirugías registradas</p>
              ) : (
                <div className="space-y-4">
                  {patient.surgeries.map((surgery: any) => (
                    <div key={surgery.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{surgery.procedure}</h4>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(surgery.date), "dd/MM/yyyy", { locale: es })}
                        </div>
                      </div>
                      {surgery.notes && <p className="text-sm">{surgery.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="conversations">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Conversaciones</CardTitle>
            <CardDescription>Conversaciones con el asistente de fisioterapia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patient.conversations && patient.conversations.length > 0 ? (
                patient.conversations.map((conversation: any) => (
                  <Link href={`/admin/conversations/${conversation.id}`} key={conversation.id}>
                    <div className="border p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-mint" />
                          <h4 className="font-medium">{conversation.title || "Conversación sin título"}</h4>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(conversation.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{conversation.messages?.length || 0} mensajes</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No hay conversaciones registradas</p>
                  <Button asChild>
                    <Link href={`/chat?patient=${patient.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Iniciar nueva conversación
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes">
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
            <CardDescription>Notas adicionales sobre el paciente</CardDescription>
          </CardHeader>
          <CardContent>
            {patient.notes ? (
              <div className="p-4 border rounded-lg whitespace-pre-wrap">{patient.notes}</div>
            ) : (
              <p className="text-muted-foreground">No hay notas registradas</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
