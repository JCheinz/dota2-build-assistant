# Interfaz compacta y horizontal — v3.60

## Objetivo
Reducir desplazamiento y mejorar la lectura en móvil sin cambiar los motores tácticos ni el cálculo de compras.

## Paneles del informe
1. **Draft con sinergia y amenazas:** el cuadro de sinergia/prioridad queda dentro del mismo panel de composición, al lado de los diez héroes en landscape.
2. **Habilidades y talentos:** guía por héroe/posición, matriz de niveles y elecciones de talentos disponibles.
3. **Build principal:** ruta de objetos, inventario/seguimiento y próxima compra.
4. **Situacionales contra el draft:** respuestas defensivas, grupos de amenazas y alternativas condicionales.

El mercado completo y las secciones no clasificadas se mantienen disponibles dentro de «Más análisis y mercado».

## Orientación horizontal
- Aplica a pantallas en landscape con ancho desde 600 px y altura hasta 700 px.
- El panel de draft ocupa el ancho completo y divide composición/sinergia en dos áreas; las herramientas de datos quedan compactas en dos columnas; la configuración usa controles en fila.
- El informe complementario se muestra en tres columnas: habilidades/talentos, build principal y situacionales.
- La matriz de habilidades conserva su desplazamiento horizontal interno.
- En orientación vertical, el informe vuelve a una columna o dos columnas según el ancho disponible.

## Integridad funcional
- El organizador solo mueve nodos HTML ya generados por el informe; no calcula ni reemplaza recomendaciones.
- Los eventos de compra, inventario y recálculo siguen delegados en el contenedor `#report`.
- Si no hay guía de habilidades o contenido situacional, se muestra un estado vacío en el panel correspondiente.
- Los paneles adicionales no se eliminan: se conservan desplegables.

## Validación pendiente
- Ejecutar CI y revisar errores de sintaxis/regresión.
- Verificar visualmente en Android, tanto horizontal como vertical.
- Comprobar que marcar una compra, recalcular y cambiar draft mantiene los paneles correctamente organizados.
