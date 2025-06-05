# Physio Health

Plataforma web conversacional de fisioterapia inteligente, enfocada en ofrecer a los usuarios una experiencia completamente personalizada, interactiva y escalable.

## Requisitos previos

- Node.js 18.x o superior
- npm 9.x o superior
- Una base de datos PostgreSQL (recomendamos usar Neon)
- Una cuenta de OpenAI para la API

## Configuración del entorno

1. Clona este repositorio
2. Instala las dependencias:

\`\`\`bash
npm install
\`\`\`

3. Crea un archivo `.env.local` basado en `.env.example` y configura las variables de entorno:

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Edita el archivo `.env.local` y añade tus propias credenciales:

\`\`\`
DATABASE_URL=postgres://user:password@host:port/database
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
\`\`\`

5. Ejecuta las migraciones de la base de datos (si es necesario)

6. Inicia el servidor de desarrollo:

\`\`\`bash
npm run dev
\`\`\`

7. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del proyecto

- `/app`: Contiene las páginas y rutas de la aplicación (Next.js App Router)
- `/components`: Componentes reutilizables
- `/lib`: Utilidades, servicios y configuraciones
- `/public`: Archivos estáticos

## Variables de entorno

- `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL
- `JWT_SECRET`: Clave secreta para firmar los tokens JWT
- `OPENAI_API_KEY`: Clave de API de OpenAI para el chat inteligente

## Características principales

- Chat interactivo con IA
- Feed personalizado
- Dashboard de usuario
- Agendamiento de citas
- Autenticación y gestión de usuarios
- Panel de administración

## Tecnologías utilizadas

- Next.js 15.3.1
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenAI API
- Neon PostgreSQL
- Jose (JWT)
\`\`\`

Vamos a crear un archivo `lib/db.ts` para la conexión a la base de datos:
