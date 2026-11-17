# Estado del proyecto — Dota 2 Build Assistant

**Última actualización:** 16 de noviembre de 2026  
**Repositorio:** https://github.com/JCheinz/dota2-build-assistant  
**Aplicación:** https://jcheinz.github.io/dota2-build-assistant/  
**Rama principal:** `main`  
**Versión integrada:** 3.27 + Service Worker v73  
**Etapa activa:** Etapa 3 — Techies Support 5 validado por el usuario en Android; corrección de sinergia genérica de PR #10 integrada, CI y GitHub Pages aprobados. Pendiente validación visual Android de la corrección.

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
