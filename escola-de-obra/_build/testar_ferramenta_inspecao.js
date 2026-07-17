// Testa o motor do Liberador de Concretagem (HTML PRO).
const fs=require("fs"), vm=require("vm"), path=require("path");
const html=fs.readFileSync(path.join(__dirname,"..","06-curso-inspecao","kit","ferramenta","liberador-concretagem-PRO.html"),"utf8");
const m=html.match(/<script>\s*"use strict";([\s\S]*?)<\/script>/);
if(!m){ console.error("script não encontrado"); process.exit(2); }
let code=m[1].replace(/renderStep\(\);\s*$/,"");
code += `
globalThis.__run = function(a){
  for(const k in ans) delete ans[k];
  Object.assign(ans, a);
  var cap=null;
  renderResultado=function(veredito,criticos,pendencias,passo){ cap={veredito,criticos,pendencias,passo}; };
  decidir();
  return cap;
};`;
const stub=new Proxy({},{get:(t,p)=>{ if(p==="style")return{}; if(p==="classList")return{add(){},remove(){},toggle(){}}; return ()=>{}; },set:()=>true});
const sb={ document:{getElementById:()=>stub,querySelectorAll:()=>[]}, window:{}, console, encodeURIComponent, String, Math };
vm.createContext(sb); vm.runInContext(code, sb);

const base={forma:"ok",armacao:"ok",cobrimento:"ok",escoramento:"ok",embutidos:"ok",prazo:"folga"};
const casos=[
 {n:"Tudo ok → LIBERADO", a:{...base}, ok:r=>r.veredito==="LIBERADO" && r.criticos.length===0 && r.pendencias.length===0},
 {n:"Escoramento NC → TRAVADO", a:{...base,escoramento:"nc"}, ok:r=>r.veredito==="TRAVADO" && r.criticos.includes("escoramento")},
 {n:"Cobrimento zero (NC) → TRAVADO", a:{...base,cobrimento:"nc"}, ok:r=>r.veredito==="TRAVADO" && r.criticos.includes("cobrimento")},
 {n:"1 pendência com folga → PENDENCIAS", a:{...base,cobrimento:"pend"}, ok:r=>r.veredito==="PENDENCIAS" && r.pendencias.includes("cobrimento")},
 {n:"Embutidos não conferidos → PENDENCIAS", a:{...base,embutidos:"nao"}, ok:r=>r.veredito==="PENDENCIAS" && r.pendencias.includes("embutidos")},
 {n:"2 pendências + concretagem HOJE → TRAVADO (sem janela)", a:{...base,forma:"pend",embutidos:"nao",prazo:"hoje"}, ok:r=>r.veredito==="TRAVADO" && /janela|tempo/i.test(r.passo.d)},
 {n:"1 pendência + hoje → ainda PENDENCIAS", a:{...base,forma:"pend",prazo:"hoje"}, ok:r=>r.veredito==="PENDENCIAS"},
 {n:"NC + pendências → TRAVADO (crítico domina)", a:{...base,armacao:"nc",forma:"pend"}, ok:r=>r.veredito==="TRAVADO" && r.criticos.includes("armacao")},
];
let allok=true;
console.log("=".repeat(60));
console.log(" TESTE DO MOTOR DO LIBERADOR DE CONCRETAGEM");
console.log("=".repeat(60));
for(const c of casos){
  const r=sb.__run(c.a); const pass=!!r && c.ok(r); allok=allok&&pass;
  console.log(`\n${pass?"✔":"✗"} ${c.n}`);
  console.log(`   veredito: ${r.veredito} · críticos: [${r.criticos}] · pendências: [${r.pendencias}]`);
}
console.log("\n"+"=".repeat(60));
console.log(" RESULTADO:", allok?"TODOS OS TESTES PASSARAM ✔":"HÁ FALHAS ✗");
console.log("=".repeat(60));
process.exit(allok?0:1);
