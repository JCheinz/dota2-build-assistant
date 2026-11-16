# Estado del proyecto — Dota 2 Build Assistant

Última actualización: 2026-11-16 (UTC)

## Estado general
- Rama principal: `main`
- Commit principal vigente: `38ad59ef8854bc44dcb5f8b4a7470681e945861a`
- Versión funcional de referencia: 3.27 (Etapa 3: especializaciones individuales).
- Arquitectura acordada: motor común + especializaciones independientes por héroe y posición.

## Último trabajo integrado
- PR #10: “Remove leftover Pugna-specific generic report text”.
- Estado: integrado mediante squash el 2026-11-16.
- Commit de integración: `38ad59ef8854bc44dcb5f8b4a7470681e945861a`.
- Se aisló la sinergia de Pugna Mid en una función propia.
- El generador genérico de sinergias ya no contiene texto exclusivo de Pugna.
- Se mantuvo la especialización de Pugna Mid y se agregaron pruebas de regresión.
- Validación CI del PR: aprobada.
- Validación CI posterior al merge (run 43923714561): aprobada.
- Despliegue de GitHub Pages posterior al merge (run 43923713532): completado con éxito.

## Respaldo
- Rama de respaldo previa a la integración: `backup/pre-merge-2026-11-16`.
- Commit respaldado: `45e93cd8b106a532ac9e85e4a41981cee8ffeae7`.
- Esta rama conserva el estado de `main` inmediatamente anterior al merge del PR #10.

## Funcionalidades validadas que deben preservarse
- Techies Support 5 fue probado por el usuario y confirmó: “Si corre perfectamente”.
- No modificar Techies Support 5 ni su matriz de habilidades salvo que una prueba o solicitud concreta lo requiera.
- Mantener separadas las especializaciones por héroe/posición; evitar que texto específico de un héroe contamine el motor común.

## Pendiente inmediato
- Prueba visual/manual desde Android de la versión desplegada, especialmente la sección “Sinergia en equipo” con Techies y con otros héroes.
- Confirmar que ya no aparece texto de Pugna al seleccionar otro héroe.
- Confirmar que Pugna Mid conserva su contenido específico.

## Procedimiento de trabajo acordado
1. Antes de cada cambio relevante, crear una rama de respaldo apuntando al commit estable de `main`, con fecha y referencia identificable.
2. Registrar aquí el commit estable, versión/etapa, cambios integrados, resultados de CI/despliegue, respaldos y pendientes.
3. Trabajar en una rama separada; no integrar cambios con CI fallido.
4. Después de integrar, verificar CI y despliegue antes de pedir validación manual al usuario.
5. No declarar una prueba manual como aprobada hasta que el usuario la confirme.

## Continuidad entre conversaciones
Este archivo es el punto de recuperación del estado del proyecto. Al retomar, leer primero este documento y comprobar el estado real de `main`, CI y GitHub Pages antes de continuar.
