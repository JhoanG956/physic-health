"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  conditions: Array<{
    name: string
    severity: string
  }>
  lastVisit?: string
  nextVisit?: string
}

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("/api/admin/patients")

        if (!response.ok) {
          throw new Error("Error al cargar los pacientes")
        }

        const data = await response.json()
        setPatients(data)
        setFilteredPatients(data)
      } catch (error: any) {
        console.error("Error al cargar pacientes:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.conditions.some((condition) => condition.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredPatients(filtered)
    }
  }, [searchTerm, patients])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 border rounded-lg bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o condición médica..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No se encontraron pacientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Link href={`/admin/patients/${patient.id}`} key={patient.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{patient.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {patient.age} años,{" "}
                    {patient.gender === "masculino" ? "Masculino" : patient.gender === "femenino" ? "Femenino" : "Otro"}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Condiciones:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.conditions.map((condition, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={
                            condition.severity === "leve"
                              ? "border-mint/50 text-mint dark:text-mint/80"
                              : condition.severity === "moderada"
                                ? "border-sky-blue/50 text-sky-blue dark:text-sky-blue/80"
                                : "border-soft-coral/50 text-soft-coral dark:text-soft-coral/80"
                          }
                        >
                          {condition.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Última visita:</span>
                      <p>
                        {patient.lastVisit
                          ? format(new Date(patient.lastVisit), "dd/MM/yyyy", { locale: es })
                          : "No registrada"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Próxima visita:</span>
                      <p>
                        {patient.nextVisit
                          ? format(new Date(patient.nextVisit), "dd/MM/yyyy", { locale: es })
                          : "No programada"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
