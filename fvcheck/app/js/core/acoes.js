/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  acoes.js — Ações e combinações (NBR 8681 · NBR 6120 · NBR 8800)
 *
 *  Cargas lineares na terça verificada (kN/m):
 *    · Permanentes (verticais): telha, terça (peso próprio), sistema FV
 *    · Sobrecarga de cobertura: 0,25 kN/m² em projeção horizontal
 *      (NBR 6120:2019 Tab. 10 · NBR 8800 B.5.1)
 *    · Vento: pressão normal ao plano da água (NBR 6123)
 *
 *  Decomposição (telhado inclinado θ):
 *    componente normal  wn = w_vertical·cosθ   → flexão no eixo x (maior inércia)
 *    componente tangencial wt = w_vertical·senθ → flexão no eixo y, vão reduzido
 *                                                 pelas correntes (Ly = L/(nc+1))
 *
 *  Combinações últimas (NBR 8800 Tabela 1 / NBR 8681):
 *    C1 (gravitacional):  1,25·Gterça + 1,35·(Gtelha+Gfv) + 1,50·Q
 *    C2 (sobrepressão):   1,25·Gterça + 1,35·(Gtelha+Gfv) + 1,40·W⁺
 *    C3 (levantamento):   1,00·G (favorável) + 1,40·W⁻
 *  Serviço (raras — NBR 8800 Anexo C): S1 = G + Q ;  S2 = G + W⁻
 * ========================================================================== */
(function (root) {
  'use strict';

  var Norms = root.FV && root.FV.Norms ? root.FV.Norms : (typeof require !== 'undefined' ? require('./norms.js') : null);
  var P = Norms.PARAM;

  /**
   * @param m modelo: { theta (rad), s (m — espaçamento das terças, medido no plano
   *                    da água), gTelha, gFv (kN/m² de superfície), pesoTerca (kN/m),
   *                    dpSuc (kN/m², ≤0), dpPos (kN/m², ≥0) }
   */
  function calcular(m) {
    var c = Math.cos(m.theta), sn = Math.sin(m.theta);
    var G = P.GAMA;

    // ---- cargas características lineares (kN/m) ----
    var wTelha = m.gTelha * m.s;           // vertical
    var wFv    = m.gFv * m.s;              // vertical
    var wTerca = m.pesoTerca;              // vertical
    var wQ     = P.SC_COBERTURA * c * m.s; // vertical (0,25 kN/m² em proj. horizontal)
    var wWsuc  = m.dpSuc * m.s;            // normal ao plano (≤ 0)
    var wWpos  = m.dpPos * m.s;            // normal ao plano (≥ 0)

    var wGvert = wTelha + wFv + wTerca;    // permanente vertical total

    function comp(wv) { return { n: wv * c, t: wv * sn }; }

    // ---- C1: gravitacional (sobrecarga principal) ----
    var wC1vert = G.gEstrutura * wTerca + G.gIndustrializado * (wTelha + wFv) + G.q * wQ;
    var C1 = comp(wC1vert);

    // ---- C2: sobrepressão de vento (θ elevado) ----
    var wC2vertPerm = G.gEstrutura * wTerca + G.gIndustrializado * (wTelha + wFv);
    var C2 = comp(wC2vertPerm);
    C2.n += G.vento * wWpos;

    // ---- C3: levantamento (permanentes favoráveis, γg = 1,0) ----
    var C3perm = comp(P.GAMA.gFavoravel * wGvert);
    var C3 = { n: C3perm.n + G.vento * wWsuc, t: C3perm.t };

    // ---- serviço (raras) ----
    var S1 = comp(wGvert + wQ);
    var S2perm = comp(wGvert);
    var S2 = { n: S2perm.n + wWsuc, t: S2perm.t };

    return {
      caracteristicas: {
        wTelha: wTelha, wFv: wFv, wTerca: wTerca, wQ: wQ,
        wWsuc: wWsuc, wWpos: wWpos, wGvert: wGvert
      },
      gamas: { gEstrutura: G.gEstrutura, gIndustrializado: G.gIndustrializado, gFavoravel: G.gFavoravel, q: G.q, vento: G.vento },
      C1: C1, C2: C2, C3: C3, S1: S1, S2: S2,
      temLevantamento: C3.n < 0,
      temSobrepressao: wWpos > 1e-9
    };
  }

  var Acoes = { calcular: calcular };

  root.FV = root.FV || {};
  root.FV.Acoes = Acoes;
  if (typeof module !== 'undefined' && module.exports) module.exports = Acoes;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
