# Estado del proyecto — Dota 2 Build Assistant

**Última actualización:** 16 de noviembre de 2026  
**Repositorio:** [JCheinz/dota2-build-assistant](https://github.com/JCheinz/dota2-build-assistant)  
**Aplicación:** https://jcheinz.github.io/dota2-build-assistant/  
**Rama principal:** `main`  
**Versión de referencia actual:** 3.27 (en rama de trabajo; pendiente de integrar)

Este documento es el punto de continuidad del proyecto. Si una conversación termina, abrir este archivo y continuar desde la sección **Próximo paso**. Actualizarlo al cerrar cada etapa importante.

---

## 1. Objetivo

Construir un asistente contextual para Dota 2, no un catálogo de builds fijas. Debe combinar:

1. **Motor común:** análisis de draft, amenazas individuales y combinadas, sinergias, fase/minuto, oro, inventario, componentes y problema actual.
2. **Especialización por héroe y posición:** habilidades, talentos, mecánicas, combos, posicionamiento y objetos propios de cada función.
3. **Decisión adaptativa:** combinar la identidad del héroe con el contexto real de la partida y explicar la recomendación.

**Objetivo final:** cubrir los 126 héroes con especializaciones válidas para las posiciones que realmente desempeñan.

## 2. Repositorio y versión

- Aplicación publicada mediante GitHub Pages desde `main`, raíz del repositorio.
- PWA instalable en Android.
- La versión 3.26 fue la base estable de esta etapa; la 3.27 está preparada en una rama de trabajo y todavía no está integrada en `main`.
- El usuario confirmó visualmente que la matriz de habilidades y talentos 3.26 funciona en su dispositivo.
- Esa confirmación no equivale a una batería completa de pruebas automatizadas ni certifica todas las funciones.

### Respaldos conocidos

- `backup/3.25-stable`: respaldo de la versión 3.25, conservar intacto.
- La versión 3.26 se desarrolló a partir de la base 3.25 y se integró a `main`.
- PR #1: https://github.com/JCheinz/dota2-build-assistant/pull/1
- Merge commit de PR #1: `eb47ba34bcc4a8431c6b6ddeadf699c45bc8be72`
- Service Worker de 3.26: caché `dota-build-v68`.
- Respaldo previo a la etapa Pugna Support: `backup/3.26-before-pugna-support` (creado desde el HEAD de `main` del 16/11/2026).

No volver a usar 3.25 como base para cambios nuevos: continuar desde el estado vigente de `main` (3.26), salvo que se solicite explícitamente restaurar una versión anterior.

## 3. Trabajo realizado

### 3.1 Motor y especialización inicial de Pugna

Se desarrolló Pugna Mid como primer perfil especializado. La guía contempla:

- Prioridad y orden de habilidades.
- Nether Blast, Decrepify, Nether Ward y Life Drain.
- Talentos contextuales.
- Combos, posicionamiento y mecánicas particulares.
- Recomendaciones de objetos y respuestas a amenazas.

Se incorporaron al análisis mecánicas específicas de Pugna, entre ellas Oblivion Savant, la atribución del daño de Nether Ward y el daño de Nether Blast a estructuras. Verificar los detalles contra el parche vigente antes de ampliarlos o tratarlos como datos actuales.

### 3.2 Motor de compras adaptativas

Se trabajó en la selección de objetos según amenazas y necesidades de la partida, incluyendo opciones ofensivas, defensivas y de utilidad. Entre los objetos contemplados en el motor están Bottle, Magic Wand, Arcane Boots, Aether Lens, Kaya, Dagon, Blink, Aghanim, Shard, Linken, Aeon Disk, Glimmer Cape, BKB, Force Staff y Scythe of Vyse.

En la versión 3.19 se corrigió una inconsistencia: la próxima compra debe respetar la decisión primaria del análisis, incluso cuando sea defensiva. Se ajustaron `getNextPurchase(build,state,preferredName=null)` y la llamada desde `analyze()`.

**Advertencia:** la lista anterior no certifica que todos los precios, recetas, componentes o recomendaciones estén actualizados al parche actual. Verificarlos antes de presentarlos como datos vigentes.

### 3.3 Matriz visual de habilidades y talentos — versión 3.26

Cambios integrados en `main`:

- Matriz de niveles 1–25.
- Filas Q/W/E/R para el perfil actual de Pugna.
- Iconos de habilidades en las celdas correspondientes.
- Filas separadas para talentos y atributos.
- Árbol de talentos con ambas alternativas y explicación contextual.
- Desplazamiento horizontal apto para pantallas móviles.
- Corrección de la progresión de Pugna: niveles 16 y 17 corresponden a atributos.

Archivos modificados en esa etapa: `index.html`, `specializations.js`, `sw.js` y `README.md`.

### 3.4 Especializaciones Pugna Support 4 y Support 5 — versión 3.27 (en rama de trabajo)

Se añadieron en `specializations.js` dos perfiles separados:

- `pugna|Support 4`: presión de línea, control, rotaciones y utilidad.
- `pugna|Support 5`: protección del carry, sustain y defensa de objetivos.

Ambos perfiles incluyen iconos Q/W/E/R, progresión de habilidades, talentos contextuales, combos, posicionamiento y mecánicas específicas de Pugna. Comparten la progresión de habilidades de referencia para Pugna support en 7.41f; se diferencian en ejecución, prioridades y criterios de uso según la posición. La secuencia se debe adaptar a la línea y al draft.

La versión visible se actualizó a 3.27 y el Service Worker a `dota-build-v69`. Estos cambios están en `work/pugna-support-4-5`; todavía no se consideran desplegados ni validados en Android.

## 4. Limitaciones técnicas conocidas

La matriz todavía no es universal:

- El renderer `renderSpecializationGuide(g)` tiene las filas Q/W/E/R definidas de forma fija.
- La matriz muestra niveles 1–25.
- Cada héroe necesita sus propios iconos y datos de progresión.
- El fallback actual de iconos puede recurrir a los iconos de Pugna; debe eliminarse o reemplazarse por un fallback neutral antes de incorporar otros héroes.
- Algunos héroes tienen habilidades innatas, transformaciones, subhabilidades, habilidades adicionales o estructuras especiales.
- La estructura de talentos y atributos debe poder adaptarse a las particularidades de cada héroe.

Antes de escalar, convertir el renderer en dinámico: generar filas desde los datos de cada héroe, admitir habilidades especiales y niveles pertinentes, no mostrar habilidades inexistentes y evitar que un héroe herede iconos de otro.

## 5. Trabajo pendiente

### Etapa 1 — Completar Pugna

- [x] Crear perfil separado Pugna Support 4.
- [x] Crear perfil separado Pugna Support 5.
- [ ] Validar selección de perfiles desde la interfaz y probarlos en Android.
- [ ] Completar revisión de compras específicas por posición con escenarios reales.

Los dos perfiles se añadieron en la rama `work/pugna-support-4-5`, pero aún esperan revisión e integración.

### Etapa 2 — Universalizar la matriz

- Filas de habilidades dinámicas.
- Iconos específicos por héroe.
- Soporte para habilidades innatas, transformaciones y subhabilidades cuando corresponda.
- Niveles y progresiones configurables.
- Talentos y atributos adaptables.
- Fallback neutral, nunca iconos de Pugna por defecto.

### Etapa 3 — Definir una plantilla de especialización

Cada perfil debe poder describir, según corresponda:

1. Héroe y posición.
2. Orden de habilidades.
3. Talentos.
4. Objetos iniciales y progresión.
5. Objetos situacionales.
6. Amenazas y respuestas.
7. Combos y ejecución.
8. Posicionamiento.
9. Mecánicas particulares.
10. Criterios de adaptación.

No todos los héroes deben tener cinco posiciones. Incluir solo roles razonables y respaldados.

### Etapa 4 — Fortalecer el motor común

Integrar draft, amenazas individuales y combinadas, sinergias, minuto, oro, inventario, necesidades ofensivas/defensivas y problema actual. Mantener coherencia entre diagnóstico, decisión primaria y próxima compra. Explicar por qué se recomienda una acción.

### Etapa 5 — Validar y ampliar el catálogo

Probar primero héroes con estructuras de habilidades distintas. Validar secuencias, iconos, talentos, mecánicas, objetos y recomendaciones con información vigente. Luego ampliar progresivamente hasta los 126 héroes.

## 6. Reglas obligatorias de desarrollo

- Trabajar sobre el código real del repositorio; no reconstruir desde cero.
- Rama principal: `main`.
- Antes de cada etapa o cambio importante, crear y conservar un respaldo identificable.
- Crear rama de trabajo desde el estado actual de `main`; no sobrescribir respaldos existentes.
- No romper funcionalidades existentes ni reemplazar lógica validada de Pugna por heurísticas genéricas.
- Trabajar por etapas y revisar los cambios.
- Comprobar sintaxis JavaScript después de modificar archivos.
- Actualizar la caché del Service Worker cuando cambien recursos de la aplicación.
- Verificar el estado integrado en `main`; no afirmar que está desplegado o probado en Android sin comprobarlo.
- Mantener imágenes e iconos existentes.
- Distinguir datos verificados, estimaciones y recomendaciones contextuales.
- Verificar habilidades, talentos, recetas, precios y mecánicas contra el parche vigente; no inventar datos.
- No permitir contradicciones entre el diagnóstico defensivo y la próxima compra.

## 7. Próximo paso acordado

**Etapa actual: revisar e integrar Pugna Support 4/5.**

1. Revisar que el selector de posición encuentre ambos perfiles y que no se altere Pugna Mid.
2. Validar sintaxis de JavaScript y coherencia de la matriz.
3. Abrir PR desde `work/pugna-support-4-5` hacia `main`.
4. Tras integrar, probar ambos perfiles en Android.
5. Luego abordar la matriz universal.

La etapa 1 está implementada en la rama de trabajo, pero todavía no integrada ni validada en el dispositivo.

---

## 8. Registro de continuidad

Al terminar cada etapa, agregar aquí:

- Fecha y versión.
- Rama de respaldo creada.
- Rama de trabajo y archivos modificados.
- Resumen de cambios.
- Pruebas realizadas y resultado.
- PR/commit de integración.
- Próximo paso concreto.

**Instrucción para una conversación nueva:** leer este documento primero y confirmar el estado real de GitHub antes de modificar archivos.
