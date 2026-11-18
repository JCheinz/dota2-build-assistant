# Motor de extracción de datos de habilidades — etapa 3.53

## Objetivo
Crear una capa común que obtenga y normalice los datos estructurados de habilidades y su asignación por héroe, evitando pruebas manuales repetitivas cuando los datos de la fuente ya están disponibles.

## Fuente inicial
OpenDota Constants API:
- `/constants/abilities`: metadatos de habilidades.
- `/constants/hero_abilities`: asignación de habilidades y talentos por héroe.
- `/constants/heroes`: catálogo de héroes.

La capa conserva el objeto original (`raw`) además de normalizar campos conocidos. Esto evita perder propiedades que la fuente incorpore y permite ampliar el esquema sin romper compatibilidad.

## Campos normalizados
Nombre visible, descripción, lore, notas, coste de maná, enfriamiento, daño, tipo de daño, alcance de lanzamiento, radio/área, comportamiento, equipo/tipo/banderas objetivo y atributos.

Los valores por nivel se conservan como arreglos; no se convierten a un único número. Campos ausentes quedan como `null`, nunca se inventan.

## Uso
```js
const data = await window.DotaSkillDataEngine.load();
const charge = window.DotaSkillDataEngine.findAbility(data, "spirit_breaker_charge_of_darkness");
const spiritBreaker = window.DotaSkillDataEngine.getHeroSkills(data, "npc_dota_hero_spirit_breaker");
const coverage = window.DotaSkillDataEngine.getCoverage(data);
```

El adaptador necesita conexión de red. Mantiene caché en memoria durante la sesión y permite `load({ force: true })` para refrescar. No persiste datos offline todavía.

## Límites y calidad de evidencia
- La descripción textual no equivale por sí sola a una simulación completa de la mecánica.
- Los campos de radio, daño, comportamiento y objetivos pueden variar de forma y disponibilidad según la habilidad.
- Los nombres de habilidad y las claves de héroe se conservan como los entrega la fuente.
- Una habilidad sin metadatos se marca explícitamente; no se elimina silenciosamente.
- La cobertura informa cuántas ranuras de habilidades de héroe no encontraron metadatos.
- La fuente debe contrastarse con los archivos del parche del juego cuando falten campos o haya discrepancias. Los resultados de las pruebas Echo Slam y Charge of Darkness quedan como observaciones experimentales separadas, no se sobrescriben con texto genérico.

## Próxima integración
Conectar el dataset al motor B (Threat Counter) mediante un índice de efectos y relaciones, manteniendo separado:
1. dato estructurado de fuente;
2. interpretación táctica inferida;
3. observación reproducida en juego.
