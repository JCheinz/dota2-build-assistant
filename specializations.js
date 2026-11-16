/* Registro de especializaciones individuales. Cada perfil se identifica por héroe|posición. */
window.DOTA_HERO_SPECIALIZATIONS = {
  "pugna|Mid": {
    guide: {
      title:"Pugna Mid · guía individual 7.41f",
      skillBuild:[{"level":1,"code":"Q"},{"level":2,"code":"W"},{"level":3,"code":"Q"},{"level":4,"code":"E"},{"level":5,"code":"Q"},{"level":6,"code":"R"},{"level":7,"code":"Q"},{"level":8,"code":"W"},{"level":9,"code":"W"},{"level":10,"code":"T"},{"level":11,"code":"E"},{"level":12,"code":"R"},{"level":13,"code":"E"},{"level":14,"code":"E"},{"level":15,"code":"E"},{"level":16,"code":"T"},{"level":17,"code":"A"},{"level":18,"code":"R"}],
      talentChoices:[{"level":10,"left":{"name":"−1 s recarga Nether Blast","reason":"Más limpieza de oleadas y presión frecuente."},"right":{"name":"+2 vida Nether Ward","reason":"Si los rivales destruyen la Ward demasiado rápido."}},{"level":15,"left":{"name":"+250 salud","reason":"Opción estable para sobrevivir a iniciaciones."},"right":{"name":"+30% velocidad Decrepify","reason":"Si tu equipo aprovecha persecuciones o reposicionamiento."}},{"level":20,"left":{"name":"+1,5 s Decrepify","reason":"Amplía la ventana de daño mágico o protección."},"right":{"name":"+15% curación Life Drain","reason":"Si necesitás sostenerte o salvar aliados."}},{"level":25,"left":{"name":"+200 daño Nether Blast","reason":"Daño directo y presión de estructuras."},"right":{"name":"+1,9 daño Nether Ward/maná","reason":"Contra equipos que lanzan muchos hechizos en su radio."}}],
      skillOrder:[
        "1: Nether Blast","2: Decrepify","3: Nether Blast","4: Nether Ward",
        "5: Nether Blast","6: Life Drain","7: Nether Blast",
        "8–9: Decrepify","10: talento","11: Nether Ward",
        "12: Life Drain","13–15: Nether Ward","16: talento",
        "17: atributo","18: Life Drain"
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
  }
};
