// Testa o motor de veredito do Simulador de Recebimento de Concreto (HTML PRO).
const fs=require("fs"), vm=require("vm"), path=require("path");
const html=fs.readFileSync(path.join(__dirname,"..","05-curso-concreto","kit","ferramenta","simulador-recebimento-PRO.html"),"utf8");
const m=html.match(/<script>\s*"use strict";([\s\S]*?)<\/script>/);
if(!m){ console.error("script não encontrado"); process.exit(2); }
let code=m[1].replace(/renderStep\(\);\s*$/,"");
code += `
globalThis.__run = function(a){
  for(const k in ans) delete ans[k];
  Object.assign(ans, a);
  var cap=null;
  renderResultado=function(veredito,motivos,passo){ cap={veredito,motivos,passo}; };
  decidir();
  return cap;
};`;
const stub=new Proxy({},{get:(t,p)=>{ if(p==="style")return{}; if(p==="classList")return{add(){},remove(){},toggle(){}}; return ()=>{}; },set:()=>true});
const sb={ document:{getElementById:()=>stub,querySelectorAll:()=>[]}, window:{}, console, encodeURIComponent, String, Math };
vm.createContext(sb); vm.runInContext(code, sb);

function hasM(r,re){ return r.motivos.some(x=>re.test(x[0]+" "+x[1])); }
const casos=[
 {n:"Tudo ok → LIBERAR", a:{nota:"ok",tempo:"dentro",slump:"faixa",aspecto:"normal",pressao:"nao"},
  ok:r=>r.veredito==="LIBERAR" && hasM(r,/provisória atendida/i)},
 {n:"Nota divergente → RECUSAR", a:{nota:"diverge",tempo:"dentro",slump:"faixa",aspecto:"normal",pressao:"nao"},
  ok:r=>r.veredito==="RECUSAR" && hasM(r,/Nota divergente/i)},
 {n:"Tempo estourado → RECUSAR", a:{nota:"ok",tempo:"estourado",slump:"faixa",aspecto:"normal",pressao:"nao"},
  ok:r=>r.veredito==="RECUSAR" && hasM(r,/Tempo-limite/i)},
 {n:"Slump fluido → RECUSAR", a:{nota:"ok",tempo:"dentro",slump:"fluido",aspecto:"normal",pressao:"nao"},
  ok:r=>r.veredito==="RECUSAR" && hasM(r,/acima do pedido/i)},
 {n:"Slump seco → CORRIGIR via central", a:{nota:"ok",tempo:"dentro",slump:"seco",aspecto:"normal",pressao:"nao"},
  ok:r=>r.veredito==="CORRIGIR" && hasM(r,/aditivo dosado PELA CENTRAL/i)},
 {n:"Sem ensaio → CORRIGIR (completar procedimento)", a:{nota:"ok",tempo:"dentro",slump:"naofiz",aspecto:"normal",pressao:"nao"},
  ok:r=>r.veredito==="CORRIGIR" && hasM(r,/Procedimento incompleto/i)},
 {n:"Aspecto anormal → RECUSAR", a:{nota:"ok",tempo:"dentro",slump:"faixa",aspecto:"anormal",pressao:"nao"},
  ok:r=>r.veredito==="RECUSAR" && hasM(r,/Aspecto anormal/i)},
 {n:"Pressão de 'aguinha' → aviso presente (com liberação)", a:{nota:"ok",tempo:"dentro",slump:"faixa",aspecto:"normal",pressao:"sim"},
  ok:r=>r.veredito==="LIBERAR" && hasM(r,/aguinha|água extra/i)},
 {n:"Seco + relógio apertado → CORRIGIR com alerta de tempo", a:{nota:"ok",tempo:"apertado",slump:"seco",aspecto:"normal",pressao:"nao"},
  ok:r=>r.veredito==="CORRIGIR" && hasM(r,/Relógio apertado/i)},
];
let allok=true;
console.log("=".repeat(62));
console.log(" TESTE DO MOTOR DO SIMULADOR DE RECEBIMENTO DE CONCRETO");
console.log("=".repeat(62));
for(const c of casos){
  const r=sb.__run(c.a); const pass=!!r && c.ok(r); allok=allok&&pass;
  console.log(`\n${pass?"✔":"✗"} ${c.n}`);
  console.log(`   veredito: ${r.veredito} · motivos: ${r.motivos.map(x=>x[0]).join(" | ")}`);
}
console.log("\n"+"=".repeat(62));
console.log(" RESULTADO:", allok?"TODOS OS TESTES PASSARAM ✔":"HÁ FALHAS ✗");
console.log("=".repeat(62));
process.exit(allok?0:1);
