const assert=require("node:assert/strict");
const icons=require("../item-icons.js");
assert.ok(icons.count()>=500,"El catálogo debe incluir al menos 500 registros");
for(const name of ["Bracer","Tango","Sange","Heaven's Halberd","Heaven’s Halberd","Linken's Sphere","Linken’s Sphere","Observer Ward","Sentry Ward","Sange and Yasha","Arcane Blink Recipe"]){
 const url=icons.resolve(name);
 assert.ok(url,"Falta resolver el icono de "+name);
 assert.ok(url.startsWith("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/"),"Ruta inválida para "+name);
}
assert.equal(icons.resolve("Nombre inexistente"),null);
assert.equal(icons.normalize("Heaven’s Halberd"),icons.normalize("Heaven's Halberd"));
console.log("OK: catálogo de iconos Dota — nombres, apóstrofos, objetos y recetas");
