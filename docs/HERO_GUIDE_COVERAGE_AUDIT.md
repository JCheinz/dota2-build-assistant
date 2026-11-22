# Auditoría de cobertura de guías de héroes

Corte de auditoría: 22 de noviembre de 2026 · parche de aplicación 7.42. Auditoría automatizada incluida en CI.

## Cobertura técnica del catálogo

- El catálogo contiene 127 héroes.
- La base de dotaconstants/OpenDota identifica habilidades, ranuras, habilidades innatas, talentos y metadatos.
- La matriz base puede construirse para 127/127 héroes cuando el conjunto de constantes se descarga correctamente.
- Esta cobertura describe metadatos y renderizado; no significa que existan recomendaciones estadísticas de habilidades para todos los héroes.

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
- **Dota2ProTracker:** secuencias de habilidades y elecciones de talentos por posición cuando existe una muestra y el endpoint está accesible. `abilities_new` contiene órdenes frecuentes y `talents` contiene ambos lados, tasa de elección y victoria.
- **StatsDota:** guías por héroe con órdenes de habilidades basadas en partidas ganadoras Immortal/pro; la página pública puede servir como contraste y normalmente presenta el rol principal. No se mezcla su muestra con D2PT.

## Limitaciones que deben permanecer visibles

1. La matriz de cobertura genérica es provisional; no se debe describir como una recomendación estadística.
2. Si D2PT no responde, la aplicación debe conservar el perfil manual o mostrar el fallback provisional con su etiqueta. No debe inventar tasas ni declarar que hay muestra por posición.
3. Una guía del rol principal no equivale a una guía específica para las cinco posiciones.
4. Los talentos oficiales se pueden mostrar con sus dos opciones y descripciones, pero una opción “recomendada” requiere una fuente de elección o una regla táctica explícita y verificable.
5. Los perfiles 7.41f deben actualizarse antes de marcarlos como vigentes en 7.42.

## Corrección de ranuras incluida en esta auditoría

El fallback ya no supone que la última habilidad de la lista es la definitiva. Toma Q/W/E de las tres primeras ranuras y la definitiva del slot canónico 5 (o slot 3 en esquemas compactos), separando innatas y habilidades adicionales. Esto evita confundir, por ejemplo, una habilidad innata o una habilidad auxiliar de Centaur con Stampede.

## Próximos criterios de aceptación

- 127/127 héroes con catálogo de habilidades, innatas y talentos identificados.
- Guías estadísticas por posición solamente cuando la fuente tenga muestra válida.
- Orden de habilidades y talentos visible por nivel, con fuente, parche, muestra y alternativa.
- Las posiciones sin muestra se marcan como “sin datos suficientes”; nunca heredan silenciosamente una secuencia de otra posición.
- Cada guía táctica manual debe tener revisión del parche y conservar combos, posicionamiento, prioridades y condiciones de talentos.
