import { NextResponse } from "next/server"
import { getServerUser } from "@/lib/services/server-auth-service"
import { query } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import OpenAI from "openai"

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const user = await getServerUser()

    console.log("Usuario autenticado:", user)

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Obtener datos del request
    const body = await request.json()
    console.log("conversationId:", body.conversationId)
    //console.log("pacientId:", user.id)
    //console.log("Cuerpo de la solicitud:", body)

    const { conversationId, messages, patientId } = body

    // Si no se proporciona patientId en el cuerpo de la solicitud, buscarlo a partir del user.id
    let actualPatientId = patientId || user.id;

    // Buscar el perfil de paciente usando el user.id para obtener el patientId correcto
    if (!patientId) {
      const patientProfile = await query(
        `SELECT id FROM patient_profiles WHERE user_id = $1`,
        [user.id]
      );

      if (!patientProfile.length) {
        return NextResponse.json({ error: "No se encontró el perfil de paciente asociado con el usuario" }, { status: 404 });
      }

      actualPatientId = patientProfile[0].id;  // Asignar el patientId correcto
    }

    // Validar que todos los valores requeridos estén presentes
    if (!conversationId || !messages || !actualPatientId || conversationId.trim() === "" || !messages.length || actualPatientId.trim() === "") {
      return NextResponse.json(
        { error: "Faltan datos requeridos: conversationId, messages o patientId" },
        { status: 400 }
      )
    }

    // Log para verificar que se esté recibiendo el patientId
    console.log("ID del paciente:", actualPatientId)

    // Tomar solo el último mensaje del array
    const { content: message, role } = messages[messages.length - 1]

    // Log para depuración
    console.log("Recibido:", { conversationId, message, patientId: actualPatientId });

    // Obtener o crear conversación
    let currentConversationId = null

    // Verificar si la conversación ya existe
    if (!currentConversationId) {
      // Realizar la consulta para ver si ya existe la conversación
      const existingConversation = await query(
        `SELECT id FROM conversations WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [actualPatientId]
      )
      console.log("pacientId despues de la consulta:", actualPatientId)

      // Si no existe la conversación, crear una nueva
      if (!existingConversation.length) {
        const newConversationId = uuidv4()
        console.log("Creando nueva conversación con ID:", newConversationId)

        const result = await query(
          `INSERT INTO conversations (id, patient_id, title, created_at, updated_at) 
           VALUES ($1, $2, $3, NOW(), NOW())`,
          [newConversationId, actualPatientId, `Conversación ${new Date().toLocaleDateString()}`],
        )

        // Verificar si la inserción fue exitosa
        console.log("Resultado de inserción de conversación:", result)

        currentConversationId = newConversationId
      } else {
        // Si ya existe, utilizar el ID de la conversación existente
        currentConversationId = existingConversation[0].id
        console.log("Usando conversación existente con ID:", currentConversationId)
      }
    } else {
      // Verificar que el conversationId ya exista
      const existingConversation = await query(
        `SELECT 1 FROM conversations WHERE id = $1`,
        [currentConversationId]
      )

      if (!existingConversation.length) {
        return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 })
      }
    }

    // Guardar mensaje del usuario
    await query(
      `INSERT INTO messages (conversation_id, content, role, timestamp) 
       VALUES ($1, $2, $3, NOW())`,
      [currentConversationId, message, role],
    )

    // Obtener historial de mensajes para contexto
    const messageHistory = await query(
      `SELECT content, role FROM messages 
       WHERE conversation_id = $1 
       ORDER BY timestamp ASC 
       LIMIT 10`,
      [currentConversationId],
    )

    // Obtener información del paciente para contexto
    const [patientProfile] = await query(`SELECT * FROM patient_profiles WHERE id = $1`, [actualPatientId])

    // Verificar que se obtuvo el perfil del paciente
    if (!patientProfile) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })
    }

    console.log("Perfil del paciente:", patientProfile)

    const conditions = await query(`SELECT name, description FROM conditions WHERE patient_id = $1`, [actualPatientId])

    const medications = await query(`SELECT name, dosage, frequency FROM medications WHERE patient_id = $1`, [
      actualPatientId,
    ])

    const exercises = await query(
      `SELECT name, description, frequency, duration FROM exercises WHERE patient_id = $1`,
      [actualPatientId],
    )

    // Crear contexto para OpenAI
    const systemPrompt = `
      Eres un asistente de fisioterapia inteligente con el objetivo de proporcionar respuestas basadas en la evidencia científica y empatía. Tu tarea es ayudar al paciente con sus necesidades de fisioterapia de manera clara, profesional y motivadora. A continuación, se detallan datos importantes para ofrecer recomendaciones más precisas:

      Información del paciente:
      - Edad: ${patientProfile?.age || "No disponible"}
      - Género: ${patientProfile?.gender || "No disponible"}
      - Altura: ${patientProfile?.height || "No disponible"} cm
      - Peso: ${patientProfile?.weight || "No disponible"} kg
      - Notas: ${patientProfile?.notes || "No disponibles"}
      - Nivel de actividad: ${patientProfile?.activity_level || "No disponible"}
      - Historial médico: ${patientProfile?.medical_history || "No disponible"}

      Condiciones médicas:
      ${conditions.map((c) => `- ${c.name}: ${c.description}`).join("\n") || "No hay condiciones registradas"}

      Medicamentos:
      ${medications.map((m) => `- ${m.name}: ${m.dosage}, ${m.frequency}`).join("\n") || "No hay medicamentos registrados"}

      Ejercicios recomendados:
      ${exercises.map((e) => `- ${e.name}: ${e.description}, ${e.frequency}, ${e.duration}`).join("\n") || "No hay ejercicios registrados"}

      Objetivos de fisioterapia:
      - ${patientProfile?.goals || "No disponibles"} (Si el paciente tiene metas específicas de tratamiento, por ejemplo: reducir el dolor lumbar, mejorar la movilidad de la rodilla, etc.)

      Restricciones o preferencias del paciente:
      - ${patientProfile?.restrictions || "No disponibles"} (Por ejemplo, evitar ciertos ejercicios por razones médicas o preferencias personales).

      Comportamiento pasado:
      - ${patientProfile?.past_behavior || "No disponible"} (Si el paciente ha mostrado dificultades para seguir el tratamiento, como falta de adherencia o quejas constantes, utiliza esta información para ofrecer respuestas motivacionales y prácticas).

      Instrucciones adicionales:
      - Si el paciente muestra frustración o inseguridad en sus respuestas, sé más alentador, brindando consejos prácticos que se ajusten a su nivel actual de compromiso.
      - Si el paciente no proporciona suficiente información sobre sus síntomas o tratamiento, solicita amablemente más detalles para ofrecer mejores recomendaciones.
      - Evita hacer suposiciones o dar respuestas generales que puedan ser inexactas. Si no tienes suficiente información, explícitamente indica que no puedes proporcionar una recomendación y solicita más datos.
      - Utiliza formato Markdown para todas las respuestas. Prioriza listas con viñetas (por ejemplo: "* Ejemplo 1") en lugar de listas numeradas, excepto cuando la secuencia sea estrictamente necesaria.
      
      Responde de manera clara, honesta y empática, brindando siempre opciones viables y personalizadas según las circunstancias del paciente.
      `

    // Crear los mensajes para OpenAI, incluyendo el mensaje del usuario
    const messagesForOpenAI = [
      { role: "system", content: systemPrompt },
      ...messageHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message }  // Incluir el mensaje del usuario
    ]

    // Llamar a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messagesForOpenAI as any,
      temperature: 0.6,
      max_tokens: 1000,
    })

    // Obtener solo la respuesta generada por OpenAI
    const aiResponse = completion.choices[0].message.content

    // Guardar respuesta de la IA (solo la respuesta, no todo el cuerpo del mensaje)
    await query(
      `INSERT INTO messages (conversation_id, content, role, timestamp) 
       VALUES ($1, $2, $3, NOW())`,
      [currentConversationId, aiResponse, "assistant"],
    )

    // Actualizar fecha de actualización de la conversación
    await query(
      `UPDATE conversations 
       SET updated_at = NOW() 
       WHERE id = $1`,
      [currentConversationId],
    )

    // Enviar solo la respuesta al usuario
    return NextResponse.json(aiResponse)

  } catch (error) {
    console.error("Error en el chat:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
