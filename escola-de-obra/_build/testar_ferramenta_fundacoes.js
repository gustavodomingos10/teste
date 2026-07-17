// Testa o motor de recomendação do Seletor de Fundação, carregando o JS real do HTML PRO.
const fs=require("fs"), vm=require("vm"), path=require("path");
const html=fs.readFileSync(path.join(__dirname,"..","04-curso-fundacoes","kit","ferramenta","seletor-fundacao-PRO.html"),"utf8");
const m=html.match(/<script>\s*"use strict";([\s\S]*?)<\/script>/);
if(!m){ console.error("script não encontrado"); process.exit(2); }
let code=m[1].replace(/renderStep\(\);\s*$/,"");
code += `
globalThis.__run = function(a){
  for(const k in ans) delete ans[k];
  ans.restr=[];
  Object.assign(ans, a);
  var cap=null;
  renderResultado=function(familia,tipos,alertas,passo,exigir,warn){ cap={familia,tipos,alertas,passo,exigir,warn}; };
  recomendar();
  return cap;
};`;
const stub=new Proxy({},{get:(t,p)=>{ if(p==="style")return{}; if(p==="classList")return{add(){},remove(){},toggle(){}}; return ()=>{}; },set:()=>true});
const sb={ document:{getElementById:()=>stub,querySelectorAll:()=>[]}, window:{}, console, encodeURIComponent, String, Math };
vm.createContext(sb); vm.runInContext(code, sb);

function has(arr,re){ return arr.some(x=>re.test(Array.isArray(x)?x[0]:x)); }
const casos=[
 {n:"Sem sondagem → exigir SPT", a:{sondagem:"nao",camada:"naosei",na:"naosei",carga:"leve",restr:[]},
  ok:r=>r.exigir===true && /Indefinida/.test(r.familia) && has(r.alertas,/6484/)},
 {n:"Camada rasa + carga leve → RASA", a:{sondagem:"sim",camada:"rasa",na:"baixo",carga:"leve",restr:[]},
  ok:r=>/RASA/.test(r.familia) && has(r.tipos,/Sapata isolada|bloco/i)},
 {n:"Camada profunda + carga alta → PROFUNDA", a:{sondagem:"sim",camada:"profunda",na:"baixo",carga:"alta",restr:[]},
  ok:r=>/PROFUNDA/.test(r.familia) && has(r.tipos,/hélice|pré-moldada/i)},
 {n:"Vizinho sensível → hélice/escavada + alerta trepidação", a:{sondagem:"sim",camada:"profunda",na:"baixo",carga:"media",restr:["vizinho"]},
  ok:r=>/PROFUNDA/.test(r.familia) && has(r.tipos,/hélice contínua/i) && has(r.alertas,/trepida/i)},
 {n:"Intermediária + média → zona cinzenta", a:{sondagem:"sim",camada:"intermediaria",na:"baixo",carga:"media",restr:[]},
  ok:r=>/cinzenta/i.test(r.familia) && r.warn===true && has(r.alertas,/custo da FALHA/i)},
 {n:"Profunda + NA alto → alerta tubulão/água", a:{sondagem:"sim",camada:"profunda",na:"alto",carga:"alta",restr:[]},
  ok:r=>/PROFUNDA/.test(r.familia) && has(r.alertas,/NA alto|água/i)},
 {n:"Divisa em terreno raso → sapata associada/alavancada", a:{sondagem:"sim",camada:"rasa",na:"baixo",carga:"leve",restr:["divisa"]},
  ok:r=>/RASA/.test(r.familia) && has(r.tipos,/associada|alavancada/i)},
 {n:"Acesso restrito (profunda) → raiz/Strauss", a:{sondagem:"sim",camada:"profunda",na:"baixo",carga:"media",restr:["acesso"]},
  ok:r=>has(r.tipos,/raiz|Strauss/i)},
];
let allok=true;
console.log("="+"=".repeat(60));
console.log(" TESTE DO MOTOR DO SELETOR DE FUNDAÇÃO");
console.log("="+"=".repeat(60));
for(const c of casos){
  const r=sb.__run(c.a); const pass=!!r && c.ok(r); allok=allok&&pass;
  console.log(`\n${pass?"✔":"✗"} ${c.n}`);
  console.log(`   família: ${r.familia}`);
  if(r.tipos.length) console.log(`   tipos: ${r.tipos.map(t=>t[0]).join(" | ")}`);
  if(r.alertas.length) console.log(`   alertas: ${r.alertas.length}`);
}
console.log("\n"+"=".repeat(61));
console.log(" RESULTADO:", allok?"TODOS OS TESTES PASSARAM ✔":"HÁ FALHAS ✗");
console.log("=".repeat(61));
process.exit(allok?0:1);
