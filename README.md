# Dota 2 Build Assistant — versión 2.8

Aplicación web progresiva (PWA) comunitaria para preparar drafts y orientar compras en Dota 2.

## Novedades de la versión 2.8
- Ruta de Anti-Mage actualizada para 7.41f: Power Treads → Battle Fury → Yasha → Manta Style.
- La próxima compra respeta el orden del núcleo y avanza al siguiente objeto cuando marcás el anterior como comprado.
- El estado de partida permite recalcular las recomendaciones al cambiar minuto, oro, inventario o amenaza seleccionada.

## Qué incluye
- Catálogo de héroes desde OpenDota.
- Selección visual de 5 aliados y 5 enemigos.
- Elección del héroe propio y cualquiera de las cinco posiciones.
- Modos Ranked y Turbo, con rango como contexto.
- Motor de análisis unificado para todos los héroes y posiciones.
- Perfiles específicos cuando están disponibles (Pugna Mid, Anti-Mage Mid/Carry, Drow Carry, Luna Carry, Bristleback Offlane y Techies en las posiciones configuradas).
- Para el resto de combinaciones, una ruta heurística por rol, arquetipo, tipo de ataque, fase de partida y amenazas detectadas.
- Recomendaciones situacionales separadas de la ruta principal.
- Estado de partida: minuto, oro, problema actual, objetos completos y componentes.
- Exportación del draft y contexto para continuar el análisis con ChatGPT.
- Diseño adaptable a escritorio y Android; service worker con actualización de HTML y limpieza de cachés anteriores.

## Cómo interpretar las recomendaciones
- Verde: hasta tres prioridades calculadas para la combinación actual.
- Azul: complementos y respuestas situacionales; no son compras obligatorias.
- Los objetos marcados como comprados se excluyen de la ruta pendiente.
- La próxima prioridad es un objetivo estratégico, no una orden de compra ni una comprobación de precio en vivo.

## Limitaciones transparentes
- Las posiciones se estiman con roles generales de OpenDota; no son estadísticas de lane ni garantizan que una elección sea meta.
- Las rutas son heurísticas y no builds certificadas por rango, posición o parche.
- Los counters específicos solo aparecen cuando hay una regla táctica cargada; para otros rivales se muestran señales generales sin inventar counters.
- El oro ingresado se muestra como contexto, pero la aplicación no consulta precios de objetos en vivo ni calcula todavía todas las recetas y componentes de cada objeto.
- Los datos de victorias por rango, cuando están disponibles, son agregados del héroe y no están separados por posición.
- Requiere conexión para cargar el catálogo e imágenes. No es un APK nativo.
- No está afiliada a Valve ni a Dota 2.

## Publicar e instalar en Android
1. Publicá los archivos en GitHub Pages.
2. Abrí la URL desde Chrome en Android.
3. Menú ⋮ → «Instalar aplicación» o «Añadir a pantalla de inicio».

Al publicar cambios del service worker, incrementá la versión de caché en `sw.js`.


## Versión 2.5
- Anti-Mage mantiene el núcleo Power Treads → Battle Fury → Manta Style.
- Las defensas se priorizan solo ante amenazas concretas seleccionadas.
- Se excluye Aeon Disk de la ruta automática de Anti-Mage.
- Próxima compra muestra el componente de Battle Fury según oro y componentes marcados.
