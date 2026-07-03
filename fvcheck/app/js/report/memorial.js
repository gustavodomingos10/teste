/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  memorial.js — Memorial da verificação expressa (HTML imprimível)
 *
 *  Estrutura auditável: cada verificação apresenta FÓRMULA, VALORES e a
 *  REFERÊNCIA NORMATIVA. O documento declara explicitamente o escopo e as
 *  limitações do método expresso (triagem) e o caminho para o laudo assinado.
 * ========================================================================== */
(function (root) {
  'use strict';

  var isNode = (typeof module !== 'undefined' && module.exports);
  var Norms = isNode ? require('../core/norms.js') : root.FV.Norms;
  var Draw = isNode ? require('./draw.js') : root.FV.Draw;
  var Laudo = isNode ? require('./laudo.js') : root.FV.Laudo;
  var P = Norms.PARAM;

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function n(x, d) { return (x == null || isNaN(x)) ? '—' : Number(x).toFixed(d == null ? 2 : d).replace('.', ','); }
  function badge(status) {
    var mapa = { verde: ['APROVADO', 'sem-ok'], atencao: ['ATENÇÃO', 'sem-at'], reprovado: ['REPROVADO', 'sem-re'] };
    var m = mapa[status] || mapa.atencao;
    return '<span class="sem-badge ' + m[1] + '">' + m[0] + '</span>';
  }
  function linhaTab(sym, desc, valor, ref) {
    return '<tr><td class="sym">' + sym + '</td><td>' + desc + '</td><td class="val">' + valor + '</td><td class="ref">' + esc(ref || '') + '</td></tr>';
  }

  var SEMAFORO_TXT = {
    verde: { titulo: 'VERDE — APTO PELO MÉTODO EXPRESSO', sub: 'As verificações expressas foram atendidas com folga (razões ≤ 0,85). Observe as condicionantes listadas.' },
    atencao: { titulo: 'AMARELO — ATENÇÃO: LAUDO RECOMENDADO', sub: 'Há verificações próximas do limite ou ressalvas de escopo. Recomenda-se laudo assinado por engenheiro antes da instalação.' },
    reprovado: { titulo: 'VERMELHO — REPROVADO PELO MÉTODO EXPRESSO', sub: 'Uma ou mais verificações foram violadas. NÃO instale sem laudo/projeto de reforço assinado por engenheiro habilitado.' }
  };

  function gerar(resultado, opcoes) {
    opcoes = opcoes || {};
    var m = resultado.modelo, c = resultado.checks, v = m.vento, a = c.acoes;
    var hoje = opcoes.data || new Date().toLocaleDateString('pt-BR');
    var stx = SEMAFORO_TXT[resultado.semaforo];
    var h = [];

    h.push('<div class="doc memorial-fv">');

    /* ---------- cabeçalho ---------- */
    h.push('<header class="doc-cab">',
      '<div class="doc-marca"><b>FV-CHECK</b><span>Verificação Estrutural Expressa · Fotovoltaico em Telhado</span></div>',
      '<h1>MEMORIAL DE VERIFICAÇÃO EXPRESSA Nº ' + esc(opcoes.numero || (m.inp.nome || '').slice(0, 24)) + '</h1>',
      '<table class="tab doc-id"><tr><th>Projeto</th><td>' + esc(m.inp.nome) + '</td><th>Data</th><td>' + esc(hoje) + '</td></tr>',
      '<tr><th>Cliente</th><td>' + esc(m.inp.cliente || '—') + '</td><th>Local</th><td>' + esc((m.inp.cidade || '—') + '/' + (m.inp.uf || '—')) + '</td></tr>',
      '<tr><th>Usina</th><td>' + n(m.kwp, 1) + ' kWp · ' + m.inp.numModulos + ' módulos</td><th>Método</th><td>Expresso v' + esc(resultado.versaoMetodo) + ' (triagem)</td></tr></table>',
      '</header>');

    /* ---------- semáforo ---------- */
    h.push('<section class="sem-hero sem-' + resultado.semaforo + '">',
      '<div class="sem-luzes">',
      '<span class="luz r' + (resultado.semaforo === 'reprovado' ? ' on' : '') + '"></span>',
      '<span class="luz a' + (resultado.semaforo === 'atencao' ? ' on' : '') + '"></span>',
      '<span class="luz v' + (resultado.semaforo === 'verde' ? ' on' : '') + '"></span></div>',
      '<div><b>' + stx.titulo + '</b><p>' + stx.sub + '</p></div></section>');

    /* ---------- 1. objeto e método ---------- */
    h.push('<section><h2>1 · Objeto e método</h2>',
      '<p>Verificação estrutural <b>expressa</b> (triagem) da cobertura metálica para recebimento de usina fotovoltaica em montagem <b>coplanar</b>, compreendendo: flexão, cisalhamento e flecha das <b>terças</b>; adequação da <b>telha</b>; demanda de <b>fixação dos módulos</b>; e o <b>acréscimo de carga</b> sobre a estrutura principal. Base normativa: <b>ABNT NBR 6123</b> (vento), <b>NBR 8681/6120</b> (ações e combinações), <b>NBR 8800</b> e <b>NBR 14762</b> (resistências).</p>',
      '<p class="destaque-aviso">Este documento é uma <b>triagem assistida por software</b> e NÃO substitui laudo/projeto assinado com ART por profissional legalmente habilitado (Lei 5.194/66; Res. CONFEA 1.025/2009).</p></section>');

    /* ---------- 2. dados de entrada ---------- */
    h.push('<section><h2>2 · Dados de entrada</h2><table class="tab">');
    h.push(linhaTab('—', 'Tipologia do telhado', m.duasAguas ? 'Duas águas' : 'Uma água', ''));
    h.push(linhaTab('a × b', 'Comprimento × largura', n(m.inp.comprimento, 1) + ' × ' + n(m.inp.largura, 1) + ' m', ''));
    h.push(linhaTab('h / z', 'Pé-direito / cota da cumeeira', n(m.inp.peDireito, 1) + ' / ' + n(m.zCumeeira, 2) + ' m', ''));
    h.push(linhaTab('θ', 'Inclinação', m.inp.inclinacao + '% (' + n(m.thetaGraus, 1) + '°)', ''));
    h.push(linhaTab('—', 'Terça', esc(m.perfil.nome) + ' · aço ' + esc(m.aco.nome) + ' (fy=' + m.aco.fy + ' MPa)', 'NBR 6355'));
    h.push(linhaTab('L / s', 'Vão da terça / espaçamento', n(m.L, 2) + ' / ' + n(m.s, 2) + ' m · ' + m.apoio.nome + ' · ' + m.nc + ' linha(s) de correntes', ''));
    h.push(linhaTab('—', 'Telha', esc(m.telha.nome) + ' (' + n(m.telha.peso, 2) + ' kN/m²)', 'dados típicos'));
    h.push(linhaTab('—', 'Módulo FV', esc(m.mod.nome || 'personalizado') + ' · ' + m.inp.numModulos + ' un · fixação ' + (m.inp.fixacao === 'telha' ? 'na telha' : 'nas terças'), ''));
    h.push(linhaTab('g<sub>fv</sub>', 'Peso do sistema FV (módulos+trilhos)', n(m.gFv * 100, 1) + ' kgf/m² (' + n(m.gFv, 3) + ' kN/m²)', 'NBR 6120 (perm.)'));
    h.push(linhaTab('—', 'Estado de conservação declarado', esc(m.conserv.nome), ''));
    h.push('</table></section>');

    /* ---------- 3. vento ---------- */
    h.push('<section><h2>3 · Ação do vento — NBR 6123</h2><table class="tab">');
    h.push(linhaTab('V<sub>0</sub>', 'Velocidade básica (isopletas)', n(m.inp.v0, 0) + ' m/s', Norms.ref('NBR6123', 'v0')));
    h.push(linhaTab('S<sub>1</sub>', 'Fator topográfico', n(m.s1.valor, 2), Norms.ref('NBR6123', 's1')));
    h.push(linhaTab('S<sub>2</sub>', 'Rugosidade/dimensões — cat. ' + m.inp.categoria + ', classe A, z=' + n(m.zCumeeira, 1) + ' m<div class="fml">S2 = b·Fr·(z/10)^p</div>', n(v.S2Local, 3), Norms.ref('NBR6123', 's2')));
    h.push(linhaTab('S<sub>3</sub>', 'Fator estatístico', n(m.s3.valor, 2), Norms.ref('NBR6123', 's3')));
    h.push(linhaTab('V<sub>k</sub>', 'Velocidade característica<div class="fml">Vk = V0·S1·S2·S3</div>', n(v.VkLocal, 1) + ' m/s', Norms.ref('NBR6123', 'vk')));
    h.push(linhaTab('q', 'Pressão dinâmica<div class="fml">q = 0,613·Vk²</div>', n(v.qLocal, 3) + ' kN/m²', Norms.ref('NBR6123', 'q')));
    h.push(linhaTab('Ce', 'Coef. externos no telhado (θ=' + n(m.thetaGraus, 1) + '°): EF=' + n(v.ce90.EF, 2) + ' · GH=' + n(v.ce90.GH, 2) + ' · paralelo=' + n(v.cePar, 2) + (v.fatorAlto > 1 ? ' · majoração h/b: ×' + n(v.fatorAlto, 2) : ''), 'envoltória ' + n(v.ceSuc, 2), Norms.ref('NBR6123', 'ce')));
    h.push(linhaTab('Ci', 'Coef. interno', '+' + n(v.ciPos, 1) + ' / ' + n(v.ciNeg, 1), Norms.ref('NBR6123', 'ci')));
    h.push(linhaTab('ΔP<sub>suc</sub>', 'Sucção efetiva no telhado<div class="fml">ΔP = (Ce − Ci)·q</div>', n(v.dpSuc, 3) + ' kN/m²', Norms.ref('NBR6123', 'dp')));
    if (v.dpPos > 0) h.push(linhaTab('ΔP<sub>pos</sub>', 'Sobrepressão (barlavento, θ alto)', '+' + n(v.dpPos, 3) + ' kN/m²', ''));
    h.push(linhaTab('ΔP<sub>borda</sub>', 'Sucção local de borda/cumeeira (fixações)', n(v.dpSucLocal, 2) + ' kN/m²', Norms.ref('NBR6123', 'local')));
    h.push('</table></section>');

    /* ---------- 4. ações e combinações ---------- */
    var g = a.gamas, cc = a.caracteristicas;
    h.push('<section><h2>4 · Ações e combinações — NBR 8681 / NBR 8800</h2>',
      '<p>Cargas lineares características na terça crítica (espaçamento s = ' + n(m.s, 2) + ' m, medido no plano da água):</p><table class="tab">');
    h.push(linhaTab('g<sub>telha</sub>', 'Telha', n(cc.wTelha, 3) + ' kN/m', 'dados típicos'));
    h.push(linhaTab('g<sub>terça</sub>', 'Peso próprio da terça', n(cc.wTerca, 3) + ' kN/m', 'NBR 6120 Tab.1 (aço 78,5 kN/m³)'));
    h.push(linhaTab('g<sub>fv</sub>', 'Sistema fotovoltaico', n(cc.wFv, 3) + ' kN/m', Norms.ref('NBR6120', 'equip')));
    h.push(linhaTab('q', 'Sobrecarga de cobertura (0,25 kN/m² · cosθ · s)', n(cc.wQ, 3) + ' kN/m', Norms.ref('NBR6120', 'sc025')));
    h.push(linhaTab('w', 'Vento — sucção (normal à água)', n(cc.wWsuc, 3) + ' kN/m', 'NBR 6123'));
    h.push('</table>',
      '<p>Combinações últimas (γ: estrutura ' + n(g.gEstrutura, 2) + ' · industrializados ' + n(g.gIndustrializado, 2) + ' · sobrecarga ' + n(g.q, 2) + ' · vento ' + n(g.vento, 2) + ' — ' + esc(Norms.ref('NBR8800', 'gamaG')) + '):</p><table class="tab">');
    h.push(linhaTab('C1', 'Gravitacional: 1,25·G<sub>t</sub> + 1,35·(G<sub>telha</sub>+G<sub>fv</sub>) + 1,50·Q', 'wₙ=' + n(a.C1.n, 3) + ' · w<sub>t</sub>=' + n(a.C1.t, 3) + ' kN/m', Norms.ref('NBR8681', 'combUlt')));
    if (a.temSobrepressao) h.push(linhaTab('C2', 'Permanentes + 1,4·W⁺', 'wₙ=' + n(a.C2.n, 3) + ' kN/m', ''));
    h.push(linhaTab('C3', 'Levantamento: 1,0·G + 1,4·W⁻', 'wₙ=' + n(a.C3.n, 3) + ' · w<sub>t</sub>=' + n(a.C3.t, 3) + ' kN/m', Norms.ref('NBR8681', 'gFavoravel')));
    h.push(linhaTab('ELS', 'Serviço (raras): G+Q e G+W⁻', 'wₙ=' + n(a.S1.n, 3) + ' / ' + n(a.S2.n, 3) + ' kN/m', Norms.ref('NBR8681', 'combServ')));
    h.push('</table></section>');

    /* ---------- 5. verificações ---------- */
    h.push('<section><h2>5 · Verificações</h2>');
    h.push('<p>Propriedades da terça: A=' + n(m.sec.A, 2) + ' cm² · Ix=' + n(m.sec.Ix, 0) + ' cm⁴ · Wx=' + n(m.sec.Wx, 1) + ' cm³ · Wy=' + n(m.sec.Wy, 1) + ' cm³ · ρ=' + n(m.sec.rho, 2) +
      ' · M<sub>Rd,x</sub>=' + n(c.MrdX, 2) + ' kN·m · M<sub>Rd,x,up</sub>=' + n(c.MrdXup, 2) + ' kN·m · V<sub>Rd</sub>=' + n(c.Vrd, 1) + ' kN' +
      (c.fatorConserv < 1 ? ' · redução por conservação: ×' + n(c.fatorConserv, 2) : '') + '</p>');
    h.push('<table class="tab tab-verif"><tr><th>Item</th><th>Verificação</th><th>Demanda × Resistência</th><th>Razão</th><th>Resultado</th></tr>');
    resultado.itens.forEach(function (it) {
      h.push('<tr><td class="sym">' + it.id + '</td><td><b>' + esc(it.titulo) + '</b><div class="fml">' + esc(it.ref) + '</div></td>',
        '<td>' + esc(it.detalhe) + '</td>',
        '<td class="val">' + (it.ratio == null ? '—' : n(it.ratio, 2)) + '</td>',
        '<td>' + badge(it.status) + '</td></tr>');
    });
    h.push('</table></section>');

    /* ---------- 6. avisos e reserva ---------- */
    if (resultado.avisos.length) {
      h.push('<section><h2>6 · Condicionantes e observações</h2><ul class="lista-avisos">');
      resultado.avisos.forEach(function (av) {
        h.push('<li class="av-' + av.tipo + '">' + esc(av.msg) + '</li>');
      });
      h.push('</ul></section>');
    }
    if (resultado.reserva && resultado.reserva.margemKgM2 > 0 && resultado.semaforo !== 'reprovado') {
      h.push('<section><h2>' + (resultado.avisos.length ? 7 : 6) + ' · Reserva de capacidade (terças/telha)</h2>',
        '<p>Pelo método expresso, a terça verificada ainda admite <b>≈ ' + n(resultado.reserva.margemKgM2, 0) + ' kgf/m²</b> adicionais de carga permanente nas verificações gravitacionais antes de atingir o limite (não vale para a estrutura principal — ver item V7).</p></section>');
    }

    /* ---------- 7. limitações ---------- */
    h.push('<section><h2>Limitações do método expresso</h2><ol class="lista-limites">',
      '<li>Verifica a <b>terça crítica</b>, a <b>telha</b> (triagem com dados típicos de fabricante) e a <b>demanda de fixação</b>; NÃO recalcula pórticos, tesouras, ligações, contraventamentos e fundações (item V7 é um indicador de acréscimo).</li>',
      '<li>Montagem <b>coplanar</b> com afastamento ≤ 20 cm; módulos afastados das <b>zonas de borda/cumeeira</b> de alta sucção. Montagens inclinadas exigem análise específica.</li>',
      '<li>Coeficientes de vento pela <b>envoltória</b> da Tabela 5 (h/b ≤ 1/2 com majoração p/ 1/2 &lt; h/b ≤ 3/2); casos especiais (aberturas dominantes, vizinhança, morros) exigem análise.</li>',
      '<li>Flambagem local pela redução conservadora ρ (larguras efetivas); FLT sob levantamento pelo <b>fator R</b> (NBR 14762 9.8.2.2). Distorcional e cálculo exato da seção efetiva integram o laudo.</li>',
      '<li>Pressupõe estrutura <b>conforme declarado</b> pelo usuário (dimensões, material, estado). Divergências de campo invalidam o resultado.</li>',
      '<li>Resultado <b>' + esc(stx.titulo) + '</b> não autoriza instalação sem a responsabilidade técnica aplicável (ART do projeto da usina e, quando indicado, laudo estrutural).</li></ol></section>');

    /* ---------- CTA laudo ---------- */
    if (!opcoes.semCta) {
      var orc = Laudo.orcamento(m.areaSuperficie);
      h.push('<section class="cta-laudo"><h2>Laudo estrutural assinado (ART inclusa)</h2>',
        '<p>' + esc(orc.descricao) + '</p>',
        '<p><b>Orçamento para esta cobertura (' + n(m.areaSuperficie, 0) + ' m²): ' + orc.moeda + ' ' + orc.total.toLocaleString('pt-BR') + '</b> · prazo ' + orc.prazoDias + ' dias úteis · ' + esc(Laudo.CALCULISTA.nome) + ' — ' + esc(Laudo.CALCULISTA.responsavel) + ' (' + esc(Laudo.CALCULISTA.registro) + ')</p></section>');
    }

    /* ---------- rodapé ---------- */
    h.push('<footer class="doc-rodape">',
      '<p>FV-CHECK · GD Engenharia e Perícia Ltda · CNPJ 54.705.748/0001-19 · Documento de triagem gerado eletronicamente em ' + esc(hoje) + (opcoes.trial ? ' · <b>LICENÇA DE AVALIAÇÃO</b>' : '') + '</p>',
      '<p class="micro">As paráfrases normativas são auxiliares; o texto oficial ABNT prevalece. Uso condicionado aos Termos de Uso da plataforma.</p>',
      '</footer>');

    h.push('</div>');
    return h.join('\n');
  }

  /* Figuras do resultado (usadas na tela e no memorial) */
  function figuras(resultado) {
    var m = resultado.modelo;
    return {
      isometrica: Draw.figIsometrica(m),
      corte: Draw.figCorte(m),
      vento: Draw.figVento(m),
      perfil: Draw.figPerfil(m)
    };
  }

  var Memorial = { gerar: gerar, figuras: figuras, SEMAFORO_TXT: SEMAFORO_TXT };

  root.FV = root.FV || {};
  root.FV.Memorial = Memorial;
  if (typeof module !== 'undefined' && module.exports) module.exports = Memorial;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
