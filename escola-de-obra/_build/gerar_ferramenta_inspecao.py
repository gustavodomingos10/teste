#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera o Liberador de Concretagem (Kit do Curso 4) em PRO e LITE.
HTML único, offline, mobile-first. Wizard pelos 3 sistemas + embutidos ->
veredito LIBERADO / LIBERADO COM PENDÊNCIAS / TRAVADO. + Quiz de cenários."""
import os
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(BASE, "06-curso-inspecao", "kit", "ferramenta")

TEMPLATE = r"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Liberador de Concretagem — Escola de Obra (__MODE__)</title>
<style>
:root{--verde:#0E3A34;--vesc:#0A2A25;--vmed:#1C5A4E;--creme:#F5EFE0;--creme2:#FBF8F0;--dour:#C9A24B;
--dour2:#E3C97E;--carvao:#20211E;--cinza:#6B6B63;--verd:#2E7D32;--amar:#F9A825;--verm:#C62828;--wpp:#25D366;}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:var(--creme);color:var(--carvao);line-height:1.5;font-size:16px;}
.app{max-width:520px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
header{background:linear-gradient(160deg,var(--verde),var(--vesc));color:var(--creme);padding:16px 18px;position:sticky;top:0;z-index:5;border-bottom:3px solid var(--dour);}
.brand{display:flex;align-items:center;gap:10px;}
.lz{width:34px;height:34px;min-width:34px;background:var(--dour);color:var(--verde);transform:rotate(45deg);display:flex;align-items:center;justify-content:center;font-weight:800;}
.lz span{transform:rotate(-45deg);font-size:.8rem;}
header h1{font-size:1rem;margin:0;font-family:Georgia,serif;color:var(--creme);}
header .tag{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dour2);}
.badge{font-size:.58rem;border:1px solid var(--dour2);color:var(--dour2);padding:2px 7px;border-radius:20px;margin-left:auto;text-transform:uppercase;letter-spacing:.1em;}
main{padding:16px 18px 28px;flex:1;}
.tabs{display:flex;gap:6px;margin-bottom:14px;}
.tab{flex:1;padding:9px;border:none;border-radius:9px;background:#e6dfc9;color:var(--verde);font-weight:700;font-size:.82rem;cursor:pointer;}
.tab.on{background:var(--verde);color:var(--creme);}
.card{background:#fff;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(14,58,52,.08);margin-bottom:14px;}
h2{font-family:Georgia,serif;color:var(--verde);font-size:1.08rem;margin:0 0 4px;}
.step-lbl{font-size:.72rem;color:var(--cinza);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;}
.opts{display:grid;gap:9px;}
.opt{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1.5px solid #ded6c0;border-radius:10px;background:var(--creme2);cursor:pointer;font-size:.9rem;transition:.12s;}
.opt:hover{border-color:var(--dour);}
.opt.sel{border-color:var(--verde);background:rgba(28,90,78,.10);font-weight:600;}
.opt .k{width:22px;height:22px;min-width:22px;border-radius:50%;border:2px solid var(--vmed);display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;color:var(--vmed);}
.opt.sel .k{background:var(--verde);border-color:var(--verde);color:#fff;}
.row{display:flex;gap:10px;margin-top:14px;}
.btn{flex:1;padding:13px;border:none;border-radius:10px;font-weight:700;font-size:.95rem;cursor:pointer;}
.btn-primary{background:var(--verde);color:var(--creme);}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;}
.btn-ghost{background:transparent;color:var(--verde);border:1.5px solid var(--verde);}
.btn-wpp{background:var(--wpp);color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;}
.progress{height:6px;background:#e6dfc9;border-radius:6px;overflow:hidden;margin-bottom:14px;}
.progress > i{display:block;height:100%;background:var(--dour);transition:.25s;}
.result-head{text-align:center;padding:8px 0 4px;}
.ver{display:inline-block;padding:6px 16px;border-radius:20px;font-weight:800;font-size:.98rem;}
.v-LIBERADO{background:rgba(46,125,50,.16);color:var(--verd);}
.v-PENDENCIAS{background:rgba(249,168,37,.18);color:#9C6500;}
.v-TRAVADO{background:rgba(198,40,40,.14);color:var(--verm);}
.mot{margin:6px 0;padding:10px 12px;border-left:4px solid var(--dour);background:var(--creme2);border-radius:0 8px 8px 0;font-size:.88rem;}
.mot b{color:var(--verde);}
.mot.crit{border-left-color:var(--verm);}
.passo{background:var(--verde);color:var(--creme);border-radius:10px;padding:12px 14px;margin-top:10px;}
.passo .t{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--dour2);}
.disc{font-size:.76rem;color:var(--cinza);background:#f4efe0;border:1px dashed var(--cinza);border-radius:8px;padding:10px;margin-top:12px;}
.selo{display:flex;align-items:center;gap:8px;justify-content:center;margin-top:12px;font-size:.72rem;color:var(--cinza);}
.selo .lz{width:26px;height:26px;min-width:26px;}
.foto{background:repeating-linear-gradient(45deg,#e8e1cf,#e8e1cf 12px,#ded6c0 12px,#ded6c0 24px);border:1px dashed var(--cinza);color:var(--cinza);font-size:.74rem;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;min-height:110px;border-radius:10px;margin-bottom:12px;}
.fb{margin-top:10px;padding:11px 13px;border-radius:9px;font-size:.9rem;}
.fb.ok{background:rgba(46,125,50,.12);border-left:4px solid var(--verd);}
.fb.no{background:rgba(198,40,40,.10);border-left:4px solid var(--verm);}
.score{text-align:center;font-family:Georgia,serif;font-size:2.4rem;color:var(--verde);}
.cta{background:linear-gradient(160deg,var(--verde),var(--vesc));color:var(--creme);border-radius:12px;padding:16px;margin-top:14px;text-align:center;}
.cta h3{color:var(--creme);margin:0 0 6px;font-family:Georgia,serif;}
.cta p{color:var(--dour2);font-size:.85rem;margin:0 0 12px;}
.lgpd{font-size:.72rem;color:var(--cinza);display:flex;gap:8px;align-items:flex-start;margin:10px 0;}
.lgpd input{margin-top:2px;accent-color:var(--verde);}
.locked{filter:grayscale(.4) opacity(.5);pointer-events:none;}
footer{background:var(--vesc);color:var(--dour2);text-align:center;font-size:.68rem;padding:12px;}
footer a{color:var(--dour2);}
.hidden{display:none!important;}
</style>
</head>
<body>
<div class="app">
  <header><div class="brand">
    <div class="lz"><span>GD</span></div>
    <div><h1>Liberador de Concretagem</h1><div class="tag">Escola de Obra · Padrão Diamante</div></div>
    <span class="badge">__MODE__</span>
  </div></header>
  <main>
    <div class="tabs">
      <button class="tab on" id="tab-lib" onclick="showView('lib')">✅ Liberador</button>
      <button class="tab" id="tab-quiz" onclick="showView('quiz')">🧠 Quiz de cenários</button>
    </div>
    <section id="view-lib">
      <div class="progress"><i id="bar" style="width:0%"></i></div>
      <div class="card" id="wizard"></div>
      <div class="row" id="nav">
        <button class="btn btn-ghost" id="btnBack" onclick="back()">Voltar</button>
        <button class="btn btn-primary" id="btnNext" onclick="next()" disabled>Avançar</button>
      </div>
    </section>
    <section id="view-quiz" class="hidden"><div class="card" id="quizBox"></div></section>
  </main>
  <footer>
    Ferramenta educativa — apoia a inspeção de liberação (NBR 14931 · 6118 · 15696). Não substitui o
    checklist formal nem o projeto; alterações de armação/escoramento são do projetista/RT.<br>
    Escola de Obra · GD Engenharia e Perícia · <a href="https://engenhariagd.com.br">engenhariagd.com.br</a><br>
    Revisado por Gustavo Domingos — Eng. Civil, CREA-PR 140.964-D
  </footer>
</div>
<script>
"use strict";
const MODE = "__MODE__";
const WA_INSTRUTOR = "5543999259577";

const STEPS = [
  { key:"forma", titulo:"FÔRMA — geometria, prumo, travamento, estanqueidade, limpeza", ops:[
    ["ok","Tudo conforme o projeto"],
    ["pend","Pendências corrigíveis hoje (fresta a vedar, limpeza…)"],
    ["nc","NC grave: geometria/prumo fora, travamento deficiente"] ]},
  { key:"armacao", titulo:"ARMAÇÃO — bitolas, quantidade, posição (negativos!), estribos", ops:[
    ["ok","Conferida contra o projeto — bateu"],
    ["pend","Pendências corrigíveis (amarração, caranguejos a completar)"],
    ["nc","Divergência de bitola/quantidade sem resposta do projetista"] ]},
  { key:"cobrimento", titulo:"COBRIMENTO — espaçadores (fundo e faces)", ops:[
    ["ok","Espaçadores adequados, sem pontos de toque"],
    ["pend","Faltam espaçadores em trechos — dá pra completar hoje"],
    ["nc","Armadura tocando a fôrma / sem espaçadores no conjunto"] ]},
  { key:"escoramento", titulo:"ESCORAMENTO — apoio, prumo, contraventamento (NBR 15696)", ops:[
    ["ok","Conforme o plano: apoios firmes, prumo, diagonais nas 2 direções"],
    ["pend","Ajustes pontuais (cunha frouxa, calço a trocar) — hoje"],
    ["nc","Sem contraventamento / apoios cedendo / fora do plano"] ]},
  { key:"embutidos", titulo:"EMBUTIDOS — elétrica, hidráulica, esperas (com as equipes)", ops:[
    ["ok","Conferidos com as equipes, fixados e vedados"],
    ["pend","Itens a fixar/vedar — corrigível hoje"],
    ["nao","Não conferidos com as equipes ainda"] ]},
  { key:"prazo", titulo:"Quando é a concretagem?", ops:[
    ["folga","Amanhã ou depois — há tempo para correções e reconferência"],
    ["hoje","É hoje / horas — tempo mínimo"] ]},
];
const ans = {};
let cur = 0;

function showView(v){
  document.getElementById("view-lib").classList.toggle("hidden", v!=="lib");
  document.getElementById("view-quiz").classList.toggle("hidden", v!=="quiz");
  document.getElementById("tab-lib").classList.toggle("on", v==="lib");
  document.getElementById("tab-quiz").classList.toggle("on", v==="quiz");
  if(v==="quiz") renderQuiz();
}
function renderStep(){
  const s = STEPS[cur];
  document.getElementById("bar").style.width = (cur/STEPS.length)*100 + "%";
  let html = `<div class="step-lbl">Passo ${cur+1} de ${STEPS.length}</div><h2>${s.titulo}</h2><div class="opts">` +
    s.ops.map((o,i)=>{
      const sel = ans[s.key]===o[0]?"sel":"";
      return `<div class="opt ${sel}" onclick="pick('${s.key}','${o[0]}')"><span class="k">${String.fromCharCode(65+i)}</span>${o[1]}</div>`;
    }).join("") + `</div>`;
  document.getElementById("wizard").innerHTML = html;
  document.getElementById("btnBack").style.visibility = cur===0?"hidden":"visible";
  const nb = document.getElementById("btnNext");
  nb.textContent = cur===STEPS.length-1 ? "Ver veredito" : "Avançar";
  nb.disabled = !ans[s.key];
}
function pick(k,v){ ans[k]=v; renderStep(); }
function back(){ if(cur>0){cur--;renderStep();} }
function next(){ if(cur<STEPS.length-1){cur++;renderStep();} else decidir(); }

/* ---------- Motor do veredito ---------- */
const NOMES = {forma:"Fôrma", armacao:"Armação", cobrimento:"Cobrimento", escoramento:"Escoramento", embutidos:"Embutidos"};
function decidir(){
  const sis = ["forma","armacao","cobrimento","escoramento","embutidos"];
  let criticos=[], pendencias=[], veredito, passo;
  for(const k of sis){
    const v = ans[k];
    if(v==="nc") criticos.push(k);
    else if(v==="pend" || v==="nao") pendencias.push(k);
  }
  if(criticos.length){
    veredito="TRAVADO";
    passo={t:"Como travar sem guerra", d:"Comunique com FATO (não adjetivo), traga a solução e o novo cronograma, escale por escrito ao responsável, remarque o caminhão e registre tudo (fotos + motivo). NC estrutural não se 'observa durante' — se corrige antes."};
  } else if(pendencias.length){
    if(ans.prazo==="hoje" && pendencias.length>=2){
      veredito="TRAVADO";
      passo={t:"Pendências demais para o tempo disponível", d:"Com a concretagem em horas e múltiplas pendências, não há janela de correção + reconferência. Reprograme: corrigir hoje, reconferir e concretar na próxima janela."};
      criticos=[]; // trava por prazo
    } else {
      veredito="PENDENCIAS";
      passo={t:"Liberado com pendências — as regras", d:"Cada pendência LISTADA, com responsável, prazo (antes do caminhão) e RECONFERÊNCIA marcada. Pendência sem prazo e sem reconferência é liberação disfarçada. Reconfirme os itens 15 min antes do caminhão."};
    }
  } else {
    veredito="LIBERADO";
    passo={t:"Antes de assinar", d:"Preencha o Termo de Liberação (sistemas + assinaturas das equipes de embutidos), fotografe o conjunto e arquive no dossiê. Reconfira em 10 minutos no dia — fôrma aprovada ontem é aprovada ONTEM."};
  }
  renderResultado(veredito,criticos,pendencias,passo);
}

function renderResultado(veredito,criticos,pendencias,passo){
  document.getElementById("bar").style.width="100%";
  document.getElementById("nav").classList.add("hidden");
  const lbl = veredito==="PENDENCIAS" ? "LIBERADO COM PENDÊNCIAS" : veredito;
  const share = encodeURIComponent(`Liberador de Concretagem (Escola de Obra): veredito = ${lbl}. Inspecao NBR 14931/6118/15696.`);
  let html = `<div class="result-head"><div class="step-lbl">Veredito da liberação</div>
    <span class="ver v-${veredito}">${lbl}</span></div>`;
  if(criticos.length){
    html += `<div class="step-lbl" style="margin-top:12px">NCs críticas (travam a concretagem)</div>`;
    criticos.forEach(k=> html += `<div class="mot crit"><b>${NOMES[k]}</b> — não conformidade grave: corrigir e reinspecionar antes de qualquer concreto.</div>`);
  }
  if(pendencias.length){
    html += `<div class="step-lbl" style="margin-top:12px">Pendências (listar com prazo + reconferência)</div>`;
    pendencias.forEach(k=> html += `<div class="mot"><b>${NOMES[k]}</b> — ${ans[k]==="nao"?"conferir com as equipes responsáveis (minuto das equipes, com assinatura)":"corrigir hoje e reconferir antes do caminhão"}.</div>`);
  }
  if(!criticos.length && !pendencias.length){
    html += `<div class="mot"><b>3 sistemas + embutidos conformes.</b> Fôrma, armação (com cobrimento garantido por espaçadores), escoramento e embutidos conferidos contra o projeto.</div>`;
  }
  html += `<div class="passo"><div class="t">${passo.t}</div><div>${passo.d}</div></div>`;
  html += `<div class="disc"><b>Aviso técnico:</b> apoio educativo à inspeção de liberação (NBR 14931 · 6118 · 15696).
    Não substitui o checklist formal, o projeto nem o responsável técnico. Alterações de armação/fôrma/escoramento
    são alçada do projetista. Tolerâncias e cobrimentos: valores do projeto/norma vigente (VALIDAR.md).</div>`;
  html += `<div class="row"><a class="btn btn-wpp" href="https://wa.me/?text=${share}" target="_blank" rel="noopener">📲 Compartilhar</a></div>`;
  html += `<div class="row"><button class="btn btn-ghost" onclick="restart()">↺ Nova inspeção</button></div>`;
  if(MODE==="LITE") html += liteCTA();
  else html += `<div class="row"><a class="btn btn-primary" style="text-decoration:none;text-align:center" href="https://wa.me/${WA_INSTRUTOR}?text=${encodeURIComponent('Ola! Sou aluno da Escola de Obra e quero discutir uma liberacao de concretagem.')}" target="_blank" rel="noopener">Falar com a Escola de Obra (Grupo VIP)</a></div>`;
  html += `<div class="selo"><div class="lz"><span>GD</span></div> Padrão Diamante — o rigor de quem assina</div>`;
  document.getElementById("wizard").innerHTML = html;
}
function restart(){ cur=0; for(const k in ans) delete ans[k]; document.getElementById("nav").classList.remove("hidden"); renderStep(); }
function liteCTA(){
  return `<div class="cta"><h3>Quer o método completo?</h3>
    <p>Esta é a versão pública. No curso <b>Inspeção de Serviços Críticos</b> você recebe o liberador PRO,
    o Checklist Mestre, a planilha de inspeção e o Termo de Liberação blindado.</p>
    <label class="lgpd"><input type="checkbox" onchange="this.closest('.cta').querySelector('#leadBtn').classList.toggle('locked',!this.checked)">
      Autorizo o contato pela Escola de Obra pelo WhatsApp sobre o curso. Nenhum dado é coletado ou armazenado por esta página; o contato só ocorre se eu clicar no botão (LGPD).</label>
    <a id="leadBtn" class="btn btn-wpp locked" href="https://wa.me/${WA_INSTRUTOR}?text=${encodeURIComponent('Ola! Usei o liberador gratuito de concretagem e quero saber do curso.')}" target="_blank" rel="noopener">Quero conhecer o curso</a></div>`;
}

/* ---------- Quiz de cenários ---------- */
const CENARIOS = [
  {foto:"Negativos da laje afundando quando alguém pisa; sem caranguejos",
   q:"Qual o risco?",
   ops:["Nenhum, é normal","Armadura negativa perde a posição/braço de alavanca → fissura sobre apoios","Só estética","Melhora o concreto"],c:1,
   exp:"O negativo só trabalha em cima. Exige caranguejos + passarelas para o tráfego da concretagem (NBR 14931)."},
  {foto:"Armadura da viga encostada no fundo da fôrma, sem espaçador",
   q:"Consequência a longo prazo?",
   ops:["Nenhuma","Cobrimento zero → carbonatação/corrosão da armadura no futuro","Concreto mais forte","Economia"],c:1,
   exp:"Cobrimento é proteção química (NBR 6118, Tab. 7.2). Espaçador é o seguro mais barato contra patologia."},
  {foto:"Escoramento sem diagonais de contraventamento nas duas direções",
   q:"Veredito da inspeção?",
   ops:["Liberar, diagonais são opcionais","Travar: NC estrutural — contraventar antes de concretar (NBR 15696)","Liberar com pendência para depois","Observar durante a concretagem"],c:1,
   exp:"Sem contraventamento o conjunto é instável. NC estrutural não se 'observa durante' — corrige antes."},
  {foto:"Fresta no fundo da viga que passa luz",
   q:"O que ela indica?",
   ops:["Nada","Por onde passa luz, passa nata → ninho de concretagem; vedar antes","Ventilação boa","Design moderno"],c:1,
   exp:"Fuga de nata deixa pedra sem pasta (ninho). Teste da luz + vedação na véspera (NBR 14931)."},
  {foto:"Barra Ø10 instalada onde o projeto pede Ø12,5; armador sugere 'compensar com mais uma'",
   q:"Conduta correta?",
   ops:["Aceitar a compensação do armador","Comunicar o projetista por escrito e corrigir conforme ele — alteração é alçada dele","Ignorar, é quase igual","Resolver depois da concretagem"],c:1,
   exp:"Alterar armação é do projetista. 'Compensações' de canteiro não substituem o detalhamento."},
  {foto:"Faltam ~20 espaçadores num bordo; concretagem amanhã 9h",
   q:"Veredito adequado?",
   ops:["Travar tudo","Liberado com pendência: completar hoje + reconferência 7h30 registrada","Liberar sem condição","Concretar só o resto"],c:1,
   exp:"Pendência corrigível + prazo + reconferência = liberação com pendências legítima. Sem prazo/reconferência, é liberação disfarçada."},
  {foto:"Escora apoiada em bloco cerâmico deitado, no meio do vão",
   q:"O que fazer?",
   ops:["Nada, sempre foi assim","NC: apoio improvisado cede — trocar por base firme antes da carga","Pintar o bloco","Adicionar outro bloco"],c:1,
   exp:"Apoio de escora exige base firme e distribuição (NBR 15696). Bloco cerâmico esmaga/cede sob carga."},
  {foto:"Concretagem em 2 horas; fôrma com pendências e embutidos não conferidos",
   q:"Melhor decisão?",
   ops:["Liberar e torcer","Reprogramar: sem janela para corrigir + reconferir, não há liberação segura","Conferir durante a descarga","Deixar o mestre decidir"],c:1,
   exp:"Sem tempo de correção + reconferência não existe 'liberado com pendências'. Reprogramar custa horas; o erro coberto custa décadas."}
];
const N_LITE = 3;
let qi=0,qscore=0,qansw=false;
function quizPool(){ return MODE==="LITE" ? CENARIOS.slice(0,N_LITE) : CENARIOS; }
function renderQuiz(){
  const pool=quizPool();
  if(qi>=pool.length) return renderQuizEnd(pool.length);
  const c=pool[qi]; qansw=false;
  let html=`<div class="step-lbl">Cenário ${qi+1} de ${pool.length} · pontuação ${qscore}</div>
    <div class="foto">[CASO: ${c.foto}]</div><h2 style="font-size:1rem">${c.q}</h2><div class="opts" id="qops">`;
  c.ops.forEach((o,i)=> html+=`<div class="opt" onclick="answer(${i})"><span class="k">${String.fromCharCode(65+i)}</span>${o}</div>`);
  html+=`</div><div id="qfb"></div><div class="row hidden" id="qnav"><button class="btn btn-primary" onclick="nextQ()">${qi===pool.length-1?"Ver resultado":"Próximo"}</button></div>`;
  document.getElementById("quizBox").innerHTML=html;
}
function answer(i){
  if(qansw) return; qansw=true;
  const c=quizPool()[qi];
  document.querySelectorAll("#qops .opt").forEach((el,idx)=>{ el.style.pointerEvents="none"; if(idx===c.c) el.classList.add("sel"); });
  const ok=i===c.c; if(ok) qscore++;
  document.getElementById("qfb").innerHTML=`<div class="fb ${ok?'ok':'no'}"><b>${ok?'✔ Correto!':'✗ Reveja.'}</b><br>${c.exp}</div>`;
  document.getElementById("qnav").classList.remove("hidden");
}
function nextQ(){ qi++; renderQuiz(); }
function renderQuizEnd(total){
  const share=encodeURIComponent(`Fiz ${qscore}/${total} no Quiz de Inspeção da Escola de Obra!`);
  let html=`<div class="result-head"><div class="step-lbl">Resultado</div><div class="score">${qscore}/${total}</div>
    <p style="color:var(--cinza);font-size:.9rem">${qscore===total?"Olho de inspetor! 👏":qscore>=Math.ceil(total*0.7)?"Muito bom.":"Reveja o Módulo de Ouro."}</p></div>
    <div class="row"><a class="btn btn-wpp" href="https://wa.me/?text=${share}" target="_blank" rel="noopener">📲 Compartilhar</a>
    <button class="btn btn-ghost" onclick="qi=0;qscore=0;renderQuiz()">↺ Refazer</button></div>`;
  if(MODE==="LITE") html+=`<div class="cta"><h3>Estes são 3 de 8 cenários</h3><p>A versão PRO traz todos os cenários, o liberador completo e o Kit do curso.</p>
    <a class="btn btn-wpp" href="https://wa.me/${WA_INSTRUTOR}?text=${encodeURIComponent('Ola! Fiz o quiz gratuito de inspecao e quero o curso completo.')}" target="_blank" rel="noopener">Quero o curso completo</a></div>`;
  html+=`<div class="selo"><div class="lz"><span>GD</span></div> Padrão Diamante — o rigor de quem assina</div>`;
  document.getElementById("quizBox").innerHTML=html;
}
renderStep();
</script>
</body>
</html>
"""
for mode in ("PRO", "LITE"):
    html = TEMPLATE.replace("__MODE__", mode)
    path = os.path.join(OUT_DIR, f"liberador-concretagem-{mode}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"LIBERADOR {mode}: {path} ({len(html)} bytes)")
