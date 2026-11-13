# Dota 2 Build Assistant — versión 0.3

Aplicación web progresiva (PWA) para preparar drafts y consultar builds situacionales de Dota 2.

## Qué incluye
- Catálogo de héroes desde la API pública de OpenDota.
- Selección visual de 5 aliados y 5 enemigos.
- Selección de héroe propio, posición, modo (Ranked/Turbo) y rango.
- Interfaz renovada, adaptable a PC y Android.
- Perfiles orientativos para Pugna Mid, Drow Carry y Luna Carry.
- Iconos de objetos en las recomendaciones de builds y respuestas situacionales.
- Exportación del draft y contexto para continuar el análisis con ChatGPT.
- Service worker con comprobación de actualizaciones y limpieza de cachés anteriores.

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

Al publicar cambios, incrementá la versión de caché en `sw.js`.
