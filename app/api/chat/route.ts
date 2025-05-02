import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

// Inicializar el cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Definimos el prompt base del sistema
const baseSystemPrompt = `Eres un asistente de fisioterapia profesional llamado PhysioBot. 
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

export async function POST(req: Request) {
  try {
    const { messages, customPrompt, patientContext } = await req.json()

    // Construir el prompt del sistema con el contexto del paciente
    let finalSystemPrompt = customPrompt || baseSystemPrompt

    if (patientContext) {
      finalSystemPrompt = `${finalSystemPrompt}

A continuación se presenta información importante sobre el paciente con el que estás interactuando. 
Utiliza esta información para personalizar tus respuestas y recomendaciones:

${patientContext}

Recuerda siempre tener en cuenta esta información al responder, pero no la repitas explícitamente a menos que sea relevante para la consulta.
Mantén un tono conversacional y natural, como si ya conocieras al paciente.`
    }

    // Preparamos los mensajes para OpenAI
    const apiMessages = [
      { role: "system", content: finalSystemPrompt },
      ...messages.map((message: any) => ({
        role: message.role,
        content: message.content,
      })),
    ]

    // Creamos el stream de OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Convertimos la respuesta a un stream
    const stream = OpenAIStream(response)

    // Devolvemos la respuesta como un stream
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error en la API de chat:", error)
    return new Response(JSON.stringify({ error: "Error al procesar la solicitud" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
