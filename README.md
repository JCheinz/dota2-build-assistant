# Dota 2 Build Assistant — versión 0.2

Aplicación web progresiva (PWA) pensada para instalarse en Android.

## Qué incluye
- Catálogo de héroes desde la API pública de OpenDota.
- Selección visual de 5 aliados y 5 enemigos.
- Selección de héroe propio, posición, modo (Ranked/Turbo) y rango.
- Análisis preliminar de composición y respuestas situacionales.
- Perfiles orientativos específicos para Pugna Mid, Drow Carry y Luna Carry.
- Exportación del draft y contexto para continuar el análisis con ChatGPT.
- Diseño responsive y service worker con caché v02 para forzar actualización.

## Limitaciones
- Es una PWA, no un APK nativo.
- Requiere conexión para cargar el catálogo e imágenes.
- Los perfiles de objetos son rutas orientativas, no builds estadísticas certificadas por rango o parche.
- El selector de rango contextualiza el análisis, pero todavía no filtra datos estadísticos por bracket.
- No está afiliada a Valve ni a Dota 2.

## Publicar e instalar en Android
1. Publicá los archivos en GitHub Pages.
2. Abrí la URL desde Chrome en Android.
3. Menú ⋮ → «Instalar aplicación» o «Añadir a pantalla de inicio».

Al publicar cambios, se incrementa la versión de caché en `sw.js` para que la PWA descargue los archivos nuevos.
