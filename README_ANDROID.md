# Android — Dota 2 Build Assistant

## Estado

La integración usa Capacitor 8 y empaqueta la aplicación web actual dentro de una aplicación Android. No reemplaza ni reescribe el motor de draft, mercado, recetas o inventario.

- Application ID: `com.jcheinz.dotabuildassistant`
- Nombre visible: `Dota 2 Build Assistant`
- Capacitor: `8.6.2`
- Web bundle: `www/` (generado; no se versiona)
- Plataforma Android: se genera desde el paquete oficial `@capacitor/android` durante la compilación.

## Requisitos locales

- Node.js 22 o superior.
- Android Studio 2025.2.1 o superior.
- Android SDK Platform 24 o superior (la compilación CI utiliza API 36).
- JDK 21; Android Studio incluye un JDK compatible.

## Preparar el proyecto

```bash
npm install
npm run build:web
npx cap add android
npx cap sync android
npx cap open android
```

Para actualizar los recursos web después de modificar la aplicación:

```bash
npm run android:sync
```

## Compilar APK de prueba

Desde Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s).

O desde la terminal:

```bash
cd android
./gradlew assembleDebug
```

El APK debug queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

## Compilación automatizada

El workflow `.github/workflows/build-android.yml` prepara los recursos, crea la plataforma Android con Capacitor, sincroniza los archivos y compila una APK debug. La APK se publica como artefacto de GitHub Actions para descargarla y probarla.

La compilación debug sirve para validación; no es una APK de distribución firmada para Google Play.

## Datos y conectividad

La interfaz y los módulos se empaquetan localmente. El catálogo de héroes, imágenes y datos de OpenDota siguen necesitando conexión a Internet. El inventario continúa usando el almacenamiento local del WebView; no se ha migrado a una base nativa.

## Criterios de prueba en dispositivo

1. Instalar la APK debug.
2. Abrir y comprobar que no haya pantalla en blanco.
3. Cargar héroes y seleccionar los diez del draft.
4. Ejecutar el análisis y comprobar el mercado.
5. Registrar compras, componentes, ventas y consumibles.
6. Cerrar y volver a abrir; verificar persistencia del inventario.
7. Probar modo avión y reconexión, distinguiendo recursos locales de datos remotos.
8. Enviar capturas y errores antes de considerar la APK validada.
