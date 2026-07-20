#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera o Seletor Interativo de Fundação (Kit do Curso 2) em PRO e LITE.
HTML único, CSS+JS embutidos, mobile-first, offline, sem requisições externas.
Wizard: sondagem/camada/NA/carga/restrições -> família recomendada + tipos candidatos + próximo passo.
A escolha e o dimensionamento finais são SEMPRE do projetista de fundações (NBR 6122:2019)."""
import os
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(BASE, "04-curso-fundacoes", "kit", "ferramenta")

TEMPLATE = r"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Seletor de Fundação — Escola de Obra (__MODE__)</title>
<style>
:root{--verde:#0E3A34;--vesc:#0A2A25;--vmed:#1C5A4E;--creme:#F5EFE0;--creme2:#FBF8F0;--dour:#C9A24B;
--dour2:#E3C97E;--carvao:#20211E;--cinza:#6B6B63;--verd:#2E7D32;--amar:#F9A825;--verm:#C62828;--wpp:#25D366;}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:var(--creme);color:var(--carvao);line-height:1.5;font-size:16px;}
.app{max-width:520px;margin:0 auto;min-height:100vh;background:var(--creme);display:flex;flex-direction:column;}
header{background:linear-gradient(160deg,var(--verde),var(--vesc));color:var(--creme);padding:16px 18px;position:sticky;top:0;z-index:5;border-bottom:3px solid var(--dour);}
.brand{display:flex;align-items:center;gap:10px;}
.lz{width:34px;height:34px;min-width:34px;background:var(--dour);color:var(--verde);transform:rotate(45deg);display:flex;align-items:center;justify-content:center;font-weight:800;}
.lz span{transform:rotate(-45deg);font-size:.8rem;}
header h1{font-size:1.05rem;margin:0;font-family:Georgia,serif;color:var(--creme);}
header .tag{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dour2);}
.badge{font-size:.58rem;border:1px solid var(--dour2);color:var(--dour2);padding:2px 7px;border-radius:20px;margin-left:auto;text-transform:uppercase;letter-spacing:.1em;}
main{padding:16px 18px 28px;flex:1;}
.tabs{display:flex;gap:6px;margin-bottom:14px;}
.tab{flex:1;padding:9px;border:none;border-radius:9px;background:#e6dfc9;color:var(--verde);font-weight:700;font-size:.82rem;cursor:pointer;}
.tab.on{background:var(--verde);color:var(--creme);}
.card{background:#fff;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(14,58,52,.08);margin-bottom:14px;}
h2{font-family:Georgia,serif;color:var(--verde);font-size:1.12rem;margin:0 0 4px;}
.step-lbl{font-size:.72rem;color:var(--cinza);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;}
.opts{display:grid;gap:9px;}
.opt{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1.5px solid #ded6c0;border-radius:10px;background:var(--creme2);cursor:pointer;font-size:.93rem;transition:.12s;}
.opt:hover{border-color:var(--dour);}
.opt.sel{border-color:var(--verde);background:rgba(28,90,78,.10);font-weight:600;}
.opt .k{width:22px;height:22px;min-width:22px;border-radius:50%;border:2px solid var(--vmed);display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;color:var(--vmed);}
.opt.sel .k{background:var(--verde);border-color:var(--verde);color:#fff;}
.chk{display:flex;align-items:center;gap:9px;padding:10px 12px;border:1.5px solid #ded6c0;border-radius:10px;background:var(--creme2);cursor:pointer;font-size:.9rem;margin-bottom:8px;}
.chk input{width:18px;height:18px;accent-color:var(--verde);}
.chk.sel{border-color:var(--verde);background:rgba(28,90,78,.08);}
.row{display:flex;gap:10px;margin-top:14px;}
.btn{flex:1;padding:13px;border:none;border-radius:10px;font-weight:700;font-size:.95rem;cursor:pointer;}
.btn-primary{background:var(--verde);color:var(--creme);}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;}
.btn-ghost{background:transparent;color:var(--verde);border:1.5px solid var(--verde);}
.btn-wpp{background:var(--wpp);color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;}
.progress{height:6px;background:#e6dfc9;border-radius:6px;overflow:hidden;margin-bottom:14px;}
.progress > i{display:block;height:100%;background:var(--dour);transition:.25s;}
.result-head{text-align:center;padding:8px 0 4px;}
.fam{display:inline-block;padding:6px 16px;border-radius:20px;font-weight:800;font-size:1rem;letter-spacing:.02em;background:rgba(28,90,78,.12);color:var(--verde);}
.fam.warn{background:rgba(249,168,37,.18);color:#9C6500;}
.tipo{margin:6px 0;padding:10px 12px;border-left:4px solid var(--dour);background:var(--creme2);border-radius:0 8px 8px 0;}
.tipo b{color:var(--verde);}
.alerta{margin:6px 0;padding:9px 12px;border-left:4px solid var(--amar);background:rgba(249,168,37,.12);border-radius:0 8px 8px 0;font-size:.86rem;color:#7a5b00;}
.passo{background:var(--verde);color:var(--creme);border-radius:10px;padding:12px 14px;margin-top:10px;}
.passo .t{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--dour2);}
.disc{font-size:.76rem;color:var(--cinza);background:#f4efe0;border:1px dashed var(--cinza);border-radius:8px;padding:10px;margin-top:12px;}
.selo{display:flex;align-items:center;gap:8px;justify-content:center;margin-top:12px;font-size:.72rem;color:var(--cinza);}
.selo .lz{width:26px;height:26px;min-width:26px;}
.foto{background:repeating-linear-gradient(45deg,#e8e1cf,#e8e1cf 12px,#ded6c0 12px,#ded6c0 24px);border:1px dashed var(--cinza);color:var(--cinza);font-size:.74rem;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;min-height:120px;border-radius:10px;margin-bottom:12px;}
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
  <header>
    <div class="brand">
      <div class="lz"><span>GD</span></div>
      <div><h1>Seletor de Fundação</h1><div class="tag">Escola de Obra · Padrão Diamante</div></div>
      <span class="badge">__MODE__</span>
    </div>
  </header>
  <main>
    <div class="tabs">
      <button class="tab on" id="tab-sel" onclick="showView('sel')">🧭 Seletor</button>
      <button class="tab" id="tab-quiz" onclick="showView('quiz')">🧠 Quiz de cenários</button>
    </div>
    <section id="view-sel">
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
    Ferramenta educativa — sugestão de triagem, NÃO substitui o projeto de fundações. A escolha e o
    dimensionamento finais são do projetista de fundações/geotécnico (NBR 6122:2019).<br>
    Escola de Obra · GD Engenharia e Perícia · <a href="https://engenhariagd.com.br">engenhariagd.com.br</a><br>
    Revisado por Gustavo Domingos — Eng. Civil, CREA-PR 140.964-D
  </footer>
</div>
<script>
"use strict";
const MODE = "__MODE__";
const WA_INSTRUTOR = "5543999259577";

const STEPS = [
  { key:"sondagem", titulo:"Existe sondagem (SPT) do terreno?", tipo:"radio", ops:[
    ["sim","Sim, tenho o boletim de sondagem"],
    ["nao","Não / não sei"] ]},
  { key:"camada", titulo:"A que profundidade está a camada resistente (onde o N-SPT fica alto)?", tipo:"radio", ops:[
    ["rasa","Rasa — firme logo abaixo (até ~3 m)"],
    ["intermediaria","Intermediária (~3 a 8 m)"],
    ["profunda","Profunda — firme só depois de ~8 m, ou topo muito mole"],
    ["naosei","Não sei"] ]},
  { key:"na", titulo:"Nível d'água (NA)", tipo:"radio", ops:[
    ["baixo","Ausente ou profundo"],
    ["alto","Alto / próximo da superfície"],
    ["naosei","Não sei"] ]},
  { key:"carga", titulo:"Ordem de carga da obra", tipo:"radio", ops:[
    ["leve","Leve (casa térrea / sobrado)"],
    ["media","Média (poucos pavimentos)"],
    ["alta","Alta (edifício / cargas concentradas)"] ]},
  { key:"restr", titulo:"Restrições da obra (marque as que existem)", tipo:"check", ops:[
    ["vizinho","Vizinhança sensível / risco de trepidação"],
    ["acesso","Acesso restrito para equipamento grande"],
    ["divisa","Pilares na divisa ou muito próximos"],
    ["prazo","Prazo/custo apertado (desempate final)"] ]},
];
const ans = { restr:[] };
let cur = 0;

function showView(v){
  document.getElementById("view-sel").classList.toggle("hidden", v!=="sel");
  document.getElementById("view-quiz").classList.toggle("hidden", v!=="quiz");
  document.getElementById("tab-sel").classList.toggle("on", v==="sel");
  document.getElementById("tab-quiz").classList.toggle("on", v==="quiz");
  if(v==="quiz") renderQuiz();
}
function renderStep(){
  const s = STEPS[cur];
  document.getElementById("bar").style.width = (cur/STEPS.length)*100 + "%";
  let html = `<div class="step-lbl">Passo ${cur+1} de ${STEPS.length}</div><h2>${s.titulo}</h2>`;
  if(s.tipo==="radio"){
    html += `<div class="opts">` + s.ops.map((o,i)=>{
      const sel = ans[s.key]===o[0]?"sel":"";
      return `<div class="opt ${sel}" onclick="pick('${s.key}','${o[0]}')"><span class="k">${String.fromCharCode(65+i)}</span>${o[1]}</div>`;
    }).join("") + `</div>`;
  } else {
    html += s.ops.map(o=>{
      const sel = ans.restr.includes(o[0])?"sel":"";
      return `<label class="chk ${sel}"><input type="checkbox" ${sel?"checked":""} onchange="toggleR('${o[0]}')">${o[1]}</label>`;
    }).join("");
  }
  document.getElementById("wizard").innerHTML = html;
  document.getElementById("btnBack").style.visibility = cur===0?"hidden":"visible";
  const nb = document.getElementById("btnNext");
  nb.textContent = cur===STEPS.length-1 ? "Ver recomendação" : "Avançar";
  nb.disabled = !stepValid();
}
function stepValid(){ const s=STEPS[cur]; return s.tipo==="check" ? true : !!ans[s.key]; }
function pick(k,v){ ans[k]=v; renderStep(); }
function toggleR(v){ const i=ans.restr.indexOf(v); if(i>=0)ans.restr.splice(i,1); else ans.restr.push(v); renderStep(); }
function back(){ if(cur>0){cur--;renderStep();} }
function next(){ if(cur<STEPS.length-1){cur++;renderStep();} else recomendar(); }

/* ---------- Motor de recomendação (espelha a árvore de decisão do curso) ---------- */
function recomendar(){
  const {sondagem,camada,na,carga,restr=[]} = ans;
  const has = k => restr.includes(k);
  let alertas=[], tipos=[], familia, passo, exigir=false, warn=false;

  if(sondagem==="nao" || camada==="naosei"){
    exigir=true; warn=true;
    familia="Indefinida — falta o mapa do solo";
    passo={t:"Primeiro passo obrigatório", d:"Exigir a sondagem de simples reconhecimento (SPT, NBR 6484:2020) antes de definir a fundação. Sem ela, qualquer escolha é aposta — e o risco não é seu para assumir."};
    return render({familia,tipos:[],alertas:["Sem sondagem não há decisão técnica de fundação (NBR 6484:2020)."],passo,exigir,warn});
  }
  if(camada==="rasa" && carga!=="alta"){ familia="Fundação RASA (superficial)"; }
  else if(camada==="profunda" || carga==="alta"){ familia="Fundação PROFUNDA"; }
  else { familia="Zona cinzenta — rasa ou profunda (decisão do projetista)"; warn=true; }

  if(familia.indexOf("RASA")>=0){
    if(carga==="leve") tipos.push(["Sapata isolada / bloco de fundação","cargas de pilar sobre terreno firme raso"]);
    if(has("divisa")) tipos.push(["Sapata associada ou alavancada (viga de equilíbrio)","pilares na divisa ou muito próximos"]);
    tipos.push(["Sapata corrida","cargas de parede / alinhadas"]);
    tipos.push(["Radier","carga distribuída ou solo raso uniforme de menor resistência"]);
  } else if(familia.indexOf("PROFUNDA")>=0){
    if(has("vizinho")){
      tipos.push(["Estaca hélice contínua","sem trepidação — vizinhança sensível"]);
      tipos.push(["Estaca escavada","execução sem impacto"]);
      alertas.push("Vizinhança sensível: evitar cravação com trepidação (pré-moldada cravada, Franki).");
    } else {
      tipos.push(["Estaca pré-moldada (cravada)","cravação com controle, sem restrição de trepidação"]);
      tipos.push(["Estaca hélice contínua","boa produtividade, sem bate-estaca"]);
    }
    if(has("acesso")){ tipos.push(["Estaca raiz / Strauss","acesso restrito, equipamento menor"]); }
    if(na==="alto"){ alertas.push("NA alto: cautela com tubulão a céu aberto; avaliar métodos que lidem com água."); }
    else { tipos.push(["Tubulão a céu aberto","cargas altas, sem NA elevado — a avaliar"]); }
    if(carga==="alta") alertas.push("Carga alta: capacidade e comprimento das estacas dependem de dimensionamento do projetista.");
  } else {
    tipos.push(["Depende da carga e do custo do erro","levar o quadro ao projetista para a decisão final"]);
    alertas.push("Zona cinzenta: o critério de desempate é o custo da FALHA, não o da execução.");
  }
  if(na==="naosei") alertas.push("Nível d'água não informado: confirme na sondagem — ele filtra os tipos.");
  if(has("prazo")) alertas.push("Prazo/custo desempatam por ÚLTIMO, só entre as opções tecnicamente viáveis.");

  passo={t:"Próximo passo", d:"Leve a família e os tipos candidatos ao projetista de fundações para definição e dimensionamento (NBR 6122:2019). Registre solo (sondagem), cargas e restrições no parecer do Kit."};
  render({familia,tipos,alertas,passo,exigir,warn});
}

function render(r){ renderResultado(r.familia, r.tipos, r.alertas, r.passo, r.exigir, r.warn); }

function renderResultado(familia,tipos,alertas,passo,exigir,warn){
  document.getElementById("bar").style.width="100%";
  document.getElementById("nav").classList.add("hidden");
  const shareTxt = encodeURIComponent(`Seletor de Fundacao (Escola de Obra): familia recomendada = ${familia}. Decisao final do projetista de fundacoes (NBR 6122:2019).`);
  let html = `<div class="result-head"><div class="step-lbl">Recomendação de triagem</div>
    <span class="fam ${warn?'warn':''}">${familia}</span></div>`;
  if(tipos.length){
    html += `<div class="step-lbl" style="margin-top:12px">Tipos candidatos (a validar com o projetista)</div>`;
    tipos.forEach(t=> html += `<div class="tipo"><b>${t[0]}</b><br><span style="font-size:.86rem">${t[1]}</span></div>`);
  }
  alertas.forEach(a=> html += `<div class="alerta">⚠ ${a}</div>`);
  html += `<div class="passo"><div class="t">${passo.t}</div><div>${passo.d}</div></div>`;
  html += `<div class="disc"><b>Aviso técnico:</b> esta é uma <b>triagem educativa</b> por regras simplificadas, com calibragem conservadora — sem sondagem (SPT), a triagem não decide. NÃO substitui o
    projeto de fundações. A escolha, o dimensionamento e a assinatura são do <b>projetista de fundações/geotécnico</b> (NBR 6122:2019).
    Faixas e critérios são convenção do curso — ver VALIDAR.md.</div>`;
  html += `<div class="row"><a class="btn btn-wpp" href="https://wa.me/?text=${shareTxt}" target="_blank" rel="noopener">📲 Compartilhar</a></div>`;
  html += `<div class="row"><button class="btn btn-ghost" onclick="restart()">↺ Nova análise</button></div>`;
  if(MODE==="LITE") html += liteCTA(); else html += `<div class="row"><div style="font-size:13px;line-height:1.5;padding:12px;border:1px solid rgba(201,162,75,.45);border-radius:8px;text-align:left">📓 <b>Registre esta escolha no seu caderno de campo</b>: dados do solo, hipótese de fundação e justificativa. Depois, confira sua leitura com o gabarito comentado do módulo.</div></div>`;
  html += `<div class="selo"><div class="lz"><span>GD</span></div> Padrão Diamante — o rigor de quem assina</div>`;
  document.getElementById("wizard").innerHTML = html;
}
function restart(){ cur=0; for(const k in ans) delete ans[k]; ans.restr=[]; document.getElementById("nav").classList.remove("hidden"); renderStep(); }
function liteCTA(){
  return `<div class="cta"><h3>Quer o método completo?</h3>
    <p>Esta é a versão pública. No curso <b>Tipos de Fundações e Quando Usar Cada Uma</b> você recebe o seletor PRO,
    a planilha comparadora, o checklist de liberação e o parecer blindado.</p>
    <label class="lgpd"><input type="checkbox" onchange="this.closest('.cta').querySelector('#leadBtn').classList.toggle('locked',!this.checked)">
      Autorizo o contato pela Escola de Obra pelo WhatsApp sobre o curso. Nenhum dado é coletado ou armazenado por esta página; o contato só ocorre se eu clicar no botão (LGPD).</label>
    <a id="leadBtn" class="btn btn-wpp locked" href="https://wa.me/${WA_INSTRUTOR}?text=${encodeURIComponent('Ola! Usei o seletor gratuito de fundacoes e quero saber do curso.')}" target="_blank" rel="noopener">Quero conhecer o curso</a>
  </div>`;
}

/* ---------- Quiz de cenários ---------- */
const CENARIOS = [
  {foto:"Sondagem: solo firme (N-SPT alto) a 1,5 m; carga de sobrado; sem NA; terreno amplo",
   q:"Família mais provável?",
   ops:["Profunda (estacas)","Rasa (sapata/bloco)","Só tubulão","Indefinida"],c:1,
   exp:"Camada resistente rasa + carga leve/média = fundação rasa. Sapata/bloco apoiam direto na camada boa próxima."},
  {foto:"Sondagem: 9 m de argila mole antes de firmar; edifício",
   q:"Família mais provável?",
   ops:["Rasa (sapata)","Radier apenas","Profunda (estacas/tubulão)","Nenhuma fundação"],c:2,
   exp:"Camada boa funda + carga alta = fundação profunda, levando a carga até a camada resistente por ponta/atrito."},
  {foto:"Obra urbana, vizinho colado e sensível; fundação profunda necessária",
   q:"Tipo mais adequado à restrição de trepidação?",
   ops:["Estaca pré-moldada cravada","Estaca Franki","Estaca hélice contínua / escavada","Bate-estaca a diesel"],c:2,
   exp:"Vizinhança sensível pede execução sem trepidação: hélice contínua ou escavada. Evitar cravação com impacto."},
  {foto:"Não há boletim de sondagem no início da obra",
   q:"Primeira providência antes de escolher a fundação?",
   ops:["Escolher sapata por ser mais barata","Exigir sondagem SPT (NBR 6484:2020)","Cravar estaca de teste no olho","Copiar a obra vizinha"],c:1,
   exp:"Sem sondagem não há decisão técnica. A primeira providência é exigir a sondagem de simples reconhecimento (NBR 6484:2020)."},
  {foto:"Pilares na divisa do terreno, cargas próximas, solo firme raso",
   q:"Solução de fundação rasa mais indicada?",
   ops:["Radier geral","Sapata associada / alavancada (viga de equilíbrio)","Tubulão","Estaca raiz"],c:1,
   exp:"Pilar na divisa/próximos em terreno firme raso: sapata associada ou alavancada com viga de equilíbrio resolve dentro da família rasa."},
  {foto:"Escolha entre dois tipos de estaca tecnicamente viáveis",
   q:"O que deve desempatar por último?",
   ops:["Custo e prazo","A cor do equipamento","O que o pedreiro prefere","Nada, escolher aleatório"],c:0,
   exp:"A técnica filtra o que é viável; custo e prazo desempatam por último, só entre as opções que aguentam carga/solo/água."},
  {foto:"Terreno com nível d'água alto; fundação profunda",
   q:"Qual alerta é pertinente?",
   ops:["Nenhum, água não importa","Cautela com tubulão a céu aberto; avaliar métodos que lidem com água","Usar sempre Strauss","Ignorar a sondagem"],c:1,
   exp:"NA alto dificulta escavação a céu aberto (tubulão) e filtra os tipos. É alerta obrigatório na triagem."},
  {foto:"Zona cinzenta: camada firme intermediária (~5 m), carga média",
   q:"Melhor conduta do júnior?",
   ops:["Cravar que é sapata","Cravar que é estaca","Levar o quadro ao projetista; desempate pelo custo da falha","Não fazer nada"],c:2,
   exp:"Na zona cinzenta, o júnior leva o quadro (solo/carga/restrições) ao projetista; o critério de desempate é o custo da falha, não o da execução."}
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
  const shareTxt=encodeURIComponent(`Fiz ${qscore}/${total} no Quiz de Escolha de Fundacao da Escola de Obra!`);
  let html=`<div class="result-head"><div class="step-lbl">Resultado</div><div class="score">${qscore}/${total}</div>
    <p style="color:var(--cinza);font-size:.9rem">${qscore===total?"Olho de projeto! 👏":qscore>=Math.ceil(total*0.7)?"Muito bom.":"Reveja o Módulo de Ouro."}</p></div>
    <div class="row"><a class="btn btn-wpp" href="https://wa.me/?text=${shareTxt}" target="_blank" rel="noopener">📲 Compartilhar</a>
    <button class="btn btn-ghost" onclick="qi=0;qscore=0;renderQuiz()">↺ Refazer</button></div>`;
  if(MODE==="LITE") html+=`<div class="cta"><h3>Estes são 3 de 8 cenários</h3><p>A versão PRO traz todos os cenários, o seletor completo e o Kit de fundações.</p>
    <a class="btn btn-wpp" href="https://wa.me/${WA_INSTRUTOR}?text=${encodeURIComponent('Ola! Fiz o quiz gratuito de fundacoes e quero o curso completo.')}" target="_blank" rel="noopener">Quero o curso completo</a></div>`;
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
    path = os.path.join(OUT_DIR, f"seletor-fundacao-{mode}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"SELETOR {mode}: {path} ({len(html)} bytes)")
