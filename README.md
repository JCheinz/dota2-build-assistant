# Dota 2 Build Assistant — versión 3.14

Aplicación web progresiva (PWA) comunitaria para preparar drafts y orientar compras en Dota 2.

## Novedades de la versión 3.14
- Nueva capa común de especialización táctica por héroe y posición: combina perfiles explícitos ya cargados con un fallback conservador por arquetipo para el resto del catálogo.
- El informe muestra identidad disponible del héroe (atributo, alcance y roles), fortalezas y riesgos generales, e indica claramente si existe una ruta individual o una inferencia por arquetipo.
- La exportación incluye el perfil táctico utilizado para que el análisis posterior conserve el nivel de evidencia y sus limitaciones.
- Esta etapa establece la arquitectura común; no implica todavía que los 126 héroes tengan builds, habilidades, combos o talentos individualizados.

## Novedades de la versión 3.6
- Separación visual y lógica entre ruta principal del héroe y compras situacionales.
- La compra de línea de Pugna (Bottle o Magic Wand) es condicional y solo una puede encabezar la ruta; Null Talisman deja de desplazar automáticamente el núcleo.
- Arcane Boots y Aether Lens conservan prioridad de progresión para Pugna Mid; Aghanim’s Shard pasa a alternativa según situación.
- Recalculo de próxima compra con orden de progresión para héroes con ruta definida, inventario y componentes marcados.
- Evita mostrar cálculos de oro ficticios cuando el objeto no tiene receta/costo configurado.

## Novedades de la versión 3.5
- Interacciones específicas entre héroe propio y enemigo para Pugna y Anti-Mage frente a Anti-Mage, Bristleback, Lion, Sniper y Tidehunter.
- El informe distingue amenazas generales de interacciones concretas del enfrentamiento y ajusta consejos de posicionamiento, uso de habilidades y ventanas de entrada.
- Se aclaran límites de respuestas como Linken’s Sphere, Manta Style y Ethereal Blade para evitar tratarlas como counters universales.

## Novedades de la versión 3.4
- Evaluación de amenazas personalizada según vulnerabilidades del héroe elegido y su posición.
- Priorización contextual: distingue peligro general del enemigo e impacto específico sobre el héroe propio.
- Recomendaciones situacionales de objetos generadas a partir de mecánicas que coinciden con esas vulnerabilidades.
- Modelo general por roles y tipo de ataque para que héroes sin perfil individual también reciban evaluación contextual.

## Novedades de la versión 3.3
- Priorización de amenazas enemigas según mecánicas tácticas reconocibles, vulnerabilidad del héroe propio, posición y minuto de partida.
- Perfiles explícitos cargados para 8 combinaciones héroe/posición (Pugna Mid, Drow Carry, Luna Carry, Anti-Mage Mid/Carry, Bristleback Offlane y Techies Offlane/Support 4); el resto conserva inferencia conservadora basada en el catálogo.
- Cada amenaza muestra prioridad relativa, mecánicas detectadas, motivo de peligro y pauta de juego.
- Orden dinámico de amenazas de mayor a menor prioridad.

## Novedades de la versión 2.9
- Corregido el cálculo de próxima compra de Anti-Mage: ahora usa oro, componentes marcados y objetos completos.
- Ruta principal secuencial Power Treads → Battle Fury → Yasha → Manta Style.
- El informe se recalcula automáticamente al cambiar minuto, oro, problema, inventario o componentes.
- Unificada la versión 2.9 en encabezado, informe y exportación.

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
- Ruta principal: progresión del héroe y su posición; el orden se adapta a la fase de partida.
- Compras situacionales: alternativas que solo se adelantan cuando una amenaza concreta o una necesidad del equipo lo justifica.
- Verde: prioridades actuales. Azul: complementos o respuestas condicionales.
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


## Historial
- La versión 2.5 fue una etapa anterior; sus notas ya no describen el motor actual.
