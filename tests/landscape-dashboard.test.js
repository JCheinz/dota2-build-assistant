const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

assert.ok(html.includes("VERSIÓN 3.60 · PARCHE 7.42"), "La interfaz debe identificar la versión 3.60");
assert.ok(html.includes('id="draftPanel"'), "El draft debe tener un contenedor identificable para el layout");
assert.ok(html.includes('id="configPanel"'), "La configuración debe tener un contenedor identificable para el layout");
assert.ok(html.includes("@media(orientation:landscape) and (min-width:600px) and (max-height:700px)"), "Debe existir el modo horizontal compacto");
assert.ok(html.includes(".analysis-dashboard{grid-template-columns:repeat(4,minmax(0,1fr))"), "El informe horizontal debe usar cuatro columnas");
assert.ok(html.includes("function organizeReportDashboard()"), "Debe existir el organizador del informe");
for (const pane of [
  "Draft · sinergia y amenazas",
  "Habilidades y talentos",
  "Build principal",
  "Situacionales contra el draft"
]) assert.ok(html.includes(pane), "Falta panel del dashboard: " + pane);
assert.ok(html.includes("Más análisis y mercado"), "Los apartados secundarios deben conservarse en un desplegable");
assert.ok(html.includes("organizeReportDashboard();$('result').classList.add('show')"), "El dashboard debe organizarse después de generar el informe");
assert.ok(html.includes("$('report').addEventListener('click'"), "Los eventos de compra y recálculo deben seguir delegados en el informe");
assert.ok(sw.includes("const CACHE = 'dota-build-v120';"), "El Service Worker debe invalidar la caché de la interfaz anterior");

console.log("OK: UI 3.60 — cuatro paneles, modo horizontal, secciones conservadas y eventos delegados");
