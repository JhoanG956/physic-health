"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Plus, Trash2, Save, UserCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Cookies ya no es necesario si usas un hook de auth que maneje la sesión
import type {
  PatientProfile,
  PatientCondition,
  PatientMedication,
  PatientExercise,
  PatientAllergy,
  PatientSurgery,
} from "@/lib/services/patient-service"

// Simulación de un hook de autenticación. Reemplaza con tu lógica real.
const useAuthUser = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true) // Iniciar carga
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.user) {
            setUser({ id: data.user.id, name: data.user.name })
          } else {
            console.warn("Usuario no autenticado o datos incompletos.")
            setUser(null) // Asegurar que user es null si no hay autenticación
          }
        } else {
          setUser(null) // Asegurar que user es null si la respuesta no es ok
        }
      } catch (e) {
        console.error("Error fetching user", e)
        setUser(null) // Asegurar que user es null en caso de error
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])
  return { user, loading }
}

export function MedicalProfileForm() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuthUser()
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false) // Para el submit del formulario
  const [isLoadingProfile, setIsLoadingProfile] = useState(true) // Para carga de datos iniciales del perfil
  const [error, setError] = useState<string | null>(null)

  const [basicInfo, setBasicInfo] = useState({ age: "", gender: "", height: "", weight: "" })
  const [conditions, setConditions] = useState<PatientCondition[]>([])
  const [medications, setMedications] = useState<PatientMedication[]>([])
  const [exercises, setExercises] = useState<PatientExercise[]>([])
  const [allergies, setAllergies] = useState<PatientAllergy[]>([])
  const [surgeries, setSurgeries] = useState<PatientSurgery[]>([])
  const [notes, setNotes] = useState("")
  const [goals, setGoals] = useState<string[]>([""])
  const [lastVisit, setLastVisit] = useState("")
  const [nextVisit, setNextVisit] = useState("")

  useEffect(() => {
    if (authUser && !authLoading) {
      setIsLoadingProfile(true)
      fetch(`/api/patients/profile`)
        .then((res) => {
          if (!res.ok) {
            // Manejar respuestas no exitosas de la API
            if (res.status === 401) {
              // No autorizado
              router.push("/login") // Redirigir si no está autorizado
              throw new Error("No autenticado")
            }
            // Para otros errores, intentar parsear el JSON si es posible
            return res.json().then((errData) => {
              throw new Error(errData.error || `Error del servidor: ${res.status}`)
            })
          }
          return res.json()
        })
        .then((data) => {
          if (data.profile) {
            // Si profile existe en la respuesta
            const profile: PatientProfile = data.profile
            setEditingProfileId(profile.id)
            setBasicInfo({
              age: profile.age?.toString() || "",
              gender: profile.gender || "",
              height: profile.height?.toString() || "",
              weight: profile.weight?.toString() || "",
            })
            setConditions(profile.conditions || [])
            setMedications(profile.medications || [])
            setExercises(profile.exercises || [])
            setAllergies(profile.allergies || [])
            setSurgeries(profile.surgeries || [])
            setNotes(profile.notes || "")
            setGoals(profile.goals && profile.goals.length > 0 ? profile.goals : [""])
            setLastVisit(profile.lastVisit || "")
            setNextVisit(profile.nextVisit || "")
          } else {
            // Perfil no encontrado, es un nuevo perfil
            setEditingProfileId(null)
            // Resetear campos por si acaso
            setBasicInfo({ age: "", gender: "", height: "", weight: "" })
            setConditions([])
            setMedications([])
            setExercises([])
            setAllergies([])
            setSurgeries([])
            setNotes("")
            setGoals([""])
            setLastVisit("")
            setNextVisit("")
          }
        })
        .catch((err) => {
          console.error("Error cargando perfil:", err)
          if (err.message !== "No autenticado") {
            // No mostrar error si ya se redirigió
            setError("No se pudo cargar tu perfil. " + err.message)
          }
        })
        .finally(() => setIsLoadingProfile(false))
    } else if (!authUser && !authLoading) {
      // Si no hay usuario autenticado y la carga de auth ha terminado, no cargar perfil
      setIsLoadingProfile(false)
    }
  }, [authUser, authLoading, router])

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBasicInfo((prev) => ({ ...prev, [name]: value }))
  }
  const handleGenderChange = (value: string) => setBasicInfo((prev) => ({ ...prev, gender: value }))
  const addNewCondition = () =>
    setConditions((prev) => [
      ...prev,
      { name: "", description: "", severity: "leve", dateOfDiagnosis: new Date().toISOString().split("T")[0] },
    ])
  const updateCondition = (index: number, field: string, value: string) =>
    setConditions((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const removeCondition = (index: number) => setConditions((prev) => prev.filter((_, i) => i !== index))

  const addNewMedication = () =>
    setMedications((prev) => [...prev, { name: "", dosage: "", frequency: "", purpose: "" }])
  const updateMedication = (index: number, field: string, value: string) =>
    setMedications((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const removeMedication = (index: number) => setMedications((prev) => prev.filter((_, i) => i !== index))

  const addNewExercise = () =>
    setExercises((prev) => [...prev, { name: "", description: "", frequency: "", duration: "", notes: "" }])
  const updateExercise = (index: number, field: string, value: string) =>
    setExercises((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const removeExercise = (index: number) => setExercises((prev) => prev.filter((_, i) => i !== index))

  const addNewAllergy = () => setAllergies((prev) => [...prev, { allergen: "", reaction: "", severity: "leve" }])
  const updateAllergy = (index: number, field: string, value: string) =>
    setAllergies((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const removeAllergy = (index: number) => setAllergies((prev) => prev.filter((_, i) => i !== index))

  const addNewSurgery = () =>
    setSurgeries((prev) => [...prev, { procedure: "", date: new Date().toISOString().split("T")[0], notes: "" }])
  const updateSurgery = (index: number, field: string, value: string) =>
    setSurgeries((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const removeSurgery = (index: number) => setSurgeries((prev) => prev.filter((_, i) => i !== index))

  const addNewGoal = () => setGoals((prev) => [...prev, ""])
  const updateGoal = (index: number, value: string) =>
    setGoals((prev) => prev.map((goal, i) => (i === index ? value : goal)))
  const removeGoal = (index: number) => setGoals((prev) => prev.filter((_, i) => i !== index && goals.length > 1))

  const validateStep1 = () => {
    if (!basicInfo.age || isNaN(Number(basicInfo.age)) || Number(basicInfo.age) <= 0) {
      setError("Por favor, ingresa una edad válida.")
      return false
    }
    if (!basicInfo.gender) {
      setError("Por favor, selecciona tu género.")
      return false
    }
    if (!basicInfo.height || isNaN(Number(basicInfo.height)) || Number(basicInfo.height) <= 0) {
      setError("Por favor, ingresa una altura válida en cm.")
      return false
    }
    if (!basicInfo.weight || isNaN(Number(basicInfo.weight)) || Number(basicInfo.weight) <= 0) {
      setError("Por favor, ingresa un peso válido en kg.")
      return false
    }
    setError(null)
    return true
  }
  const validateStep2 = () => {
    for (const condition of conditions) {
      if (!condition.name.trim()) {
        setError("Completa el nombre de todas las condiciones médicas.")
        return false
      }
      if (!condition.severity) {
        setError("Selecciona la severidad de todas las condiciones médicas.")
        return false
      }
    }
    setError(null)
    return true
  }
  const validateStep3 = () => {
    for (const medication of medications) {
      if (!medication.name.trim()) {
        setError("Completa el nombre de todos los medicamentos.")
        return false
      }
      if (!medication.dosage.trim()) {
        setError("Completa la dosis de todos los medicamentos.")
        return false
      }
    }
    setError(null)
    return true
  }
  const validateStep4 = () => {
    for (const exercise of exercises) {
      if (!exercise.name.trim()) {
        setError("Completa el nombre de todos los ejercicios.")
        return false
      }
    }
    setError(null)
    return true
  }
  const validateStep5 = () => {
    for (const allergy of allergies) {
      if (!allergy.allergen.trim()) {
        setError("Completa el alérgeno de todas las alergias.")
        return false
      }
    }
    for (const surgery of surgeries) {
      if (!surgery.procedure.trim()) {
        setError("Completa el procedimiento de todas las cirugías.")
        return false
      }
    }
    setError(null)
    return true
  }
  const validateStep6 = () => {
    if (goals.length === 0 || !goals.some((goal) => goal.trim())) {
      setError("Ingresa al menos un objetivo.")
      return false
    }
    setError(null)
    return true
  }

  const handleNext = () => {
    setError(null)
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
    else if (step === 3 && validateStep3()) setStep(4)
    else if (step === 4 && validateStep4()) setStep(5)
    else if (step === 5 && validateStep5()) setStep(6)
  }
  const handleBack = () => {
    setError(null)
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateStep6()) return
    if (!authUser) {
      setError("Debes iniciar sesión para guardar tu perfil.")
      return
    }

    setIsSubmitting(true)

    const profilePayload = {
      // userId no es necesario en el payload si la API lo toma del token
      age: Number(basicInfo.age),
      gender: basicInfo.gender as "masculino" | "femenino" | "otro",
      height: Number(basicInfo.height),
      weight: Number(basicInfo.weight),
      notes: notes,
      goals: goals.filter((goal) => goal.trim()),
      lastVisit: lastVisit || undefined,
      nextVisit: nextVisit || undefined,
      conditions: conditions.filter((c) => c.name.trim()),
      medications: medications.filter((m) => m.name.trim()),
      exercises: exercises.filter((ex) => ex.name.trim()),
      allergies: allergies.filter((a) => a.allergen.trim()),
      surgeries: surgeries.filter((s) => s.procedure.trim()),
    }

    try {
      let response
      if (editingProfileId) {
        // Actualizar perfil existente
        response = await fetch(`/api/patients/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profilePayload),
        })
      } else {
        // Crear nuevo perfil
        response = await fetch(`/api/patients/profile`, {
          // Usar el mismo endpoint, pero con POST
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profilePayload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status} al guardar el perfil.`)
      }

      // const responseData = await response.json(); // Opcional, si necesitas datos de la respuesta
      // if (responseData.patientId && !editingProfileId) {
      //   setEditingProfileId(responseData.patientId); // Actualizar ID si se creó uno nuevo
      // }

      router.push("/chat") // Redirigir tras éxito
    } catch (error: any) {
      console.error("Error al guardar el perfil:", error)
      setError(error.message || "Hubo un error al guardar el perfil.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      setError("No se pudo cerrar sesión. Inténtalo de nuevo.")
    }
  }

  if (authLoading || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-deep-blue" />
      </div>
    )
  }

  if (!authUser && !authLoading) {
    // Si terminó de cargar auth y no hay usuario
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>Debes iniciar sesión para ver o editar tu perfil médico.</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center">
          <UserCircle className="h-8 w-8 mr-3 text-deep-blue dark:text-sky-blue" />
          {editingProfileId ? "Actualizar Perfil Médico" : "Completar Perfil Médico"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === 1 && "Información básica para personalizar tu experiencia"}
          {step === 2 && "Cuéntanos sobre tus condiciones médicas"}
          {step === 3 && "Información sobre tus medicamentos actuales"}
          {step === 4 && "Ejercicios que realizas actualmente"}
          {step === 5 && "Alergias y cirugías previas"}
          {step === 6 && "Tus objetivos, visitas y notas adicionales"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
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
                    <RadioGroup
                      value={basicInfo.gender}
                      onValueChange={handleGenderChange}
                      className="flex space-x-4 pt-2"
                    >
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
                            <Label>Nombre</Label>
                            <Input
                              value={condition.name}
                              onChange={(e) => updateCondition(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Severidad</Label>
                            <Select
                              value={condition.severity}
                              onValueChange={(value) => updateCondition(index, "severity", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
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
                            <Label>Nombre</Label>
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Dosis</Label>
                            <Input
                              value={medication.dosage}
                              onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Frecuencia</Label>
                            <Input
                              value={medication.frequency}
                              onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Propósito</Label>
                            <Input
                              value={medication.purpose}
                              onChange={(e) => updateMedication(index, "purpose", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
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
                            <Label>Nombre</Label>
                            <Input
                              value={exercise.name}
                              onChange={(e) => updateExercise(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Frecuencia</Label>
                            <Input
                              value={exercise.frequency}
                              onChange={(e) => updateExercise(index, "frequency", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duración</Label>
                            <Input
                              value={exercise.duration}
                              onChange={(e) => updateExercise(index, "duration", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Descripción</Label>
                            <Textarea
                              value={exercise.description}
                              onChange={(e) => updateExercise(index, "description", e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Notas</Label>
                            <Textarea
                              value={exercise.notes || ""}
                              onChange={(e) => updateExercise(index, "notes", e.target.value)}
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
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
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
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Severidad</Label>
                              <Select
                                value={allergy.severity}
                                onValueChange={(value) => updateAllergy(index, "severity", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
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
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                                value={surgery.notes || ""}
                                onChange={(e) => updateSurgery(index, "notes", e.target.value)}
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
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
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
                          placeholder="Ej: Reducir dolor, Mejorar movilidad"
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
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastVisit">Última visita (opcional)</Label>
                    <Input
                      id="lastVisit"
                      type="date"
                      value={lastVisit}
                      onChange={(e) => setLastVisit(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextVisit">Próxima visita (opcional)</Label>
                    <Input
                      id="nextVisit"
                      type="date"
                      value={nextVisit}
                      onChange={(e) => setNextVisit(e.target.value)}
                    />
                  </div>
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
        </form>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              Atrás
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-destructive"
          >
            Cerrar sesión
          </Button>
        </div>

        {step < 6 ? (
          <Button onClick={handleNext}>Siguiente</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingProfileId ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Actualizar Perfil
              </>
            ) : (
              "Completar Perfil"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
