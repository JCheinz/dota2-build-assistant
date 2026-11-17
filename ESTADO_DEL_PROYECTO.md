# Estado del proyecto — Dota 2 Build Assistant

**Última actualización:** 17 de noviembre de 2026  
**Repositorio:** https://github.com/JCheinz/dota2-build-assistant  
**Aplicación:** https://jcheinz.github.io/dota2-build-assistant/  
**Rama principal:** `main`  
**Versión integrada:** 3.52 + Service Worker v103; última versión estable respaldada: 3.52  
**Etapa activa:** versión 3.52 integrada mediante PR #44. Inventario actual e historial separados, registro de compras/ventas/mejoras, consumibles usados, consumo cuantitativo de componentes, deduplicación de recomendaciones y persistencia local. CI y regresiones aprobados; pendiente validación de publicación, Android y APK.

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
- Estado: cambios preparados en rama de trabajo; PR #9 integrado por squash en `main` (merge `52185eb2e22a23de6a7fa334c873ec998dee658e`). CI del PR #9 run `43913242668`, job `validate`, success (sintaxis y pruebas). Publicación Pages y prueba Android pendientes de confirmación.

## 7. Corrección de textos contextuales tras prueba Android de Techies Support 5

- El usuario compartió capturas Android que confirman que el perfil Support 5 carga con metadata, M.A.D., iconos, matriz de niveles 1–25, talentos y secciones posteriores.
- En la captura del informe se detectó texto heredado de Pugna en la sinergia genérica ("Nether Blast") y en el pie global de versión.
- Se corrigió la sinergia genérica para referirse a las habilidades del héroe seleccionado y se sustituyó el pie por una descripción neutral del asistente.
- Se añadieron regresiones para evitar que textos globales genéricos vuelvan a quedar vinculados a Pugna.
- Rama: `work/contextual-copy-cleanup`; respaldos previos: `backup/3.27-before-context-copy-fix` y `backup/estado-3.27-before-context-copy-fix`.
- Estado: cambios preparados, pendiente CI, revisión y publicación.


## 8. Actualización de continuidad — PR #10 integrado (16-11-2026)

- PR #10: “Remove leftover Pugna-specific generic report text”; integrado mediante squash.
- Commit de integración: `38ad59ef8854bc44dcb5f8b4a7470681e945861a`.
- CI del PR #10: run `43923257604`, success.
- CI posterior al merge: run `43923714561`, success.
- GitHub Pages posterior al merge: run `43923713532`, success.
- Se aisló el contenido de sinergia de Pugna Mid en `buildPugnaMidAllySynergy`; el generador genérico `buildAllySynergy` ya no contiene texto exclusivo de Pugna.
- Se conservaron las sinergias específicas de Pugna Mid y se añadieron regresiones para comprobar el aislamiento.
- Respaldo de código inmediatamente anterior al merge: `backup/pre-merge-2026-11-16`, commit `45e93cd8b106a532ac9e85e4a41981cee8ffeae7`.
- Tras el merge se creó el registro duplicado temporal `PROJECT_STATUS.md`; se decidió mantener como única fuente de verdad este archivo `ESTADO_DEL_PROYECTO.md`. El duplicado se eliminará.
- Respaldo previo a la unificación de documentación: `backup/estado-unificado-2026-11-16`, commit `0dd48e3f2b6db55350dd474e8b3d6b80fc2d0c46`.
- Commit de documentación y limpieza del duplicado: registrado en el historial de `main`; el archivo `PROJECT_STATUS.md` fue eliminado.
- Validación manual Android: completada con capturas del usuario el 16-11-2026. Techies Support 5 carga correctamente y la sección «Sinergias entre aliados» muestra pautas genéricas por roles, sin texto exclusivo de Pugna. La captura confirma la vista de Techies Support 5; queda pendiente una comprobación visual específica de Pugna Mid para confirmar su contenido individual.
- Regla de continuidad: actualizar exclusivamente `ESTADO_DEL_PROYECTO.md` tras cada hito. No crear otro archivo de estado salvo petición expresa del usuario.


## 9. Validación final Android de PR #10 y Techies Support 5 (16-11-2026)

- El usuario compartió una serie de capturas desde Android con Techies seleccionado y posición Hard Support (5), contra Bristleback, Centaur Warrunner, Broodmother, Anti-Mage y Hoodwink.
- Se confirma que el informe identifica correctamente «Análisis adaptable · Techies · Support 5» y carga la guía individual completa.
- Se visualizan metadata de la guía 7.41f, innata M.A.D., matriz de habilidades por niveles 1–25, talentos de niveles 10/15/20/25, combos, mecánicas, posicionamiento y ruta de objetos.
- La ruta de objetos muestra Magic Wand, Tranquil Boots, Ring of Basilius, Soul Ring, Aether Lens, Consecrated Wraps y Kaya; se presentan como guía orientativa.
- En «Sinergias entre aliados» aparecen recomendaciones agregadas por roles (Initiator, Disabler y Support), sin referencias a Pugna ni Nether Blast. El usuario confirmó visualmente la sección tras el despliegue de PR #10.
- Resultado: prueba manual Android de Techies Support 5 y corrección genérica de sinergias aprobadas por el usuario.
- Se observa en la interfaz el aviso de compatibilidad estimada baja de Techies para los roles generales del catálogo; la especialización individual de Support 5 sí está cargada. Se conserva como información explicativa, no como fallo.
- Próximo paso: continuar la expansión de especializaciones por héroe/posición siguiendo el flujo de respaldo, rama de trabajo, pruebas, PR, despliegue y actualización de este documento.
- Respaldo previo a este registro: `backup/estado-android-validado-2026-11-16`, creado desde el commit estable anterior `32b8ec3c60b6e16aacd26f9c2b6fa7f10e687564`.
- Regla permanente: este archivo `ESTADO_DEL_PROYECTO.md` es la única fuente de continuidad. Actualizarlo después de cada cambio relevante, integración, validación o modificación del estado; no crear archivos paralelos de estado.


## 10. Nueva especialización en desarrollo — Crystal Maiden Support 5 (16-11-2026)

- Próximo perfil seleccionado: `crystal_maiden|Support 5` (Hard Support/posición 5).
- Criterio: en la muestra de Herald de 7.41f, Crystal Maiden figura entre los hard supports fuertes (54,0% de victorias y 8,9% de selección); StatsDota la muestra como tercera por volumen de partidas de hard support entre héroes, 66,1% de sus partidas en ese rol y 51,3% de victorias en la muestra global del rol.
- Fuentes iniciales: StatsDota Crystal Maiden Hard Support 7.41f, DotaTrack Crystal Maiden build 7.41f, Spectral Hard Support 7.41f y Liquipedia changelog 7.41.
- Skill build de referencia: Frostbite 1/3/5/7; Arcane Aura 2/9/10/12; Crystal Nova 4/8/14/15; Freezing Field 6/13/17. Los niveles de desbloqueo de talentos se representan separadamente en 10/15/20/25, sin inventar eventos T en la matriz.
- Innata Glacial Guard: barrera de daño de 8 segundos por lanzamiento de habilidad, con fórmula dependiente del coste de maná actual y nivel; se documentará separada de la progresión.
- Talentos de referencia: nivel 10 +200 salud / +12 inteligencia; 15 +100 alcance de Frostbite / −4,5 s de recarga de Crystal Nova; 20 +50 daño de Freezing Field / +20% de maná gastado convertido en barrera de Glacial Guard (sin tasa fiable para la alternativa); 25 +1 s duración de Frostbite / +300 daño de Crystal Nova.
- Objetos de referencia: Tango, Iron Branch, Blood Grenade, Enchanted Mango, Sentry Ward, Magic Stick; Magic Wand y Tranquil Boots como progresión temprana; Blink Dagger y Glimmer Cape como opciones posteriores. La compra será condicional al oro, draft y necesidad real; no se presentará como obligación.
- Respaldo de código y estado creados antes del trabajo desde commit `346d6ab1504b7be0c459eb2f695853ec5210af1d`: `backup/3.27-before-crystal-maiden-support5` y `backup/estado-3.27-before-crystal-maiden-support5`.
- Rama de trabajo: `work/etapa-3-crystal-maiden-support5`.
- Perfil agregado a `specializations.js` con Glacial Guard, habilidades Q/W/E/R, progresión de referencia, cuatro tiers de talentos, combos, mecánicas, posicionamiento y cautelas.
- Ruta de objetos independiente agregada en `index.html`: consumibles de línea, Magic Wand, Wind Lace, Tranquil Boots, Infused Raindrops, Blink Dagger, Glimmer Cape y alternativas condicionales.
- Se amplió `tests/skill-matrix.test.js` para verificar metadata, innata, iconos, niveles, talentos, renderizado, aislamiento de contenido Techies y ruta de objetos independiente.
- Referencia de especializaciones actualizada a `?v=3276`; Service Worker actualizado a `dota-build-v75`.
- PR #11 abierto: https://github.com/JCheinz/dota2-build-assistant/pull/11
- Primer intento de CI run `43926257452` detectó un separador sintáctico sobrante antes del perfil; corregido en el commit `27bde04646bd74f5b74ab3a6b0d818382b0dea27`.
- CI del commit corregido run `43926333308`, job `133506680152`: sintaxis y pruebas aprobadas.
- Estado: PR abierto, no integrado ni desplegado; se está completando revisión y validación final. No modificar Techies Support 4/5 ni Pugna.

## 11. Corrección de ruta de objetos — Crystal Maiden Support 5 (16-11-2026)

- Rama de trabajo: `work/etapa-3-crystal-maiden-item-route-fix`; respaldos previos de código y estado: `backup/3.27-before-crystal-maiden-item-route-fix` y `backup/estado-3.27-before-crystal-maiden-item-route-fix`.
- Las capturas Android mostraron que la selección inicial de siete objetos podía llenar el bloque principal con consumibles y dejar fuera de vista el núcleo y las alternativas situacionales del perfil.
- El informe ahora presenta un bloque separado de `Núcleo orientativo` y conserva visibles las compras situacionales de Crystal Maiden aunque no entren entre las primeras siete recomendaciones. Los objetos ya marcados como comprados se ocultan de esos bloques.
- La próxima compra de Crystal Maiden Support 5 ya no propone automáticamente Tango con cero oro. Solicita registrar el oro; antes del minuto 12 orienta sobre la fase de línea; desde el minuto 12 sigue el orden de núcleo Blink Dagger → Glimmer Cape → Aghanim’s Shard, avanzando según el inventario marcado. Si el núcleo está cubierto, solo propone una alternativa situacional si el análisis la puntúa.
- Se agregaron iconos oficiales para Tango, Iron Branch, Blood Grenade, Enchanted Mango, Sentry Ward, Magic Stick, Wind Lace, Tranquil Boots e Infused Raindrops.
- Se añadieron regresiones para iconos, visibilidad del núcleo y alternativas, guardas de oro/fase y avance de la ruta según inventario.
- Service Worker actualizado a `dota-build-v76`.
- Estado actualizado: PR #12 integrado por squash en `main` el 16-11-2026. Commit: `af5dbca8e8d3d79348aa5632f839dd177106c975`. CI previo al merge aprobado; validación post-merge y despliegue de Pages iniciados y pendientes al momento de esta actualización.

## 12. Integración y autorización operativa permanente (16-11-2026)

- PR #12 — Fix Crystal Maiden Support 5 item route and icons: https://github.com/JCheinz/dota2-build-assistant/pull/12
- Integrado por squash en `main`; commit: `af5dbca8e8d3d79348aa5632f839dd177106c975`.
- CI del PR antes del merge: aprobado (run `43928051614`, job `133512701083`).
- Validación post-merge: run `43929105992`, iniciada y pendiente de resultado en el momento de esta actualización.
- GitHub Pages build/deploy: run `43929102880`, iniciado y pendiente de resultado en el momento de esta actualización.
- Service Worker incluido: `dota-build-v76`.
- A partir del 16-11-2026, el usuario autoriza expresamente realizar merges automáticamente cuando el PR tenga CI aprobado, revisión de diff satisfactoria, sin conflictos y el archivo de estado esté actualizado. No hace falta pedir autorización individual para cada merge bajo esas condiciones.
- Archivo operativo de continuidad: `ESTADO_DEL_TRABAJO.md`; mantenerlo actualizado en cada avance relevante, además de este historial de proyecto.


## 13. Mejora transversal de accesibilidad horizontal — matrices de habilidades (16-11-2026)

- El usuario solicitó que la columna con los nombres de las habilidades permanezca visible al desplazarse horizontalmente y confirmó expresamente que debe aplicarse a todos los héroes.
- Se creó la rama `work/universal-sticky-skill-labels` desde el main publicado `546cd175f1b6c0dcce6e86cbf6e2638792d46996`, con respaldos `backup/3.27-before-universal-sticky-skill-labels` y `backup/estado-3.27-before-universal-sticky-skill-labels`.
- Se ajustó el CSS común de `renderSpecializationGuide(g)`: etiquetas de primera columna con `position: sticky; left: 0`, fondo opaco, z-index superior y sombra divisoria; cabecera «HABILIDAD» en capa superior. Se eliminó el `overflow:hidden` interno que recortaba el sticky.
- La modificación afecta a todas las matrices que genera el renderizador compartido, independientemente del héroe, posición o cantidad de niveles.
- Se añadió prueba automatizada que recorre todos los perfiles con `skillBuild` e `skillIcons` y verifica que renderizan la estructura común con etiquetas fijas.
- Se actualizó la referencia de especializaciones a `?v=3277` y Service Worker a `dota-build-v77`.
- Estado: rama preparada; pendiente CI y revisión del diff antes de crear/integrar PR.
- No se alteró la lógica ni los datos de las especializaciones validadas de Pugna, Techies Support 4/5 y Crystal Maiden Support 5.


## 14. Integración — columna fija universal de matrices de habilidades (16-11-2026)

- PR #13 «Keep skill matrix labels fixed for every hero»: https://github.com/JCheinz/dota2-build-assistant/pull/13
- Integrado por squash en `main`; commit `aa746438c3d799e63f6eba4fe9a240986cdd6030`.
- CI del PR #13 run `43933110575`: success; sintaxis y regresiones aprobadas.
- Cambio en el renderizador compartido: primera columna de nombres fija durante el desplazamiento horizontal, cabecera HABILIDAD por encima de las celdas y sombra divisoria. Se eliminó el overflow interno que recortaba sticky.
- Regresión automatizada añadida para todas las especializaciones que declaran matriz; no se modificaron los datos ni las lógicas individuales de Pugna, Techies Support 4/5 o Crystal Maiden Support 5.
- Cache Service Worker: `dota-build-v77`; referencia de especializaciones: `?v=3277`.
- Respaldos: `backup/3.27-before-universal-sticky-skill-labels` y `backup/estado-3.27-before-universal-sticky-skill-labels`.
- CI post-merge y publicación Pages iniciados, pendientes de confirmación al momento de esta actualización.
- Próxima validación manual: probar desplazamiento de la matriz en Android con varios héroes/posiciones y comprobar que la columna de nombres permanece fija.


## 15. Crystal Maiden Support 4 — matriz de habilidades y árbol de talentos (16-11-2026)

- Se comprobó que el registro existente incluía únicamente `crystal_maiden|Support 5`; no había perfil `Support 4`. Esa ausencia explicaba que no aparecieran orden de habilidades ni talentos.
- Se agregó un perfil individual `crystal_maiden|Support 4`, separado de Support 5 y basado en datos de soft support del parche 7.41f.
- Progresión contrastada: Frostbite niveles 1/3/5/7; Arcane Aura 2/9/10/12; Crystal Nova 4/8/14/15; Freezing Field 6/13/17.
- Talentos y alternativas: nivel 10 (+200 salud / +12 inteligencia); nivel 15 (+100 alcance de Frostbite / −4,5 s de recarga de Crystal Nova); nivel 20 (+50 daño de Freezing Field / opción de Glacial Guard sin muestra suficiente); nivel 25 (+1 s de Frostbite / +300 daño de Crystal Nova).
- Fuentes consultadas para posición 4: StatsDota soft support y DotaTrack Crystal Maiden soft sup build. Los datos de hard support existentes no se sustituyeron ni se mezclaron como si fueran de posición 4.
- Prueba de regresión añadida para progresión nivel por nivel, los cuatro tiers, renderizado de matriz/árbol y separación respecto de Support 5.
- Versiones: `specializations.js?v=3278`, Service Worker `dota-build-v78`.
- Rama `work/crystal-maiden-support4-guide`; respaldos previos `backup/3.27-before-crystal-maiden-support4` y `backup/estado-3.27-before-crystal-maiden-support4`.
- PR #14 integrado por squash en `main` el 16-11-2026; commit `29d7a769ebeb2cbd364fcc83d0b861a488b55e34`.
- CI del último commit de la rama antes del merge: run `43935068064`, success. CI post-merge de `main`: run `43935772107`, success.
- GitHub Pages para el commit integrado: run `43935771590`, en ejecución al actualizar este registro.

## 16. Auditoría transversal de especializaciones (16-11-2026)

- Rama: `work/audit-specialization-quality`, creada desde `main` commit `2c82a1b28fd07a836a19f48f4673e50ca6bbb108`.
- Respaldos previos: `backup/3.27-before-specialization-audit` y `backup/estado-3.27-before-specialization-audit`.
- Alcance: siete perfiles existentes — Pugna Mid/Support 4/Support 5; Techies Support 4/Support 5; Crystal Maiden Support 4/Support 5.
- Hallazgo verificado: todos los perfiles contienen `talentChoices` con cuatro tiers (10/15/20/25), y el renderizador utiliza ese campo como fuente principal del árbol. Por eso, que algunos perfiles tengan un campo auxiliar `talents` incompleto o ausente no implica que el árbol visible esté incompleto; no se duplicarán ni modificarán datos redundantes sin necesidad.
- Hallazgo de calidad: las pruebas previas cubrían cada perfil de manera desigual y no verificaban de forma transversal los siete árboles completos, las dos opciones y sus explicaciones, niveles válidos/únicos de progresión ni coherencia de metadata cuando existe.
- Se añadió una regresión transversal para exigir los siete perfiles conocidos, progresión con niveles válidos y no duplicados, referencias de iconos válidas, cuatro tiers con dos opciones explicadas y renderizado efectivo de todas las elecciones. También verifica rol/parche en metadata cuando está declarada.
- No se cambiaron datos de builds, talentos, compras ni lógica del motor. Perfiles validados por el usuario permanecen intactos.
- Estado: pruebas ampliadas en rama; pendiente CI, revisión del diff y PR. No integrado ni desplegado.
- PR #15 integrado por squash en `main`: https://github.com/JCheinz/dota2-build-assistant/pull/15.
- Commit de integración: `c8abc5f9aefe09a9e25d94b8e49885a700d0d8c9`.
- CI del PR #15: run `43942313191`, success. CI post-merge: run `43942370008`, success.
- GitHub Pages post-merge: run `43942368681`, build y deploy success.
- La auditoría transversal quedó integrada; no cambió datos de builds ni lógica del motor.


## 17. Seguimiento de compras por toque — PR #16 (16-11-2026)

- El usuario solicitó acercar las recomendaciones al panel de estado/compras y poder descontar un objeto con un toque, sin cargarlo previamente en una lista manual.
- Se creó `work/purchase-workspace-click-to-buy` desde main `435348f0af9abaffef66d98b231c7b833cf9455c`; se conservaron los respaldos `backup/3.28-before-performance-optimization` y `backup/estado-3.28-before-performance-optimization`.
- Se añadió un bloque compacto «Compras y seguimiento» al inicio del informe. Las tarjetas de rutas y recomendaciones permiten marcar/desmarcar compras; el informe se recalcula sin desplazar al usuario al inicio.
- El toque en un componente registra ese componente, mientras que el toque en un objeto completo registra el objeto entero. La lista manual sigue disponible de forma opcional y desplegable.
- El estado de comprado se distingue visualmente y las recomendaciones se recalculan usando el inventario actualizado. No se alteraron datos de builds ni especializaciones.
- Se añadieron regresiones automatizadas de interacción/estado visual. PR #16: https://github.com/JCheinz/dota2-build-assistant/pull/16; CI del PR run `43947885373`, success.
- Integrado por squash en main: `cc5e0941b70ea0b506bfced24bc7ef832a187e9c`. CI post-merge run `43947959482` y Pages run `43947959522` quedaron iniciados; confirmar resultados antes de solicitar prueba Android.
- Service Worker actualizado a `dota-build-v79`.


## 18. Inventario visual del héroe — PR #17 (16-11-2026)

- Se creó la rama `work/hero-inventory-visual` desde main `376a1703bb27a57178d728840dfbbb13f8f5dabc`; respaldos: `backup/3.29-before-hero-inventory-ui` y `backup/estado-3.29-before-hero-inventory-ui`.
- La sección de compras ahora contiene un inventario visual de seis espacios principales, inspirado en el HUD de Dota 2. Cada objeto completo comprado aparece allí con icono y nombre.
- Los objetos que exceden seis espacios se conservan en un apartado adicional; los componentes se listan por separado.
- Los elementos del inventario son interactivos: tocar un objeto lo retira del inventario y recalcula el informe; lo mismo ocurre con los componentes.
- Las recomendaciones siguen admitiendo compra por toque y actualizan este inventario. La lógica de builds y especializaciones no se modificó.
- Se agregaron pruebas de regresión. PR #17 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/17; CI del PR run `43950311869`, success.
- Commit integrado: `d86f9f451f4d40fc6e55ea3ec739ff7834e6b3d0`. Service Worker `dota-build-v80`. CI post-merge y Pages pendientes de confirmación.


## 19. Auditoría universal de compras e inventario — PR #18 (16-11-2026)

- Se respaldó main `506bb61fc4749aca0d413fb48ecf52faaced54fd` en `backup/3.30-before-universal-purchase-audit` y `backup/estado-3.30-before-universal-purchase-audit`.
- La auditoría confirmó un mecanismo común: las rutas individuales y las recomendaciones usan `renderItemCards`; la delegación de eventos admite objetos dinámicos no presentes en la lista manual; el inventario visual refleja objetos completos y componentes y permite retirarlos.
- Se reforzaron regresiones para recorrer todas las rutas declaradas en `heroPlans` (inicio, núcleo y situacionales), probar recomendaciones arbitrarias no precargadas, render del inventario, retirada de objetos/componentes y catálogo común para Carry/Mid/Offlane/Support 4/Support 5.
- No se alteraron las builds, las especializaciones ni el criterio de compra; solo se fortaleció la validación transversal.
- PR #18: https://github.com/JCheinz/dota2-build-assistant/pull/18. CI aprobado en run `43969922879`, commit `20913dbfaa796e6ea3e12c921f34b255fb792139`.
- Estado: pendiente actualizar los registros finales, integrar y confirmar CI/Pages post-merge.

- Resultado final: PR #18 integrado en main por squash, commit `ae787e7bc51e128db5e5a3e3cea6827baac7f3f7`. CI de la rama con estado y pruebas finales run `43969996986`, success; Pages build y deploy post-merge run `43970058451`, success. Publicación confirmada.


## 20. Consumo de componentes y aislamiento del inventario — PR #19 (16-11-2026)

- Se crearon respaldos `backup/3.31-before-recipe-consumption` y `backup/estado-3.31-before-recipe-consumption` desde main `b06b21e41c194a95fc0d321e4d4ed2b7864f19f4`.
- Al marcar un objeto completo como comprado, ahora se consumen sus componentes declarados en `itemRecipes`. En el caso de Arcane Boots se retiran Boots of Speed, Ring of Basilius, Wizard Hat y Receta de Arcane Boots; los componentes ajenos permanecen.
- Cambiar héroe o posición reinicia el inventario previo, evitando mezclar las compras de dos configuraciones diferentes.
- Pruebas de regresión para consumo de receta y aislamiento de inventario. PR #19: https://github.com/JCheinz/dota2-build-assistant/pull/19; CI inicial `43976306859`, success.
- Service Worker `dota-build-v81`. Pendiente merge y verificación de Pages.

- Integrado por squash en main: commit `4a821e26311295be500993bcc36cc6f719a4eb49`. CI final de PR tras actualizar estados run `43976374141`, success. Pendiente confirmar CI y Pages post-merge.


## 21. Inventario con mochila y reserva vendible — PR #20 (16-11-2026)

- Respaldos: `backup/3.32-before-inventory-backpack-reserve` y `backup/estado-3.32-before-inventory-backpack-reserve`, desde main `48aa1ee85f00cac61912793c9adb2198395113ce`.
- Interfaz de inventario ampliada: seis espacios principales, tres espacios de mochila para rotar objetos y zona de reserva sin límite fijo.
- Tocar un objeto de inventario/mochila permite moverlo entre sectores si existe espacio; × lo retira/vende. En reserva, tocar directamente el objeto lo vende y lo descuenta de los comprados.
- Se preserva la asignación de sectores al recalcular y reconstruir los controles. Componentes y consumo de recetas conservados.
- Regresiones automáticas añadidas; CI run `43979583575`, success. PR #20: https://github.com/JCheinz/dota2-build-assistant/pull/20.
- Service Worker actualizado a `dota-build-v82`. Pendiente merge y verificación de publicación.

- Resultado final: PR #20 integrado por squash en main, commit `31fbcd2a5d7ac94ca1f0d6d9ecb0de2dde155008`. CI post-merge run `43979731552`, success. GitHub Pages build/deploy run `43979731165`, success; publicación confirmada.


## Corrección de compras por etapa e iconos — en desarrollo (16-11-2026)

- Rama: `work/phase-aware-inventory-and-item-icons`, desde main `aedb9a10d3715e0685eb64616d8bf8fa43547045`.
- Respaldos pre-etapa creados previamente: `backup/3.29-before-phase-aware-purchases` y `backup/estado-3.29-before-phase-aware-purchases`, ambos apuntan al commit base.
- Se identificó que la rama especial de compras de Pugna Mid daba paso primero al núcleo y luego ordenaba alternativas solo por score, sin ponderar fase tardía. Ahora agrega bonus de etapa: inicio, medio y avanzada/cierre; las defensas situacionales no se descartan y pueden seguir ganando si tienen score real.
- El inventario automático ahora ordena los objetos registrados por la fase actual y por las secciones de la ruta individual (early/core/situational). Las ubicaciones manuales guardadas por el usuario se conservan.
- El fallback visual de imagen rota deja de mostrar una espada genérica y muestra una abreviatura del objeto. Se añadieron asociaciones para componentes de recetas observados en la prueba (Robe of the Magi, Staff of Wizardry, Energy Booster, Void Stone, Ring of Health, Ultimate Orb y recetas).
- Service Worker actualizado a `dota-build-v84`.
- Pruebas añadidas para las tres fases, ponderación tardía de Pugna, orden automático del inventario y fallback/iconos de componentes.
- Pendiente: CI, revisión del diff, integración y despliegue. No afirmar publicación hasta verificar GitHub Pages.


## Resultado — PR #22 integrado (17-11-2026)

- PR #22 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/22.
- Commit integrado: `4c0eb7874171ad09c10706c341c23f829e4fa756`.
- CI del PR #22 run `43988280714`: success. CI post-merge run `43988328494`: success.
- GitHub Pages run `43988327776`: en ejecución al actualizar este registro; no declarar deploy completado hasta confirmar.
- Service Worker `dota-build-v84`.
- Se conserva la fase 0–11 / 12–27 / 28+ para priorizar compras; en Pugna, el núcleo base sigue primero y, una vez cubierto, las opciones avanzadas/cierre reciben ponderación tardía sin eliminar respuestas defensivas justificadas.
- El inventario automático reordena objetos según la ruta individual y la etapa; los espacios con zona manual explícita se conservan.
- Los iconos que fallen muestran abreviatura del nombre en vez de una espada genérica. Las asociaciones nuevas se añadieron para componentes y recetas reportados. La comprobación de que cada URL de imagen sirva el icono visual exacto requiere validación visual Android.
- Próxima prueba Android: Pugna Mid con inventario similar a la captura, probar minuto 25 y 35 y verificar que cambia la próxima compra; comprobar también que los objetos automáticos se reordenan y los manuales no se mueven. Revisar iconos de Robe of the Magi, Staff of Wizardry y componentes.


## Nueva etapa — problemas de partida y evolución del núcleo Pugna Mid (17-11-2026)

- Respaldos previos desde main `3c15fead72068bbf89f208f4e5cdf72b5c7570a9`: `backup/3.34-before-situation-and-core-progression` y `backup/estado-3.34-before-situation-and-core-progression`.
- Rama: `work/situation-aware-core-evolution`.
- Se corrigió el contrato entre el selector `currentProblem` (valores `issue:*` y `enemy:*`) y el motor específico de Pugna, que esperaba claves antiguas como `rupture`, `initiation` o `magic`. Ahora las opciones elegidas por el usuario elevan las respuestas correspondientes y conservan condiciones para evitar compras automáticas injustificadas.
- Se amplió la detección de problemas seleccionables para movilidad/saltos, intercambios de línea y peleas grupales cuando el draft contiene amenazas asociadas.
- Pugna Mid incorpora opciones de progresión posterior al núcleo: Kaya and Sange, Yasha and Kaya, Shiva’s Guard y Gem of True Sight. Las evoluciones de Kaya solo reciben prioridad si Kaya está comprada y el minuto es 32 o superior; otras opciones tardías dependen de problema/minuto.
- Las recetas reconocen objetos completos existentes como componentes de una evolución y al marcar la mejora como comprada se consume el objeto base del inventario. No se modifica la compra ni el inventario de otros héroes.
- Se actualizó Service Worker a `dota-build-v85` y se agregaron regresiones estáticas para problemas contextuales, evolución de Kaya y continuidad tardía.
- Pendiente: validar CI, revisar diff y verificar que las pruebas dinámicas no alteren perfiles Pugna Support, Techies o Crystal Maiden. Prueba Android posterior: variar el problema seleccionado con draft fijo y comprobar que cambie la respuesta; registrar Kaya en inventario y probar minuto 33 para observar evolución; marcar la evolución y confirmar consumo de Kaya.


## Resultado — PR #23 integrado y desplegado (17-11-2026)

- PR #23: https://github.com/JCheinz/dota2-build-assistant/pull/23, integrado por squash.
- Commit de integración: `c907dd7040c7b5611df9e55d725f2db593448081`.
- CI del PR, run `43990690370`: success, incluidas pruebas funcionales del motor Pugna para los ocho problemas, evoluciones de Kaya y opciones tardías.
- CI post-merge, run `43990733161`: success.
- GitHub Pages build/deploy, run `43990732518`: success; publicación confirmada.
- Service Worker: `dota-build-v85`.
- Alcance: se corrigió el enlace entre el selector de problemas y las respuestas de compra de Pugna Mid; se agregaron rutas de evolución de Kaya y opciones condicionales de late game. Se mantienen intactos los perfiles Pugna Support, Techies y Crystal Maiden.
- Validación pendiente del usuario en Android: cambiar el problema seleccionado con draft fijo y verificar la próxima compra; registrar Kaya como objeto completo, fijar minuto 33 y comprobar que se recomiende una evolución apropiada; al marcar la evolución, confirmar que Kaya se consume del inventario.


## Nueva etapa — controles independientes y selección situacional Pugna (17-11-2026)

- Backups creados desde main `4e75464b0ed9ca1b46443ea5bb2f82593fd20bb4`: `backup/3.35-before-inventory-and-selection-controls` y `backup/estado-3.35-before-inventory-and-selection-controls`.
- Rama: `work/inventory-and-selection-controls`.
- La composición incorpora el botón `Borrar héroes`, que limpia únicamente los diez espacios del draft.
- El inventario incorpora `Borrar ítems`, que limpia únicamente objetos completos, componentes, minuto, oro y problema seleccionado; no toca los héroes.
- `Limpiar selección` se renombra `Restablecer todo` y conserva una acción explícita para borrar ambos contextos.
- Pugna Mid conserva Kaya and Sange como única evolución de Kaya en esta ruta; se retira Yasha and Kaya de las opciones específicas de Pugna.
- Se añade Spirit Vessel al motor de Pugna Mid con prioridad condicional ante Alchemist/Huskar cuando el sustain sea la amenaza; se agrega a carga manual e iconografía.
- Service Worker pasa a `dota-build-v86`. Se añadieron comprobaciones de regresión para botones separados y respuestas anti-sustain.
- Pendiente CI/revisión del diff y prueba Android de los tres botones y de Spirit Vessel ante Alchemist/Huskar.


## Resultado — PR #24 integrado (17-11-2026)

- PR #24 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/24.
- Commit: `55b036ff371128c14d8f08cab11e5acaa4d0f5cf`.
- CI del PR, run `43992294471`: success tras corregir la expectativa de regresión para que Pugna tenga una sola evolución de Kaya.
- Cambios integrados: `Borrar héroes` limpia solo el draft; `Borrar ítems` limpia inventario/componentes y estado de partida; `Restablecer todo` mantiene el borrado completo.
- Pugna Mid: Kaya and Sange queda como única evolución de Kaya en su ruta. Spirit Vessel se incorpora al motor con prioridad condicional frente a Alchemist/Huskar por sustain alto.
- Service Worker: `dota-build-v86`.
- Pendiente: verificar CI post-merge y deploy de Pages, y prueba visual Android de los botones y de la compra anti-sustain.


## Progresión adaptativa de núcleo y evoluciones (17-11-2026)

- Se inició una etapa transversal con foco de validación inicial en Pugna Mid.
- La próxima compra sigue una ruta core secuencial, admite respuestas situacionales explícitas de alta prioridad y considera minuto, oro, objetos completos y componentes.
- Las evoluciones reconocen el objeto base como componente ya adquirido: Kaya + Sange → Kaya and Sange. Al registrar la mejora completa, se consume Kaya del inventario para evitar duplicación.
- La presencia de un héroe con sustain en el draft no equivale por sí sola a una compra obligatoria; el problema seleccionado eleva Spirit Vessel cuando corresponde.
- Rama de trabajo: `work/core-progression-and-item-upgrades`; respaldos previos 3.34.
- Estado: implementación y pruebas agregadas; pendiente CI/revisión/deploy.


## Resultado — progresión adaptativa y evolución de objetos (17-11-2026)

- PR #25 integrado por squash: `78b25a96ced89c6251313e7d3889b0c2057b3a66`.
- CI del PR y post-merge aprobados (runs `43995986339` y `43996069576`).
- GitHub Pages build/deploy aprobado (run `43996068769`).
- Service Worker v87.
- Pugna Mid: core secuencial Arcane Boots → Aether Lens; respuesta situacional explícita de prioridad alta puede adelantar el core. Spirit Vessel no se impone por presencia de Alchemist/Huskar sin seleccionar sustain.
- Evolución Kaya → Kaya and Sange: Kaya se reconoce como objeto base poseído, se solicita Sange y al marcar la mejora se consume el objeto anterior.
- Pruebas funcionales agregadas y suite de regresión completa aprobada. Próxima validación: Android, incluyendo avance core, selección de problema, mejora y consumo de Kaya.


## Orden situacional del inventario (17-11-2026)

- Se añadió un refinamiento para que el inventario automático priorice los objetos situacionales ya adquiridos según el problema seleccionado, sin mover objetos ubicados manualmente.
- Se mantiene la organización por etapa y por núcleo del héroe; las evoluciones completadas pueden subir en el orden visual cuando corresponde.
- Rama `work/situational-inventory-priority`; respaldos 3.37. Pendiente CI, revisión e integración.


## Resultado — orden situacional del inventario publicado (17-11-2026)

- PR #26 integrado: `4106040f1fde2d920f4e2a5e2d99c07cc78412b3`.
- CI PR/post-merge: success (`43996382079`, `43996452895`). GitHub Pages build/deploy: success (`43996452316`).
- Service Worker v88.
- El inventario automático prioriza la respuesta situacional ya adquirida según el problema seleccionado, sin alterar las ubicaciones manuales; mantiene el orden por etapa y núcleo.


## Resultado — motor común de progresión 3.38 (17-11-2026)

- PR #28 integrado por squash: `b64556cfb3a173c7979aba46a04be8446eb2e1e0`.
- CI del PR aprobado (run `44000768637`).
- Versión 3.38 · Service Worker v89.
- Rutas individuales: el motor compartido respeta su orden principal sin depender de excepciones por héroe; las respuestas situacionales explícitas pueden adelantar el núcleo cuando alcanzan prioridad suficiente.
- Se corrigió una detección demasiado amplia de Anti-Mage que podía contaminar rutas de otros héroes con objetos compartidos.
- Pendiente: confirmar despliegue GitHub Pages y validar comportamiento real en Android. La suite automatizada no sustituye esa prueba.


## 12. Respaldo estable y política de APK (16-11-2026)

- Se creó una copia estable del código integrado 3.38 desde el commit `fcd8a020ba70e6e970cb3d9e68a7920c36739343`:
  - Rama inmutable de respaldo de código: `backup/3.38-stable-2026-11-16`.
  - Rama de respaldo del estado: `backup/estado-3.38-stable-2026-11-16`.
- Estos respaldos conservan el snapshot del repositorio anterior a los próximos cambios. No se deben sobrescribir; cada nueva versión estable tendrá ramas nuevas.
- Estado de la aplicación: el proyecto actualmente está publicado como aplicación web en GitHub Pages. En esta revisión no se encontró un APK versionado ni un flujo Android/Gradle de generación de APK en el repositorio. Por tanto, **no se afirma que exista un APK 3.38 descargable ni se inventa un respaldo binario**.
- Política de respaldos APK a partir de ahora:
  1. Cada APK generado y probado se conserva como archivo binario independiente, con nombre `Dota2-Build-Assistant-vX.YY-YYYY-MM-DD.apk`.
  2. Registrar versión, fecha, commit fuente, checksum SHA-256, resultado de instalación y enlace/ubicación del archivo.
  3. No reemplazar APK anteriores; conservar también el último APK estable conocido.
  4. Si solo hay aplicación web y no se ha generado APK, indicarlo explícitamente como “APK no generado”.
- Regla permanente de documentación: actualizar este archivo `ESTADO_DEL_PROYECTO.md` en cada respaldo, cambio relevante, PR integrado, resultado CI/Pages, generación de APK y validación Android. Este sigue siendo el único registro maestro del estado.
- Estado de publicación 3.38: integración en `main` confirmada; CI del PR #28 aprobado. No hay confirmación independiente del despliegue de GitHub Pages ni prueba Android posterior a 3.38.

- Registro de política APK creado en `backup/APK/README.md` (commit `2641ed1def23faa6f46b8da8baccb01cda5b70f0`). El registro deja explícito que el APK 3.38 no existe todavía como binario y define nombre, metadatos y conservación inmutable para futuras compilaciones.
- Actualización de este estado y política de respaldos: commit `c51cdf887328eed5bd9c56bdf5ad7941662a8b39`.


## 13. Etapa — mercado universal y compras incrementales (16-11-2026)

- Respaldos previos desde el commit `679d6af5b38e0c48feffd44bec6f7471de81a457`: `backup/3.38-before-universal-market-v3-39` y `backup/estado-3.38-before-universal-market-v3-39`. No sobrescribir.
- Rama de trabajo: `work/universal-market-progression-v3-39`.
- Auditoría detectó que los objetos sin receta ni coste explícito podían devolver coste 0 y aparentar ser gratuitos. Se corrigió el contrato: el precio desconocido ahora es `null`, no 0; la interfaz indica que debe comprobarse en la tienda.
- La selección de componentes ahora reconoce tanto componentes parciales como objetos completos ya adquiridos que formen parte de una evolución (por ejemplo, Kaya → Kaya and Sange).
- La tarjeta de próxima compra informa el coste y oro faltante cuando el catálogo dispone de un precio conocido; si el precio no está verificado, lo declara expresamente.
- Se añadieron regresiones para coste desconocido, coste conocido, componente ya adquirido y evolución Kaya → Kaya and Sange.
- Versión de trabajo: 3.39. Service Worker: `dota-build-v90`.
- CI del PR #30: runs `44001719794` y `44001721511`, ambos success; sintaxis de especializaciones y suite completa de regresiones aprobadas.
- Revisión del diff: sin cambios en especializaciones ni reglas de draft; el alcance se limita al contrato de coste/receta y presentación de la próxima compra.
- Estado: PR #30 listo para integrar; publicación y validación Android pendientes. No declarar el mercado universal terminado con este primer bloque: sigue pendiente ampliar/contrastar recetas y costes del catálogo y validar rutas reales de más héroes/posiciones.


## 14. Resultado — PR #30 integrado: mercado universal (16-11-2026)

- PR #30 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/30.
- Commit de integración: `d8bfd138a22c9bb8cd51f2f106a0eb27c020daf2`.
- CI del PR, run `44001791783`: success; sintaxis de especializaciones y suite de regresiones completas aprobadas. Runs previos de validación del mismo código: `44001719794` y `44001721511`, success.
- Versión integrada: 3.39. Service Worker: `dota-build-v90`.
- El mercado ya no trata como gratuitos los objetos cuyo coste no está catalogado; la interfaz diferencia precio verificado de precio desconocido.
- La progresión de recetas descuenta componentes y objetos completos ya poseídos; la mejora Kaya → Kaya and Sange solicita Sange cuando Kaya ya está en el inventario.
- Respaldo estable de código: `backup/3.39-market-cost-fix-2026-11-16`.
- Respaldo estable del estado: `backup/estado-3.39-market-cost-fix-2026-11-16`.
- Publicación GitHub Pages de 3.39 y validación Android: pendientes de confirmación independiente. APK 3.39: no generado; el repositorio sigue siendo una aplicación web sin binario Android comprobado.
- Próxima etapa: ampliar el catálogo validado de recetas/componentes, hacer que las rutas de todos los héroes/posiciones avancen sin agotarse y revisar la prioridad situacional/core en partidas completas. No declarar completo el mercado automático todavía.


## 15. Etapa — pool completo del mercado automático (16-11-2026)

- Respaldos previos desde el commit `9e451cd7a22ea4f04c98ae0efcc9efbddf648fab`: `backup/3.39-before-full-market-pool-v3-40` y `backup/estado-3.39-before-full-market-pool-v3-40`. No sobrescribir.
- Rama: `work/full-market-pool-progression-v3-40`.
- Auditoría confirmó que el mercado recibía únicamente `adaptive.selected` y `adaptive.situational`, listas derivadas de un máximo de siete tarjetas visibles. Las demás compras candidatas quedaban fuera del motor.
- Se separa el pool completo de candidatos (`marketPool`) de la selección visual resumida. El mercado recibe todos los candidatos puntuados; la interfaz conserva su límite visual para no saturar la pantalla.
- Se añade una regresión con 24 objetivos core y dos situacionales: debe recorrer los 24 en orden y continuar con el situacional tras completar el núcleo.
- Versión de trabajo: 3.40. Service Worker: `dota-build-v91`.
- CI del PR #31, run `44001992386`: success; sintaxis y suite completa de regresiones aprobadas, incluida la ruta sintética de 24 objetivos y continuidad situacional.
- Revisión del diff: el pool completo se conserva por separado de las siete tarjetas visuales; no se modifican perfiles ni puntuaciones de héroes.
- Estado: listo para integrar. Publicación y prueba Android pendientes. La cobertura de rutas individuales y recetas sigue siendo incremental; no se afirma que todos los héroes tengan una build individual validada.


## 16. Resultado — PR #31 integrado: pool completo del mercado (16-11-2026)

- PR #31 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/31.
- Commit de integración: `7840479c8819b42368350c8c67a2cb2d0af205b4`.
- CI del PR, run `44002035632`: success; sintaxis y suite completa aprobadas, incluida la prueba de progresión de 24 objetos y continuación situacional.
- Versión integrada: 3.40. Service Worker: `dota-build-v91`.
- `buildAdaptivePlan` expone todos los candidatos puntuados como `marketPool`; el mercado usa ese pool completo en vez de limitarse a las siete tarjetas visibles. La interfaz mantiene el resumen compacto.
- Respaldos estables creados desde el commit integrado:
  - Código: `backup/3.40-full-market-pool-2026-11-16`.
  - Estado: `backup/estado-3.40-full-market-pool-2026-11-16`.
- GitHub Pages de 3.40 y validación Android: pendientes de confirmación independiente. APK 3.40: no generado; no existe binario Android comprobado en el repositorio.
- Próxima etapa: ampliar el catálogo de recetas/costes con datos verificados y probar rutas completas por héroe/posición. El mercado ya no tiene el límite artificial de siete candidatos, pero todavía no está certificada la cobertura individual de todos los héroes.


## 17. Desarrollo — catálogo recursivo de recetas y componentes (versión candidata 3.41, 16-11-2026)

- Respaldos previos creados desde `main` después de integrar PR #31:
  - Código: `backup/3.40-before-recipe-catalog-audit-2026-11-16`.
  - Estado: `backup/estado-3.40-before-recipe-catalog-audit-2026-11-16`.
- Rama de trabajo: `work/verified-item-recipe-catalog-v3-41`.
- Se amplió el catálogo de recetas con Perseverance, Sange, Yasha, Manta Style, Kaya and Sange, Yasha and Kaya, Sange and Yasha, Shiva’s Guard, Glimmer Cape, Force Staff, Black King Bar, Dragon Lance y Hurricane Pike; se revisaron también las rutas de Battle Fury y Arcane Boots.
- Costes de referencia de la candidata: Battle Fury 3.900; Yasha 2.100; Sange 2.100; Manta Style 4.650; Arcane Boots 1.500; Kaya and Sange / Yasha and Kaya / Sange and Yasha 4.200; Shiva’s Guard 4.500; Glimmer Cape 2.150; Force Staff 2.200; Black King Bar 4.050; Dragon Lance 2.000; Hurricane Pike 4.550.
- El motor ahora expande recetas anidadas: por ejemplo, si se registran Blade of Alacrity, Band of Elvenskin y Receta de Yasha, Manta Style no vuelve a solicitar Yasha; solo muestra Diadem y la receta final.
- La evolución Kaya → Kaya and Sange conserva el comportamiento: Kaya completa se reconoce como componente, y solo se solicita Sange cuando falta.
- Se incorporó cantidad en piezas duplicadas: Battle Fury necesita dos Broadswords. Si ya hay una Broadsword completa en el inventario, el motor descuenta una y solicita una adicional; la interfaz muestra la cantidad pendiente.
- Al completar un objeto, el consumo recorre la receta anidada y consume el objeto completo si está registrado; si no, consume las piezas registradas. Se preservan los componentes no relacionados.
- Se añadieron regresiones para sumas de costes, expansión Manta/Yasha, evolución Kaya, duplicados de Battle Fury y consumo recursivo.
- Versión candidata visible: 3.41. Service Worker: `dota-build-v92`; referencia de especializaciones `?v=3279`.
- Estado: pendiente CI, revisión del diff e integración. No declarar desplegada la 3.41 hasta verificar Pages; Android y APK 3.41 siguen pendientes. La cobertura de recetas se amplía de forma incremental, no representa todavía el catálogo completo de Dota 2.

- CI del PR #32: run `44004218604` (run 171), job `validate`: success. Se aprobaron sintaxis de especializaciones y la suite completa, incluidas las pruebas de recetas 7.41f, expansión recursiva, cantidades duplicadas y consumo de componentes.
- La suite confirmó además que, con Kaya ya poseída, el mercado solicita Sange como objeto completo; si hay piezas parciales de Yasha, Manta Style solo solicita las faltantes.
- Estado del PR #32: CI aprobado; revisión final e integración pendientes. No se declara despliegue público ni prueba Android de la candidata 3.41.


## 18. Resultado — PR #32 integrado: recetas recursivas y cantidades de componentes (16-11-2026)

- PR #32: https://github.com/JCheinz/dota2-build-assistant/pull/32, integrado por squash.
- Commit integrado: `d9ac5505c668687013e4c59be7974eb12fe72adf`.
- CI del PR #32, run `44004218604` (run 171), job `validate`: success. Sintaxis de especializaciones y suite completa aprobadas; el log confirma las regresiones de mercado universal y recetas 7.41f.
- Versión integrada: 3.41. Service Worker: `dota-build-v92`. Referencia de especializaciones: `?v=3279`.
- El mercado expande recetas anidadas solo cuando hay piezas parciales registradas; si no hay progreso de componentes, conserva como objetivo el subobjeto completo (por ejemplo, tras comprar Kaya solicita Sange; Manta Style puede solicitar Yasha).
- Si ya se registraron piezas de Yasha, Manta Style calcula solo las faltantes. Al completar un objeto, el inventario consume los componentes registrados a través de la receta anidada.
- Battle Fury registra dos Broadswords; una unidad ya poseída descuenta una y el mercado solicita la restante. El selector muestra la cantidad requerida.
- Se agregaron/actualizaron recetas y costes de referencia para Perseverance, Battle Fury, Yasha, Sange, Manta Style, Kaya and Sange, Yasha and Kaya, Sange and Yasha, Arcane Boots, Shiva’s Guard, Glimmer Cape, Force Staff, Black King Bar, Dragon Lance y Hurricane Pike, además de las recetas previas.
- Respaldo estable posterior a la integración:
  - Código: `backup/3.41-stable-2026-11-16`.
  - Estado: `backup/estado-3.41-stable-2026-11-16`.
- La versión visible y el Service Worker están confirmados en `main`. La URL de GitHub Pages no pudo verificarse con la herramienta de navegación; por tanto, el despliegue público de 3.41 queda pendiente de confirmación. Android y APK 3.41 también pendientes.
- APK 3.41: no generado ni archivado como binario. Se mantiene el registro en `backup/APK/README.md`; no se sustituye un APK por código fuente.
- Próxima etapa: auditoría del inventario de recetas y objetos restantes, control de cantidades, progreso del mercado en rutas situacionales y pruebas Android con compras parciales y mejoras.


## 19. Desarrollo — mercado inteligente por tempo y composición (candidata 3.42, 16-11-2026)

- Respaldos previos desde `main` commit `9db655e1666a95d9623686140278092f39ff7a8d`:
  - Código: `backup/3.41-before-intelligent-market-2026-11-16`.
  - Estado: `backup/estado-3.41-before-intelligent-market-2026-11-16`.
- Rama: `work/intelligent-market-tempo-synergy-v3-42`.
- Se detectó que la secuencia de sinergia de Pugna Mid se agregaba sin comprobar que Mars, Rubick, Oracle y Juggernaut estuvieran todos en el equipo aliado. Ahora la secuencia combinada exige los cuatro; las tarjetas individuales solo se muestran para aliados presentes.
- Se eliminaron los consejos de apoyo heredados que nombraban a Mars/Oracle fuera de la composición actual. El bloque genérico resume únicamente los aliados seleccionados.
- El mercado aplica umbrales de tempo a objetos de transición y avanzados (incluida BKB), y no permite que los objetos core de etapa media desplacen la compra inicial antes del minuto 12. Los situacionales avanzados no entran antes del minuto 20. Los umbrales son heurísticos y deberán calibrarse con pruebas por héroe/posición.
- Se actualizó el Service Worker a `dota-build-v93` y la referencia de especializaciones a `?v=3280`.
- Se agregaron regresiones para sinergias vacías/parciales/completas, filtros temporales y versión de caché.
- PR #33 integrado por squash en `main`: commit `3f0f481cc5018fef1c4e62478aad795e6f336886`. CI PR run `44006505822`, job `133783045022`: success. El despliegue Pages, la validación visual en Android y APK siguen pendientes; no se generó APK.
- Próxima ampliación: convertir la ruta de compra en fases específicas por héroe y posición, con consumibles de inicio, objetos de línea, transición, core y situacionales; comprobar que el oro y el inventario determinen el siguiente componente comprable sin saltar objetivos.


## 20. Resultado — versión 3.42 integrada: mercado por tempo y sinergias de composición (17-11-2026)

- PR #33: https://github.com/JCheinz/dota2-build-assistant/pull/33, integrado por squash.
- Commit: `3f0f481cc5018fef1c4e62478aad795e6f336886`.
- CI PR: run `44006505822`, job `133783045022`, success. La suite completa de matrices, mercado y recetas, junto con las nuevas regresiones de sinergia/tempo, terminó correctamente.
- La secuencia de equipo completo de Pugna Mid requiere Mars, Rubick, Oracle y Juggernaut presentes en los aliados. Las sinergias individuales se generan solo para los aliados elegidos.
- Se eliminaron menciones de apoyo genéricas heredadas de Mars/Oracle; el informe refleja la composición actual.
- Se incorporaron umbrales temporales: BKB desde minuto 12; objetos de transición/defensa desde umbrales de 12–16; objetos avanzados de 20–24. La ruta de héroes sin perfil específico conserva solo compras tempranas antes de minuto 12 y no muestra objetivos avanzados antes de minuto 20. Son reglas iniciales que requieren calibración con pruebas reales por héroe/posición.
- Service Worker: `dota-build-v93`; referencia `specializations.js?v=3280`.
- Respaldo previo inmutable: `backup/3.41-before-intelligent-market-2026-11-16`; estado previo: `backup/estado-3.41-before-intelligent-market-2026-11-16`.
- GitHub Pages no confirmado en este hito. Android no probado por el usuario. APK 3.42 no generado ni archivado.
- Próxima fase prioritaria: construir rutas temporales por héroe y posición (inicio, línea, transición, core y situacionales), y ordenar la próxima compra por fase, oro, inventario y amenaza activa.


## 20. Integración — versión 3.42: tempo y sinergias de composición (17-11-2026)

- PR #33 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/33.
- Commit: `3f0f481cc5018fef1c4e62478aad795e6f336886`.
- CI del PR #33: run `44006505822`, job `133783045022`, success.
- La secuencia de equipo completo de Pugna Mid requiere los cuatro aliados Mars, Rubick, Oracle y Juggernaut; las sinergias individuales dependen de los aliados realmente seleccionados.
- Se retiraron textos genéricos que conservaban referencias a Mars/Oracle de otra composición.
- Service Worker `dota-build-v93`; referencia `specializations.js?v=3280`.
- GitHub Pages 3.42, Android y APK no confirmados. No se generó APK.

## 21. Desarrollo — mercado inteligente por fases y posición (candidata 3.43, 17-11-2026)

### Respaldos y rama
- Commit base de `main`: `b7d1accafc51ba9dc0037eafa7e1cea0d8368577`.
- Código: `backup/3.42-before-market-phases-v3-43-2026-11-17`.
- Estado: `backup/estado-3.42-before-market-phases-v3-43-2026-11-17`.
- Rama: `work/market-phases-role-engine-v3-43`.

### Arquitectura implementada en la candidata
- Cinco fases globales: Inicio (0–4), Línea (5–11), Transición (12–19), Core (20–29) y Avanzada (30+).
- Catálogo de apertura y progreso por posición: Carry, Mid, Offlane, Support 4 y Support 5.
- Condiciones por alcance y datos del héroe; por ejemplo, Quelling Blade no se incluye como compra inicial de un Carry a distancia.
- Condiciones por draft: Magic Wand/Stick, Raindrops, BKB, Pipe y Crimson Guard aparecen según los roles/amenazas registrados o el problema activo.
- Perfiles que ya tienen ruta individual conservan prioridad: el catálogo de rol aporta el comienzo y la ruta específica gobierna línea, transición y core.
- La vista muestra solo los candidatos de la fase actual; el `marketPool` conserva los candidatos futuros para que no se pierdan al avanzar el reloj.
- El selector de inventario manual se amplía con los objetos de todas las fases de la posición seleccionada.
- La decisión de compra calcula componentes faltantes, compara oro disponible y distingue un objeto gratuito (Observer Ward) de un precio desconocido.
- Costes comunes de referencia 7.41f registrados en `MARKET_ITEM_COSTS`; Spirit Vessel ajustado a 2.725. Las recetas continúan siendo una cobertura parcial: cuando falta una receta el mercado presenta el objeto completo con precio conocido, no inventa piezas.
- Service Worker candidato `dota-build-v94`; interfaz e informe versión 3.43. No se modificaron datos de especializaciones.

### Fuentes de datos y límites
- Referencia oficial de versión: Dota 2, actualización 7.41f publicada el 15-09-2026: https://www.dota2.com/news/updates/16749.
- Referencia de costes de objetos 7.41f basada en el datafeed de objetos: https://senseos.gg/wiki/dota-2/items/.
- Los costes son una referencia del parche; los tiempos de compra son heurísticos iniciales, no timings garantizados. Los objetos situacionales no se convierten en obligatorios por el simple hecho de que el enemigo esté en el draft.
- La candidata no representa todavía builds individualizadas para los 126 héroes ni todas sus posiciones. Actualmente hay seis rutas de objetos individuales conocidas; el resto usa el catálogo de rol y arquetipo.
- Falta extender y verificar recetas de los objetos de inicio/transición que todavía no tienen `itemRecipes`, validar rutas por héroe/posición, y ampliar las reglas de situaciones activas.

### Criterios permanentes del mercado inteligente
1. Nunca recomendar objetos fuera de fase como próxima compra, salvo una respuesta urgente validada y compatible con el rol.
2. Respetar orden de ruta individual y perfil de posición; las builds de héroes distintos no deben contaminarse.
3. Distinguir enemigo presente, amenaza mecánica detectada y problema que el jugador confirma que está sufriendo.
4. Calcular componentes recursivamente, cantidades duplicadas, progreso parcial, oro faltante y evolución de objetos.
5. Separar inventario actual de historial de compras/consumibles para no confundir objetos consumidos con objetos que nunca se compraron.
6. Mantener motivos, condiciones, confianza y fuente/versionado de cada recomendación.
7. No presentar inferencias genéricas como builds individuales verificadas.

### Estado
- Implementado en la rama; CI, revisión de diff e integración pendientes.
- GitHub Pages, validación visual Android y APK 3.43 pendientes. No se ha generado APK.


## 22. Resultado — versión 3.43 integrada: mercado inteligente de cinco fases y cinco posiciones (17-11-2026)

- PR #34 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/34.
- Commit integrado: `de88494d287b208e1cb57e3a45d67ee6a6f540ca`.
- CI del PR #34: run `44008820828`, job `133790581725`, success. Se aprobaron sintaxis de especializaciones y toda la suite de regresiones.
- Fases: Inicio (0–4), Línea (5–11), Transición (12–19), Core (20–29) y Avanzada (30+).
- Catálogos por Carry, Mid, Offlane, Support 4 y Support 5; filtros por alcance, roles del héroe y amenazas del draft.
- La próxima compra respeta fase, posición, ruta individual cuando existe, oro e inventario; los perfiles individuales no ceden su progresión a la lista genérica de rol.
- UI limitada a candidatos de la fase actual, con mercado completo preservado para futuras fases; selector manual de inventario ampliado con objetos del rol.
- Se separa objeto gratuito (Observer Ward) de coste desconocido; costes comunes con referencia de datos 7.41f; no se inventan recetas ausentes.
- Service Worker `dota-build-v94`; interfaz/informe 3.43.
- Respaldos previos: `backup/3.42-before-market-phases-v3-43-2026-11-17` y `backup/estado-3.42-before-market-phases-v3-43-2026-11-17`.
- GitHub Pages no confirmado por separado. Android no probado por el usuario. APK 3.43 no generado ni archivado.
- Límites: seis rutas individuales de objetos conocidas; otras combinaciones todavía usan arquetipo/posición. Recetas parciales para objetos de inicio/transición. Próxima fase: reglas de amenaza activa (no solo draft), más rutas individuales verificadas, receta completa y separación inventario/historial de consumibles.


## 23. Desarrollo — respuesta a problemas activos (candidata 3.44, 17-11-2026)

- Rama: `work/active-problem-response-v3-44`.
- Base: versión 3.43 integrada en main, commit `de88494d287b208e1cb57e3a45d67ee6a6f540ca`.
- Respaldos previos: `backup/3.43-before-active-problem-v3-44-2026-11-17` y `backup/estado-3.43-before-active-problem-v3-44-2026-11-17`.
- Nuevo motor común `getActiveProblemResponses`: respuestas seleccionadas para iniciación, daño mágico, control, ilusiones, invisibilidad, movilidad, hostigamiento en línea, peleas grupales y sustain.
- Reglas explícitas por posición y alcance; filtros de minuto mínimo; razones de compra; objetos ya poseídos excluidos en el selector de próxima compra.
- Seleccionar un problema activo puede adelantar una respuesta; la mera presencia de un héroe en el draft no lo hace. Una vez cubierta la respuesta, el motor continúa la ruta principal.
- Amenazas por enemigo seleccionado utilizan la tabla de matchup y contadores existentes. El selector suma `issue:sustain` cuando el draft incluye héroes con curación/regeneración relevante.
- Precios añadidos con referencia 7.41f: Dust of Appearance 80, Gem of True Sight 900, Linken’s Sphere 4.800, Spirit Vessel 2.725 y Monkey King Bar 5.000. Fuentes: https://www.dota2.com/newsentry/677383425371407609, https://sarjanaherald.com/item/, https://sinceilastplayed.com/dota2/items/linkens-sphere y https://sinceilastplayed.com/dota2/items/monkey-king-bar.
- Interfaz/informe 3.44; Service Worker `dota-build-v95`.
- Se agregaron regresiones para problema no seleccionado, respuestas por rol/alcance, invisibilidad, ilusiones, magia, sustain, enemigo concreto, oro, item comprado y anulación temporal de ruta.
- PR #35 integrado por squash en `main`: https://github.com/JCheinz/dota2-build-assistant/pull/35.
- Commit integrado: `7ceafca97d48b8d100bcc3e2923221fa7ae68b4c`.
- CI PR #35 run `44015327497`, job `133811748997`: success. Pasaron todas las regresiones incluidas.
- GitHub Pages, validación visual Android y APK 3.44 pendientes de confirmación. No se generó APK.


## 24. Integración — versión 3.44: respuestas a problemas activos (17-11-2026)

- PR #35 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/35.
- Commit de integración en `main`: `7ceafca97d48b8d100bcc3e2923221fa7ae68b4c`.
- CI run `44015327497`, job `133811748997`: success.
- Motor `getActiveProblemResponses` para iniciación, magia, control, ilusiones, invisibilidad, movilidad, línea, teamfight y sustain.
- Respuestas seleccionadas por el usuario pueden adelantar una compra compatible con la posición y el minuto. La sola presencia del enemigo en el draft no anula el core.
- La compra vuelve a la ruta principal al registrar la respuesta activa en el inventario.
- Precio de referencia 7.41f en el catálogo común: Dust 80, Gem 900, Linken’s Sphere 4.800, Spirit Vessel 2.725, Monkey King Bar 5.000.
- Service Worker `dota-build-v95`; etiqueta de interfaz e informe 3.44.
- Pages no verificado todavía por separado. Android no probado por el usuario. APK 3.44 no generado ni archivado.
- Próximos hitos: ampliar recetas con precios/ingredientes verificados, construir más rutas específicas por héroe/posición y añadir pruebas de inventario/historial de consumibles.


## 25. Desarrollo — ampliación de recetas de mercado (candidata 3.45, 17-11-2026)

- Base integrada: 3.44, commit `7ceafca97d48b8d100bcc3e2923221fa7ae68b4c`.
- Rama: `work/recipes-and-hero-routes-v3-45`.
- Respaldos previos: `backup/3.44-before-recipes-and-hero-routes-v3-45-2026-11-17` y `backup/estado-3.44-before-recipes-and-hero-routes-v3-45-2026-11-17`.
- Recetas nuevas para Magic Wand, Bracer, Maelstrom, Mjollnir, Vanguard, Crimson Guard, Pipe of Insight, Headdress, Mekansm, Lotus Orb, Scythe of Vyse, Monkey King Bar, Urn of Shadows y Spirit Vessel.
- Se incorporan iconos para las piezas y nombres de recetas nuevas.
- Regresiones: suma de coste total, expansión de recetas anidadas, descuento de componente ya poseído, consumo del objeto base al completar la mejora.
- No se inventan recetas para Dust of Appearance, Infused Raindrops ni Gem of True Sight: son compras directas/consumibles o sin receta en esta versión del catálogo.
- Referencias de coste/receta 7.41f (fuente de datos con historial de cambios y muestra de compras recientes en parche 7.41f):
  - Magic Wand, Bracer, Maelstrom, Mjollnir, Vanguard, Crimson Guard, Pipe, Headdress, Mekansm, Lotus Orb, Scythe, MKB, Urn y Spirit Vessel: https://sinceilastplayed.com/dota2/items/magic-wand ; https://sinceilastplayed.com/dota2/items/bracer ; https://sinceilastplayed.com/dota2/items/maelstrom ; https://sinceilastplayed.com/dota2/items/mjollnir ; https://sinceilastplayed.com/dota2/items/vanguard ; https://sinceilastplayed.com/dota2/items/crimson-guard ; https://sinceilastplayed.com/dota2/items/pipe-of-insight ; https://sinceilastplayed.com/dota2/items/headdress ; https://sinceilastplayed.com/dota2/items/mekansm ; https://sinceilastplayed.com/dota2/items/lotus-orb ; https://sinceilastplayed.com/dota2/items/scythe-of-vyse ; https://sinceilastplayed.com/dota2/items/monkey-king-bar ; https://sinceilastplayed.com/dota2/items/urn-of-shadows ; https://sinceilastplayed.com/dota2/items/spirit-vessel .
  - Patch notes de 7.41: https://liquipedia.net/dota2/7.41. La página de seguimiento muestra compras recientes del 7 de noviembre de 2026 dentro de 7.41f; los costes se fijan al desglose vigente, no a precios antiguos.
- PR #36 integrado por squash en `main`: https://github.com/JCheinz/dota2-build-assistant/pull/36.
- Commit integrado: `d067de617e3639b8e709f5848ee1aadcd0e1ff5f`.
- CI PR #36: run `44015909133`, job `133813663764`, success.
- GitHub Pages, Android y APK 3.45 no probados/generados.


## 26. Integración — versión 3.45: cobertura ampliada de recetas (17-11-2026)

- PR #36 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/36.
- Commit integrado: `d067de617e3639b8e709f5848ee1aadcd0e1ff5f`.
- CI run `44015909133`, job `133813663764`: success; sintaxis y suite completa aprobadas.
- Añadidas 14 recetas de objetos usados en respuestas activas y catálogos de rol: Magic Wand, Bracer, Maelstrom, Mjollnir, Vanguard, Crimson Guard, Pipe of Insight, Headdress, Mekansm, Lotus Orb, Scythe of Vyse, Monkey King Bar, Urn of Shadows y Spirit Vessel.
- Recetas anidadas verificadas: Mjollnir → Maelstrom; Crimson Guard → Vanguard; Mekansm → Headdress; Spirit Vessel → Urn of Shadows.
- Se sumaron iconos de componentes/recetas y pruebas para suma de coste, progreso parcial y consumo del objeto previo.
- Dust of Appearance, Infused Raindrops y Gem of True Sight siguen sin receta fabricada.
- Costes/ingredientes contrastados contra fichas con historial de cambios y compras recientes de 7.41f, más registro de cambios 7.41: https://sinceilastplayed.com/dota2/items/magic-wand ; https://sinceilastplayed.com/dota2/items/bracer ; https://sinceilastplayed.com/dota2/items/maelstrom ; https://sinceilastplayed.com/dota2/items/mjollnir ; https://sinceilastplayed.com/dota2/items/vanguard ; https://sinceilastplayed.com/dota2/items/crimson-guard ; https://sinceilastplayed.com/dota2/items/pipe-of-insight ; https://sinceilastplayed.com/dota2/items/headdress ; https://sinceilastplayed.com/dota2/items/mekansm ; https://sinceilastplayed.com/dota2/items/lotus-orb ; https://sinceilastplayed.com/dota2/items/scythe-of-vyse ; https://sinceilastplayed.com/dota2/items/monkey-king-bar ; https://sinceilastplayed.com/dota2/items/urn-of-shadows ; https://sinceilastplayed.com/dota2/items/spirit-vessel ; https://liquipedia.net/dota2/7.41.
- UI 3.45; Service Worker `dota-build-v96`.
- GitHub Pages no confirmado de forma independiente; Android no probado por el usuario; APK 3.45 no generado ni archivado.
- Siguiente prioridad: ampliar rutas individuales verificadas. En la rama actual solo existen seis combinaciones de compra específicas: Pugna Mid, Drow Carry, Luna Carry, Anti-Mage Carry/Mid y Bristleback Offlane. El resto utiliza catálogo de rol/arquetipo, no build individual validada.


## 27. Desarrollo — rutas individuales y cantidades de componentes (candidata 3.46, 17-11-2026)

- Base estable: 3.45, commit `d067de617e3639b8e709f5848ee1aadcd0e1ff5f`.
- Rama: `work/hero-routes-by-position-v3-46`.
- Backups previos: `backup/3.45-before-hero-routes-v3-46-2026-11-17` y `backup/estado-3.45-before-hero-routes-v3-46-2026-11-17`.
- Se añaden siete rutas individuales: Juggernaut Carry, Phantom Assassin Carry, Axe Offlane, Mars Offlane, Lion Support 4, Lion Support 5 y Zeus Mid. El catálogo pasa de seis a trece combinaciones específicas de objetos.
- Cada ruta incluye apertura/línea, core y situacionales, con nota de fuente y snapshot. No se presentan timings agregados como horarios obligatorios.
- Datos de builds y compras recientes StatsDota 7.41f (snapshots 16–17-11-2026): https://statsdota.com/en/heroes/juggernaut/carry ; https://statsdota.com/en/heroes/phantom-assassin/carry ; https://statsdota.com/en/heroes/axe/offlane ; https://statsdota.com/en/heroes/mars/offlane ; https://statsdota.com/en/heroes/lion/soft-support ; https://statsdota.com/en/heroes/lion/hard-support ; https://statsdota.com/en/heroes/zeus/mid .
- Se incorporan recetas de Soul Ring (2 Gauntlets), Phase Boots, Blade Mail, Tranquil Boots, Ring of Basilius y Desolator según fichas de objetos 7.41f: https://sinceilastplayed.com/dota2/items/soul-ring ; https://sinceilastplayed.com/dota2/items/phase-boots ; https://sinceilastplayed.com/dota2/items/blade-mail ; https://sinceilastplayed.com/dota2/items/tranquil-boots ; https://sinceilastplayed.com/dota2/items/ring-of-basilius ; https://sinceilastplayed.com/dota2/items/desolator .
- Seguimiento cuantitativo: el inventario de componentes admite varias unidades de una misma pieza; el motor descuenta cantidades exactas y consume solo las unidades marcadas al completar una receta.
- Regresiones añadidas para trece perfiles, costes de nuevas recetas y Soul Ring con cero, una o dos Gauntlets registradas.
- PR #37 integrado por squash en `main`: https://github.com/JCheinz/dota2-build-assistant/pull/37.
- Commit integrado: `030be1a9415127bc05852a4c21edbe3bfd410525`.
- CI PR #37 run `44017041005`, job `133817339994`: success. Pasaron todas las regresiones de matrices, recetas, cantidades, rutas y motor de compra.
- UI/informe 3.46; Service Worker `dota-build-v97`. Pages, Android y APK no probados/generados.


## 28. Integración — versión 3.46: rutas por héroe/posición y componentes cuantitativos (17-11-2026)

- PR #37 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/37.
- Commit de integración `main`: `030be1a9415127bc05852a4c21edbe3bfd410525`.
- CI run `44017041005`, job `133817339994`: success; sintaxis y suite completa de regresiones aprobadas.
- El catálogo de rutas de objetos individuales pasó de seis a trece combinaciones: Juggernaut Carry, Phantom Assassin Carry, Axe Offlane, Mars Offlane, Lion Support 4, Lion Support 5 y Zeus Mid, además de los seis perfiles preexistentes.
- Las rutas separan línea, core y situacionales y citan StatsDota 7.41f con snapshots de 16–17 noviembre de 2026. Los tiempos son datos agregados, no plazos obligatorios. No son trece guías completas de habilidades/talentos.
- Recetas nuevas: Soul Ring, Phase Boots, Blade Mail, Tranquil Boots, Ring of Basilius y Desolator.
- Cantidades duplicadas reales: múltiples casillas de la misma pieza, descuento exacto en recetas recursivas y consumo únicamente de unidades realmente marcadas.
- Prueba específica: Soul Ring exige dos Gauntlets of Strength; con una registrada, el mercado solicita una más; con dos, considera cubierto el requisito.
- Service Worker `dota-build-v97`; interfaz e informe 3.46.
- Backups previos de base 3.45: `backup/3.45-before-hero-routes-v3-46-2026-11-17` y `backup/estado-3.45-before-hero-routes-v3-46-2026-11-17`.
- GitHub Pages no confirmado independientemente; Android no probado por el usuario; APK 3.46 no generado ni archivado.
- Próxima prioridad: continuar ampliación gradual de rutas de objetos por héroe/posición a partir de datos 7.41f, y luego cubrir builds/habilidades/talentos separados donde falten.


## 29. Desarrollo — cuarta tanda de rutas individuales (candidata 3.47, 17-11-2026)

- Base estable: 3.46, commit `030be1a9415127bc05852a4c21edbe3bfd410525`.
- Rama: `work/next-hero-routes-v3-47`.
- Respaldos previos: `backup/3.46-before-next-routes-v3-47-2026-11-17` y `backup/estado-3.46-before-next-routes-v3-47-2026-11-17`.
- Se agregan cuatro rutas individuales: Wraith King Carry, Shadow Fiend Mid, Tidehunter Offlane y Pudge Support 4. El catálogo pasa de 13 a 17 combinaciones héroe/posición con ruta de objetos específica.
- Cada ruta separa early/línea, core y situacionales; las notas señalan muestra y snapshot. Los timings son tendencias agregadas, no metas obligatorias.
- Fuentes de builds 7.41f:
  - Wraith King Carry (223.582 partidas; snapshot 17-11-2026): https://statsdota.com/en/heroes/wraith-king/carry
  - Shadow Fiend Mid (snapshot 16-11-2026; data StatsDota 7.41f): https://statsdota.com/en/heroes/shadow-fiend/mid y guía de 100 partidas ganadoras/pro: https://statsdota.com/en/guides/shadow-fiend
  - Tidehunter Offlane (468.256 partidas; actualización 14-11-2026): https://statsdota.com/en/heroes/tidehunter/offlane
  - Pudge Support / Soft Support (512.148 partidas; actualizado 16-11-2026): https://statsdota.com/en/heroes/pudge/soft-support
- Recetas añadidas para sostener esas rutas: Eul’s Scepter of Divinity (2.600), Buckler (425), Vladmir’s Offering (2.200) con subreceta Buckler, y Radiance (4.700).
- Detalles de receta/precio contrastados en 7.41f: Eul’s Scepter https://sinceilastplayed.com/dota2/items/euls-scepter-of-divinity ; Vladmir’s Offering https://sinceilastplayed.com/dota2/items/vladmirs-offering ; Radiance https://sinceilastplayed.com/dota2/items/radiance .
- No se activa Consecrated Wraps como compra porque su receta todavía no está verificada en este proyecto; queda como siguiente investigación, no como pieza inventada.
- Se añadieron pruebas para cuatro perfiles, suma de costes, progresión de Vladmir’s con Ring of Protection ya poseído e iconos nuevos.
- PR #38 integrado por squash en `main`: https://github.com/JCheinz/dota2-build-assistant/pull/38.
- Commit integrado: `985f13d940f97f809c82480511abc7ace8f47dc7`.
- CI PR #38 run `44017750310`, job `133819650588`: success. Pasaron sintaxis y la suite completa.
- Interfaz/informe 3.47; Service Worker `dota-build-v98`. Pages/Android/APK no probados/generados.


## 30. Integración — versión 3.47: cuatro rutas adicionales por héroe/posición (17-11-2026)

- PR #38 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/38.
- Commit integrado en `main`: `985f13d940f97f809c82480511abc7ace8f47dc7`.
- CI run `44017750310`, job `133819650588`: success.
- El catálogo crece de 13 a 17 rutas de objetos individuales con cuatro combinaciones: Wraith King Carry, Shadow Fiend Mid, Tidehunter Offlane y Pudge Support 4.
- Recetas añadidas: Eul’s Scepter of Divinity (2.600), Buckler (425), Vladmir’s Offering (2.200) con subreceta Buckler, Radiance (4.700).
- Se prueban la expansión de Buckler cuando Ring of Protection ya está en el inventario y el cálculo de siguiente compra (solo receta de Buckler pendiente).
- Consecrated Wraps queda excluido del mercado automático hasta confirmar su receta y sus ingredientes.
- Fuentes de ruta StatsDota 7.41f y fichas de componentes sinceilastplayed documentadas en la sección 29.
- Service Worker `dota-build-v98`, UI e informe 3.47.
- GitHub Pages no verificado independientemente; Android no probado por el usuario; APK 3.47 no generado ni archivado.
- Próxima prioridad: ampliar más rutas individuales solo cuando exista muestra suficiente por posición, y avanzar luego a guías de habilidades/talentos individuales donde todavía falten.


## 31. Ajuste 3.48 — prioridad de respuestas activas (17-11-2026)

- Se corrigió el umbral de anulación de ruta: respuestas activas con prioridad >= 8.0 ahora pueden adelantar el core. El umbral previo 8.5 descartaba respuestas válidas como Mekansm (8.4) para Support 5 cuando el problema confirmado era perder peleas grupales.
- Se agregó una regresión que verifica prioridad, coste de 1.775, adelanto del core y no repetición tras marcar el objeto comprado.
- Se conserva el criterio: solo adelanta una respuesta cuando el jugador selecciona explícitamente el problema; el draft por sí solo no fuerza la compra.
- UI 3.48; Service Worker dota-build-v99.
- PR #40 integrado por squash en main: commit 3ca2b2938ec4f38462ca0d5c7319a2415bb858e1. CI run 44021015074, job 133830255635: success.
- Pages no verificado independientemente; Android no probado; APK 3.48 no generado.


## 32. Integración — versión 3.48: prioridad de respuestas activas (17-11-2026)

- PR #40 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/40.
- Commit de main: 3ca2b2938ec4f38462ca0d5c7319a2415bb858e1.
- CI run 44021015074, job 133830255635: success; sintaxis y suite completa aprobadas.
- Se corrigió el umbral de respuesta activa de 8.5 a 8.0. Mekansm (8.4) puede adelantar la ruta de Support 5 cuando se selecciona perder teamfights; el motor recomienda su primer componente real (Headdress) y continúa cuando se registra el objeto terminado.
- La presencia de enemigos sin problema seleccionado sigue sin forzar compras situacionales.
- UI 3.48; Service Worker v99.
- Pages no verificado independientemente; Android no probado; APK 3.48 no generado ni archivado.


## 33. Desarrollo 3.49 — tres nuevas rutas individuales y receta Drum (17-11-2026)

- Se amplía el catálogo de 17 a 20 rutas por héroe/posición: Phantom Lancer Carry, Enigma Offlane y Winter Wyvern Support 5.
- Fuentes StatsDota 7.41f: Phantom Lancer Carry, corte 16-11-2026 (494.036 partidas de parche; 108.209 en la muestra de posición): https://statsdota.com/en/heroes/phantom-lancer/carry . Enigma Offlane, actualizado 17-11-2026 (112.256 partidas en la muestra del parche; corte de posición 19.368): https://statsdota.com/en/heroes/enigma/offlane . Winter Wyvern Hard Support, snapshot 16-11-2026 (161.848 partidas de parche; corte de posición 28.841): https://statsdota.com/en/heroes/winter-wyvern/hard-support .
- Las rutas reflejan compras frecuentes y separan core/situacionales; no convierten timings medios en metas rígidas ni objetos de baja frecuencia en obligatorios.
- Se agrega Drum of Endurance: Headdress (425) + Belt of Strength (450) + Wind Lace (225) + receta (525) = 1.625. La receta de Headdress queda anidada para descontar Ring of Regen si ya está poseído. Referencia de receta 7.41f: https://highgroundcoach.app/dota-2-items/ancient-janggo y cambios de parche: https://dotaideas.com/wiki/patches/7.41 .
- Service Worker candidato v100; UI candidata 3.49.
- Respaldos pre-etapa: backup/3.48-before-next-market-stage-v3-49-2026-11-17 y backup/estado-3.48-before-next-market-stage-v3-49-2026-11-17.
- PR #41 integrado por squash en main: commit 76cb74173d64100e950cdbad4b0edf924286f811. CI run 44021398285, job 133831472898: success.
- Pages no verificado independientemente; Android no probado; APK 3.49 no generado.


## 34. Integración — versión 3.49: veinte rutas individuales por héroe/posición (17-11-2026)

- PR #41 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/41.
- Commit de main: 76cb74173d64100e950cdbad4b0edf924286f811.
- CI run 44021398285, job 133831472898: success.
- El catálogo pasa de 17 a 20 rutas con Phantom Lancer Carry, Enigma Offlane y Winter Wyvern Support 5.
- Drum of Endurance añadido con receta recursiva: Headdress 425 + Belt of Strength 450 + Wind Lace 225 + receta 525 = 1.625. Si Ring of Regen ya está poseído, la expansión de Headdress solicita solo la receta y no vuelve a pedir el anillo.
- Fuentes StatsDota 7.41f y muestras/snapshots 16–17-11-2026 documentadas en la sección 33.
- UI 3.49; Service Worker v100.
- Pages no verificado independientemente; Android no probado; APK 3.49 no generado ni archivado.


## 35. Desarrollo 3.50 — tres rutas Mid y cinco recetas de objetos (17-11-2026)

- Rutas nuevas: Puck Mid, Outworld Destroyer Mid e Invoker Mid. El catálogo pasa de 20 a 23 combinaciones héroe/posición.
- StatsDota 7.41f: Puck Mid, snapshot 16-11-2026, 25.434 partidas con objetos conocidos: https://statsdota.com/en/heroes/puck/mid . Outworld Destroyer Mid, snapshot 16-11-2026, 507.229 partidas de parche y 113.830 en corte por posición: https://statsdota.com/en/heroes/outworld-devourer/mid . Invoker Mid, snapshot 16-11-2026, 99.019 partidas: https://statsdota.com/en/heroes/invoker/mid .
- Recetas añadidas: Oblivion Staff 1.625 (Blitz Knuckles 1.000 + Sage’s Mask 175 + Robe of the Magi 450); Witch Blade 2.775 (Oblivion Staff 1.625 + Chainmail 500 + Orb of Venom 350 + receta 300); Meteor Hammer 2.850 (Kaya 2.100 + Crown 450 + receta 300); Null Talisman 505 (Circlet 155 + Mantle of Intelligence 140 + receta 210); Boots of Travel 2.500 (Boots of Speed 500 + receta 2.000).
- Se prueban sumas, progresión recursiva de Witch Blade desde Oblivion Staff y descuento de Kaya ya poseída para Meteor Hammer.
- Fuentes de recetas: https://sinceilastplayed.com/dota2/items/oblivion-staff ; https://sinceilastplayed.com/dota2/items/witch-blade ; https://sinceilastplayed.com/dota2/items/null-talisman ; https://highgroundcoach.app/dota-2-items/meteor-hammer .
- UI candidata 3.50; Service Worker v101. Pendiente CI/revisión/integración.


## 36. Integración — versión 3.50: veintitrés rutas y cinco recetas nuevas (17-11-2026)

- PR #42 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/42.
- Commit de main: e40105c06d2e0d8bc0d22a7fb5ce0a2927c9ee1f.
- CI run 44021670287, job 133832342460: success.
- Rutas añadidas: Puck Mid, Outworld Destroyer Mid e Invoker Mid. Total 23 rutas héroe/posición.
- Recetas 7.41f añadidas: Oblivion Staff (1.625), Witch Blade (2.775), Meteor Hammer (2.850), Null Talisman (505) y Boots of Travel (2.500). Witch Blade expande Oblivion Staff; Meteor Hammer reconoce Kaya ya poseída.
- UI 3.50; Service Worker v101.
- Pages no verificado independientemente; Android no probado; APK 3.50 no generado ni archivado.


## 37. Auditoría 3.51 — prioridad de rutas individuales (17-11-2026)

- Se corrigió el orden de decisión temprana: el catálogo genérico de rol ya no devuelve la compra antes de revisar una ruta individual de héroe/posición.
- Si existe una ruta individual, se conserva su secuencia; si no existe, el mercado recurre al catálogo genérico de la posición.
- Las respuestas urgentes explícitamente seleccionadas mantienen la capacidad de interrumpir la ruta cuando cumplen prioridad y minuto mínimo.
- Pruebas nuevas: ruta individual vs plantilla de rol, anulación urgente y fallback genérico.
- PR #43 integrado por squash en main: commit ca9a50d541a018e33f72fd573b7dcf38b000924a. CI run 44021956634, job 133833269323: success.
- UI 3.51; Service Worker v102. Pages no verificado; Android pendiente; APK no generado.


## 38. Integración — versión 3.51: prioridad correcta de rutas individuales (17-11-2026)

- PR #43 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/43.
- Commit de main: ca9a50d541a018e33f72fd573b7dcf38b000924a.
- CI run 44021956634, job 133833269323: success.
- En Inicio/Línea, si el mercado contiene una ruta heroSpecific, el catálogo genérico ya no se adelanta a su orden de compra individual.
- Se mantiene la respuesta urgente explícita y el fallback de rol cuando no existe ruta individual.
- Regresiones verifican Puck Mid: Magic Wand como objetivo de ruta (la compra siguiente puede ser un componente), respuesta Dust of Appearance urgente y fallback Power Treads.
- UI 3.51; SW v102. Pages no verificado, Android pendiente, APK no generado.


## Desarrollo 3.52 — inventario actual e historial de compras (17-11-2026)

- Base estable: versión 3.51, rama `main`, commit base `6740c91f733ed0ad9d7199272d41a99409cc9ff7`.
- Respaldos previos creados desde la base: `backup/3.51-before-inventory-ledger-v3-52-2026-11-17` (código) y `backup/estado-3.51-before-inventory-ledger-v3-52-2026-11-17` (estado/documentación). No sobrescribir.
- Rama de trabajo solicitada: `work/inventory-ledger-v3-52-refresh`.
- Nuevo módulo `inventory-ledger.js`: inventario activo separado del historial; eventos de compra, venta, retiro, mejora, consumo de componentes y uso de consumibles; persistencia local versionada.
- La interfaz distingue «Inventario actual» e «Historial de compras y consumibles». Los consumibles identificados pueden marcarse como usados y pasan al historial, no permanecen como objetos activos.
- Las evoluciones registran el objeto final y consumen las piezas cuantitativas disponibles; los componentes duplicados se registran como unidades independientes.
- Las recomendaciones visuales filtran objetos ya poseídos y duplicados del mismo bloque; el motor de próxima compra conserva su filtro de inventario y recetas.
- Pruebas nuevas: `tests/inventory-ledger.test.js`, con compra repetida, consumible usado, evolución Kaya → Kaya and Sange, componentes repetidos para Battle Fury, venta, persistencia, limpieza independiente del historial y deduplicación de recomendaciones.
- CI ampliado para ejecutar la prueba nueva junto con `tests/skill-matrix.test.js`.
- Service Worker candidato: `dota-build-v103`; versión de interfaz candidata: 3.52.
- Estado: implementación en rama de trabajo. CI completo y regresiones aún deben ejecutarse; PR e integración pendientes. Pages/Android no verificados; APK no generado.
- Criterio de integración: no fusionar hasta que ambos comandos de prueba, sintaxis, regresiones y CI de GitHub Actions terminen correctamente. Revisar además que los controles de borrar inventario e historial sigan siendo independientes.
