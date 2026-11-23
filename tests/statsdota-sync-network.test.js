"use strict";
const assert=require("node:assert/strict");
const {RateLimitError,fetchText}=require("../scripts/sync-statsdota-guides");
(async()=>{
 let calls=0;
 const limited=async()=>{calls++;return{status:429,headers:{get:()=> "60"},ok:false,text:async()=>"limited"}};
 await assert.rejects(fetchText("https://statsdota.test/guides",3,limited),error=>{
  assert.ok(error instanceof RateLimitError);
  assert.equal(error.retryAfter,60);
  return true;
 });
 assert.equal(calls,1,"HTTP 429 must stop immediately without retries");
 calls=0;
 const forbidden=async()=>{calls++;return{status:403,headers:{get:()=>null},ok:false,text:async()=>"forbidden"}};
 await assert.rejects(fetchText("https://statsdota.test/guides",3,forbidden),/HTTP 403 forbidden/);
 assert.equal(calls,1,"HTTP 403 must stop immediately without retries");
 calls=0;
 const success=async()=>{calls++;return{status:200,ok:true,headers:{get:()=>null},text:async()=>"guide html"}};
 assert.equal(await fetchText("https://statsdota.test/guides",3,success),"guide html");
 assert.equal(calls,1);
 console.log("OK: StatsDota 429/403 circuit breaker and successful fetch");
})().catch(error=>{console.error(error);process.exitCode=1});
