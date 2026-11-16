# Estado del proyecto — Dota 2 Build Assistant

**Última actualización:** 16 de noviembre de 2026  
**Repositorio:** [JCheinz/dota2-build-assistant](https://github.com/JCheinz/dota2-build-assistant)  
**Aplicación:** https://jcheinz.github.io/dota2-build-assistant/  
**Rama principal:** `main`  
**Versión integrada de referencia:** 3.27 + Service Worker v70  
**Etapa activa:** Etapa 2 — matriz universal dinámica de habilidades.

Este archivo es el registro de continuidad del proyecto. Actualizarlo al cerrar cada etapa importante. No declarar pruebas o despliegues que no se hayan verificado.

## 1. Objetivo

Construir un asistente contextual de Dota 2, no un catálogo de builds estáticas. Debe combinar:
1. Motor común: draft, amenazas individuales y combinadas, sinergias, fase/minuto, oro, inventario, componentes y problema actual.
2. Especializaciones por héroe y posición: habilidades, talentos, mecánicas, combos, posicionamiento y objetos.
3. Decisión adaptativa: identidad del héroe + posición + contexto real de partida, con explicaciones.
4. Cobertura progresiva de los 126 héroes en las posiciones que realmente desempeñan, sin inventar datos.

## 2. Estado de versiones y respaldos

- La versión 3.27 está integrada en `main`.
- PR #2 integró Pugna Support 4 y Support 5. Merge: `bf381b7466d2036339668e958c57b89055ef5917`.
- PR #3 integró la corrección de carga de especializaciones. Merge: `f71d2c8243946493c98f0ee9b37feb55252dbe0c`.
- Service Worker actual: `dota-build-v70`; JavaScript usa estrategia network-first con fallback offline.
- Respaldo anterior: `backup/3.26-before-pugna-support`.
- Respaldo 3.27 anterior a la matriz universal: `backup/3.27-stable-before-universal-matrix`.
- Respaldo independiente del estado del proyecto: `backup/estado-3.27-before-universal-matrix`.
- Ambos respaldos nuevos apuntan al commit `02da391c48f9e37931a1a554248c108a1f8d80cb`, antes de iniciar la Etapa 2. No sobrescribirlos.

## 3. Etapa 1 — Pugna (funcionalmente completada)

### Pugna Mid
Primer perfil especializado desarrollado en etapas anteriores. Incluye progresión de habilidades, talentos, combos, posicionamiento, mecánicas y compras adaptativas. Se conserva como referencia histórica y funcional; no pedir repetir pruebas ya realizadas salvo que un cambio posterior pueda afectarlo.

### Pugna Support 4
Especialización individual incorporada en 3.27: progresión de habilidades, talentos, combos, posicionamiento, mecánicas y ruta de compras propia. El usuario confirmó en Android que aparece GUÍA INDIVIDUAL COMPLETA y la matriz.

### Pugna Support 5
Especialización individual incorporada en 3.27: guía, matriz, talentos, combos y ruta de compras diferenciada. El usuario confirmó en Android que aparece GUÍA INDIVIDUAL COMPLETA y su ruta propia.

### Pendientes de calidad conocidos
- Mejorar el texto de compatibilidad para que distinga la posición seleccionada de los roles generales del catálogo. Actualmente puede mostrar Carry/Mid/Offlane como compatibilidades estimadas aunque la guía seleccionada sea Support.
- Auditar explicaciones de objetos situacionales y su relación con amenazas concretas; no confundir nombres de enemigos con errores de perfil.
- No reabrir la etapa Pugna sin una regresión que lo justifique.

## 4. Etapa 2 — Matriz universal dinámica (en curso)

### Situación actual del código
- La matriz visual está dentro de `renderSpecializationGuide(g)` en `index.html`.
- Se inició la generalización: las filas ahora se derivan de las claves de `g.skillIcons` y de los códigos presentes en `g.skillBuild`, en lugar de fijarse a `Q/W/E/R`.
- Los niveles se calculan a partir de 25, `g.maxLevel` y los niveles definidos en la progresión/talentos.
- Las columnas y el ancho de la matriz se generan según la cantidad de niveles.
- Las filas de talentos y atributos solo aparecen cuando existen datos para ellas.
- Se eliminó el fallback visual que inventaba habilidades de Pugna cuando faltan metadatos; si no hay habilidades definidas, se muestra una explicación de matriz no disponible.
- Los metadatos siguen usando `g.skillIcons`; la progresión `g.skillBuild`; y los talentos `g.talentChoices`.
- `specializations.js` contiene guías individuales verificadas solo para Pugna Mid, Support 4 y Support 5; esta generalización del renderizador no crea automáticamente guías ni datos de otros héroes.

### Objetivo de la matriz universal
1. Renderizar las filas a partir de los metadatos de cada guía, no de Q/W/E/R codificados.
2. Admitir códigos de habilidad variables y filas especiales (innata/puntos de atributo/talentos) solo cuando los datos las definan.
3. Mantener iconos, nombres, tooltip y fallback visual sin inventar habilidades.
4. Mantener niveles, orden de aprendizaje y puntos especiales derivados de los datos explícitos.
5. Conservar el diseño móvil con desplazamiento horizontal y encabezados legibles.
6. Si faltan datos, mostrar claramente “matriz no disponible” en lugar de fabricar una progresión.
7. Mantener compatibilidad hacia atrás con los tres perfiles de Pugna existentes.

### Criterios de aceptación
- Pugna Mid, Support 4 y Support 5 mantienen exactamente su progresión, iconos, talentos y contenido.
- El renderizador no presupone que todos los héroes tienen las mismas claves de habilidad.
- Una guía de prueba con claves de habilidad distintas de Q/W/E/R puede producir matriz correcta.
- No se agregan perfiles ni progresiones de héroes sin datos verificados.
- Se valida sintaxis JS y se revisa el diff antes de integrar.
- Prueba Android posterior a la integración antes de cerrar la etapa.

## 5. Flujo de trabajo obligatorio

1. Crear respaldo de versión y estado antes de cambios estructurales importantes.
2. Crear rama de trabajo desde el `main` vigente.
3. Trabajar en etapas pequeñas; no sobrescribir respaldos.
4. Revisar código existente y compatibilidad antes de cambiar.
5. Actualizar Service Worker cuando cambien recursos cacheados.
6. Validar sintaxis, revisar diff y registrar limitaciones.
7. Integrar mediante PR solo cuando el diff esté revisado y mergeable.
8. Confirmar publicación y pedir al usuario únicamente las pruebas reales que falten.
9. Actualizar este documento al cerrar cada etapa.

## 6. Próximo paso inmediato

Completar revisión del diff y validación de sintaxis JavaScript de `index.html`. Añadir una fixture de prueba sintética con claves diferentes de Q/W/E/R para validar el comportamiento, sin incorporarla como héroe real ni presentarla como dato de juego. Luego abrir PR, revisar que sea mergeable e integrar solo después de validar la regresión de Pugna.
