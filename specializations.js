/* Registro de especializaciones individuales. Cada perfil se identifica por héroe|posición. */
window.DOTA_HERO_SPECIALIZATIONS = {
  "pugna|Mid": {
    guide: {
      title:"Pugna Mid · guía individual 7.41f",
      skillIcons:{Q:{name:"Nether Blast",slug:"pugna_nether_blast"},W:{name:"Decrepify",slug:"pugna_decrepify"},E:{name:"Nether Ward",slug:"pugna_nether_ward"},R:{name:"Life Drain",slug:"pugna_life_drain"}},
      skillBuild:[{"level":1,"code":"Q"},{"level":2,"code":"W"},{"level":3,"code":"Q"},{"level":4,"code":"E"},{"level":5,"code":"Q"},{"level":6,"code":"R"},{"level":7,"code":"Q"},{"level":8,"code":"W"},{"level":9,"code":"W"},{"level":10,"code":"T"},{"level":11,"code":"E"},{"level":12,"code":"R"},{"level":13,"code":"E"},{"level":14,"code":"E"},{"level":15,"code":"E"},{"level":16,"code":"A"},{"level":17,"code":"A"},{"level":18,"code":"R"}],
      talentChoices:[{"level":10,"left":{"name":"−1 s recarga Nether Blast","reason":"Más limpieza de oleadas y presión frecuente."},"right":{"name":"+2 vida Nether Ward","reason":"Si los rivales destruyen la Ward demasiado rápido."}},{"level":15,"left":{"name":"+250 salud","reason":"Opción estable para sobrevivir a iniciaciones."},"right":{"name":"+30% velocidad Decrepify","reason":"Si tu equipo aprovecha persecuciones o reposicionamiento."}},{"level":20,"left":{"name":"+1,5 s Decrepify","reason":"Amplía la ventana de daño mágico o protección."},"right":{"name":"+15% curación Life Drain","reason":"Si necesitás sostenerte o salvar aliados."}},{"level":25,"left":{"name":"+200 daño Nether Blast","reason":"Daño directo y presión de estructuras."},"right":{"name":"+1,9 daño Nether Ward/maná","reason":"Contra equipos que lanzan muchos hechizos en su radio."}}],
      skillOrder:[
        "1: Nether Blast","2: Decrepify","3: Nether Blast","4: Nether Ward",
        "5: Nether Blast","6: Life Drain","7: Nether Blast",
        "8–9: Decrepify","10: talento","11: Nether Ward",
        "12: Life Drain","13–15: Nether Ward","16–17: atributo","18: Life Drain"
      ],
      skillPriority:"Maximizá Nether Blast primero (nivel 7), Decrepify después (nivel 9) y Nether Ward a continuación (nivel 15). Life Drain en 6/12/18. La secuencia es la tendencia observada para Pugna Mid en 7.41f; adelantá Nether Ward si la línea o el draft exigen castigar mucho lanzamiento de hechizos, o Decrepify si necesitás defensa/daño mágico temprano.",
      talents:[
        ["Nivel 10","-1 s de recarga de Nether Blast para limpiar oleadas y presionar más seguido; +2 de vida de Nether Ward si el rival la destruye rápido. La elección depende de cuánto valor real obtiene la Ward en esa partida."],
        ["Nivel 15","+250 de salud como opción estable para sobrevivir a iniciaciones; +30% de velocidad de movimiento de Decrepify a aliados si tu equipo aprovecha persecuciones o reposicionamiento."],
        ["Nivel 20","+1,5 s de duración de Decrepify para ampliar la ventana de daño mágico o protección; +15% de curación de Life Drain si necesitás sostenerte o salvar aliados."],
        ["Nivel 25","+200 de daño de Nether Blast para daño directo y presión de estructuras; +1,9 de daño de Nether Ward por maná si el equipo rival lanza muchos hechizos dentro de su radio."]
      ],
      combos:[
        ["Línea y control de oleada","Usá Nether Blast para asegurar creeps y hostigar cuando el rival esté dentro del radio. No gastes maná en oleadas que no necesitás empujar: Pugna puede quedar expuesto si avanza sin visión."],
        ["Decrepify + Nether Blast","Aplicá Decrepify al enemigo cuando tus aliados puedan seguir con daño mágico y rematá con Nether Blast. No lo uses sobre el objetivo que tus carries necesitan golpear físicamente: el destierro impide los ataques."],
        ["Nether Ward antes del intercambio","Colocá Nether Ward donde cubra el espacio de pelea y no quede expuesta a destrucción inmediata. Su valor aumenta contra rivales que gastan mucho maná; no la coloques automáticamente en el centro del equipo enemigo."],
        ["Life Drain y Oblivion Savant","Durante Life Drain podés lanzar habilidades y usar objetos sin interrumpir la canalización, respetando alcance y condiciones del objeto. Aprovechá para colocar Nether Ward o usar Decrepify; no intentes canalizar una segunda habilidad."],
        ["Life Drain ofensivo o de rescate","Canalizá sobre un enemigo aislado cuando no tenga interrupciones disponibles, o sobre un aliado que necesite curación urgente. Cortá la canalización si el rival puede interrumpirte o si quedás fuera de posición."],
        ["Decrepify defensivo","Sobre un aliado puede impedir que reciba ataques físicos y aumentar la curación recibida. Usalo para negar burst físico o facilitar una salvación, no sobre un aliado que necesita seguir pegando."]
      ],
      positioning:"En línea, mantené distancia y una salida clara después de usar Nether Blast. En peleas, jugá detrás del iniciador y dentro de un rango desde el que puedas lanzar Nether Blast y Decrepify sin ser el primer objetivo. Colocá Nether Ward en un ángulo protegido que cubra el área de hechizos. No te quedes canalizando Life Drain si ya gastaron tu cobertura o si una interrupción sigue disponible.",
      mechanics:"Oblivion Savant permite lanzar habilidades y usar objetos durante Life Drain; también otorga 1,5% de amplificación de hechizos por cada torre destruida. Nether Ward ahora causa daño atribuido a Pugna, por lo que aprovecha su amplificación de hechizos. Nether Blast inflige el 65% de su daño a estructuras.",
      caveats:"La prioridad de habilidades y las compras reflejan datos de Pugna Mid en 7.41f, no una secuencia obligatoria ni una garantía de victoria. Las elecciones de talentos tienen tasas cercanas y deben responder a la partida. La amplificación de Oblivion Savant depende de torres destruidas; no confundas esa mecánica con una mejora permanente desde el minuto cero."
    }
  },

  "pugna|Support 4": {
    guide: {
      title:"Pugna Support 4 · presión de línea, control y utilidad · 7.41f",
      skillIcons:{Q:{name:"Nether Blast",slug:"pugna_nether_blast"},W:{name:"Decrepify",slug:"pugna_decrepify"},E:{name:"Nether Ward",slug:"pugna_nether_ward"},R:{name:"Life Drain",slug:"pugna_life_drain"}},
      skillBuild:[{"level":1,"code":"Q"},{"level":2,"code":"E"},{"level":3,"code":"Q"},{"level":4,"code":"W"},{"level":5,"code":"Q"},{"level":6,"code":"R"},{"level":7,"code":"Q"},{"level":8,"code":"E"},{"level":9,"code":"E"},{"level":10,"code":"T"},{"level":11,"code":"W"},{"level":12,"code":"R"},{"level":13,"code":"W"},{"level":14,"code":"W"},{"level":15,"code":"W"},{"level":16,"code":"A"},{"level":17,"code":"A"},{"level":18,"code":"R"}],
      talentChoices:[{"level":10,"left":{"name":"−1 s recarga Nether Blast","reason":"Elegilo si necesitás limpiar oleadas, hostigar y presionar el objetivo con más frecuencia."},"right":{"name":"+2 vida Nether Ward","reason":"Preferilo si los rivales destruyen la Ward antes de que aporte daño relevante."}},{"level":15,"left":{"name":"+250 salud","reason":"Opción consistente si sos objetivo de iniciaciones o necesitás sobrevivir para usar tus recursos."},"right":{"name":"+30% velocidad Decrepify","reason":"Elegilo cuando tu equipo pueda aprovechar la movilidad adicional para perseguir o reposicionarse."}},{"level":20,"left":{"name":"+1,5 s Decrepify","reason":"Extiende la ventana de control/protección y amplifica el tiempo de exposición al daño mágico."},"right":{"name":"+15% curación Life Drain","reason":"Preferilo cuando tu función principal sea sostener o salvar aliados."}},{"level":25,"left":{"name":"+200 daño Nether Blast","reason":"Más presión directa y capacidad de castigar estructuras."},"right":{"name":"+1,9 daño Nether Ward/maná","reason":"Más valor contra equipos que lanzan muchos hechizos cerca de la Ward."}}],
      skillOrder:["1: Nether Blast","2: Nether Ward","3: Nether Blast","4: Decrepify","5: Nether Blast","6: Life Drain","7: Nether Blast","8–9: Nether Ward","10: talento","11: Decrepify","12: Life Drain","13–15: Decrepify","16–17: atributo","18: Life Drain"],
      skillPriority:"Prioridad de referencia para soporte: Nether Blast primero (nivel 7), Nether Ward después (nivel 10) y Decrepify a continuación (nivel 15); Life Drain en 6/12/18. La progresión coincide con las tendencias publicadas para Pugna support en 7.41f, pero adelantá Decrepify si necesitás salvar al core o responder a una amenaza física en línea. No gastes puntos por automatismo si el intercambio exige otra habilidad.",
      talents:[["Nivel 10","−1 s de recarga de Nether Blast para presión y oleadas; +2 de vida de Nether Ward si el rival la elimina demasiado rápido. Elegí según el tiempo real que la Ward permanece activa."]],
      combos:[
        ["Hostigamiento y presión de línea","Usá Nether Blast para castigar al dúo rival y empujar cuando tu core pueda aprovechar la oleada. Evitá romper el equilibrio de línea sin visión o sin una ventana para asegurar runa/objetivo."],
        ["Nether Ward antes de la pelea","Ubicala fuera de la visión inmediata del rival pero cubriendo la zona desde donde lanzará hechizos. Como posición 4 podés preparar el terreno antes de que tu iniciador entre."],
        ["Decrepify para habilitar daño mágico","Aplicalo sobre el objetivo cuando tus aliados puedan seguir con daño mágico. No lo uses sobre un enemigo que tu core necesita golpear físicamente."],
        ["Decrepify defensivo","Usalo sobre un aliado para impedir que reciba ataques físicos durante la ventana crítica; recordá que tampoco podrá atacar mientras dure el efecto."],
        ["Life Drain y Oblivion Savant","Durante Life Drain podés lanzar habilidades y usar objetos según las condiciones del objeto. Aprovechá para reposicionar recursos, pero cortá la canalización si aparece una interrupción o quedás expuesto."]
      ],
      positioning:"Jugá como soporte de segunda línea: acompañá al iniciador, prepará Nether Ward antes del choque y mantené Nether Blast a alcance sin quedar como primer objetivo. En rotaciones, buscá ángulos desde los que puedas amenazar al soporte rival o defender al core. No canalices Life Drain desde una posición que permita al rival interrumpirte gratis.",
      mechanics:"Oblivion Savant permite lanzar habilidades y usar objetos durante Life Drain; otorga 1,5% de amplificación de hechizos por cada torre destruida. Nether Ward causa daño atribuido a Pugna y Nether Blast inflige el 65% de su daño a estructuras.",
      caveats:"La secuencia y los talentos son una referencia de partidas de Pugna support en 7.41f, no una build obligatoria. Los datos agregados no distinguen siempre con precisión la función de cada partida; adaptá la prioridad a tu core, al dúo rival y al draft. Precios y recetas no se certifican en esta guía."
    }
  },
  "pugna|Support 5": {
    guide: {
      title:"Pugna Support 5 · protección, sustain y defensa de objetivos · 7.41f",
      skillIcons:{Q:{name:"Nether Blast",slug:"pugna_nether_blast"},W:{name:"Decrepify",slug:"pugna_decrepify"},E:{name:"Nether Ward",slug:"pugna_nether_ward"},R:{name:"Life Drain",slug:"pugna_life_drain"}},
      skillBuild:[{"level":1,"code":"Q"},{"level":2,"code":"E"},{"level":3,"code":"Q"},{"level":4,"code":"W"},{"level":5,"code":"Q"},{"level":6,"code":"R"},{"level":7,"code":"Q"},{"level":8,"code":"E"},{"level":9,"code":"E"},{"level":10,"code":"T"},{"level":11,"code":"W"},{"level":12,"code":"R"},{"level":13,"code":"W"},{"level":14,"code":"W"},{"level":15,"code":"W"},{"level":16,"code":"A"},{"level":17,"code":"A"},{"level":18,"code":"R"}],
      talentChoices:[{"level":10,"left":{"name":"−1 s recarga Nether Blast","reason":"Si tu línea necesita más hostigamiento y capacidad de despejar oleadas."},"right":{"name":"+2 vida Nether Ward","reason":"Si la Ward recibe foco y no alcanza a castigar los hechizos enemigos."}},{"level":15,"left":{"name":"+250 salud","reason":"La opción prudente cuando debés permanecer vivo para proteger al carry y sostener la defensa."},"right":{"name":"+30% velocidad Decrepify","reason":"Si la movilidad adicional de Decrepify permite salvar o reposicionar aliados con frecuencia."}},{"level":20,"left":{"name":"+1,5 s Decrepify","reason":"Más duración para proteger a un aliado o extender la ventana de daño mágico."},"right":{"name":"+15% curación Life Drain","reason":"Priorizalo si la curación sobre aliados tiene un impacto alto en las peleas."}},{"level":25,"left":{"name":"+200 daño Nether Blast","reason":"Si necesitás aportar daño y acelerar la presión sobre estructuras."},"right":{"name":"+1,9 daño Nether Ward/maná","reason":"Si el equipo enemigo depende de lanzar muchos hechizos dentro del área de la Ward."}}],
      skillOrder:["1: Nether Blast","2: Nether Ward","3: Nether Blast","4: Decrepify","5: Nether Blast","6: Life Drain","7: Nether Blast","8–10: Nether Ward","10: talento","11: Decrepify","12: Life Drain","13–15: Decrepify","16–17: atributo","18: Life Drain"],
      skillPriority:"Como posición 5, la referencia sigue siendo Nether Blast primero, Nether Ward segundo y Decrepify tercero, con Life Drain en 6/12/18. La guía prioriza que puedas defender al carry y sostener el área de juego; adelantá Decrepify si el rival amenaza con daño físico directo o necesitás salvar a tu aliado. No sacrifiques la seguridad de línea por empujar sin motivo.",
      talents:[["Nivel 10","−1 s de recarga de Nether Blast para hostigar/defender oleadas; +2 de vida de Nether Ward cuando los rivales la destruyen rápidamente."]],
      combos:[
        ["Defensa del carry","Guardá Decrepify para el momento en que el carry reciba una amenaza física importante. Avisá antes de aplicarlo: durante el efecto no podrá atacar."],
        ["Nether Ward en defensa de torre","Colocala en un punto protegido que cubra el acceso y el área desde donde el rival lanzará hechizos. Evitá ponerla al alcance de ataques gratuitos."],
        ["Nether Blast con control de oleada","Usala para defender bajo torre o castigar cuando el carry pueda farmear con seguridad. No empujes la línea hacia territorio enemigo si eso expone al equipo."],
        ["Life Drain como salvación","Canalizá sobre un aliado herido cuando puedas mantenerte fuera del alcance de interrupciones. La supervivencia del canalizador también es parte de la salvación."],
        ["Decrepify para amplificar daño mágico","Si el equipo tiene daño mágico coordinado, aplicalo al enemigo prioritario; si el carry depende de ataques físicos, no lo destierres en ese momento."]
      ],
      positioning:"Mantenete cerca del carry sin compartir innecesariamente el mismo ángulo de iniciación. Protegé rutas de retirada y entradas a objetivos con visión y Nether Ward. En peleas, priorizá sobrevivir para poder aplicar Decrepify y Life Drain; no busques daño personal si eso te obliga a abandonar a tu core.",
      mechanics:"Oblivion Savant permite lanzar habilidades y usar objetos durante Life Drain; otorga 1,5% de amplificación de hechizos por cada torre destruida. Nether Ward causa daño atribuido a Pugna y Nether Blast inflige el 65% de su daño a estructuras.",
      caveats:"Esta guía separa la función de posición 5 de la de posición 4, pero comparte una progresión de habilidades respaldada por datos agregados de Pugna support. La elección real depende del dúo de línea, la amenaza física/mágica y las necesidades del carry. Los objetos y su orden deben decidirse con el inventario, el draft y el oro de la partida."
    }
  },

  "techies|Support 4": {
    guide: {
      title:"Techies Support 4 · presión, control de zona y protección · 7.41f",
      metadata:{
        heroKey:"npc_dota_hero_techies",
        role:"Support 4",
        patch:"7.41f",
        source:[
          "https://dotacoach.gg/en/heroes/techies",
          "https://statsdota.com/en/heroes/techies/soft-support",
          "https://dotatrack.com/es/heroes/techies/build"
        ],
        confidence:"mixed"
      },
      innateAbilities:[
        {
          name:"M.A.D.",
          description:"Pasiva innata: convierte el 0,1% del maná máximo en regeneración adicional. Al morir, Techies deja un barril que explota tras 1,5 s; inflige 50 + 30% del maná máximo como daño mágico en un radio de 400. El efecto de barril y la regeneración escalan con el maná máximo."
        }
      ],
      skillIcons:{
        Q:{name:"Sticky Bomb",slug:"techies_sticky_bomb"},
        W:{name:"Reactive Tazer",slug:"techies_reactive_tazer"},
        E:{name:"Blast Off!",slug:"techies_suicide"},
        R:{name:"Proximity Mines",slug:"techies_land_mines"}
      },
      skillBuild:[
        {level:1,code:"E"},{level:2,code:"W"},{level:3,code:"E"},{level:4,code:"W"},
        {level:5,code:"E"},{level:6,code:"R"},{level:7,code:"E"},{level:8,code:"W"},
        {level:9,code:"W"},{level:10,code:"Q"},{level:12,code:"Q"},{level:13,code:"R"},
        {level:14,code:"Q"},{level:15,code:"Q"},{level:17,code:"R"}
      ],
      skillOrder:[
        "1: Blast Off!","2: Reactive Tazer","3: Blast Off!","4: Reactive Tazer",
        "5: Blast Off!","6: Proximity Mines","7: Blast Off!","8–9: Reactive Tazer",
        "10: Sticky Bomb","12: Sticky Bomb","13: Proximity Mines","14–15: Sticky Bomb",
        "17: Proximity Mines"
      ],
      talentChoices:[
        {level:10,left:{name:"−2 s de recarga de Proximity Mines",reason:"La opción más elegida en la muestra; mejora la frecuencia con la que preparás rutas y objetivos. Elegila si las minas tienen impacto real en el mapa."},right:{name:"+15% resistencia mágica",reason:"Alternativa defensiva si recibís daño mágico sostenido o burst antes de poder reposicionarte."}},
        {level:15,left:{name:"+175 daño de Blast Off!",reason:"Aumenta el daño de tu herramienta de iniciación y pickoff; es la opción más frecuente en la muestra."},right:{name:"+25% duración de Reactive Tazer y desarme",reason:"Preferila si tu función principal es proteger al aliado que recibe ataques y prolongar la ventana de desarme."}},
        {level:20,left:{name:"−15 s de recarga de Blast Off!",reason:"Más oportunidades de iniciar, interrumpir y aportar daño en peleas sucesivas."},right:{name:"+160 daño de Sticky Bomb",reason:"Elegila si necesitás más daño a distancia y presión sin comprometerte con un salto."}},
        {level:25,left:{name:"−0,8 s de activación de Proximity Mines",reason:"La opción más elegida; reduce la ventana de reacción del rival y mejora la fiabilidad de las trampas."},right:{name:"+253 daño",reason:"Daño directo adicional como alternativa de late game; aparece con una elección mucho menor en la muestra."}}
      ],
      skillPriority:"Referencia agregada de Techies Support en 7.41f: Blast Off! primero (4 puntos al nivel 7), Reactive Tazer después (4 puntos al nivel 9), Sticky Bomb a continuación y Proximity Mines en 6/13/17. Los niveles 10/15/20/25 de la matriz indican cuándo se desbloquea cada tier de talento; la selección puede retrasarse y no tiene por qué coincidir con el evento de habilidad de ese nivel.",
      combos:[
        ["Hostigamiento de línea","Usá Blast Off! para castigar cuando tu compañero pueda seguir el aturdimiento. El daño propio es no letal, pero consume 20% de tu vida actual: no saltes si después quedás expuesto o sin recursos."],
        ["Reactive Tazer para salvar","Aplicalo sobre el aliado que está recibiendo ataques. Los enemigos que lo golpean quedan desarmados; podés detonar el efecto antes para provocar la explosión en área."],
        ["Sticky Bomb para persecución","Lanzala hacia la ruta de escape del rival. Si se adhiere, ralentiza y prepara daño en área; coordiná el impacto con el control de tu equipo."],
        ["Proximity Mines para preparar terreno","Colocá minas en accesos, portales y rutas de objetivos antes de que empiece la pelea. No las amontones: respetá la distancia mínima entre minas y no supongas que bloquean campamentos neutrales."],
        ["M.A.D. y maná","El maná máximo aporta regeneración y aumenta el daño del barril al morir. Es un beneficio pasivo, no una razón para comprar objetos de maná que no resuelvan una necesidad real."]
      ],
      positioning:"Como posición 4, buscá ángulos laterales para hostigar y preparar minas antes del enfrentamiento. No seas el primer cuerpo que entra: Blast Off! te deja dentro del equipo rival y reduce tu vida actual. Conservá Reactive Tazer para proteger al aliado que reciba foco y mantené rutas de retirada. En el mapa, prepará objetivos y pasos estrechos con antelación en lugar de perseguir kills sin visión.",
      mechanics:"M.A.D. es la habilidad innata y no consume un punto de progresión. Blast Off! aturde en área, destruye árboles y causa a Techies daño propio puro no letal equivalente al 20% de su vida actual. Reactive Tazer puede lanzarse sobre aliados; los atacantes del objetivo reciben daño y desarme. Proximity Mines son invisibles fuera de su área de activación, detonan tras mantener un enemigo en el radio y reducen su resistencia mágica durante 4 s; también infligen daño reducido a edificios.",
      caveats:"Perfil inicial de Support 4 basado en datos agregados de 7.41f, no en una muestra exclusiva de una sola liga. Las habilidades y el orden de referencia se contrastaron entre StatsDota y DotaTrack; las mecánicas de habilidades e innata se contrastaron con DotaCoach. El árbol muestra las opciones y tiers de talento de 7.41f; los eventos de selección observados en algunos registros pueden aparecer en niveles posteriores al desbloqueo. No se extrapola este perfil a Support 5. La ruta de objetos es estadística orientativa y debe ajustarse al draft, inventario y oro real."
    }
  },

};
