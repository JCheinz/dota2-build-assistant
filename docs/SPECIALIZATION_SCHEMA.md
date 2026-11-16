# Contrato de datos para especializaciones

**Estado:** contrato en implementación incremental. La matriz universal ya está integrada; metadatos e innatas cuentan ahora con renderizado y pruebas, pendientes de integrar en la rama principal.

## Principios

- Una especialización se identifica por `heroKey|role`, por ejemplo `pugna|Support 5`.
- Los datos de una guía deben corresponder a un héroe, posición y versión/parche identificables.
- No asumir que todos los héroes tienen cuatro habilidades entrenables, las mismas teclas, una habilidad innata o la misma progresión.
- La matriz solo representa eventos explícitos. No inferir puntos de habilidad por huecos.
- Los datos agregados de un héroe no demuestran por sí solos una build específica de una posición.
- Si un campo no está verificado, se omite o se marca como pendiente; nunca se completa con valores inventados.

## Contrato propuesto

```js
{
  metadata: {
    heroKey: "npc_dota_hero_example",
    role: "Support 4",
    patch: "versión verificada",
    source: ["URL o referencia de datos consultada"],
    confidence: "verified | mixed | provisional"
  },

  guide: {
    title: "Nombre de la guía",

    // Habilidades que se pueden aprender; las claves son identificadores
    // internos arbitrarios, no se presupone Q/W/E/R.
    skillIcons: {
      ABILITY_KEY: {
        name: "Nombre localizado",
        slug: "nombre_interno_del_icono"
      }
    },

    // Solo eventos de aprendizaje comprobados.
    // T = talento y A = punto de atributo, si corresponde al parche.
    skillBuild: [
      { level: 1, code: "ABILITY_KEY" },
      { level: 10, code: "T" }
    ],

    // Habilidades innatas o efectos pasivos que deben explicarse aparte
    // de la progresión de puntos, si el héroe los tiene.
    innateAbilities: [
      { name: "Nombre", slug: "icono", description: "Efecto verificado" }
    ],

    talentChoices: [
      {
        level: 10,
        left: { name: "Talento izquierdo", reason: "Criterio contextual" },
        right: { name: "Talento derecho", reason: "Criterio contextual" }
      }
    ],

    // Opcionales: solo incluir si el sistema del parche realmente los usa.
    maxLevel: 30,
    skillOrder: [],
    skillPriority: "",
    talents: [],
    combos: [],
    positioning: "",
    mechanics: "",
    caveats: ""
  }
}
```

## Reglas de validación

1. Cada código de habilidad usado en `skillBuild` debe existir en `skillIcons`, salvo códigos especiales reservados documentados.
2. Los niveles deben ser enteros positivos, únicos y no superar `maxLevel` cuando se define.
3. Cada evento `T` explícito en `skillBuild` debe tener metadatos de talento correspondientes. `talentChoices` también puede declarar los niveles de talento posteriores sin duplicarlos como eventos de habilidad en `skillBuild`; el renderizador debe mostrarlos a partir de `talentChoices`.
4. Los eventos `A` solo se permiten cuando el sistema de progresión del parche y el héroe los contempla.
5. `innateAbilities` no consume un punto de habilidad ni se debe presentar como una mejora elegible por nivel.
6. Los nombres e iconos deben corresponder a la habilidad real del héroe; los slugs se verifican contra los recursos del juego.
7. El orden recomendado, la prioridad situacional y la progresión observada son conceptos distintos y no deben mezclarse.
8. La guía debe identificar el parche y la fuente usada. Si la fuente no separa posiciones, se declara esa limitación.
9. El renderizador debe seguir funcionando con los perfiles actuales de Pugna, aunque no declaren los campos nuevos.
10. No añadir una guía a la aplicación hasta que los datos mínimos y las pruebas de regresión estén completos.

## Estado de implementación

- La matriz dinámica actual ya admite claves de habilidad arbitrarias mediante `skillIcons` y `skillBuild`.
- Las filas de talentos y atributos se generan desde los eventos `T` y `A`.
- `metadata` se muestra como parche, posición, nivel de confianza y fuentes declaradas.
- `innateAbilities` se muestra en un bloque separado de la matriz y no consume puntos de habilidad.
- Las pruebas cubren metadatos, innatas y compatibilidad con perfiles antiguos de Pugna.
- Los campos opcionales ausentes se omiten; no se fabrican habilidades innatas para perfiles que no las declaran.
- No se incorpora aquí un héroe ficticio ni una progresión de ejemplo como si fuera real. El bloque anterior es únicamente una especificación de formato.
