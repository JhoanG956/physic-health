"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { PromptEditor } from "./prompt-editor"
import { ConversationHistory } from "./conversation-history"
import { useChat } from "@/hooks/use-chat"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, Plus, Trash2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Prompt del sistema predeterminado
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

  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
  } = useChat({ conversationId })

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
          if (profileResponse.status === 404) return router.push("/onboarding")
          throw new Error("Error al obtener el perfil del paciente")
        }

        const profileData = await profileResponse.json()
        setPatientProfile(profileData.profile)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndProfile()
  }, [router])

  useEffect(() => {
    if (patientProfile) {
      loadConversations()
    }
  }, [patientProfile])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations?patientId=${patientProfile.id}`)
      if (!response.ok) throw new Error("Error al cargar conversaciones")
      const data = await response.json()
      const conversationsData = Array.isArray(data) ? data : data.conversations || []

      const grouped = conversationsData.reduce((acc: any[], conv: any) => {
        const { message_id, content, message_created_at, ...rest } = conv
        const existing = acc.find((c) => c.id === rest.id)
        if (existing) {
          existing.messages.push({ message_id, content, created_at: message_created_at })
        } else {
          acc.push({ ...rest, messages: [{ message_id, content, created_at: message_created_at }] })
        }
        return acc
      }, [])

      setConversations(grouped)
    } catch (error) {
      console.error("Error al cargar conversaciones:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = (content: string) => {
    if (patientProfile) sendMessage(content, customPrompt)
  }

  const handleSavePrompt = (newPrompt: string) => setCustomPrompt(newPrompt)

  const handleSelectConversation = (id: string) => {
    setConversationId(id)
    if (isMobile) setSidebarOpen(false)
  }

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    if (lastUserMessage && patientProfile) {
      sendMessage(lastUserMessage.content, customPrompt)
    }
  }

  const handleCreateNewConversation = async () => {
    if (!patientProfile) return
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patientProfile.id }),
      })
      if (!res.ok) throw new Error("Error al crear nueva conversación")
      const data = await res.json()
      setConversationId(data.conversationId)
      loadConversations()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm("¿Estás seguro de eliminar esta conversación?")) {
      try {
        const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" })
        if (res.ok) {
          setConversations(conversations.filter((c) => c.id !== id))
          if (conversationId === id) setConversationId(undefined)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const getConversationTitle = (c: any): string => {
    if (c.title) return c.title
    const userMessages = c.messages?.filter((m: any) => m.role === "user") || []
    return userMessages[0]?.content?.slice(0, 30) + "..." || "Nueva conversación"
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
          <h3 className="text-lg font-medium mb-2">Error al cargar tu perfil</h3>
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
      className="flex w-full max-h-[100dvh] h-full rounded-2xl overflow-hidden border shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-md"
    >
      {/* SIDEBAR */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "w-72" : "w-0"} border-r`}>
        {sidebarOpen && (
          <div className="flex flex-col h-full bg-white/80 dark:bg-slate-900/80 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-slate-700 dark:text-white">Conversaciones</h2>
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button onClick={handleCreateNewConversation} className="mb-4">
              <Plus className="h-4 w-4 mr-2" /> Nueva conversación
            </Button>
            <ScrollArea className="flex-1 pr-1">
              {isLoadingConversations ? (
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className="p-4 mb-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{getConversationTitle(conv)}</h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-500 dark:text-slate-300 hover:text-red-600"
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{conv.messages?.length || 0} mensaje(s)</p>
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
        <div className="flex justify-between items-center p-4 border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="text-lg font-semibold">Phy</h2>
              <p className="text-xs text-muted-foreground">Hola, {currentUser?.name || "..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* {patientProfile && (
              <ConversationHistory patientId={patientProfile.id} onSelectConversation={handleSelectConversation} />
            )} */}
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

        <ChatInput onSend={handleSendMessage} isLoading={isChatLoading} />
      </div>
    </motion.div>
  )
}