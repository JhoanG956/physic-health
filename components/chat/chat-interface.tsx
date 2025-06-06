"use client"

import type React from "react"
import Link from "next/link" // Importar Link
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { PromptEditor } from "./prompt-editor"
import { useChat } from "@/hooks/use-chat"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, Plus, Trash2, Menu, X, UserCog } from "lucide-react" // Añadir UserCog
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Prompt del sistema predeterminado (sin cambios)
const DEFAULT_SYSTEM_PROMPT = `Eres un asistente de fisioterapia profesional llamado PhysioBot. 
Tu objetivo es ayudar a los usuarios con recomendaciones personalizadas, ejercicios y consejos relacionados con la fisioterapia.

Debes:
- Ser amable, profesional y empático
- Proporcionar información precisa basada en conocimientos de fisioterapia
- Sugerir ejercicios adecuados según las necesidades del usuario
- Recordar siempre que no reemplazas a un fisioterapeuta real
- Animar a los usuarios a consultar con profesionales para casos específicos
- Usar un lenguaje claro y accesible

Cuando recomiendes ejercicios, describe brevemente cómo realizarlos correctamente.
Si el usuario menciona dolor agudo o síntomas graves, recomienda siempre buscar atención médica profesional.`

export function ChatInterface() {
  const router = useRouter()
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [conversationId, setConversationId] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const { messages, isLoading: isChatLoading, error: chatError, sendMessage } = useChat({ conversationId })

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    async function loadUserAndProfile() {
      try {
        setIsLoading(true)

        const userResponse = await fetch("/api/auth/me")
        if (!userResponse.ok) {
          if (userResponse.status === 401) return router.push("/login")
          throw new Error("Error al obtener el usuario actual")
        }

        const userData = await userResponse.json()
        setCurrentUser(userData.user)

        const profileResponse = await fetch(`/api/patients/profile?userId=${userData.user.id}`)
        if (!profileResponse.ok) {
          // No lanzar error si es 404, el perfil puede no existir aún
          if (profileResponse.status === 404) {
            console.log("Perfil no encontrado, se puede crear uno nuevo.")
            setPatientProfile(null) // Asegurarse que patientProfile es null
          } else {
            throw new Error("Error al obtener el perfil del paciente")
          }
        } else {
          const profileData = await profileResponse.json()
          if (profileData.profile) {
            // Verificar si profile existe en la respuesta
            setPatientProfile(profileData.profile)
          } else {
            console.log("Perfil no encontrado (profileData.profile es null), se puede crear uno nuevo.")
            setPatientProfile(null)
          }
        }
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndProfile()
  }, [router])

  useEffect(() => {
    // Cargar conversaciones solo si hay un perfil de paciente Y el usuario actual está definido
    if (patientProfile && currentUser) {
      loadConversations()
    }
  }, [patientProfile, currentUser]) // Añadir currentUser como dependencia

  const loadConversations = async () => {
    if (!patientProfile || !patientProfile.id) {
      // Asegurarse que patientProfile.id existe
      console.log("No se puede cargar conversaciones: patientProfile o patientProfile.id no está definido.")
      return
    }
    setIsLoadingConversations(true)
    try {
      const response = await fetch(`/api/conversations?patientId=${patientProfile.id}`)
      if (!response.ok) throw new Error("Error al cargar conversaciones")
      const data = await response.json()
      const conversationsData = Array.isArray(data) ? data : data.conversations || []

      const grouped = conversationsData.reduce((acc: any[], conv: any) => {
        const { message_id, content, message_created_at, role, ...rest } = conv // Incluir 'role'
        const existing = acc.find((c) => c.id === rest.id)
        if (existing) {
          existing.messages.push({ message_id, content, created_at: message_created_at, role })
        } else {
          acc.push({ ...rest, messages: [{ message_id, content, created_at: message_created_at, role }] })
        }
        return acc
      }, [])

      // Ordenar mensajes dentro de cada conversación por fecha
      grouped.forEach((conv: { id: string; messages: any[] }) => {
        conv.messages.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      })

      setConversations(grouped)
    } catch (error) {
      console.error("Error al cargar conversaciones:", error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!patientProfile && !currentUser) {
      setError("No se ha podido cargar tu perfil o información de usuario. Intenta recargar la página.")
      return
    }

    let currentConversationId = conversationId

    // Si no hay perfil de paciente, el usuario debe ir a onboarding primero.
    // Esta lógica podría necesitar ajuste si permites chatear sin perfil completo.
    if (!patientProfile) {
      router.push("/onboarding")
      // O mostrar un mensaje para completar el perfil
      // setError("Por favor, completa tu perfil médico para comenzar a chatear.");
      return
    }

    // Si no hay conversación activa, crea una nueva con título generado
    if (!currentConversationId) {
      const initialTitle = content.slice(0, 40) + (content.length > 40 ? "..." : "")
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId: patientProfile.id, title: initialTitle }),
        })
        if (!res.ok) throw new Error("Error al crear nueva conversación")
        const data = await res.json()
        setConversationId(data.conversationId)
        currentConversationId = data.conversationId // Actualizar para el envío del mensaje
        await loadConversations() // Recargar lista de conversaciones
      } catch (err) {
        console.error(err)
        setError("No se pudo crear una nueva conversación.")
        return
      }
    }
    // Asegurarse que currentConversationId está definido antes de enviar el mensaje
    
    sendMessage(content, customPrompt) // Pasar el ID de la conversación
    
  }

  const handleSavePrompt = (newPrompt: string) => setCustomPrompt(newPrompt)

  const handleSelectConversation = (id: string) => {
    setConversationId(id)
    if (isMobile) setSidebarOpen(false)
  }

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    if (lastUserMessage && patientProfile && conversationId) {
      // Asegurar que conversationId existe
      sendMessage(lastUserMessage.content, customPrompt)
    }
  }

  const handleCreateNewConversation = async () => {
    if (!patientProfile) {
      router.push("/onboarding") // O mostrar mensaje
      return
    }
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patientProfile.id, title: "Nueva conversación" }),
      })
      if (!res.ok) throw new Error("Error al crear nueva conversación")
      const data = await res.json()
      setConversationId(data.conversationId)
      loadConversations() // Recargar lista
    } catch (err) {
      console.error(err)
      setError("No se pudo crear una nueva conversación.")
    }
  }

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm("¿Estás seguro de eliminar esta conversación?")) {
      try {
        const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" })
        if (res.ok) {
          setConversations(conversations.filter((c) => c.id !== id))
          if (conversationId === id) setConversationId(undefined) // Limpiar ID si se borra la activa
        } else {
          throw new Error("Error al eliminar conversación desde el servidor")
        }
      } catch (err) {
        console.error(err)
        setError("No se pudo eliminar la conversación.")
      }
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const getConversationTitle = (c: any): string => {
    if (c.title && c.title !== "Nueva conversación") return c.title
    // Buscar el primer mensaje del usuario para generar un título si no hay uno explícito
    const firstUserMessage = c.messages?.find((m: any) => m.role === "user")
    return (
      firstUserMessage?.content?.slice(0, 30) + (firstUserMessage?.content?.length > 30 ? "..." : "") || "Conversación"
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-white/70 dark:bg-slate-900/60 rounded-2xl border shadow-xl backdrop-blur-md">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-mint rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-white/70 dark:bg-slate-900/60 rounded-2xl border shadow-xl backdrop-blur-md">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.refresh()}>Intentar de nuevo</Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-full max-h-[100dvh] h-full rounded-2xl overflow-hidden border shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-md relative"
    >
      {/* SIDEBAR */}
      <div
        className={`relative transition-all duration-300 ease-in-out ${sidebarOpen ? "w-72" : "w-0"} border-r flex-shrink-0`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full bg-white/80 dark:bg-slate-900/80 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-700 dark:text-white">Conversaciones</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-md">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Button onClick={handleCreateNewConversation} className="mb-2">
              <Plus className="h-4 w-4 mr-2" /> Nueva conversación
            </Button>
            <Link href="/onboarding" passHref legacyBehavior>
              <Button variant="outline" className="w-full mb-4">
                <UserCog className="h-4 w-4 mr-2" /> Mi Perfil Médico
              </Button>
            </Link>
            <ScrollArea className="flex-1 pr-1">
              {isLoadingConversations ? (
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-4 mb-3 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer group min-h-[90px] flex flex-col gap-1 justify-between ${conversationId === conv.id ? "bg-mint/20 dark:bg-mint/30 border-mint" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 leading-snug">
                        {getConversationTitle(conv)}
                      </h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-500 dark:text-slate-300 hover:text-red-600"
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {conv.messages?.length || 0} mensaje(s)
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center">No hay conversaciones previas</p>
              )}
            </ScrollArea>
          </div>
        )}
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur relative">
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2" aria-label="Abrir sidebar">
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center gap-2">
            {isMobile && sidebarOpen === false && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <h2 className="text-lg font-semibold">Physio</h2>
                <h2 className="text-lg font-bold text-mint dark:text-mint/90">Health</h2>
              </div>
              <p className="text-xs text-muted-foreground">Hola, {currentUser?.name || "..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PromptEditor defaultPrompt={DEFAULT_SYSTEM_PROMPT} onSave={handleSavePrompt} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {chatError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{chatError}</span>
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  <RefreshCw className="h-3 w-3 mr-1" /> Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <AnimatePresence initial={false}>
            <ChatMessages messages={messages} isLoading={isChatLoading} />
          </AnimatePresence>
        </div>

        <ChatInput onSend={handleSendMessage} isLoading={isChatLoading || isLoading} />
      </div>
    </motion.div>
  )
}