# ESTADO DEL TRABAJO — Dota 2 Build Assistant

Actualizado: 16-11-2026
Repositorio: https://github.com/JCheinz/dota2-build-assistant
Aplicación: https://jcheinz.github.io/dota2-build-assistant/

## Estado actual

- Último PR integrado: #12 — Fix Crystal Maiden Support 5 item route and icons.
- Commit integrado: `af5dbca8e8d3d79348aa5632f839dd177106c975`.
- Rama principal: `main`.
- La integración por squash fue confirmada por GitHub.
- CI del PR antes del merge: aprobado (run `43928051614`, job `133512701083`).
- Validación post-merge: run `43929105992`, pendiente al momento de esta actualización.
- GitHub Pages build/deploy: run `43929102880`, pendiente al momento de esta actualización.
- Service Worker de la versión integrada: `dota-build-v76`.

## Último trabajo: Crystal Maiden Support 5

Se corrigió el problema observado en las capturas Android: el límite de siete objetos podía ocultar parte del núcleo y las alternativas situacionales.

Cambios integrados:
- Bloque separado para el núcleo orientativo: Blink Dagger → Glimmer Cape → Aghanim’s Shard.
- Alternativas situacionales visibles aunque no entren en las primeras siete recomendaciones.
- Próxima compra condicionada por oro, fase de partida e inventario.
- No recomendar Tango automáticamente cuando el oro registrado es cero.
- Iconos añadidos para Tango, Iron Branch, Blood Grenade, Enchanted Mango, Sentry Ward, Magic Stick, Wind Lace, Tranquil Boots e Infused Raindrops.
- Regresiones para iconos, visibilidad de rutas y avance de compra.

PR: https://github.com/JCheinz/dota2-build-assistant/pull/12

## Especializaciones que deben preservarse

- Techies Support 4 y Support 5: ya validadas por el usuario; no modificar sin necesidad y pruebas específicas.
- Pugna Mid y otros perfiles Pugna: preservar su lógica y regresiones.
- Crystal Maiden Support 5: integrada; pendiente de prueba práctica del usuario tras confirmar el despliegue.

## Protocolo de trabajo permanente

El usuario autorizó el 16-11-2026 realizar merges sin pedir autorización individual, siempre que:
1. El CI del PR esté aprobado.
2. El diff se haya revisado y no introduzca regresiones evidentes.
3. No existan conflictos.
4. Este archivo `ESTADO_DEL_TRABAJO.md` se mantenga actualizado.

Procedimiento:
- Revisar este archivo y `ESTADO_DEL_PROYECTO.md` antes de cada etapa.
- Crear respaldo y rama de trabajo antes de cambios.
- Añadir pruebas específicas y de regresión.
- No integrar con CI fallido, pendiente o con conflictos.
- Cuando se cumplan las condiciones, hacer merge automáticamente.
- Tras el merge, verificar CI post-merge y despliegue de GitHub Pages.
- Actualizar este archivo y el historial de proyecto en cada avance relevante.
- Informar con precisión qué está integrado, qué está desplegado y qué queda pendiente.

## Próximo paso

Esperar el resultado de los workflows post-merge del commit `af5dbca8e8d3d79348aa5632f839dd177106c975`. Si build/deploy finaliza correctamente, pedir al usuario probar Crystal Maiden Support 5 en Android y reportar cualquier diferencia visual o de compra.


## Nueva etapa — Columna fija en matrices de habilidades para todos los héroes (16-11-2026)

- Rama: `work/universal-sticky-skill-labels`, creada desde main commit `546cd175f1b6c0dcce6e86cbf6e2638792d46996`.
- Respaldos previos: `backup/3.27-before-universal-sticky-skill-labels` y `backup/estado-3.27-before-universal-sticky-skill-labels`.
- Cambio transversal en el renderizador común `renderSpecializationGuide(g)`: la primera columna de etiquetas queda fija al desplazar horizontalmente la matriz; la cabecera «HABILIDAD» usa una capa superior para no quedar tapada.
- Se quitó el recorte `overflow:hidden` del contenedor interno que podía impedir el comportamiento sticky.
- La modificación es común al renderizador, no específica de Crystal Maiden ni de un héroe concreto.
- Pruebas agregadas: inspeccionan el contrato CSS sticky y recorren todas las especializaciones con matriz definida para comprobar que usan la misma estructura.
- Cache actualizado a `dota-build-v77`; referencia de especializaciones a `?v=3277`.
- Estado: implementado en rama; pendiente ejecutar CI, revisar diff/compatibilidad, integrar por PR y verificar deploy.
- Preservación: no se modificaron los datos de perfiles Pugna, Techies ni Crystal Maiden; se probará su renderizado con la nueva columna común.


## Integración — columna fija universal de matrices (16-11-2026)

- PR #13: https://github.com/JCheinz/dota2-build-assistant/pull/13
- Integrado por squash en `main`; commit: `aa746438c3d799e63f6eba4fe9a240986cdd6030`.
- CI del PR #13: run `43933110575`, success (sintaxis y regresiones).
- El diff modifica el renderizador común, CSS, pruebas, Service Worker y documentación; no cambia datos de especializaciones.
- La prueba nueva recorre todos los perfiles que tienen matriz y valida que usan la estructura con columna fija.
- GitHub Pages y validación post-merge del commit integrado iniciados; pendientes de confirmar.
- Versiones: `dota-build-v77` y `specializations.js?v=3277`.
- Respaldos previos: `backup/3.27-before-universal-sticky-skill-labels`, `backup/estado-3.27-before-universal-sticky-skill-labels`.
- Pendiente de esta etapa: verificar CI y deploy post-merge; luego prueba visual en Android del desplazamiento horizontal con distintos héroes.


## Nueva corrección — Crystal Maiden Support 4 (16-11-2026)

- Se detectó que no existía el perfil `crystal_maiden|Support 4`; por eso el informe no podía mostrar la matriz de habilidades ni el árbol de talentos.
- Se creó el perfil Support 4 de forma independiente, sin modificar `crystal_maiden|Support 5`.
- Orden contrastado para soft support 7.41f: Frostbite 1/3/5/7; Arcane Aura 2/9/10/12; Crystal Nova 4/8/14/15; Freezing Field 6/13/17.
- Árbol de talentos agregado en niveles 10/15/20/25, con las opciones y razones en español.
- Fuentes de Support 4: StatsDota soft support y DotaTrack soft sup build; no se reutiliza una URL de datos de hard support.
- Prueba nueva: comprueba la presencia del perfil, rol/parche, fuentes soft support, progresión exacta, render de matriz y cuatro tiers de talentos; comprueba independencia respecto de Support 5.
- Referencias actualizadas: `specializations.js?v=3278`; Service Worker `dota-build-v78`.
- Rama: `work/crystal-maiden-support4-guide`. Respaldos: `backup/3.27-before-crystal-maiden-support4` y `backup/estado-3.27-before-crystal-maiden-support4`.
- PR #14 integrado por squash en `main` el 16-11-2026; commit `29d7a769ebeb2cbd364fcc83d0b861a488b55e34`.
- CI del último commit de la rama antes del merge: run `43935068064`, success. CI post-merge de `main`: run `43935772107`, success.
- GitHub Pages para el commit integrado: run `43935771590`, en ejecución al actualizar este registro.

## Auditoría de especializaciones — 16-11-2026

- Rama de trabajo: `work/audit-specialization-quality`.
- Respaldos previos desde main `2c82a1b28fd07a836a19f48f4673e50ca6bbb108`: `backup/3.27-before-specialization-audit` y `backup/estado-3.27-before-specialization-audit`.
- Alcance: siete perfiles (Pugna x3, Techies x2, Crystal Maiden x2).
- Revisión inicial: los siete perfiles tienen `talentChoices` con niveles 10/15/20/25 y dos alternativas con explicación. El renderizador usa `talentChoices` como árbol principal; el campo auxiliar `talents` solo actúa como fallback, por lo que sus ausencias/parcialidades no rompen el árbol mostrado.
- Se detectó cobertura de pruebas desigual: faltaba una comprobación común de progresión, iconos, tiers y render de ambas opciones para todos los perfiles.
- Se añadió esa regresión transversal. No se modificaron las builds ni las especializaciones.
- Pendiente: CI, revisión final y PR.

## Resultado de auditoría — PR #15 integrado (16-11-2026)

- PR #15: https://github.com/JCheinz/dota2-build-assistant/pull/15 — integrado por squash.
- Commit: `c8abc5f9aefe09a9e25d94b8e49885a700d0d8c9`.
- CI PR run `43942313191`: success.
- CI post-merge run `43942370008`: success.
- GitHub Pages run `43942368681`: build y deploy success.
- Las pruebas ahora auditan en conjunto los siete perfiles integrados: progresión, iconos, cuatro tiers de talentos, dos alternativas con explicación y renderizado.
- No se modificaron builds ni rutas de objetos; Pugna, Techies y Crystal Maiden permanecen sin cambios de contenido.
- Próximo paso: revisión factual de fuentes/parche y consistencia de órdenes de habilidades para cada rol, antes de incorporar nuevos héroes.


## Mejora de flujo de compras — PR #16 (16-11-2026)

- Objetivo: acercar el seguimiento de compras a las recomendaciones y evitar cargar manualmente cada objeto comprado.
- Rama: `work/purchase-workspace-click-to-buy`, creada desde main `435348f0af9abaffef66d98b231c7b833cf9455c`.
- Respaldos previos conservados: `backup/3.28-before-performance-optimization` y `backup/estado-3.28-before-performance-optimization`.
- La sección «Compras y seguimiento» aparece al comienzo del informe, antes del análisis extenso, con la próxima compra y el inventario ya marcado.
- Las tarjetas de objetos recomendados ahora son tocables: un toque registra el objeto como comprado y recalcula el informe; otro toque deshace la marca. Los componentes de una ruta se registran en «Componentes que ya tenés», sin confundirlos con el objeto completo.
- La carga manual de objetos comprados queda disponible como alternativa desplegable, ya no como paso obligatorio.
- El estado comprado queda visible y tachado; el motor excluye esos objetos de las siguientes recomendaciones según su lógica existente.
- Se agregaron pruebas estáticas de regresión para el contrato de interacción y estado visual. CI del PR: run `43947885373`, success. Los dos primeros intentos detectaron selectores de prueba demasiado estrictos, corregidos antes de aprobar.
- PR #16 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/16. Commit: `cc5e0941b70ea0b506bfced24bc7ef832a187e9c`.
- CI post-merge `43947959482` y GitHub Pages `43947959522`: en ejecución al momento de esta actualización.
- Service Worker: `dota-build-v79`. No se modificaron perfiles, builds, órdenes de habilidades ni árboles de talentos.
- Próxima validación: prueba práctica en Android de marcar/desmarcar un objeto, confirmar que la próxima compra cambia y que los componentes siguen su ruta correctamente.


## Inventario visual del héroe — PR #17 (16-11-2026)

- Se añadió una interfaz inspirada en el inventario de Dota 2, con seis espacios principales para objetos completos, iconos y nombres.
- Si hay más de seis objetos completos registrados, se muestran en una sección adicional para no perderlos del seguimiento.
- Los componentes de recetas se muestran separados de los objetos completos.
- Tocar un objeto del inventario lo quita del estado de compras; tocar un componente lo quita de la lista de componentes. En ambos casos se recalcula el informe y las recomendaciones.
- Las tarjetas de recomendaciones mantienen la acción de marcar como comprado y ahora alimentan el inventario visual.
- Se agregaron pruebas de regresión para los seis espacios, objetos adicionales y eliminación de objetos/componentes.
- PR #17 integrado por squash: https://github.com/JCheinz/dota2-build-assistant/pull/17. Commit: `d86f9f451f4d40fc6e55ea3ec739ff7834e6b3d0`.
- CI del PR run `43950311869`: success. CI post-merge y Pages: verificar.
- Service Worker actualizado a `dota-build-v80`.
- Próxima validación Android: comprar un objeto desde una recomendación, confirmar que aparece en el inventario, probar más de seis objetos y quitar uno desde el inventario para confirmar que vuelve a estar disponible en las recomendaciones.


## Auditoría universal del inventario y compras — PR #18 (16-11-2026)

- Objetivo: comprobar que el registro por toque y el inventario visual funcionan con las recomendaciones de cualquier héroe/posición, no solo con Crystal Maiden.
- Respaldos desde main `506bb61fc4749aca0d413fb48ecf52faaced54fd`: `backup/3.30-before-universal-purchase-audit` y `backup/estado-3.30-before-universal-purchase-audit`.
- Rama: `work/universal-purchase-audit`.
- Auditoría del código: las tarjetas de ruta, situacionales y las recomendaciones dinámicas usan el renderizador común `renderItemCards`; el controlador delegado del informe permite marcar un objeto aunque no estuviera en la lista manual, creando su checkbox de estado y recalculando sin scroll. El inventario muestra los objetos registrados y permite retirarlos; los componentes tienen un flujo separado.
- La cobertura automática ahora recorre todas las rutas individuales declaradas en `heroPlans` (inicio, núcleo y situacionales), prueba objetos genéricos no precargados, verifica render y retirada de objetos/componentes y confirma cobertura del catálogo universal para Carry, Mid, Offlane, Support 4 y Support 5.
- No se modificó lógica de recomendaciones, builds, talentos ni especializaciones; se amplió la suite de regresión.
- PR #18: https://github.com/JCheinz/dota2-build-assistant/pull/18. Primeros intentos de CI detectaron colisiones de nombres de variables y dependencias de fixtures en el harness; corregidos. CI del commit `20913dbfaa796e6ea3e12c921f34b255fb792139`, run `43969922879`: success.
- Pendiente integrar tras actualizar ambos archivos de estado y confirmar CI final.

- Resultado final: PR #18 integrado en main por squash, commit `ae787e7bc51e128db5e5a3e3cea6827baac7f3f7`. CI de la rama con estado y pruebas finales run `43969996986`, success; Pages build y deploy post-merge run `43970058451`, success. Publicación confirmada.


## Consumo de componentes al completar objetos — PR #19 (16-11-2026)

- Respaldos desde main `b06b21e41c194a95fc0d321e4d4ed2b7864f19f4`: `backup/3.31-before-recipe-consumption` y `backup/estado-3.31-before-recipe-consumption`.
- Se corrigió el inventario de recetas: al marcar como comprado un objeto completo, el motor desmarca/consume las piezas exactas de su receta. Ejemplo Pugna Mid: al completar Arcane Boots se consumen Boots of Speed, Ring of Basilius, Wizard Hat y Receta de Arcane Boots.
- Solo se consumen los componentes de esa receta; las piezas no relacionadas quedan registradas.
- Al cambiar el héroe o la posición elegida, se limpia el inventario de la configuración anterior para evitar que objetos de Axe Carry aparezcan como si fueran de Pugna Mid.
- Se agregaron pruebas automatizadas para el consumo exacto de receta y el reinicio del inventario por héroe/posición.
- PR #19: https://github.com/JCheinz/dota2-build-assistant/pull/19. CI inicial run `43976306859`: success.
- Service Worker actualizado a `dota-build-v81`. Sin cambios en perfiles, builds o criterios de recomendación.

- Integrado por squash en main: commit `4a821e26311295be500993bcc36cc6f719a4eb49`. CI final de PR tras actualizar estados run `43976374141`, success. Pendiente confirmar CI y Pages post-merge.


## Inventario con mochila y reserva vendible — PR #20 (16-11-2026)

- Respaldos desde main `48aa1ee85f00cac61912793c9adb2198395113ce`: `backup/3.32-before-inventory-backpack-reserve` y `backup/estado-3.32-before-inventory-backpack-reserve`.
- Inventario visual reorganizado en seis espacios principales, tres espacios de mochila y una reserva de capacidad no limitada.
- Tocar un objeto de inventario/mochila lo mueve al otro sector si hay espacio; el control × lo quita/vende. Tocar un objeto en reserva lo vende/retira directamente, deja de contar como comprado y puede volver a aparecer como recomendación.
- La ubicación se preserva al recalcular el análisis y reconstruir los controles. Componentes y consumo de recetas siguen funcionando aparte.
- Se agregaron regresiones para seis slots, tres de mochila, reserva, movimiento, venta y persistencia de zona. CI run `43979583575`, success.
- PR #20: https://github.com/JCheinz/dota2-build-assistant/pull/20. Service Worker `dota-build-v82`.
- No se modificaron builds ni lógica de recomendaciones. Pendiente merge y Pages.

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


## Nueva etapa — progresión de núcleo y evolución automática de objetos (17-11-2026)

- Base verificada: main `bb2a867eeba004b830144f149fc557f83a5e6007` (integración PR #24).
- Respaldos: `backup/3.34-before-core-progression-and-upgrades` y `backup/estado-3.34-before-core-progression-and-upgrades`.
- Rama: `work/core-progression-and-item-upgrades`.
- El motor de Pugna Mid ahora conserva el orden Arcane Boots → Aether Lens, pero permite que una respuesta situacional explícita y de alta prioridad interrumpa esa secuencia.
- La mera presencia de Alchemist/Huskar en el draft ya no impone Spirit Vessel como compra inmediata; la selección explícita del problema de sustain sí lo eleva a prioridad.
- La selección de próxima compra reconoce `pugnaScore` de las respuestas específicas, pondera la etapa y evita terminar silenciosamente cuando no hay compra pendiente.
- Flujo de evolución: con Kaya registrada y minuto 32+, Kaya and Sange se convierte en objetivo elegible; como Kaya ya cuenta como componente poseído, el motor solicita Sange y al marcar el objeto mejorado la receta consume Kaya del inventario.
- Service Worker actualizado a `dota-build-v87`.
- Pruebas funcionales nuevas: avance de núcleo, interrupción situacional por sustain, mejora Kaya → Kaya and Sange, y no repetir la mejora ya completada.
- Pendiente: CI, revisión de diff, integración y deploy. La lógica de perfiles Support, Techies y Crystal Maiden no se altera.
