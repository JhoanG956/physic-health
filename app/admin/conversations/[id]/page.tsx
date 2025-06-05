import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getConversation } from "@/lib/services/conversation-service"
import { getPatientProfile } from "@/lib/services/patient-service"
import { ConversationHeader } from "@/components/admin/conversation-header"
import { ConversationMessages } from "@/components/admin/conversation-messages"

interface ConversationPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ConversationPageProps): Promise<Metadata> {
  const conversation = await getConversation(params.id)

  if (!conversation) {
    return {
      title: "Conversación no encontrada | Physio Health",
    }
  }

  return {
    title: `${conversation.title || "Conversación"} | Physio Health`,
    description: `Historial de conversación`,
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const conversation = await getConversation(params.id)

  if (!conversation) {
    notFound()
  }

  const patient = await getPatientProfile(conversation.patientId)

  return (
    <div className="container mx-auto px-4 py-8">
      <ConversationHeader conversation={conversation} patient={patient} />
      <ConversationMessages messages={conversation.messages} />
    </div>
  )
}
