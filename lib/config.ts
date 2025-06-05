const config = {
  // Base de datos
  databaseUrl: process.env.DATABASE_URL || "",

  // Autenticación
  jwtSecret: process.env.JWT_SECRET || "",

  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || "",

  // Entorno
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Verificar que todas las variables de entorno requeridas estén definidas
  validateEnv: () => {
    const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "OPENAI_API_KEY"]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      console.error(`Error: Variables de entorno faltantes: ${missingEnvVars.join(", ")}`)
      console.error("Por favor, asegúrate de que todas las variables de entorno requeridas estén definidas.")
      console.error('Puedes usar "vercel env pull" para descargar las variables de entorno de tu proyecto Vercel.')

      if (process.env.NODE_ENV === "development") {
        console.error("También puedes crear un archivo .env.local con las variables requeridas.")
      }

      return false
    }

    return true
  },
}

export default config
