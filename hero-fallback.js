(function(){
 const $=id=>document.getElementById(id);
 const img=h=>'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/'+h.name.replace('npc_dota_hero_','')+'.png';
 let data=[],team='ally',slot=0,ally=Array(5).fill(null),enemy=Array(5).fill(null);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function paint(){
  for(const [key,arr,id] of [['ally',ally,'allySlots'],['enemy',enemy,'enemySlots']]){
   const root=$(id);if(!root)return;
   root.innerHTML='';
   arr.forEach((h,i)=>{const b=document.createElement('button');b.className='slot '+(h?'selected':'empty');b.innerHTML=h?'<img src="'+img(h)+'" alt=""><span>'+esc(h.localized_name)+'</span>':'＋';b.onclick=()=>window.openPicker(key,i);root.appendChild(b)});
  }
  const n=ally.filter(Boolean).length+enemy.filter(Boolean).length;
  if($('draftCount'))$('draftCount').textContent=n+' / 10 héroes';
  const sel=$('myHero'),old=sel&&sel.value;
  if(sel){sel.innerHTML='<option value="">Elegí tu héroe</option>';ally.filter(Boolean).forEach(h=>{const o=document.createElement('option');o.value=h.id;o.textContent=h.localized_name;sel.appendChild(o)});if([...sel.options].some(o=>o.value===old))sel.value=old;}
  if($('analyze'))$('analyze').disabled=n!==10||!sel?.value;
 }
 window.openPicker=function(t,i){team=t;slot=i;$('modalTitle').textContent=(t==='ally'?'Tu equipo':'Equipo enemigo')+' · espacio '+(i+1);$('search').value='';draw();$('modal').classList.add('open');};
 function draw(){const used=new Set([...ally,...enemy].filter(Boolean).map(h=>h.id));const q=$('search').value.toLocaleLowerCase('es');const list=data.filter(h=>(h.localized_name.toLocaleLowerCase('es').includes(q)||h.name.includes(q))&&(!used.has(h.id)||((team==='ally'?ally:enemy)[slot]?.id===h.id)));$('heroGrid').innerHTML=list.map(h=>'<button class="hero" data-id="'+h.id+'"><img loading="lazy" src="'+img(h)+'" alt=""><span>'+esc(h.localized_name)+'</span></button>').join('')||'<p class="hint">No hay resultados.</p>';$('heroGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>{const h=data.find(x=>x.id===Number(b.dataset.id));(team==='ally'?ally:enemy)[slot]=h;$('modal').classList.remove('open');paint();});}
 function start(){
  if(typeof window.openPicker==='function' && $('loadStatus')?.textContent.includes('héroes disponibles'))return;
  fetch('./heroes.json?fallback=328',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(payload=>{data=Object.values(payload).filter(h=>h&&h.id&&h.name&&h.localized_name).map(h=>({...h,id:Number(h.id),roles:Array.isArray(h.roles)?h.roles:[]}));if(data.length<100)throw Error('Catálogo incompleto');data.sort((a,b)=>a.localized_name.localeCompare(b.localized_name,'es'));paint();$('loadStatus').textContent=data.length+' héroes disponibles · catálogo local de emergencia.';}).catch(e=>{$('loadStatus').textContent='No se pudo iniciar el selector: '+e.message;});
 }
 $('search')?.addEventListener('input',draw);
 $('close')?.addEventListener('click',()=>$('modal').classList.remove('open'));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,1200));else setTimeout(start,1200);
})();