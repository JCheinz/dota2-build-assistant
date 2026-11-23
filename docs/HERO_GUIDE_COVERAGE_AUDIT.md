# Auditoría de cobertura de guías de héroes

Corte de auditoría: 22 de noviembre de 2026 · parche de aplicación 7.42. Auditoría automatizada incluida en CI.

## Cobertura técnica del catálogo

- El catálogo contiene 127 héroes.
- La base de dotaconstants/OpenDota identifica habilidades, ranuras, habilidades innatas, talentos y metadatos.
- La matriz base puede construirse para 127/127 héroes cuando el conjunto de constantes se descarga correctamente.
- Esta cobertura describe metadatos y renderizado; no significa que existan recomendaciones estadísticas de habilidades para todos los héroes.

## Auditoría real de fuentes públicas · 22 de noviembre de 2026

- StatsDota publicó enlaces para 126 de los 127 héroes del catálogo.
- Se descargaron y analizaron las 126 páginas: 48 devolvieron una secuencia interpretable de al menos seis puntos y 78 quedaron incompletas por falta de una secuencia extraíble. No hubo errores HTTP de descarga en esa ejecución.
- La cobertura observada de StatsDota fue 48/126 (38,1 %). Es una guía del rol principal, no una cobertura de las cinco posiciones.
- La prueba end-to-end de Dota2ProTracker con Centaur Warrunner / Offlane devolvió 254 partidas, 21 niveles de progresión y cuatro tiers de talentos para 7.42.
- El endpoint directo de Dota2ProTracker devolvió HTTP 403 en la red de CI. La ruta Jina con URL de origen HTTP sí devolvió JSON; la variante HTTPS de origen fue denegada. El motor ahora intenta primero la ruta funcional HTTP, después la HTTPS y finalmente el endpoint directo.
- Se agregó `scripts/audit-d2pt-hero-positions.js` para auditar las 127 × 5 combinaciones (635 consultas), sin heredar builds entre roles. El workflow `.github/workflows/audit-d2pt-hero-positions.yml` conserva el informe completo como artefacto. La cobertura final de esas 635 combinaciones queda pendiente de la ejecución del workflow; no se declara completada hasta revisar ese artefacto.
- La primera auditoría de 635 combinaciones quedó limitada por HTTP 429: solo 4 posiciones pudieron validarse; no se interpreta el resto como falta de builds.
- La sincronización nueva conserva el rol principal aun cuando StatsDota no publique una secuencia extraíble. `scripts/sync-d2pt-primary-guides.js` consulta únicamente ese rol para cada una de las 78 guías incompletas, con concurrencia 1, espera mínima de 3,5 s y reintentos exponenciales (30 s iniciales ante 429). No consulta cinco posiciones por héroe ni inventa un rol si la fuente no lo identifica.
- Las guías D2PT sincronizadas se guardan en `d2pt-primary-guides.json` y la app las utiliza solo cuando el rol seleccionado coincide exactamente con el rol principal y el registro está validado para 7.42. La guía en vivo por posición conserva prioridad. El workflow `.github/workflows/sync-d2pt-primary-guides.yml` ejecuta la sincronización diaria, conserva artefacto y publica snapshots con guías válidas.

## Cobertura estratégica local

El archivo `specializations.js` contiene 7 perfiles manuales para 3 héroes:

| Héroe | Posiciones con perfil |
|---|---|
| Pugna | Mid, Support 4, Support 5 |
| Techies | Support 4, Support 5 |
| Crystal Maiden | Support 4, Support 5 |

Cobertura por posición: Carry 0, Mid 1, Offlane 0, Support 4 3, Support 5 3.

Los 7 perfiles manuales incluyen secuencia, cuatro tiers de talentos y contenido táctico; los 7 títulos todavía hacen referencia al parche 7.41f y requieren revisión para 7.42. No deben presentarse como guías certificadas del parche actual.

## Qué aporta cada fuente

- **dotaconstants / OpenDota constants:** identidad de habilidades, orden de ranuras, innatas, talentos, descripciones e iconos. No aporta por sí sola la secuencia recomendada por nivel.
- **Dota2ProTracker:** secuencias de habilidades, talentos y builds por posición. El endpoint directo puede devolver HTTP 403 desde navegadores o redes de servidor; la aplicación intenta una lectura JSON mediante Jina Reader y conserva el acceso directo como respaldo. `abilities_new` contiene órdenes frecuentes y `talents` contiene ambos lados, tasa de elección y victoria.
- **StatsDota:** el snapshot diario extrae la secuencia visible de habilidades de sus guías públicas basadas en partidas ganadoras Immortal/pro. Se usa solo si el rol principal coincide exactamente con la posición elegida (Soft Support/Hard Support se distinguen; el rótulo genérico Support no se adivina). No se mezcla su muestra con D2PT. El catálogo local conserva muestra, parche, fecha y URL de origen.

## Limitaciones que deben permanecer visibles

1. La matriz de cobertura genérica es provisional; no se debe describir como una recomendación estadística.
2. Si D2PT no responde, la aplicación debe conservar el perfil manual o mostrar el fallback provisional con su etiqueta. No debe inventar tasas ni declarar que hay muestra por posición.
3. Una guía del rol principal no equivale a una guía específica para las cinco posiciones.
4. Los talentos oficiales se pueden mostrar con sus dos opciones y descripciones, pero una opción “recomendada” requiere una fuente de elección o una regla táctica explícita y verificable.
5. Los perfiles 7.41f deben actualizarse antes de marcarlos como vigentes en 7.42.\n6. El snapshot StatsDota se sincroniza diariamente; la aplicación lo usa sin consultar esa web en cada selección y solo aplica guías con secuencia válida y rol coincidente.

## Corrección de ranuras incluida en esta auditoría

El fallback ya no supone que la última habilidad de la lista es la definitiva. Toma Q/W/E de las tres primeras ranuras y la definitiva del slot canónico 5 (o slot 3 en esquemas compactos), separando innatas y habilidades adicionales. Esto evita confundir, por ejemplo, una habilidad innata o una habilidad auxiliar de Centaur con Stampede.

## Próximos criterios de aceptación

- 127/127 héroes con catálogo de habilidades, innatas y talentos identificados.
- Guías estadísticas por posición solamente cuando la fuente tenga muestra válida.
- Orden de habilidades y talentos visible por nivel, con fuente, parche, muestra y alternativa.
- Las posiciones sin muestra se marcan como “sin datos suficientes”; nunca heredan silenciosamente una secuencia de otra posición.
- Cada guía táctica manual debe tener revisión del parche y conservar combos, posicionamiento, prioridades y condiciones de talentos.
