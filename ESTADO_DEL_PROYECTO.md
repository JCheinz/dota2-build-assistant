# Estado del proyecto — Dota 2 Build Assistant

**Última actualización:** 16 de noviembre de 2026  
**Repositorio:** https://github.com/JCheinz/dota2-build-assistant  
**Aplicación:** https://jcheinz.github.io/dota2-build-assistant/  
**Rama principal:** `main`  
**Versión integrada:** 3.27 + Service Worker v73  
**Etapa activa:** Etapa 3 — Techies Support 4 validado por el usuario en Android; Techies Support 5 integrado en rama de trabajo, pendiente de CI y revisión.

## 1. Objetivo

Construir un asistente contextual de Dota 2, no un catálogo de builds estáticas:
1. Motor común: draft, amenazas individuales y combinadas, sinergias, fase/minuto, oro, inventario, componentes y problema actual.
2. Especializaciones por héroe y posición: habilidades, talentos, mecánicas, combos, posicionamiento y objetos.
3. Decisión adaptativa: identidad del héroe + posición + contexto real de partida, con explicaciones.
4. Cobertura progresiva de los 126 héroes en las posiciones que realmente desempeñan, sin inventar datos.

## 2. Versiones, integraciones y respaldos

- Versión 3.27 integrada en `main`.
- PR #2 integró Pugna Support 4 y Support 5. Merge: `bf381b7466d2036339668e958c57b89055ef5917`.
- PR #3 corrigió la carga de especializaciones. Merge: `f71d2c8243946493c98f0ee9b37feb55252dbe0c`.
- PR #4 integró la matriz dinámica universal. Merge: `0fd92b385bbd4744cdaef5c5ae6668514e640c3f`.
- PR #5 integró la corrección de Pugna Support 5 y el contrato de datos. Merge squash: `9e418f7f4334f2fc56e53b1bd4226c16ed4930d5`.
- CI del commit integrado: run `43822489290`, sintaxis y regresiones success.
- GitHub Pages del commit `9e418f7`: run `43822488399`, conclusion `success`.
- Commit de continuidad en `main`: `8ad26a5bc65a5d1772478b06169499739475018e`.
- Validación CI de PR #4: run `43820657158`, success; sintaxis de especializaciones y pruebas de matriz/regresiones aprobadas.
- Publicación GitHub Pages del commit de continuidad: run `43820718390`, conclusion `success`.
- PR #6 integró el renderizado opcional de metadatos e innatas. Merge squash: `a3a3d56952afca1e32f22b0a3cbf103f8834f216`.
- CI del PR #6: run `43822711864`, success. CI del commit integrado: run `43822788779`, success.
- GitHub Pages del commit `a3a3d56`: run `43822788109`; pendiente de confirmar al actualizar este registro.
- Commit de documentación en main: `6ab85d1bebd41f23f1370ce7ad547583fa2996fa`.
- PR #7 integró Techies Support 4. Merge squash: `4946573548097b7cf364f190d10146b2f2e0d944`.
- CI del PR #7: run `43823050286`, success. CI del commit integrado: run `43823104609`, success.
- GitHub Pages del commit `4946573`: run `43823104163`, success.
- PR #8 integró el árbol de talentos Techies Support 4 y aclaración de la matriz. Merge squash: `27278b84f018b4ee6d900aab1a2ed81f835ef6b8`.
- CI del PR #8: run `43823268643`, success. CI del commit integrado: run `43823328340`, success.
- GitHub Pages del commit `27278b8`: run `43823327854`, success.
- Service Worker integrado: `dota-build-v73`; la matriz aclara que los talentos se marcan por nivel de desbloqueo y la elección puede retrasarse.
- Respaldos históricos: `backup/3.26-before-pugna-support`, `backup/3.27-stable-before-universal-matrix` y `backup/estado-3.27-before-universal-matrix`. No sobrescribir.
- Respaldos nuevos desde el main publicado `8ad26a5`: `backup/3.27-universal-matrix-deployed` y `backup/estado-3.27-universal-matrix-deployed`.
- Respaldos posteriores a PR #5: `backup/3.27-etapa3-pugna-fix-integrated` y `backup/estado-3.27-etapa3-pugna-fix-integrated`, ambos creados desde `9e418f7f4334f2fc56e53b1bd4226c16ed4930d5`.
- Respaldos posteriores a PR #6: `backup/3.27-etapa3-innate-renderer-integrated` y `backup/estado-3.27-etapa3-innate-renderer-integrated`, ambos creados desde `a3a3d56952afca1e32f22b0a3cbf103f8834f216`.
- Respaldo de código posterior a PR #8: `backup/3.27-techies-talents-integrated`, creado desde `27278b84f018b4ee6d900aab1a2ed81f835ef6b8`. El respaldo del estado se crea tras esta actualización.
- Rama de trabajo Techies Support 5: `work/etapa-3-techies-support5-profile`, creada desde `main` tras respaldar el estado previo.\n- Respaldos previos a Techies Support 5: `backup/3.27-before-techies-support5` y `backup/estado-3.27-before-techies-support5`.

## 3. Etapa 1 — Pugna

Funcionalmente completada y validada previamente por el usuario en Android:
- Pugna Mid: guía individual, progresión, talentos, combos, posicionamiento, mecánicas y compras adaptativas.
- Pugna Support 4: guía individual y ruta de compras propia.
- Pugna Support 5: guía individual y ruta de compras diferenciada.
- No reabrir esta etapa salvo que una regresión posterior lo justifique.

Pendientes de calidad conocidos:
- Mejorar el texto de compatibilidad para distinguir la posición seleccionada de los roles generales del catálogo.
- Auditar explicaciones de objetos situacionales y su relación con amenazas concretas.

## 4. Etapa 2 — Matriz universal dinámica

### Implementación integrada
- En `index.html`, `renderSpecializationGuide(g)` deriva filas desde las claves de `g.skillIcons` y los códigos de `g.skillBuild`, sin fijar Q/W/E/R.
- Niveles, columnas y ancho de matriz son dinámicos; las filas de talentos y atributos aparecen solo si existen datos.
- Se eliminó el fallback que inventaba habilidades de Pugna cuando faltan metadatos; se informa que la matriz no está disponible.
- `cards(arr)` tolera listas opcionales ausentes.
- Se agregó `tests/skill-matrix.test.js`, con pruebas para los tres perfiles Pugna y una fixture sintética con claves distintas de Q/W/E/R y progresión de 30 niveles.
- Se agregó `.github/workflows/validate-skill-matrix.yml` para validar sintaxis y ejecutar pruebas.
- CI pasó y PR #4 fue integrado.
- GitHub Pages terminó correctamente la publicación del commit `8ad26a5`.

### Validación visual
El usuario confirmó que la aplicación y la matriz funcionan correctamente en Android para Pugna Mid, Support 4 y Support 5. La Etapa 2 queda validada visualmente. La validación automática no sustituye futuras pruebas si se modifica el renderizador.

## 5. Flujo de trabajo obligatorio

1. Crear respaldos separados de código y estado antes de cambios estructurales.
2. Crear rama de trabajo desde el `main` vigente.
3. Trabajar por etapas pequeñas; no sobrescribir respaldos.
4. Revisar código y compatibilidad antes de cambiar.
5. Actualizar Service Worker cuando cambien recursos cacheados.
6. Validar sintaxis, pruebas y diff antes de integrar.
7. Integrar mediante PR cuando el cambio esté revisado y mergeable.
8. Confirmar publicación y solicitar solo las pruebas reales que dependan del usuario.
9. Actualizar este documento tras cada hito importante.

## 6. Etapa 3 — Cobertura de especializaciones universales

### Inicio de etapa y cambios realizados en la rama de trabajo
- Rama: `work/etapa-3-perfiles-universales`, creada desde el `main` publicado `8ad26a5bc65a5d1772478b06169499739475018e`.
- Respaldos nuevos creados desde ese mismo commit: `backup/3.27-universal-matrix-deployed` y `backup/estado-3.27-universal-matrix-deployed`. Los respaldos anteriores permanecen intactos.
- Se detectó una inconsistencia en Pugna Support 5: el `skillBuild` colocaba Nether Ward en nivel 10 y el talento en nivel 11, mientras `talentChoices` y `skillOrder` indicaban talento en nivel 10.
- Se corrigió Support 5 para que nivel 10 sea talento y nivel 11 Decrepify, y se alineó el texto de progresión para indicar Nether Ward en niveles 8–9.
- Se amplió `tests/skill-matrix.test.js` para verificar que cada talento declarado coincida con un evento `T` y que no existan eventos `T` sin metadatos de talento.
- Se añadió `docs/SPECIALIZATION_SCHEMA.md`, contrato propuesto para metadatos, habilidades aprendibles, eventos de progresión, innatas y fuentes.

### Alcance y límites
- PR #5 está integrado en `main`. La corrección de Pugna Support 5 deja nivel 10 para talento y nivel 11 para Decrepify; Nether Ward se aprende en niveles 8–9. La regresión correspondiente está cubierta por CI.
- No se añadió todavía ningún perfil de héroe nuevo. El primer perfil no-Pugna requiere verificar habilidades, talentos, roles y progresión para el parche objetivo.
- PR #6 ya está integrado y publicado pendiente de confirmación final de Pages. El renderizador muestra `metadata` (parche, posición, confianza y fuentes declaradas) y `innateAbilities` en un bloque independiente de la matriz.
- La ausencia de estos campos no altera los perfiles Pugna existentes. CI prueba metadatos, innatas, matriz dinámica de 30 niveles y compatibilidad legacy.
- El Service Worker se actualizó a `dota-build-v71` y la referencia de `specializations.js` a `?v=3272`.
- Primer perfil no-Pugna en desarrollo: `techies|Support 4`, en rama `work/etapa-3-primer-perfil-no-pugna`. Se eligió por volumen de partidas de Support/Hard Support y evidencia separada de soft support en 7.41f.
- Se incorporó M.A.D. como innata separada de la progresión; habilidades Q/W/E/R y orden de referencia se basan en StatsDota y DotaTrack, con mecánicas cotejadas en DotaCoach.
- Se detectó que una fuente registra la selección de talentos como eventos posteriores al nivel de desbloqueo. Se contrastó con DotaTrack y DotaCoach: el perfil ahora muestra las opciones de talentos en sus tiers 10/15/20/25, sin duplicarlos como eventos `T` de habilidad.
- Se ajustó la ruta de objetos de Techies Support 4 a tendencias observadas: Tranquil Boots, Ring of Basilius, Soul Ring y alternativas de Aether Lens/Consecrated Wraps; se presentan como estadísticas orientativas.
- La rama también actualiza `specializations.js` a `?v=3273` y Service Worker a `dota-build-v73`. Cambios de talentos y aclaración de matriz en nueva rama `work/etapa-3-techies-talentos`, pendientes CI y revisión del diff.


## 6. Etapa 3 — Techies Support 5 (en revisión)

- Se añadió el perfil independiente `techies|Support 5`, sin reutilizar la guía de Support 4.
- La progresión de habilidades se contrastó con StatsDota y DotaTrack para Hard Support 7.41f: Blast Off! primero, Reactive Tazer segundo, Sticky Bomb después y Proximity Mines en 6/13/17.
- Los cuatro tiers de talentos se incorporaron desde las fuentes de 7.41f; la alternativa de nivel 15 tiene datos incompletos y se marca como tal.
- Se añadió una ruta de objetos de Hard Support diferenciada: Magic Wand, Tranquil Boots, Ring of Basilius, Soul Ring; luego Aether Lens y Consecrated Wraps como referencias frecuentes. Los objetos son orientativos.
- Se añadió regresión específica para presencia del perfil, innata, iconos, cuatro tiers, independencia de Support 4 y renderizado.
- Se incrementó la versión del archivo de especializaciones a `?v=3275` y Service Worker a `dota-build-v74`.
- Fuentes: StatsDota Hard Support 7.41f (actualizado 15-11-2026), DotaTrack Hard Support 7.41f y Spectral Hard Support 7.41f (16-11-2026).
- Estado: cambios preparados en rama de trabajo; pendiente ejecutar pruebas/CI, revisar diff y abrir PR. No declarar publicación ni validación Android hasta completar esos pasos.
