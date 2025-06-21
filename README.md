# 🧠 Physio Health – Plataforma de Fisioterapia Inteligente

**Physio Health** es una aplicación web multiplataforma que proporciona un **seguimiento personalizado de pacientes en procesos de rehabilitación**, integrando Inteligencia Artificial para mejorar la adherencia al tratamiento y la comunicación con fisioterapeutas.

---

## 🚀 Tecnologías principales

- [Next.js 14+](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel](https://vercel.com/) (para despliegue)
- [Neon](https://neon.tech/) (PostgreSQL, Auth, BBDD)

---

## 📦 Instalación

1. **Clonar el repositorio:**

```bash
git clone https://github.com/tu-usuario/physio-health.git
cd physio-health
```

2. **Instalar dependencias:**

```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz del proyecto y agrega tus claves de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🧪 Modo desarrollo

Ejecuta el servidor local con:

```bash
npm run dev
```

Visita `http://localhost:3000` para ver la aplicación en desarrollo.

---

## ✅ Comandos útiles

```bash
npm run dev         # Inicia en modo desarrollo
npm run build       # Compila la aplicación para producción
npm run start       # Ejecuta la app compilada
npm run lint        # Corre linter para verificar errores de estilo
```

---

## 📂 Estructura general del proyecto

```
/app
  /dashboard
  /auth
  /api
/components
/lib
/types
/utils
/styles
.env.local
next.config.mjs
tailwind.config.ts
```

---

## 📱 Funcionalidades actuales (MVP)

- ✅ Registro e inicio de sesión de pacientes
- ✅ Dashboard con ejercicios personalizados
- ✅ Seguimiento de progreso por sesión
- ✅ Visualización guiada con animaciones
- ✅ Agenda de citas con profesionales
- 🚧 Integración smartwatch / SmartTV (en desarrollo)
- 🚧 Asistente conversacional IA (próximamente)

---

## ☁️ Despliegue en producción

El proyecto está listo para desplegarse en **Vercel**:

1. Conecta el repositorio en [Vercel](https://vercel.com/)
2. Configura las variables de entorno en Settings > Environment Variables
3. Elige la rama principal y despliega

---

## 🤝 Contribuciones

¿Quieres colaborar? Haz un fork del repositorio, crea una rama con tus cambios y abre un pull request. Toda ayuda es bienvenida para mejorar este proyecto 🚀

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo libremente respetando las condiciones de atribución.

---

## ✉️ Contacto

Proyecto desarrollado por **Jhoan Gallego – Gallego AI**  
📱 WhatsApp: [+34 722 499 952](https://wa.me/34722499952)  
🌐 Sitio web: próximamente...

---
