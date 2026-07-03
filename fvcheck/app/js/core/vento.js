/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  vento.js — Ação do vento conforme ABNT NBR 6123
 *
 *  Vk = V0·S1·S2·S3 ;  q = 0,613·Vk² (N/m²)
 *  S2 = b·Fr·(z/10)^p — Tabela 1 (categorias I–V, classes A/B/C)
 *  Ce — telhados de duas águas (Tabela 5, h/b ≤ 1/2, com envoltórias
 *       conservadoras p/ vento paralelo e p/ edificações mais altas)
 *  Ci — ±0,2/−0,3 (NBR 6123 6.2.5, permeabilidade típica)
 *
 *  Convenção de sinais: pressão POSITIVA empurra a superfície (sobrepressão);
 *  NEGATIVA é sucção (arrancamento). ΔP = (Ce − Ci)·q.
 * ========================================================================== */
(function (root) {
  'use strict';

  var Norms = root.FV && root.FV.Norms ? root.FV.Norms : (typeof require !== 'undefined' ? require('./norms.js') : null);
  var P = Norms.PARAM;

  /* S2 (NBR 6123 5.3) — z em metros */
  function s2(z, categoria, classe) {
    var cat = P.S2.cat[categoria];
    if (!cat) throw new Error('Categoria de terreno inválida: ' + categoria);
    var par = cat[classe];
    if (!par) throw new Error('Classe de dimensões inválida: ' + classe);
    var Fr = P.S2.Fr[classe];
    var zz = Math.max(z, 5); // abaixo de 5 m adota-se o valor de 5 m (prática usual)
    return par.b * Fr * Math.pow(zz / 10, par.p);
  }

  /* Classe de dimensões (NBR 6123 5.3.2) a partir da maior dimensão da
   * superfície considerada. Para terças/telhas/fixações → Classe A. */
  function classePorDimensao(maiorDim) {
    if (maiorDim <= 20) return 'A';
    if (maiorDim <= 50) return 'B';
    return 'C';
  }

  /* Interpolação linear do Ce na Tabela 5 (h/b ≤ 1/2, vento a 90°) */
  function ceTab5(thetaGraus) {
    var tab = P.CE_TAB5_HB05;
    var th = Math.max(tab[0].th, Math.min(tab[tab.length - 1].th, thetaGraus));
    for (var i = 0; i < tab.length - 1; i++) {
      var a = tab[i], b = tab[i + 1];
      if (th >= a.th && th <= b.th) {
        var f = (b.th === a.th) ? 0 : (th - a.th) / (b.th - a.th);
        return { EF: a.EF + f * (b.EF - a.EF), GH: a.GH + f * (b.GH - a.GH) };
      }
    }
    var u = tab[tab.length - 1];
    return { EF: u.EF, GH: u.GH };
  }

  /**
   * Calcula a ação do vento sobre o telhado.
   * @param inp {v0, s1Valor, s3Valor, categoria, zCumeeira, maiorDimGlobal,
   *             thetaGraus, hRelativo (h/b), permeabilidade:'normal'|'dominante'}
   * Retorna pressões características (kN/m²) para os casos de verificação.
   */
  function calcular(inp) {
    var avisos = [];
    var classeLocal = 'A'; // vedações e elementos de fixação — NBR 6123 5.3.2
    var classeGlobal = classePorDimensao(inp.maiorDimGlobal || 20);

    var S2L = s2(inp.zCumeeira, inp.categoria, classeLocal);
    var S2G = s2(inp.zCumeeira, inp.categoria, classeGlobal);

    var VkL = inp.v0 * inp.s1Valor * S2L * inp.s3Valor;
    var VkG = inp.v0 * inp.s1Valor * S2G * inp.s3Valor;
    var qL = 0.613 * VkL * VkL / 1000; // kN/m² (elementos: terças, telhas, fixações)
    var qG = 0.613 * VkG * VkG / 1000; // kN/m² (estrutura principal)

    // Coeficientes externos
    var ce90 = ceTab5(inp.thetaGraus);
    var cePar = P.CE_PARALELO;
    var fatorAlto = 1;
    if (inp.hRelativo > 0.5) {
      fatorAlto = P.CE_FATOR_HB_ALTO;
      avisos.push('Edificação com h/b > 1/2: sucções majoradas em ' + Math.round((fatorAlto - 1) * 100) + '% (envoltória do método expresso; Tabela 5 da NBR 6123 apresenta os valores exatos).');
      if (inp.hRelativo > 1.5) avisos.push('h/b > 3/2 está fora da envoltória expressa — os coeficientes reais podem ser mais severos (laudo necessário).');
    }
    // Sucção governante no telhado (envoltória entre vento a 90° e a 0°)
    var ceSuc = Math.min(ce90.EF, ce90.GH, cePar) * fatorAlto;
    // Sobrepressão externa (só ocorre em águas de barlavento com θ elevado)
    var cePos = Math.max(ce90.EF, 0);

    // Coeficiente interno (NBR 6123 6.2.5)
    var ciPos = P.CI.pos, ciNeg = P.CI.neg;
    if (inp.permeabilidade === 'dominante') {
      // envoltórias máximas da NBR 6123 6.2.5 para abertura dominante:
      // +0,8 (abertura a barlavento — agrava a sucção externa do telhado) e
      // −0,9 (abertura em zona de alta sucção externa — agrava a sobrepressão p/ baixo)
      ciPos = 0.8;
      ciNeg = -0.9;
      avisos.push('Edificação aberta/abertura dominante: adotadas as envoltórias máximas de pressão interna da NBR 6123 6.2.5 (Ci = +0,8 no levantamento e −0,9 na sobrepressão). A análise exata das aberturas integra o laudo.');
    }

    // Pressões efetivas características no telhado (kN/m²)
    var dpSuc = (ceSuc - ciPos) * qL;              // caso crítico de levantamento
    var dpPos = (cePos - ciNeg) * qL;              // caso de sobrepressão (θ alto)
    var dpSucLocal = (P.CE_LOCAL_BORDA - ciPos) * qL; // zonas de borda (fixações)

    return {
      classeLocal: classeLocal, classeGlobal: classeGlobal,
      S2Local: S2L, S2Global: S2G,
      VkLocal: VkL, VkGlobal: VkG,
      qLocal: qL, qGlobal: qG,
      ce90: ce90, cePar: cePar, ceSuc: ceSuc, cePos: cePos, fatorAlto: fatorAlto,
      ciPos: ciPos, ciNeg: ciNeg,
      dpSuc: dpSuc,         // ≤ 0 (sucção) — kN/m² normal à água do telhado
      dpPos: dpPos,         // ≥ 0 (sobrepressão)
      dpSucLocal: dpSucLocal, ceLocalBorda: P.CE_LOCAL_BORDA,
      avisos: avisos
    };
  }

  var Vento = { s2: s2, ceTab5: ceTab5, classePorDimensao: classePorDimensao, calcular: calcular };

  root.FV = root.FV || {};
  root.FV.Vento = Vento;
  if (typeof module !== 'undefined' && module.exports) module.exports = Vento;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
