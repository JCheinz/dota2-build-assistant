# Dota 2 Build Assistant — prototipo 0.1

Aplicación web progresiva (PWA) pensada para instalarse en Android.

## Qué incluye
- Carga de héroes desde la API pública de OpenDota.
- Selección visual de 5 aliados y 5 enemigos con imágenes.
- Selección del héroe propio y posición.
- Análisis preliminar por reglas de contrajuego.
- Exportación del draft como prompt para continuar el análisis con ChatGPT.
- Diseño responsive y service worker básico.

## Limitaciones de esta versión
- No es un APK nativo: es una PWA.
- Requiere conexión a Internet para cargar el catálogo e imágenes de héroes.
- El análisis local es heurístico y deliberadamente conservador; no afirma que una build sea infalible.
- Todavía no consulta estadísticas por héroe/posición/parche ni incorpora el árbol completo de objetos, habilidades y talentos.
- No está afiliada a Valve ni a Dota 2.

## Publicar e instalar en Android
1. Publicá el contenido de esta carpeta en un hosting HTTPS (por ejemplo GitHub Pages).
2. Abrí la URL desde Chrome en Android.
3. Menú ⋮ → «Instalar aplicación» o «Añadir a pantalla de inicio».

Para editar el proyecto, modificá `index.html`, `manifest.webmanifest` y `sw.js`.
