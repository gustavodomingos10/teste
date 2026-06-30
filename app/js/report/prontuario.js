/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  prontuario.js — Montagem do PRONTUÁRIO DO SISTEMA DE LINHA DE VIDA
 *
 *  Dossiê técnico completo e auditável (18 seções), conforme a NR-35 (Anexo II
 *  itens 4, 5 e 6), NR-18 (18.12.12) e NBR 16325. Consolida projeto, memoriais,
 *  materiais, análises de risco, planos e registros — a documentação que uma
 *  seguradora/perícia exige em caso de sinistro.
 * ========================================================================== */
(function (root) {
  'use strict';

  function dep(n) { var x = root.LV && root.LV[n]; if (!x) throw new Error('prontuario.js: ' + n + ' não carregado'); return x; }
  function f(x, d) { return root.LV.Report._f(x, d); }
  function esc(s) { return root.LV.Report._esc(s); }
  function dataBR(t) { return root.LV.Report._dataBR(t); }

  function round(x) { return Math.round(x); }

  // ---- Quantitativo de materiais (reproduz a aba «Resumo de Materiais») ----
  function quantitativo(e) {
    var nVaos = +e.nVaos || 1, L = +e.L || 0, nUsr = +e.nUsuarios || 1;
    var temAbs = (e.temAbsorvedor === 'Sim' || e.temAbsorvedor === true);
    return {
      materiais: [
        ['Poste de ancoragem (perfil tubular conf. cálculo)', nVaos + 1, 'un', 'Extremos + intermediários'],
        ['Placa de base + kit de chumbadores', nVaos + 1, 'cj', '1 por poste'],
        ['Cabo de aço da linha de vida (Ø conf. cálculo)', round(L * nVaos * 1.1), 'm', 'Vão × nº vãos + 10% de folga'],
        ['Esticador / tensor com contraporca', nVaos, 'un', 'Aplicação da pré-tensão'],
        ['Absorvedor de energia da linha', temAbs ? nVaos : 0, 'un', '1 por tramo (se adotado)'],
        ['Terminação prensada / laço + sapatilho + clipes', 2 * nVaos, 'cj', 'Extremidades de cada tramo'],
        ['Placa-guia / olhal intermediário', Math.max(0, nVaos - 1), 'un', 'Postes intermediários'],
        ['Placa de identificação do sistema', 1, 'un', 'NR-18 18.12.12.3'],
        ['Arruelas de vedação EPDM (telhado)', 4 * (nVaos + 1), 'un', 'Estanqueidade das perfurações']
      ],
      epi: [
        ['Cinturão de segurança tipo paraquedista', nUsr, 'un', 'NR-35.6.9 / CA vigente'],
        ['Talabarte em Y com absorvedor de energia (Fₜ ≤ 6 kN)', nUsr, 'un', 'NR-35.6.7 / 35.6.9.1.1'],
        ['Trava-quedas deslizante guiado, compatível com o cabo', nUsr, 'un', 'NR-35.6.10'],
        ['Capacete de segurança com jugular (3 pontos)', nUsr, 'un', 'NR-35 / NR-6'],
        ['Conectores / mosquetões com dupla trava', 2 * nUsr, 'un', 'Resistência conforme fabricante'],
        ['Calçado de segurança e luvas', nUsr, 'par', 'Acessórios de proteção']
      ]
    };
  }

  function tabela(headers, rows, classe) {
    var s = '<table class="tab ' + (classe || '') + '"><thead><tr>' + headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r) { s += '<tr>' + r.map(function (c, i) { return '<td' + (i === 0 ? '' : ' class="val"') + '>' + (c == null ? '' : esc(c)) + '</td>'; }).join('') + '</tr>'; });
    return s + '</tbody></table>';
  }
  function vaziaTab(headers, nLinhas) {
    var rows = [];
    for (var i = 0; i < (nLinhas || 4); i++) rows.push(headers.map(function () { return ''; }));
    return tabela(headers, rows, 'preencher');
  }

  function secao(id, titulo, conteudo) {
    return '<section class="pr-sec" id="pr-' + id + '"><h2 class="pr-h">' + esc(titulo) + '</h2>' + conteudo + '</section>';
  }

  // =======================================================================
  function gerar(R, proj, cfg) {
    var Norms = dep('Norms'), Compat = dep('Compat'), Report = dep('Report'), Draw = root.LV.Draw;
    var e = R.entrada, reg = (proj.registros || {});
    var inox = /Inox/i.test(R.dados.cabo.material);
    var serie = 'GDLV-' + (proj.id || '').slice(-6).toUpperCase() + '-' + new Date().getFullYear();
    var s = '<div class="report prontuario">';

    // CAPA
    s += '<div class="pr-capa">' +
      '<div class="cp-emp">' + esc(cfg.empresa) + '</div>' +
      '<div class="cp-sub">' + esc(cfg.responsavel) + ' · ' + esc(cfg.crea) + ' · CNPJ ' + esc(cfg.cnpj) + '</div>' +
      '<div class="cp-titulo">PRONTUÁRIO DO SISTEMA<br>DE LINHA DE VIDA HORIZONTAL</div>' +
      '<div class="cp-sub2">Dossiê técnico — NR-35 (Anexo II) · NR-18 · ABNT NBR 16325-1/2 · NBR 8800</div>' +
      '<table class="cp-id"><tbody>' +
      '<tr><td>Obra / Cliente</td><td>' + esc(e.obra || proj.nome) + '</td></tr>' +
      '<tr><td>Local</td><td>' + esc(e.local || '—') + '</td></tr>' +
      '<tr><td>Identificação do sistema (nº de série)</td><td>' + esc(serie) + '</td></tr>' +
      '<tr><td>Responsável técnico</td><td>' + esc(e.responsavel || cfg.responsavel) + '</td></tr>' +
      '<tr><td>Revisão / Emissão</td><td>' + esc(proj.revisao || 'R00') + ' · ' + dataBR(Date.now()) + '</td></tr>' +
      '<tr><td>Veredito do dimensionamento</td><td><b class="' + (R.veredito.aprovado ? 'tok' : 'tfail') + '">' + R.veredito.texto + '</b></td></tr>' +
      '</tbody></table>' +
      (Draw ? '<div class="fig">' + Draw.iso3D(R) + '</div>' : '') +
      '<div class="cp-rodape">Documento gerado pelo software Linha de Vida — GD Engenharia. Confidencial.</div>' +
      '</div>';

    // SUMÁRIO
    s += '<section class="pr-sec"><h2 class="pr-h">Sumário</h2><ol class="sumario">' +
      Norms.PRONTUARIO_SECOES.slice(1).map(function (x) { return '<li>' + esc(x.titulo) + '</li>'; }).join('') + '</ol></section>';

    // 1 OBJETO
    s += secao('objeto', '1 · Objeto e dados gerais',
      '<p>Este prontuário consolida o projeto, os memoriais, as especificações, as análises de risco, os planos e os registros do sistema de linha de vida horizontal da obra <b>' + esc(e.obra || proj.nome) + '</b>, em ' + esc(e.local || '—') + '. ' +
      'Atende à NR-35 Anexo II (itens 4 a 6), à NR-18 18.12.12 e à ABNT NBR 16325. O sistema é classificado como <b>dispositivo de ancoragem tipo C</b> (linha de vida horizontal flexível).</p>' +
      tabela(['Parâmetro', 'Valor'], [
        ['Cenário / substrato', (e.cenario || '—') + ' / ' + (e.substrato || '—')],
        ['Ambiente (corrosividade)', e.ambiente || '—'],
        ['Geometria', Math.round(R.dados.nVaos.valor) + ' vão(s) × ' + f(R.dados.L.valor) + ' m · poste ' + f(R.dados.h.valor) + ' m'],
        ['Nº de usuários simultâneos', String(Math.round(R.dados.n.valor))],
        ['Material principal', inox ? 'Aço inoxidável AISI 316' : 'Aço galvanizado a fogo']
      ]));

    // 2 NORMAS E PREMISSAS
    s += secao('normas', '2 · Normas e premissas adotadas',
      '<ul class="prem">' +
      '<li>' + Norms.NORMS.NR35.itens.forca6kN + '</li>' +
      '<li>' + Norms.NORMS.NR35.itens.a2_dimensionamento + '</li>' +
      '<li>' + Norms.NORMS.NR35.itens.a2_estrutura + '</li>' +
      '<li>' + Norms.NORMS.NR18.itens.ancoragem15kN + '</li>' +
      '<li>' + Norms.NORMS.NBR16325_2.itens.zlq + '</li>' +
      '<li>' + Norms.NORMS.NBR8800.itens.ponderacao + '</li>' +
      '</ul>');

    // 3 MEMORIAL DESCRITIVO
    s += secao('descritivo', '3 · Memorial descritivo', Report.memorialDescritivo(R, proj, cfg));

    // 4 MEMORIAL DE CÁLCULO
    s += secao('calculo', '4 · Memorial de cálculo', Report.memorialCalculo(R, proj, cfg));

    // 5 MATERIAIS
    s += secao('materiais', '5 · Especificação técnica de materiais',
      '<p>Duas alternativas: <b>INOX AISI 316</b> (ambientes agressivos/litorâneos, C4–C5) e <b>GALVANIZADO a fogo</b> (melhor custo-benefício, C2–C3). Configuração do projeto: cabo Ø' + R.dados.cabo.d + ' mm · ' + esc(R.dados.cabo.material) + ' · poste ' + esc(R.poste.perfil) + '.</p>' +
      tabela(['Componente', 'Inox AISI 316', 'Galvanizado', 'Norma/Obs.'], [
        ['Cabo de aço (linha de vida)', 'Inox 316, 1x19/7x19, Ø8–12 mm; CR ≥ 5× carga', 'Galvanizado a fogo 6x19+AA, Ø8–12 mm', 'NR-18 Anexo II; NBR 16325'],
        ['Esticador / tensor', 'Inox 316 c/ contraporca', 'Galvanizado c/ contraporca', 'Aplica e mantém T₀'],
        ['Absorvedor de energia da linha', 'Inox calibrado (~9–15 kN)', 'Galvanizado calibrado', 'NBR 16325'],
        ['Terminações do cabo', 'Prensado inox ou laço+sapatilho+3 clipes inox', 'Prensado/laço galvanizado', 'NR-18 Anexo II'],
        ['Poste de ancoragem', 'SHS inox 316 ou aço galv. a fogo (≥85 µm)', 'SHS aço A572/A36 galv. a fogo', 'NBR 8800'],
        ['Placa de base + chumbadores', 'Inox 316 (químico/mecânico)', 'Galvanizados/zincados', 'NR-18 18.12.12.2 (≥15 kN)'],
        ['Placa de identificação', 'Indelével (vide seção 15)', 'Idem', 'NR-18 18.12.12.3']
      ]));

    // 6 COMPATIBILIDADE
    var headC = ['Substrato'].concat(Compat.ANCORAGENS.map(function (a) { return a.replace(/ \(.*/, ''); }));
    var rowsC = Object.keys(Compat.MATRIZ).map(function (sub) { return [sub].concat(Compat.MATRIZ[sub]); });
    s += secao('compat', '6 · Compatibilidade substrato × ancoragem',
      tabela(headC, rowsC, 'matriz') +
      '<p class="leg">✔ recomendado · ✔* só com reforço · ⚠ com restrição · ✗ não permitido · – não aplicável</p>' +
      '<div class="notas-norm"><b>Notas normativas:</b><ol>' + Compat.NOTAS.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ol></div>');

    // 7 QUANTITATIVO
    var q = quantitativo(e);
    s += secao('quantit', '7 · Quantitativo de materiais e EPI',
      '<h3>A · Materiais do sistema</h3>' + tabela(['Descrição', 'Qtd.', 'Un.', 'Observação'], q.materiais.map(function (r) { return [r[0], String(r[1]), r[2], r[3]]; })) +
      '<h3>B · EPI por trabalhador</h3>' + tabela(['Descrição', 'Qtd.', 'Un.', 'Norma/Obs.'], q.epi.map(function (r) { return [r[0], String(r[1]), r[2], r[3]]; })) +
      '<p class="nota">Todos os EPI devem possuir Certificado de Aprovação (CA) válido do MTE e ser inspecionados antes do uso e periodicamente — NR-35.6.6.</p>');

    // 8 APR
    s += secao('apr', '8 · Análise Preliminar de Risco (APR) — NR-35.5',
      '<p>Identificação de perigos e medidas de controle para a instalação, uso e manutenção do sistema. A organização deve realizar a Análise de Risco (AR) e, quando aplicável, a Permissão de Trabalho (PT).</p>' +
      tabela(['Perigo', 'Risco', 'Medidas de controle'], [
        ['Queda de altura', 'Lesão grave / morte', 'SPIQ conectado 100% do tempo; trava-quedas; ZLQ verificada'],
        ['Ruptura/escorregamento do cabo', 'Queda', 'Cabo dimensionado (FS≥2); terminações conforme NR-18; pré-tensão'],
        ['Falha da ancoragem', 'Colapso do sistema', 'Ancoragem ≥ 15 kN; ensaio de arrancamento; inspeção'],
        ['Suspensão inerte pós-queda', 'Trauma de suspensão', 'Plano de resgate (seção 12); tempo de resgate reduzido'],
        ['Telha frágil / superfície', 'Queda por ruptura do piso', 'Não pisar em telha frágil; passarelas; ancorar em estrutura resistente'],
        ['Condições climáticas', 'Escorregamento / raios', 'Suspender trabalho em condição adversa (NR-35)']
      ]) +
      (reg.apr && reg.apr.length ? '<h3>Registros de APR específicos</h3>' + tabela(['Data', 'Perigo', 'Medida'], reg.apr.map(function (r) { return [dataBR(r.criadoEm), r.perigo, r.medida]; })) : ''));

    // 9 PROCEDIMENTO / PT
    s += secao('pt', '9 · Procedimento operacional e Permissão de Trabalho (PT) — NR-35 Anexo II 6.1',
      '<p>O sistema deve ter procedimento operacional de montagem e utilização (montagem, manutenção, alteração, mudança de local e desmontagem), elaborado por profissional qualificado em segurança do trabalho. Antes de cada atividade, emitir a Permissão de Trabalho (PT) com base na AR.</p>' +
      '<h3>Permissão de Trabalho (modelo)</h3>' + vaziaTab(['Data', 'Atividade', 'Responsável', 'AR nº', 'Liberado por'], 3));

    // 10 INSPEÇÃO
    s += secao('inspecao', '10 · Plano e registros de inspeção — NR-35.6.6 / Anexo II 4.1',
      '<p>Inspeção <b>inicial</b> (após a instalação — Anexo II 4.1.1), <b>rotineira</b> (antes de cada uso — 35.6.6.2) e <b>periódica</b> (periodicidade não superior a <b>12 meses</b> — 35.6.6.3 / Anexo II 4.1.2). Registrar inspeções iniciais, periódicas e rotineiras que recusarem elementos (35.6.6.4). Elementos com defeito/deformação ou que sofreram impacto devem ser descartados (35.6.6.5).</p>' +
      (reg.inspecoes && reg.inspecoes.length
        ? tabela(['Data', 'Tipo', 'Inspetor', 'Resultado', 'Próxima', 'Observações'], reg.inspecoes.map(function (r) { return [dataBR(r.criadoEm), r.tipo, r.inspetor, r.resultado, r.proxima || '', r.obs || '']; }))
        : vaziaTab(['Data', 'Tipo (inicial/rotineira/periódica)', 'Inspetor', 'Resultado', 'Próxima inspeção', 'Observações'], 4)));

    // 11 ENSAIO DE CARGA
    s += secao('ensaio', '11 · Registro de ensaio de carga das ancoragens — NR-18 18.12.12.2.1',
      '<p>Ensaio de comprovação da carga mínima do dispositivo de ancoragem (≥ 15 kN ou a força máxima aplicável, conforme o maior valor: <b>' + f(R.ancoragem.R_anc.valor) + ' kN</b>), sob responsabilidade de profissional legalmente habilitado.</p>' +
      (reg.ensaios && reg.ensaios.length
        ? tabela(['Data', 'Ponto', 'Carga exigida (kN)', 'Carga aplicada (kN)', 'Resultado', 'Resp.'], reg.ensaios.map(function (r) { return [dataBR(r.criadoEm), r.ponto, r.exigida, r.aplicada, r.resultado, r.resp]; }))
        : vaziaTab(['Data', 'Ponto de ancoragem', 'Carga exigida (kN)', 'Carga aplicada (kN)', 'Resultado (passou?)', 'Responsável'], 4)));

    // 12 RESGATE
    s += secao('resgate', '12 · Plano de emergência e resgate — NR-35.7',
      '<p>Procedimento de resposta a emergências em altura, considerando os perigos da operação de resgate, a equipe necessária e seu dimensionamento, o tempo estimado de resgate e as técnicas/equipamentos para reduzir o tempo de <b>suspensão inerte</b> do trabalhador.</p>' +
      tabela(['Item', 'Definição'], [
        ['Equipe de resgate', '____________________ (nomes e contatos)'],
        ['Tempo-alvo de resgate', '____ minutos (minimizar suspensão inerte)'],
        ['Equipamentos de resgate', 'Kit de resgate, maca, primeiros socorros'],
        ['Acionamento', 'SAMU 192 / Bombeiros 193 / Brigada interna'],
        ['Ponto de encontro', '____________________']
      ]) +
      '<p class="nota">As pessoas responsáveis pelo salvamento devem ser capacitadas a executar o resgate e prestar primeiros socorros (NR-35.7.3).</p>');

    // 13 CAPACITAÇÃO
    s += secao('capacit', '13 · Registro de capacitação — NR-35.4',
      '<p>Trabalhadores autorizados e capacitados (treinamento inicial mínimo de <b>8 h</b> — NR-35.4.2.1) e com reciclagem periódica. A documentação deve ser arquivada por, no mínimo, 5 anos (NR-35.3.1 "j").</p>' +
      (reg.capacitacao && reg.capacitacao.length
        ? tabela(['Trabalhador', 'CPF', 'Curso', 'Carga (h)', 'Data', 'Validade'], reg.capacitacao.map(function (r) { return [r.nome, r.cpf, r.curso, r.horas, dataBR(r.criadoEm), r.validade]; }))
        : vaziaTab(['Trabalhador', 'CPF', 'Curso (NR-35)', 'Carga horária', 'Data', 'Validade'], 4)));

    // 14 EPI
    s += secao('epi', '14 · Relação de EPI (CA e validade) — NR-35.6.6',
      (reg.epi && reg.epi.length
        ? tabela(['EPI', 'Fabricante', 'CA', 'Validade', 'Inspecionado'], reg.epi.map(function (r) { return [r.epi, r.fabricante, r.ca, r.validade, r.inspecao]; }))
        : vaziaTab(['EPI', 'Fabricante', 'CA (nº)', 'Validade', 'Última inspeção'], 5)));

    // 15 PLAQUETA DE IDENTIFICAÇÃO
    s += secao('placa', '15 · Plaqueta de identificação do sistema — NR-18 18.12.12.3 / NR-35 Anexo II 3.2.1',
      '<p>O sistema deve apresentar, em caracteres indeléveis e visíveis, a marcação abaixo:</p>' +
      '<div class="plaqueta"><table class="tab"><tbody>' +
      '<tr><td>Fabricante / RT</td><td>' + esc(cfg.empresa) + ' — ' + esc(cfg.responsavel) + '</td></tr>' +
      '<tr><td>CNPJ</td><td>' + esc(cfg.cnpj) + '</td></tr>' +
      '<tr><td>Modelo / código</td><td>Linha de Vida Horizontal tipo C — ' + esc(R.poste.perfil) + '</td></tr>' +
      '<tr><td>Nº de fabricação / série</td><td>' + esc(serie) + '</td></tr>' +
      '<tr><td>Material</td><td>' + (inox ? 'Aço inoxidável AISI 316' : 'Aço galvanizado a fogo') + '</td></tr>' +
      '<tr><td>Carga / força máxima aplicável</td><td>' + f(R.tracao.T.valor) + ' kN (dispositivo ≥ ' + f(R.ancoragem.R_anc.valor) + ' kN)</td></tr>' +
      '<tr><td>Nº máx. de usuários simultâneos</td><td>' + Math.round(R.dados.n.valor) + '</td></tr>' +
      '<tr><td>Pictograma</td><td>⚠ Ler as informações do fabricante antes do uso</td></tr>' +
      '</tbody></table></div>');

    // 16 TERMO DE LIBERAÇÃO
    s += secao('liberacao', '16 · Termo de entrega técnica e liberação de uso',
      '<p>Declaro que o sistema de linha de vida horizontal descrito neste prontuário foi projetado conforme as normas aplicáveis e que sua <b>liberação para uso</b> fica condicionada: (i) à correta instalação por equipe capacitada; (ii) à realização e aprovação dos ensaios de carga das ancoragens; (iii) à inspeção inicial; e (iv) à capacitação dos usuários (NR-35.4).</p>' +
      Report.assinatura(cfg, proj));

    // 17 ART
    s += secao('art', '17 · Anotação de Responsabilidade Técnica (ART)',
      '<p>O projeto e a instalação do sistema de ancoragem permanente devem estar sob responsabilidade de profissional legalmente habilitado (NR-35 Anexo II 4.3 e 5.1), com a respectiva ART registrada no CREA.</p>' +
      tabela(['Campo', 'Preenchimento'], [
        ['Nº da ART', '____________________'],
        ['Responsável técnico', esc(e.responsavel || cfg.responsavel)],
        ['CREA', esc(cfg.crea)],
        ['Data de registro', '____/____/________']
      ]));

    // 18 REFERÊNCIAS
    s += secao('refs', '18 · Referências normativas',
      '<ul class="refs">' + Norms.listarReferencias().map(function (n) {
        return '<li><b>' + esc(n.codigo) + '</b> — ' + esc(n.titulo) + '</li>';
      }).join('') + '</ul>');

    s += '</div>';
    return s;
  }

  var Prontuario = { gerar: gerar, quantitativo: quantitativo };
  root.LV = root.LV || {};
  root.LV.Prontuario = Prontuario;
  if (typeof module !== 'undefined' && module.exports) module.exports = Prontuario;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
