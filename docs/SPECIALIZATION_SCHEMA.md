# Contrato de datos para especializaciones

**Estado:** propuesta de esquema para Etapa 3. No implica que el renderizador ya soporte todos los campos descritos ni que existan perfiles poblados para otros héroes.

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
3. Cada entrada `talentChoices.level` debe coincidir con un evento `T` en `skillBuild`; cada evento `T` debe tener su elección de talento.
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
- `innateAbilities` y el bloque `metadata` son parte del contrato propuesto; aún requieren implementación y pruebas en el renderizador.
- No se incorpora aquí un héroe ficticio ni una progresión de ejemplo como si fuera real. El bloque anterior es únicamente una especificación de formato.
