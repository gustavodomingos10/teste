// Testa o motor de diagnóstico da ferramenta, carregando o JS real do HTML PRO
// num sandbox com DOM simulado, e conferindo hipótese/gravidade em vários casos.
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "02-curso-piloto", "kit", "ferramenta", "ferramenta-fissuras-PRO.html"), "utf8");
const m = html.match(/<script>\s*"use strict";([\s\S]*?)<\/script>/);
if(!m){ console.error("script não encontrado"); process.exit(2); }
let code = m[1];
// Remove a chamada de init que depende de DOM
code = code.replace(/\/\* init \*\/\s*renderStep\(\);\s*$/, "");
// Injeta um hook no MESMO escopo léxico: muta 'ans', captura via renderResultado e chama diagnosticar
code += `
globalThis.__run = function(ansObj){
  for (const k in ans) delete ans[k];
  ans.sinais = [];
  Object.assign(ans, ansObj);
  var cap = null;
  renderResultado = function(hip,grav,estrutural,ativa,passo){ cap = {hip:hip,grav:grav,estrutural:estrutural,ativa:ativa,passo:passo}; };
  diagnosticar();
  return cap;
};`;

// DOM/stubs mínimos
const stubEl = new Proxy({}, { get:(t,p)=>{
  if(p==="style") return {};
  if(p==="classList") return {add(){},remove(){},toggle(){}};
  if(p==="innerHTML") return "";
  return ()=>{};
}, set:()=>true });
const sandbox = {
  document:{ getElementById:()=>stubEl, querySelectorAll:()=>[] },
  window:{}, console,
  encodeURIComponent, String, Math, parseFloat,
};
sandbox.global = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

// Captura do resultado
let captured = null;
sandbox.renderResultado = (hip,grav,estrutural,ativa,passo)=>{ captured = {hip,grav,estrutural,ativa,passo}; };

function run(ansObj){
  return sandbox.__run(ansObj);
}

const casos = [
  { nome:"Canto 45° estável fino", ans:{orient:"diagonal",local:"canto",sinais:[],abertura:0.2,evolucao:"estavel"},
    esperaGrav:"BAIXA", esperaHip:/canto/i, esperaEstrut:false },
  { nome:"Flexão viga ativa", ans:{orient:"vertical",local:"meioviga",sinais:["estrutural"],abertura:0.2,evolucao:"ativa"},
    esperaGrav:"ALTA", esperaHip:/Flex/i, esperaEstrut:true },
  { nome:"Cisalhamento apoio ativo", ans:{orient:"diagonal",local:"apoioviga",sinais:["estrutural"],abertura:0.5,evolucao:"ativa"},
    esperaGrav:"ALTA", esperaHip:/Cisalh/i, esperaEstrut:true },
  { nome:"Recalque não monitorado", ans:{orient:"diagonal",local:"parede",sinais:["esquadria","piso"],abertura:null,evolucao:"naomonit"},
    esperaGrav:"BAIXA", esperaHip:/Recalque/i, esperaEstrut:true },
  { nome:"Umidade base abertura>wk", ans:{orient:"horizontal",local:"base",sinais:["umidade"],abertura:0.4,evolucao:"estavel"},
    esperaGrav:"MEDIA", esperaHip:/Umidade/i, esperaEstrut:false },
  { nome:"Risco imediato força ALTA", ans:{orient:"vertical",local:"meioviga",sinais:["risco"],abertura:0.1,evolucao:"estavel"},
    esperaGrav:"ALTA", esperaHip:/./, esperaEstrut:true },
  { nome:"Craquelê estrutural investiga RAA", ans:{orient:"mapeada",local:"parede",sinais:["estrutural"],abertura:null,evolucao:"naomonit"},
    esperaGrav:"BAIXA", esperaHip:/Retra/i, esperaRAA:/álcali|alcali|RAA/i },
];

let ok=true;
console.log("="+"=".repeat(64));
console.log(" TESTE DO MOTOR DE DIAGNÓSTICO DA FERRAMENTA");
console.log("="+"=".repeat(64));
for(const c of casos){
  const r=run(c.ans);
  const gOk = r.grav===c.esperaGrav;
  const hOk = c.esperaHip.test(r.hip[0][0]);
  const eOk = c.esperaEstrut===undefined || r.estrutural===c.esperaEstrut;
  const raaOk = !c.esperaRAA || r.hip.some(h=>c.esperaRAA.test(h[0]));
  const pass = gOk&&hOk&&eOk&&raaOk; ok=ok&&pass;
  console.log(`\n${pass?"✔":"✗"} ${c.nome}`);
  console.log(`   gravidade: ${r.grav}  (esperado ${c.esperaGrav}) ${gOk?"✓":"✗"}`);
  console.log(`   hipótese[0]: "${r.hip[0][0]}"  ${hOk?"✓":"✗"}`);
  console.log(`   estrutural: ${r.estrutural} ${eOk?"✓":"✗"}${c.esperaRAA?`  RAA listada: ${raaOk?"✓":"✗"}`:""}`);
}
console.log("\n"+"=".repeat(65));
console.log(" RESULTADO:", ok?"TODOS OS TESTES PASSARAM ✔":"HÁ FALHAS ✗");
console.log("=".repeat(65));
process.exit(ok?0:1);
