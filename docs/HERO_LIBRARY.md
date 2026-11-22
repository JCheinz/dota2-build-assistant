# Biblioteca de héroes (diccionario)
Cada clave de `heroes` representa un héroe y contiene sus cinco posiciones. Cada posición conserva procedencia, parche, fecha, tamaño de muestra, win rate, build por etapas, secuencia de habilidades, cuatro tiers de talentos y counters.
## Etapas de objetos
- `starting`: objetos iniciales.
- `laning`: consumibles y objetos de línea.
- `early`: primeros objetos de impacto.
- `core`: núcleo de la build con orden/tiempos.
- `late`: extensiones de partida larga.
- `situational`: respuestas condicionadas al draft.
- `neutral`: objetos neutrales por tier.
## Política de datos
Los campos estadísticos solo se muestran cuando el proveedor los entrega y se conserva su muestra y procedencia. No se extrapola una build de una posición a otra. Valve/dotaconstants aporta identidad, habilidades y talentos oficiales; STRATZ puede aportar estadísticas de partidas mediante su API GraphQL oficial y credencial propia. Overseer sirve como referencia de contenido y metodología, pero sus condiciones prohíben solicitudes automatizadas masivas y limitan su uso a fines privados/personales, por lo que no se configura scraping. La integración STRATZ debe validar el esquema de GraphQL y los límites de la cuenta antes de habilitar sincronización.
