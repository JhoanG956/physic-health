"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Cookies from "js-cookie"
import {
  createPatientProfile,
  addCondition,
  addMedication,
  addExercise,
  addAllergy,
  addSurgery,
} from "@/lib/services/patient-service"

export function MedicalProfileForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Datos básicos del perfil
  const [basicInfo, setBasicInfo] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
  })

  // Condiciones médicas
  const [conditions, setConditions] = useState<
    Array<{
      name: string
      description: string
      severity: string
      dateOfDiagnosis: string
    }>
  >([])

  // Medicamentos
  const [medications, setMedications] = useState<
    Array<{
      name: string
      dosage: string
      frequency: string
      purpose: string
    }>
  >([])

  // Ejercicios
  const [exercises, setExercises] = useState<
    Array<{
      name: string
      description: string
      frequency: string
      duration: string
      notes: string
    }>
  >([])

  // Alergias
  const [allergies, setAllergies] = useState<
    Array<{
      allergen: string
      reaction: string
      severity: string
    }>
  >([])

  // Cirugías
  const [surgeries, setSurgeries] = useState<
    Array<{
      procedure: string
      date: string
      notes: string
    }>
  >([])

  // Notas y objetivos
  const [notes, setNotes] = useState("")
  const [goals, setGoals] = useState<string[]>([""])

  // Manejadores de cambios para datos básicos
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBasicInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setBasicInfo((prev) => ({ ...prev, gender: value }))
  }

  // Manejadores para condiciones médicas
  const addNewCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        severity: "leve",
        dateOfDiagnosis: new Date().toISOString().split("T")[0],
      },
    ])
  }

  const updateCondition = (index: number, field: string, value: string) => {
    setConditions((prev) => prev.map((condition, i) => (i === index ? { ...condition, [field]: value } : condition)))
  }

  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index))
  }

  // Manejadores para medicamentos
  const addNewMedication = () => {
    setMedications((prev) => [
      ...prev,
      {
        name: "",
        dosage: "",
        frequency: "",
        purpose: "",
      },
    ])
  }

  const updateMedication = (index: number, field: string, value: string) => {
    setMedications((prev) =>
      prev.map((medication, i) => (i === index ? { ...medication, [field]: value } : medication)),
    )
  }

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  // Manejadores para ejercicios
  const addNewExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        frequency: "",
        duration: "",
        notes: "",
      },
    ])
  }

  const updateExercise = (index: number, field: string, value: string) => {
    setExercises((prev) => prev.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise)))
  }

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  // Manejadores para alergias
  const addNewAllergy = () => {
    setAllergies((prev) => [
      ...prev,
      {
        allergen: "",
        reaction: "",
        severity: "leve",
      },
    ])
  }

  const updateAllergy = (index: number, field: string, value: string) => {
    setAllergies((prev) => prev.map((allergy, i) => (i === index ? { ...allergy, [field]: value } : allergy)))
  }

  const removeAllergy = (index: number) => {
    setAllergies((prev) => prev.filter((_, i) => i !== index))
  }

  // Manejadores para cirugías
  const addNewSurgery = () => {
    setSurgeries((prev) => [
      ...prev,
      {
        procedure: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      },
    ])
  }

  const updateSurgery = (index: number, field: string, value: string) => {
    setSurgeries((prev) => prev.map((surgery, i) => (i === index ? { ...surgery, [field]: value } : surgery)))
  }

  const removeSurgery = (index: number) => {
    setSurgeries((prev) => prev.filter((_, i) => i !== index))
  }

  // Manejador para objetivos
  const addNewGoal = () => {
    setGoals((prev) => [...prev, ""])
  }

  const updateGoal = (index: number, value: string) => {
    setGoals((prev) => prev.map((goal, i) => (i === index ? value : goal)))
  }

  const removeGoal = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index))
  }

  // Validaciones
  const validateStep1 = () => {
    if (!basicInfo.age || isNaN(Number(basicInfo.age))) {
      setError("Por favor, ingresa una edad válida")
      return false
    }

    if (!basicInfo.gender) {
      setError("Por favor, selecciona tu género")
      return false
    }

    if (!basicInfo.height || isNaN(Number(basicInfo.height))) {
      setError("Por favor, ingresa una altura válida en cm")
      return false
    }

    if (!basicInfo.weight || isNaN(Number(basicInfo.weight))) {
      setError("Por favor, ingresa un peso válido en kg")
      return false
    }

    return true
  }

  const validateStep2 = () => {
    // Validar que todas las condiciones tengan al menos nombre y severidad
    for (const condition of conditions) {
      if (!condition.name.trim()) {
        setError("Por favor, completa el nombre de todas las condiciones médicas")
        return false
      }
      if (!condition.severity) {
        setError("Por favor, selecciona la severidad de todas las condiciones médicas")
        return false
      }
    }

    return true
  }

  const validateStep3 = () => {
    // Validar que todos los medicamentos tengan al menos nombre y dosis
    for (const medication of medications) {
      if (!medication.name.trim()) {
        setError("Por favor, completa el nombre de todos los medicamentos")
        return false
      }
      if (!medication.dosage.trim()) {
        setError("Por favor, completa la dosis de todos los medicamentos")
        return false
      }
    }

    return true
  }

  const validateStep4 = () => {
    // Validar que todos los ejercicios tengan al menos nombre
    for (const exercise of exercises) {
      if (!exercise.name.trim()) {
        setError("Por favor, completa el nombre de todos los ejercicios")
        return false
      }
    }

    return true
  }

  const validateStep5 = () => {
    // Validar que todas las alergias tengan al menos el alérgeno
    for (const allergy of allergies) {
      if (!allergy.allergen.trim()) {
        setError("Por favor, completa el alérgeno de todas las alergias")
        return false
      }
    }

    // Validar que todas las cirugías tengan al menos el procedimiento
    for (const surgery of surgeries) {
      if (!surgery.procedure.trim()) {
        setError("Por favor, completa el procedimiento de todas las cirugías")
        return false
      }
    }

    return true
  }

  const validateStep6 = () => {
    // Validar que haya al menos un objetivo
    if (goals.length === 0 || !goals.some((goal) => goal.trim())) {
      setError("Por favor, ingresa al menos un objetivo")
      return false
    }

    return true
  }

  const handleNext = () => {
    setError(null)

    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    } else if (step === 3 && validateStep3()) {
      setStep(4)
    } else if (step === 4 && validateStep4()) {
      setStep(5)
    } else if (step === 5 && validateStep5()) {
      setStep(6)
    }
  }

  const handleBack = () => {
    setError(null)
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateStep6()) return

    // Nueva lógica para obtener el usuario autenticado desde la API
    console.log("Intentando obtener el usuario autenticado desde la API...")
    const res = await fetch("/api/auth/me", { credentials: "include" })
    const data = await res.json()

    if (!res.ok || !data.success || !data.user) {
      setError("No se pudo obtener la información del usuario. Por favor, inicia sesión.")
      return
    }

    const token = data.user.id
    console.log("Usuario autenticado, ID:", token)

    setIsLoading(true)

    try {
      // Crear el perfil del paciente
      const patientId = await createPatientProfile({
        userId: token, // Usamos el token como userId
        age: Number(basicInfo.age),
        gender: basicInfo.gender as "masculino" | "femenino" | "otro",
        height: Number(basicInfo.height),
        weight: Number(basicInfo.weight),
        notes: notes,
        goals: goals.filter((goal) => goal.trim()),
      })
      console.log("Perfil de paciente creado con ID: ", patientId) // Log para confirmar creación

      // Añadir condiciones médicas
      for (const condition of conditions) {
        if (condition.name.trim()) {
          await addCondition(patientId, {
            name: condition.name,
            description: condition.description,
            severity: condition.severity as "leve" | "moderada" | "grave",
            dateOfDiagnosis: condition.dateOfDiagnosis,
          })
        }
      }

      // Añadir medicamentos
      for (const medication of medications) {
        if (medication.name.trim()) {
          await addMedication(patientId, {
            name: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            purpose: medication.purpose,
          })
        }
      }

      // Añadir ejercicios
      for (const exercise of exercises) {
        if (exercise.name.trim()) {
          await addExercise(patientId, {
            name: exercise.name,
            description: exercise.description,
            frequency: exercise.frequency,
            duration: exercise.duration,
            notes: exercise.notes,
          })
        }
      }

      // Añadir alergias
      for (const allergy of allergies) {
        if (allergy.allergen.trim()) {
          await addAllergy(patientId, {
            allergen: allergy.allergen,
            reaction: allergy.reaction,
            severity: allergy.severity as "leve" | "moderada" | "grave",
          })
        }
      }

      // Añadir cirugías
      for (const surgery of surgeries) {
        if (surgery.procedure.trim()) {
          await addSurgery(patientId, {
            procedure: surgery.procedure,
            date: surgery.date,
            notes: surgery.notes,
          })
        }
      }

      // Redirigir al chat
      router.push("/chat")
    } catch (error: any) {
      console.error("Error al crear el perfil: ", error) // Log para errores
      setError(error.message || "Hubo un error al crear el perfil.")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    Cookies.remove("auth_token")
    router.push("/login")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Perfil médico</CardTitle>
        <CardDescription className="text-center">
          {step === 1 && "Información básica para personalizar tu experiencia"}
          {step === 2 && "Cuéntanos sobre tus condiciones médicas"}
          {step === 3 && "Información sobre tus medicamentos actuales"}
          {step === 4 && "Ejercicios que realizas actualmente"}
          {step === 5 && "Alergias y cirugías previas"}
          {step === 6 && "Tus objetivos y notas adicionales"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Paso 1: Información básica */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Edad</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={basicInfo.age}
                      onChange={handleBasicInfoChange}
                      placeholder="Ingresa tu edad"
                      min="1"
                      max="120"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Género</Label>
                    <RadioGroup value={basicInfo.gender} onValueChange={handleGenderChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="masculino" id="masculino" />
                        <Label htmlFor="masculino">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="femenino" id="femenino" />
                        <Label htmlFor="femenino">Femenino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="otro" id="otro" />
                        <Label htmlFor="otro">Otro</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={basicInfo.height}
                      onChange={handleBasicInfoChange}
                      placeholder="Ingresa tu altura en cm"
                      min="50"
                      max="250"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={basicInfo.weight}
                      onChange={handleBasicInfoChange}
                      placeholder="Ingresa tu peso en kg"
                      min="1"
                      max="300"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Paso 2: Condiciones médicas */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Condiciones médicas</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addNewCondition}>
                    <Plus className="h-4 w-4 mr-2" /> Añadir condición
                  </Button>
                </div>

                {conditions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No has añadido ninguna condición médica</p>
                    <p className="text-sm">Haz clic en "Añadir condición" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {conditions.map((condition, index) => (
                      <div key={index} className="border p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Condición {index + 1}</h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nombre de la condición</Label>
                            <Input
                              value={condition.name}
                              onChange={(e) => updateCondition(index, "name", e.target.value)}
                              placeholder="Ej: Diabetes, Hipertensión, etc."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Severidad</Label>
                            <Select
                              value={condition.severity}
                              onValueChange={(value) => updateCondition(index, "severity", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la severidad" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="leve">Leve</SelectItem>
                                <SelectItem value="moderada">Moderada</SelectItem>
                                <SelectItem value="grave">Grave</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Fecha de diagnóstico</Label>
                            <Input
                              type="date"
                              value={condition.dateOfDiagnosis}
                              onChange={(e) => updateCondition(index, "dateOfDiagnosis", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Descripción</Label>
                            <Textarea
                              value={condition.description}
                              onChange={(e) => updateCondition(index, "description", e.target.value)}
                              placeholder="Describe brevemente tu condición"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Paso 3: Medicamentos */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Medicamentos actuales</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addNewMedication}>
                    <Plus className="h-4 w-4 mr-2" /> Añadir medicamento
                  </Button>
                </div>

                {medications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No has añadido ningún medicamento</p>
                    <p className="text-sm">Haz clic en "Añadir medicamento" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {medications.map((medication, index) => (
                      <div key={index} className="border p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Medicamento {index + 1}</h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMedication(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nombre del medicamento</Label>
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(index, "name", e.target.value)}
                              placeholder="Ej: Paracetamol, Ibuprofeno, etc."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Dosis</Label>
                            <Input
                              value={medication.dosage}
                              onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                              placeholder="Ej: 500mg, 1 comprimido, etc."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Frecuencia</Label>
                            <Input
                              value={medication.frequency}
                              onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                              placeholder="Ej: Cada 8 horas, 1 vez al día, etc."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Propósito</Label>
                            <Input
                              value={medication.purpose}
                              onChange={(e) => updateMedication(index, "purpose", e.target.value)}
                              placeholder="Ej: Dolor, inflamación, etc."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Paso 4: Ejercicios */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Ejercicios actuales</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addNewExercise}>
                    <Plus className="h-4 w-4 mr-2" /> Añadir ejercicio
                  </Button>
                </div>

                {exercises.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No has añadido ningún ejercicio</p>
                    <p className="text-sm">Haz clic en "Añadir ejercicio" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="border p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Ejercicio {index + 1}</h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeExercise(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nombre del ejercicio</Label>
                            <Input
                              value={exercise.name}
                              onChange={(e) => updateExercise(index, "name", e.target.value)}
                              placeholder="Ej: Estiramiento de piernas, Natación, etc."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Frecuencia</Label>
                            <Input
                              value={exercise.frequency}
                              onChange={(e) => updateExercise(index, "frequency", e.target.value)}
                              placeholder="Ej: 3 veces por semana, Diario, etc."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Duración</Label>
                            <Input
                              value={exercise.duration}
                              onChange={(e) => updateExercise(index, "duration", e.target.value)}
                              placeholder="Ej: 30 minutos, 1 hora, etc."
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Descripción</Label>
                            <Textarea
                              value={exercise.description}
                              onChange={(e) => updateExercise(index, "description", e.target.value)}
                              placeholder="Describe brevemente el ejercicio"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Notas adicionales</Label>
                            <Textarea
                              value={exercise.notes}
                              onChange={(e) => updateExercise(index, "notes", e.target.value)}
                              placeholder="Cualquier nota o precaución sobre este ejercicio"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Paso 5: Alergias y cirugías */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Alergias */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Alergias</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addNewAllergy}>
                      <Plus className="h-4 w-4 mr-2" /> Añadir alergia
                    </Button>
                  </div>

                  {allergies.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No has añadido ninguna alergia</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allergies.map((allergy, index) => (
                        <div key={index} className="border p-4 rounded-lg space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">Alergia {index + 1}</h4>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeAllergy(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Alérgeno</Label>
                              <Input
                                value={allergy.allergen}
                                onChange={(e) => updateAllergy(index, "allergen", e.target.value)}
                                placeholder="Ej: Penicilina, Látex, etc."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Severidad</Label>
                              <Select
                                value={allergy.severity}
                                onValueChange={(value) => updateAllergy(index, "severity", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona la severidad" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="leve">Leve</SelectItem>
                                  <SelectItem value="moderada">Moderada</SelectItem>
                                  <SelectItem value="grave">Grave</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label>Reacción</Label>
                              <Textarea
                                value={allergy.reaction}
                                onChange={(e) => updateAllergy(index, "reaction", e.target.value)}
                                placeholder="Describe la reacción alérgica"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cirugías */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Cirugías previas</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addNewSurgery}>
                      <Plus className="h-4 w-4 mr-2" /> Añadir cirugía
                    </Button>
                  </div>

                  {surgeries.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No has añadido ninguna cirugía</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {surgeries.map((surgery, index) => (
                        <div key={index} className="border p-4 rounded-lg space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">Cirugía {index + 1}</h4>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeSurgery(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Procedimiento</Label>
                              <Input
                                value={surgery.procedure}
                                onChange={(e) => updateSurgery(index, "procedure", e.target.value)}
                                placeholder="Ej: Apendicectomía, Artroscopia, etc."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Fecha</Label>
                              <Input
                                type="date"
                                value={surgery.date}
                                onChange={(e) => updateSurgery(index, "date", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label>Notas</Label>
                              <Textarea
                                value={surgery.notes}
                                onChange={(e) => updateSurgery(index, "notes", e.target.value)}
                                placeholder="Cualquier detalle relevante sobre la cirugía"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Paso 6: Objetivos y notas */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Objetivos */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Objetivos de fisioterapia</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addNewGoal}>
                      <Plus className="h-4 w-4 mr-2" /> Añadir objetivo
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={goal}
                          onChange={(e) => updateGoal(index, e.target.value)}
                          placeholder="Ej: Reducir dolor de espalda, Mejorar movilidad, etc."
                        />
                        {goals.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeGoal(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas adicionales */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Cualquier información adicional que consideres relevante para tu fisioterapeuta"
                    rows={4}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Botón para cerrar sesión */}
          <Button type="button" variant="outline" size="sm" onClick={handleLogout} className="mt-4">
            Cerrar sesión
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack} disabled={isLoading}>
            Atrás
          </Button>
        ) : (
          <div></div>
        )}

        {step < 6 ? (
          <Button onClick={handleNext}>Siguiente</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Completar perfil
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
