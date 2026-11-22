(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 if(root)root.DOTA_MATCH_CLOCK=api;
})(typeof globalThis!=="undefined"?globalThis:null,function(){
 "use strict";
 const PHASES=Object.freeze([
  {key:"early",label:"Early game",start:0,end:12},
  {key:"mid",label:"Mid game",start:12,end:25},
  {key:"late",label:"Late game",start:25,end:null}
 ]);
 function create(options={}){
  const storage=options.storage||null;
  const storageKey=options.storageKey||"dota2-build-match-clock-v1";
  const now=typeof options.now==="function"?options.now:()=>Date.now();
  let state={elapsedMs:0,running:false,startedAt:null};
  const persist=()=>{try{if(storage&&typeof storage.setItem==="function")storage.setItem(storageKey,JSON.stringify(state));}catch(_){}};
  const read=()=>{try{const raw=storage&&storage.getItem&&storage.getItem(storageKey);if(!raw)return;const saved=JSON.parse(raw);if(saved&&Number.isFinite(Number(saved.elapsedMs))){state={elapsedMs:Math.max(0,Number(saved.elapsedMs)),running:saved.running===true,startedAt:saved.running===true&&Number.isFinite(Number(saved.startedAt))?Number(saved.startedAt):null};if(state.running&&state.startedAt===null)state.running=false;}}catch(_){state={elapsedMs:0,running:false,startedAt:null};}};
  read();
  function elapsed(at=now()){return Math.max(0,state.elapsedMs+(state.running&&state.startedAt!==null?Math.max(0,at-state.startedAt):0));}
  function snapshot(){
   const elapsedMs=elapsed(),elapsedSeconds=Math.floor(elapsedMs/1000),minute=Math.floor(elapsedSeconds/60),second=elapsedSeconds%60;
   return{elapsedMs,elapsedSeconds,minute,second,running:state.running,phase:phaseAt(minute)};
  }
  function phaseAt(minute){
   const value=Math.max(0,Number(minute)||0);
   return PHASES.find(p=>value>=p.start&&(p.end===null||value<p.end))||PHASES[2];
  }
  function start(){if(state.running)return false;state.running=true;state.startedAt=now();persist();return true;}
  function pause(){if(!state.running)return false;state.elapsedMs=elapsed();state.running=false;state.startedAt=null;persist();return true;}
  function reset(){state={elapsedMs:0,running:false,startedAt:null};persist();return snapshot();}
  return{start,pause,reset,snapshot,phaseAt,isRunning:()=>state.running};
 }
 return{create,phases:PHASES};
});
