/* Rabbit site behaviour: i18n (EN/ES), config tokens, demo window, tabs, reveals, copy buttons. */
(function () {
  'use strict';

  /* ===== EDIT ME: official Discord server "The Rabbit Hole" (verified, non-expiring invite) ===== */
  var DISCORD_INVITE = 'https://discord.gg/rFHFdbQ2xA';
  /* ================================================================================================ */

  var CFG = window.RABBIT_CONFIG || {};
  var T = CFG.TOOLS || { macro: 28, quantfi: 10, premia: 10, edge: 6 };
  var TOTAL = T.macro + T.quantfi + T.premia + T.edge;
  var PRICE = CFG.PRO_PRICE_EUR != null ? CFG.PRO_PRICE_EUR : 30;
  var ENDPOINT = CFG.ENDPOINT || 'https://the-macro-dashboard.com/mcp';
  var DEFAULT_ENDPOINT = 'https://the-macro-dashboard.com/mcp';
  var doc = document;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function tok(s) { return String(s).split('{total}').join(TOTAL).split('{price}').join(PRICE); }

  /* ---------- ES dictionary (EN lives in the HTML) ---------- */
  var ES = {
    'nav.tools': 'Herramientas', 'nav.pricing': 'Precios', 'nav.connect': 'Conectar', 'nav.discord': 'Discord', 'nav.free': 'gratis', 'star.label': 'Dale una estrella',
    'hero.h1': 'Cae por el <em class="horror">agujero</em>.<br>Vuelve con pruebas.',
    'hero.sub': '{total} herramientas de investigación para asistentes de IA tras una sola URL alojada: macro, métodos cuantitativos, informes y papers. Elige una familia y úsala gratis, para siempre.',
    'hero.cta1': 'Empieza gratis', 'hero.cta1b': 'sin tarjeta', 'hero.cta2': 'Ver precios',
    'hero.proof1': '<b>1 familia</b> gratis, sin límite', 'hero.proof2': 'Pro: las cuatro · {price} €/mes',
    'hero.k1': 'clic', 'hero.h1t': 'suelta una onda', 'hero.k2': 'mueve', 'hero.h2t': 'curva el agujero',
    'win.title': 'ruta · sesión ilustrativa', 'win.you': 'Tu asistente', 'win.foot': 'Una URL · cuatro familias',
    'why.h2': 'Cuatro túneles. Un <em class="horror">agujero</em>.',
    'why.lede': 'Las herramientas de investigación vivían en servidores separados, con accesos y configuraciones distintas. Rabbit las reúne en un único endpoint alojado, para que tu asistente pase de una serie de liquidez de la Fed a un 10-K y a una auditoría de backtest sin reconfigurar nada.',
    'st.1': 'herramientas de investigación', 'st.1n': 'tras un solo endpoint', 'st.2': 'familias de herramientas', 'st.2n': 'Macro · QuantFi · Premia · Edge',
    'st.3': 'URL para conectar', 'st.3n': 'alojado · nada que instalar', 'st.4': 'para empezar', 'st.4n': 'una familia, sin límite, sin tarjeta',
    'why.h3': 'Dónde viven las herramientas.', 'bars.l': 'herramientas por familia', 'bars.r': 'herramientas de investigación de solo lectura',
    'bars.macro': 'contexto de mercado y gráficos', 'bars.qf': 'métodos cuantitativos y backtests', 'bars.pr': 'datos oficiales de empresas', 'bars.ed': 'papers clasificados S/A/B/C', 'bars.t': 'herramientas',
    'bars.foot': '28 + 10 + 10 + 6 = {total} · el bot de Edge para Discord vive aparte, dentro del servidor.',
    'tools.h2': 'Cada herramienta, <em class="horror">con nombre</em>.', 'tools.lede': 'Cuatro familias, una conexión. En el plan gratis eliges la que más necesitas; Pro abre las cuatro.',
    'b.macro': 'Vistas de régimen, liquidez, curva, crédito y crecimiento, más datos oficiales de FRED, EIA y CFTC.',
    'b.qf': 'Convierte una idea en un plan falsable, diseña un backtest point-in-time y audítalo.',
    'b.pr': 'Datos e informes de fuentes públicas oficiales, con referencias de evidencia y avisos de cobertura.',
    'b.ed': 'Descubrimiento de papers académicos para investigación de trading, por orden de prioridad, con enlaces directos a arXiv.',
    'bot.l': 'Discord · gratis en el servidor', 'bot.h': 'El bot de Edge, dentro de The Rabbit Hole',
    'bot.p': 'El mismo motor de clasificación de papers que Edge, como bot de Discord. Ejecuta <code>/papers</code>, describe tu proyecto de trading y recibe una lista de lectura S/A/B/C privada con enlaces directos a arXiv. Gratis para todos dentro del servidor oficial de Discord.',
    'bot.cta': 'Únete a The Rabbit Hole',
    'flow.h2': 'Entra la pregunta. Sale la <em class="horror">evidencia</em>.',
    'flow.lede': 'Tu asistente pregunta una vez. Rabbit enruta la llamada a la familia adecuada, consulta fuentes públicas oficiales y devuelve el resultado con su fuente. Los gráficos y cálculos se construyen en tu propia sesión.',
    'fl.1': 'Tu pregunta', 'fl.2': 'Rabbit · una URL', 'fl.3': 'Acceso con Discord', 'fl.4': 'Tu familia gratis', 'fl.5': 'Las otras familias', 'fl.6': 'Fuentes oficiales', 'fl.7': 'Resultado + fuente', 'fl.8': 'Hecho en tu sesión', 'fl.9': 'Tu respuesta',
    'leg.free': 'familia gratis', 'leg.pro': 'Pro: las cuatro familias',
    'more.h2': 'Más que una <em class="horror">lista de herramientas</em>.', 'more.lede': 'Rabbit es una capa de método y recetas sobre datos públicos: le dice a tu asistente cómo hacer el trabajo y le enseña su evidencia.',
    'm1.h': 'Audita un backtest', 'm1.p': 'Fugas, errores de timing y costes omitidos, como hallazgos; nunca como promesa de rentabilidad.',
    'm2.h': 'Compara dos informes', 'm2.p': 'Mira qué añadió o quitó una empresa entre informes, con referencias al documento original.',
    'm3.h': 'Papers que merecen la pena', 'm3.p': 'Una lista de lectura clasificada para tu proyecto de trading, S primero, con enlaces directos a arXiv.',
    'm4.h': 'Fuentes siempre visibles', 'm4.p': 'Los resultados de Premia y de datos oficiales siempre llevan su fuente y atribución, como BLS, SEC y BEA.',
    'm5.h': 'Una familia, sin contador', 'm5.p': 'Gratis es gratis: elige una familia y úsala sin límites. Sin tope diario, sin tarjeta.',
    'm6.h': 'Honesto con los huecos', 'm6.p': 'Los datos pueden llegar con retraso o incompletos. Rabbit señala lo que falta en vez de rellenarlo con una suposición.',
    'pr.h2': 'Gratis para sumergirte. <em class="horror">Pro</em> para ir a fondo.',
    'pr.lede': 'Elige una familia y es tuya, gratis para siempre y sin límite de uso. ¿Quieres las cuatro? Pro cuesta {price} € al mes, con cobro a través de Whop.',
    'pr.f.tag': 'Gratis', 'pr.f.tag2': 'para siempre', 'pr.f.per': 'sin tarjeta · sin límite',
    'pr.f.1': '<span><b>Una familia a tu elección:</b> Macro, QuantFi, Premia o Edge</span>',
    'pr.f.2': '<span><b>Uso ilimitado</b> de esa familia</span>',
    'pr.f.3': '<span>Accede con <b>Discord</b>, nada más</span>',
    'pr.f.4': '<span>Fuente visible en cada resultado de datos oficiales</span>',
    'pr.f.5': '<span>El bot de Edge para Discord, gratis en el servidor</span>',
    'pr.f.b1': 'Empieza gratis', 'pr.f.b2': 'Únete a Discord',
    'pr.p.tag2': 'las cuatro familias', 'pr.p.per': 'al mes · ilimitado',
    'pr.p.1': '<span><b>Las cuatro familias:</b> las {total} herramientas</span>',
    'pr.p.2': '<span><b>Uso ilimitado</b> en todas las familias</span>',
    'pr.p.3': '<span>Todo lo del plan Gratis</span>',
    'pr.p.4': '<span>Cobro a través de <b>Whop</b></span>',
    'pr.p.b1': 'Suscríbete con Whop', 'soon': 'próximamente',
    'pr.note': 'Rabbit es un servicio alojado y de código cerrado: gratis de usar, con el código en privado. El repositorio de esta web solo contiene el sitio estático.',
    'con.h2': 'Funciona donde <em class="horror">vive</em> tu asistente.',
    'con.lede': 'Rabbit habla MCP sobre Streamable HTTP. Si tu asistente admite servidores MCP remotos, funciona: añade la URL, accede una vez con Discord y pregunta.',
    'con.title': 'conectar', 'con.any': 'Otro cliente', 'con.plugin': 'Añade el servidor', 'con.rec': 'Cada llamada vuelve con su fuente',
    'con.sign': 'La primera conexión abre un acceso con Discord. Apruébalo y listo: no hay clave API que copiar.',
    'gets.l': 'Lo que obtiene tu agente · {total} herramientas',
    'g.m1': 'Liquidez de la Fed desde series oficiales', 'g.m2': 'Hoy frente a hace un mes y un año', 'g.m3': 'Calendario oficial de publicaciones', 'g.m4': 'Inventarios de crudo en Cushing', 'g.m5': 'Posicionamiento CFTC', 'g.m6': 'régimen, ciclo, crédito, nowcast del PIB, escenarios…',
    'g.q1': 'Hipótesis → protocolo sin sesgos', 'g.q2': 'Universo, señal, tamaño, riesgo', 'g.q3': 'Arquitectura point-in-time', 'g.q4': 'Revisión de fugas, timing y costes', 'g.q5': 'Walk-forward, holdout, embargo', 'g.q6': 'analyze_results, search_knowledge…',
    'g.p1': 'Busca por nombre, ticker o ID', 'g.p2': 'Tendencias, márgenes, caja', 'g.p3': 'Paquete de evidencia en una llamada', 'g.p4': 'Texto y tablas con referencias', 'g.p5': 'Qué se añadió o quitó', 'g.p6': 'filing_briefing, list_reports…',
    'g.e1': '1–30 papers para tu proyecto', 'g.e2': 'Búsqueda por tema con niveles', 'g.e3': 'Qué significan S, A, B y C', 'g.e4': 'Lee un paper desde su ID de arXiv', 'g.e5': 'Papers de 1–10 investigadores', 'g.e6': 'Quién trabaja en este tema',
    'con.noteh': 'Aviso: el endpoint puede cambiar.', 'con.note': 'La URL de arriba es el endpoint de producción actual. Podemos mover Rabbit a su propio dominio; si ocurre, esta página mostrará la nueva URL y la antigua seguirá funcionando durante un periodo de transición.',
    'faq.h2': 'Preguntas, <em class="horror">respondidas</em>.',
    'q1': '¿Cómo funciona el plan gratis?', 'a1': 'Eliges <strong>una familia</strong> (Macro, QuantFi, Premia o Edge) y la usas gratis, para siempre, sin límite de uso y sin tarjeta. Accedes con Discord. Pro ({price} €/mes) abre las cuatro familias, también sin límite.',
    'q2': '¿Qué incluye Pro y cómo se paga?', 'a2': 'Pro cuesta {price} € al mes por uso ilimitado de las cuatro familias ({total} herramientas). El cobro es a través de <strong>Whop</strong>. Suscríbete desde la sección de precios; el plan gratis sigue abierto para todos.',
    'q3': '¿Puedo ver el código?', 'a3': 'No. Rabbit es un servicio <strong>alojado y de código cerrado</strong>: gratis de usar, pero el código del servidor no se publica. El repositorio de esta web solo contiene el sitio estático.',
    'q4': '¿Los resultados muestran de dónde vienen los datos?', 'a4': 'Sí. <strong>Los resultados de Premia y de datos oficiales siempre muestran su fuente</strong>, con atribución a la agencia que los publica, por ejemplo BLS, SEC o BEA. Rabbit es independiente y no está avalado por esas agencias.',
    'q5': '¿Es asesoramiento de inversión?', 'a5': 'No. Rabbit ofrece herramientas de investigación. Los backtests son simulaciones, no previsiones, y los datos pueden llegar con retraso o incompletos. Nada aquí promete rentabilidad.',
    'q6': '¿Y el bot de Discord?', 'a6': 'El bot de Edge que clasifica papers es gratis para todos dentro del servidor oficial de Discord, <strong>The Rabbit Hole</strong>. <a href="https://discord.gg/rFHFdbQ2xA" data-discord rel="noopener">Únete con el enlace de invitación</a> y ejecuta <code>/papers</code>.',
    'q7': '¿Cambia la URL del endpoint?', 'a7': 'Puede cambiar. El endpoint actual aparece en la sección de conexión. Si Rabbit pasa a su propio dominio, esta página mostrará la nueva URL y la antigua seguirá funcionando durante la transición.',
    'q8': '¿Veis mi código o tocáis mi bróker?', 'a8': 'No. Los cálculos y gráficos se construyen en tu propio asistente. Las herramientas de Rabbit son de solo lectura; no ejecutan tu código ni se conectan a tu bróker.',
    'cta.h2': 'Da el <em class="horror">salto</em>.', 'cta.p': 'Alojado. Una URL. Elige una familia, gratis para siempre, y accede con Discord.', 'cta.b': 'Únete a The Rabbit Hole',
    'foot.tag': 'Cuidado con el hueco.',
    'foot.legal': 'Rabbit ofrece herramientas de investigación, no asesoramiento de inversión. Los backtests son simulaciones, no previsiones. Los datos proceden de fuentes públicas oficiales, pueden llegar con retraso o incompletos y se atribuyen a su editor (por ejemplo BLS, SEC, BEA). Rabbit es independiente y no está afiliado ni avalado por las fuentes o clientes citados en esta página. © 2026 Rabbit.',
    'copy': 'Copiar', 'copied': '¡Copiado!'
  };

  /* ---------- demo scenarios ---------- */
  var SC = {
    en: [
      { q: 'Is the liquidity tailwind fading?', bad: 'GUESSES', why: 'no sourced series, stale memory', calls: [['data_net_liquidity', 'FRED', 1], ['data_yield_curve', 'FRED', 1], ['get_chart_recipe', 'recipe', 1], ['data_cot', 'not needed', 0]], sum: '<em>3</em> calls · source attached' },
      { q: 'Here is my momentum backtest. Is it lying to me?', bad: 'FLATTERS', why: 'no leakage or cost review', calls: [['audit_backtest', 'findings', 1], ['design_validation', 'walk-forward', 1], ['analyze_results', 'gaps listed', 1], ['build_research_plan', 'not needed', 0]], sum: '<em>3</em> calls · findings, no promises' },
      { q: 'What changed between the last two annual reports?', bad: 'INVENTS', why: 'cannot open the filing', calls: [['search_companies', 'resolved', 1], ['list_reports', 'SEC EDGAR', 1], ['compare_reports', 'diff + refs', 1], ['read_report', 'not needed', 0]], sum: '<em>3</em> calls · source attached' },
      { q: 'Which papers should I read for a vol-targeting strategy?', bad: 'RANDOM', why: 'unranked links from memory', calls: [['find_papers', 'S/A/B/C', 1], ['tier_guide', 'tiers', 1], ['read_paper', 'arXiv', 1], ['find_researchers', 'not needed', 0]], sum: '<em>3</em> calls · arXiv links' }
    ],
    es: [
      { q: '¿Se está agotando el viento de cola de liquidez?', bad: 'ADIVINA', why: 'sin series con fuente, memoria vieja', calls: [['data_net_liquidity', 'FRED', 1], ['data_yield_curve', 'FRED', 1], ['get_chart_recipe', 'receta', 1], ['data_cot', 'no hace falta', 0]], sum: '<em>3</em> llamadas · fuente adjunta' },
      { q: 'Este es mi backtest de momentum. ¿Me está mintiendo?', bad: 'ADULA', why: 'sin revisión de fugas ni costes', calls: [['audit_backtest', 'hallazgos', 1], ['design_validation', 'walk-forward', 1], ['analyze_results', 'huecos', 1], ['build_research_plan', 'no hace falta', 0]], sum: '<em>3</em> llamadas · hallazgos, sin promesas' },
      { q: '¿Qué cambió entre los dos últimos informes anuales?', bad: 'SE LO INVENTA', why: 'no puede abrir el documento', calls: [['search_companies', 'resuelta', 1], ['list_reports', 'SEC EDGAR', 1], ['compare_reports', 'diff + refs', 1], ['read_report', 'no hace falta', 0]], sum: '<em>3</em> llamadas · fuente adjunta' },
      { q: '¿Qué papers leo para una estrategia de vol targeting?', bad: 'AL AZAR', why: 'enlaces sin ranking, de memoria', calls: [['find_papers', 'S/A/B/C', 1], ['tier_guide', 'niveles', 1], ['read_paper', 'arXiv', 1], ['find_researchers', 'no hace falta', 0]], sum: '<em>3</em> llamadas · enlaces arXiv' }
    ]
  };
  var NL = { en: 'Assistant alone · no tools', es: 'Asistente solo · sin herramientas' };

  /* ---------- connect snippets ---------- */
  var SN = {
    cursor: { code: '{\n  "mcpServers": {\n    "rabbit": {\n      "url": "' + DEFAULT_ENDPOINT + '"\n    }\n  }\n}', en: 'Add to <code>~/.cursor/mcp.json</code> (or the project\'s <code>.cursor/mcp.json</code>).', es: 'Añade a <code>~/.cursor/mcp.json</code> (o al <code>.cursor/mcp.json</code> del proyecto).' },
    cc: { code: 'claude mcp add --transport http rabbit ' + DEFAULT_ENDPOINT, en: 'Run once in your terminal, then <code>/mcp</code> inside Claude Code and choose “Authenticate”.', es: 'Ejecútalo una vez en tu terminal; luego <code>/mcp</code> dentro de Claude Code y elige «Authenticate».' },
    cd: { code: 'Name: Rabbit\nURL:  ' + DEFAULT_ENDPOINT, en: 'In Settings → Connectors, choose “Add custom connector”. Menu names vary by plan and version.', es: 'En Ajustes → Conectores, elige «Añadir conector personalizado». Los nombres de menú varían según plan y versión.' },
    gen: { code: 'npx @modelcontextprotocol/inspector@latest\n# transport: Streamable HTTP\n# URL: ' + DEFAULT_ENDPOINT, en: 'Point any Streamable-HTTP MCP client at the endpoint. To poke around first, use the MCP Inspector.', es: 'Apunta cualquier cliente MCP de Streamable HTTP al endpoint. Para explorar antes, usa el MCP Inspector.' }
  };

  var lang = 'en', EN = {};
  var curScen = 0, curTab = 'cursor', timers = [];

  /* ---------- apply config ---------- */
  $$('[data-discord]').forEach(function (a) { a.href = DISCORD_INVITE; });
  $$('[data-endpoint]').forEach(function (e) { e.textContent = ENDPOINT; });
  var pe = $('[data-price-eur]'); if (pe) pe.textContent = '€' + PRICE;
  $$('[data-w]').forEach(function (i) { i.style.setProperty('--w', (T[i.getAttribute('data-w')] / Math.max(T.macro, 1) * 100) + '%'); });
  $$('[data-n]').forEach(function (n) { n.textContent = T[n.getAttribute('data-n')]; });
  var wb = $('#whop');
  if (wb) {
    if (CFG.WHOP_URL) { wb.href = CFG.WHOP_URL; wb.removeAttribute('aria-disabled'); var sm = $('small', wb); if (sm) sm.remove(); wb.target = '_blank'; wb.rel = 'noopener'; }
    else wb.addEventListener('click', function (e) { e.preventDefault(); });
  }

  /* ---------- i18n ---------- */
  var nodes = $$('[data-i18n]');
  nodes.forEach(function (n) { EN[n.getAttribute('data-i18n')] = n.innerHTML; });
  function setLang(l) {
    lang = l; doc.documentElement.lang = l;
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      var s = l === 'es' && ES[k] != null ? ES[k] : EN[k];
      n.innerHTML = tok(s);
    });
    $$('[data-discord]').forEach(function (a) { a.href = DISCORD_INVITE; });
    var b = $('#lang'); if (b) b.textContent = l === 'es' ? 'EN' : 'ES';
    try { localStorage.setItem('rabbit-lang', l); } catch (e) {}
    if (!$('#w-code').dataset.init) { /* first call handled below */ }
    renderScen(curScen, false); renderTab(curTab);
    $$('[data-count]').forEach(function (c) { c.textContent = TOTAL; });
  }
  var lb = $('#lang'); if (lb) lb.addEventListener('click', function () { setLang(lang === 'en' ? 'es' : 'en'); });

  /* ---------- demo window ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function renderScen(i, animate) {
    curScen = i; var d = SC[lang][i];
    timers.forEach(clearTimeout); timers = [];
    $('#w-code').innerHTML = '<span class="k">const</span> reply = <span class="k">await</span> assistant.<span class="f">ask</span>(\n  <span class="s">"' + esc(d.q) + '"</span>\n)';
    $('#w-nl').textContent = NL[lang]; $('#w-nb').textContent = d.bad; $('#w-nw').textContent = d.why;
    var ul = $('#w-ladder');
    ul.innerHTML = d.calls.map(function (c, n) {
      return '<li class="' + (c[2] ? 'ok' : 'skip') + '"><span class="r-id">0' + (n + 1) + '</span><span class="r-name"><code>' + c[0] + '</code></span><span class="r-ms">' + esc(c[1]) + '</span></li>';
    }).join('');
    var lis = $$('li', ul), sum = $('#w-sum');
    sum.innerHTML = '';
    function show(n) { lis[n].classList.add('show'); if (n === lis.length - 1) sum.innerHTML = '<span>' + d.sum + '</span>'; }
    lis.forEach(function (li, n) { if (animate === false) show(n); else timers.push(setTimeout(function () { show(n); }, 250 + n * 420)); });
    $$('#scen button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-s') === i)); });
  }
  $$('#scen button').forEach(function (b) { b.addEventListener('click', function () { renderScen(+b.getAttribute('data-s'), true); auto = false; }); });
  var auto = true;
  setInterval(function () { if (!auto || document.hidden) return; var r = $('#demo').getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) renderScen((curScen + 1) % 4, true); }, 6500);

  /* ---------- connect tabs ---------- */
  function renderTab(k) {
    curTab = k; var s = SN[k];
    $('#cpre').textContent = s.code.split(DEFAULT_ENDPOINT).join(ENDPOINT);
    $('#chint').innerHTML = s[lang];
    $$('#ctabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-c') === k)); });
  }
  $$('#ctabs button').forEach(function (b) { b.addEventListener('click', function () { renderTab(b.getAttribute('data-c')); }); });

  /* ---------- copy ---------- */
  function copy(text, btn) {
    function done() { var o = btn.textContent; btn.textContent = lang === 'es' ? ES.copied : 'Copied!'; setTimeout(function () { btn.textContent = lang === 'es' ? ES.copy : 'Copy'; }, 1400); }
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
  }
  $('#ccopy').addEventListener('click', function () { copy($('#cpre').textContent, this); });
  $('#ecopy').addEventListener('click', function () { copy(ENDPOINT, this); });

  /* ---------- reveals + counters ---------- */
  var rev = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    rev.forEach(function (e) { e.classList.add('pre'); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    rev.forEach(function (e) { io.observe(e); });
  }

  /* ---------- GitHub star count (optional; silently skipped on any failure) ---------- */
  try {
    fetch('https://api.github.com/repos/nqmaikel/rabbit-mcp', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || typeof d.stargazers_count !== 'number' || d.stargazers_count < 1) return;
        $$('[data-star-count]').forEach(function (e) { e.textContent = d.stargazers_count.toLocaleString('en'); e.hidden = false; });
      }).catch(function () {});
  } catch (e) {}

  /* ---------- init ---------- */
  var saved = null; try { saved = localStorage.getItem('rabbit-lang'); } catch (e) {}
  var q = /[?&]lang=(en|es)/.exec(location.search);
  setLang(q ? q[1] : (saved === 'es' ? 'es' : 'en'));
})();
