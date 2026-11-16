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
