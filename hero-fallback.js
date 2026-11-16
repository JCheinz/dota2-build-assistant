// Respaldo de catálogo: reutiliza el estado y los selectores originales de la aplicación.
(async function(){
 const status=document.getElementById('loadStatus');
 try{
  status.textContent='Cargando catálogo local de héroes…';
  const response=await fetch('./heroes.json?fallback=330',{cache:'no-store'});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const payload=await response.json();
  const list=(Array.isArray(payload)?payload:Object.values(payload))
   .filter(h=>h&&Number.isFinite(Number(h.id))&&h.name&&h.localized_name)
   .map(h=>({...h,id:Number(h.id),roles:Array.isArray(h.roles)?h.roles:[]}));
  if(list.length<100)throw new Error('Catálogo incompleto: '+list.length);
  heroes=list.sort((a,b)=>a.localized_name.localeCompare(b.localized_name,'es'));
  renderSlots();
  renderHeroGrid();
  renderDynamicStateControls();
  status.textContent=heroes.length+' héroes disponibles · catálogo local de respaldo.';
 }catch(error){
  status.textContent='No se pudo cargar el catálogo local: '+error.message;
 }
})();