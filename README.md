# Dota 2 Build Assistant — versión 3.59

Aplicación web progresiva comunitaria para analizar drafts de Dota 2 y orientar compras según héroe, posición, amenazas, fase de partida, oro e inventario.

**Aplicación:** https://jcheinz.github.io/dota2-build-assistant/  
**Repositorio:** https://github.com/JCheinz/dota2-build-assistant  
**Estado:** rama 3.59 en validación; incorpora reloj de partida pausable y rotación de inventario por fases.

## Funcionalidades actuales

- Selección de cinco héroes aliados y cinco enemigos.
- Análisis contextual de amenazas y compatibilidad de roles.
- Mercado general por posición y cinco fases de partida.
- Rutas individuales para combinaciones héroe/posición disponibles.
- Respuestas situacionales según amenazas y problemas declarados.
- Catálogo de recetas y cálculo de componentes faltantes.
- Inventario principal de seis espacios, mochila, reserva de venta e historial local de compras, ventas y mejoras.
- Componentes de recetas registrados también como objetos físicos del inventario, con prioridad según los objetivos de build adquiridos.
- Reloj persistente de partida con iniciar, pausar, reanudar y fases Early (0–11), Mid (12–24) y Late (25+).
- Registro de uso de consumibles.
- Especializaciones individuales con progresión de habilidades, talentos y mecánicas.
- Skill Data Engine v2 para descargar y normalizar constantes de OpenDota bajo demanda.
- Diseño adaptable y Service Worker para experiencia PWA.

## Módulos principales

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Interfaz y lógica principal de draft, mercado y presentación |
| `specializations.js` | Perfiles de héroes y posiciones |
| `inventory-ledger.js` | Inventario físico, componentes, historial, rotación y movimientos |
| `match-clock.js` | Reloj persistente y paus able de partida, con límites de fase |
| `skill-data-engine.js` | Extracción y normalización de habilidades |
| `build-data-engine.js` | Builds dinámicas por posición desde Dota2ProTracker y respaldo de popularidad de objetos de OpenDota |
| `sw.js` | Caché y actualización de recursos |
| `tests/` | Pruebas automatizadas |

## Validación

El workflow `.github/workflows/validate-skill-matrix.yml` ejecuta:

- Comprobación sintáctica de los módulos JavaScript.
- `tests/skill-matrix.test.js`.
- `tests/inventory-ledger.test.js`.
- `tests/match-clock.test.js`.
- `tests/skill-data-engine.test.js`.
- `tests/build-data-engine.test.js`.

Las pruebas automáticas no sustituyen la validación visual en Android ni las pruebas de uso en una partida.

## Limitaciones conocidas y siguientes pasos

- Las especializaciones individuales cubren una parte pequeña del conjunto de héroes y posiciones.
- Las recetas y precios requieren auditoría contra el parche vigente.
- El inventario depende de la entrada manual del jugador y todavía necesita cantidades/cargas completas para consumibles.
- Skill Data Engine descarga datos bajo demanda, pero aún no genera un snapshot versionado ni un índice táctico integrado con Threat Counter.
- No se ha verificado todavía la publicación de 3.54 en Pages ni el funcionamiento de esta versión en Android.
- No existe actualmente configuración nativa Android/Capacitor ni una APK generada en el repositorio.

## Plan de estabilización y Android

1. Consolidar documentación y caché de la versión 3.54.
2. Ejecutar CI completo y revisar regresiones.
3. Verificar GitHub Pages y recursos PWA.
4. Probar la aplicación en Android: instalación, selección de draft, mercado, inventario, persistencia y actualización.
5. Elegir el empaquetado Android adecuado (PWA/TWA o wrapper nativo) según permisos y capacidades necesarias.
6. Generar APK firmada, instalarla y ejecutar pruebas de uso antes de distribuirla.

No considerar una APK terminada hasta que el artefacto se haya generado, instalado y probado en un dispositivo Android.

## Fuentes

- OpenDota: https://www.opendota.com/
- OpenDota API: https://docs.opendota.com/
- Repositorio: https://github.com/JCheinz/dota2-build-assistant
