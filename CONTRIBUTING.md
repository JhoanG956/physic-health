# Guía de Contribución

¡Gracias por tu interés en contribuir a Physio Health! Esta guía te ayudará a configurar el entorno de desarrollo y a entender nuestro proceso de contribución.

## Configuración del entorno de desarrollo

1. Haz un fork del repositorio
2. Clona tu fork:
   \`\`\`bash
   git clone https://github.com/tu-usuario/physio-health.git
   cd physio-health
   \`\`\`
3. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`
4. Crea una rama para tu contribución:
   \`\`\`bash
   git checkout -b feature/nombre-de-tu-caracteristica
   \`\`\`

## Estándares de código

- Utilizamos ESLint y Prettier para mantener un estilo de código consistente
- Ejecuta `npm run lint` antes de enviar tu PR para asegurarte de que cumple con nuestros estándares
- Utiliza TypeScript para todas las nuevas características

## Proceso de Pull Request

1. Asegúrate de que tu código pase todas las pruebas
2. Actualiza la documentación si es necesario
3. Crea un Pull Request con una descripción clara de los cambios
4. Espera la revisión del equipo

## Estructura de commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para nuestros mensajes de commit:

- `feat:` para nuevas características
- `fix:` para correcciones de errores
- `docs:` para cambios en la documentación
- `style:` para cambios que no afectan el significado del código
- `refactor:` para cambios de código que no corrigen errores ni añaden características
- `test:` para añadir o modificar pruebas
- `chore:` para cambios en el proceso de construcción o herramientas auxiliares

## Reportar problemas

Si encuentras un error, por favor crea un issue con la siguiente información:

- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs. comportamiento actual
- Capturas de pantalla si es posible
- Entorno (navegador, sistema operativo, etc.)

## Solicitar características

Si tienes una idea para una nueva característica, crea un issue con:

- Descripción clara de la característica
- Justificación de por qué debería añadirse
- Posibles implementaciones o diseños

¡Gracias por contribuir a Physio Health!
