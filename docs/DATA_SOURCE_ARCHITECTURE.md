# Arquitectura de fuentes de datos — Mercado Inteligente

Actualizado: 23 de noviembre de 2026 · parche de referencia de la aplicación: 7.42.

## Principio

No existe una sola fuente que entregue con la misma calidad el catálogo del juego, la secuencia de habilidades, los talentos elegidos y las compras por posición. La aplicación separa los datos canónicos del juego de las recomendaciones estadísticas.

## Fuentes y responsabilidad

| Fuente | Uso permitido en el motor | Lo que no debe inferirse |
|---|---|---|
| Valve Dota 2 Datafeed | Identidad de héroes, datos del héroe, habilidades, talentos, objetos y datos actuales del juego | No entrega por sí sola builds estadísticas por rol ni orden recomendado de habilidades por nivel |
| STRATZ GraphQL oficial | Estadísticas de partidas y compras/habilidades/talentos por posición cuando la consulta autenticada y el esquema lo confirman | No inventar registros ausentes; no extrapolar una posición a otra |
| OpenDota / dotaconstants | Mapeo de héroes, slots de habilidades, innatas, talentos y metadatos normalizados; API y archivos públicos | No tratar el mapeo de habilidades como una build recomendada |
| StatsDota | Guías públicas del rol principal cuando la página es accesible, interpretable y su rol/parche/muestra se pueden verificar | No convertir una guía del rol principal en cinco builds; no completar campos no publicados |
| Dota2ProTracker | Solo datos obtenidos con autorización expresa del titular | No scraping automatizado, proxy, Jina Reader ni evasión de HTTP 403/429 mientras no exista autorización |
| Especializaciones locales | Consejos editoriales/manuales con etiqueta de fuente, parche y revisión | No presentarlos como estadística ni como guía actual si pertenecen a otro parche |

## Separación de capas

1. **Catálogo canónico:** héroes, habilidades, slots, innatas, talentos, objetos y parche.
2. **Observaciones estadísticas:** registros crudos de STRATZ/StatsDota con posición, muestra, tasa, fecha y fuente.
3. **Normalización:** convertir observaciones verificadas al contrato de `hero-library-engine.js`.
4. **Recomendación:** solo usar una posición coincidente y un parche/muestra aceptados. Mantener separadas las recomendaciones estadísticas y las reglas tácticas manuales.
5. **Presentación:** indicar fuente, parche, muestra y cobertura; mostrar “sin datos suficientes” cuando corresponda.

## Reglas de calidad

- Claves de posición canónicas: `POSITION_1` Carry, `POSITION_2` Mid, `POSITION_3` Offlane, `POSITION_4` Support 4, `POSITION_5` Support 5.
- Nunca heredar Carry a Mid/Offlane/Supports ni Support 5 a Support 4.
- Una secuencia de habilidades debe mapear IDs reales a las habilidades del héroe y respetar niveles legales. Los datos min/max de nivel de STRATZ se conservan como observaciones hasta validar su semántica con una respuesta real.
- Los talentos necesitan emparejarse con los cuatro tiers oficiales del héroe. Si la estadística solo devuelve una opción o no puede mapearse al tier correcto, no se marca el conjunto como completo.
- Items se normalizan por ID canónico y se conservan recuento, minuto y posición; no se deducen componentes ni orden de compra que la fuente no entregue.
- No publicar un snapshot nuevo si falla la consulta, el esquema cambia o la validación de calidad no pasa.
- No confundir cobertura de catálogo 127/127 con cobertura estadística de builds.

## Estado de acceso al 23-11-2026

- La credencial STRATZ autenticó correctamente y la introspección confirmó los campos de estadísticas usados por el probe Pugna. Una ejecución anterior terminó bien al inspeccionar esquema, pero no validó todavía un conjunto completo de builds normalizadas.
- La validación de Pugna en cinco posiciones se bloqueó por una restricción de STRATZ relativa a direcciones IP. El token no debe volver a compartirse ni imprimirse.
- StatsDota respondió HTTP 429 en la sincronización más reciente; el circuito de protección ya aborta sin reintentos ante 429/403 y conserva el snapshot anterior.
- D2PT permanece deshabilitado hasta autorización expresa.
- La fuente canónica de habilidades/talentos puede migrar gradualmente al Datafeed oficial de Valve; OpenDota/dotaconstants queda como respaldo/mapeo hasta completar pruebas comparativas de esquema.

## Normalizador inicial implementado

- `scripts/stratz-normalize.js` convierte compras e ítems neutrales a las etapas locales cuando el ID existe en el catálogo.
- Conserva `abilityMinLevel`, `abilityMaxLevel` y `talent` como observaciones agregadas, sin transformarlas en orden de habilidades ni selección de talentos.
- Verifica que la posición de cada fila coincida con la solicitada y exige que el parche se indique explícitamente.
- Los IDs de objetos desconocidos quedan en `unmappedItems`; no se inventan nombres.
- `hero-library-engine.js` conserva las observaciones en cada rol sin marcar cobertura de habilidades/talentos como completa.
- El probe de Pugna guarda primero la respuesta cruda y después el JSON normalizado, ambos como artefactos.
- El parche por defecto se etiqueta `unverified`; solo se puede cambiar con `--patch=` cuando una consulta/criterio externo demuestre ese alcance.
- Tests usan fixtures sintéticos; no equivalen a una validación con datos reales de STRATZ.

## Próximas validaciones antes de sincronizar 127 héroes

1. Registrar un runner self-hosted de GitHub Actions con salida de red estable y restringido a este repositorio.
2. Ejecutar `.github/workflows/stratz-pugna-self-hosted.yml` para una sola posición de Pugna y guardar respuesta cruda/normalizada.
3. Documentar con ejemplos reales el significado de `abilityMinLevel`, `abilityMaxLevel`, `talent` y los campos de compras.
4. Validar las cinco posiciones de Pugna por separado.
5. Solo entonces ampliar a los 127 héroes, con concurrencia 1, caché, snapshots atómicos y corte por errores/rate limit.


## Referencias técnicas

- Valve Datafeed: `https://www.dota2.com/datafeed/herolist?language=english`, `https://www.dota2.com/datafeed/herodata?language=english&hero_id={id}`, `https://www.dota2.com/datafeed/itemlist?language=english`.
- STRATZ API oficial: `https://stratz.com/api`.
- OpenDota API: `https://opendota.apidocumentation.com/`.
- OpenDota constants: `https://github.com/odota/dotaconstants`.
