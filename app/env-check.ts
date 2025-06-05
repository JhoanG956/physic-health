export function checkEnvironment() {
  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "OPENAI_API_KEY"]

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.warn(`⚠️ Faltan las siguientes variables de entorno: ${missingEnvVars.join(", ")}`)
    console.warn("Por favor, configura estas variables en tu archivo .env.local o en tu plataforma de despliegue.")
  }
}
