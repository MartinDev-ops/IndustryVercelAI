/* =====================================================================
   FuturePath AI — Data Scientist interactive lessons
   Adds data-science activity types to Lesson Mode and defines Phase 1
   (plus a regression lab in Phase 3). Original illustrations only.
   Load AFTER lesson-mode.js.
   ===================================================================== */
(function(){
const LM = window.LessonMode, esc = LM.esc, req = LM.req;
const C = { navy:"#16324f", blue:"#1479c9", teal:"#12a3b8", cyan:"#3fc6e0", orange:"#f28a3d", yellow:"#f6c344",
            green:"#2ea56a", purple:"#6b5bd6", pink:"#e05a8a", grey:"#9aa7b6", light:"#eef3f8", ink:"#1d2733" };

/* ---------- extra styles ---------- */
const st = document.createElement("style");
st.textContent = `
.ds-table{width:100%;border-collapse:separate;border-spacing:0;font-size:14.5px;border:1px solid #dbe3ec;border-radius:10px;overflow:hidden}
.ds-table th{background:#0f2742;color:#fff;text-align:left;padding:9px 12px;font-weight:600;font-size:13px;letter-spacing:.3px}
.ds-table td{padding:9px 12px;border-top:1px solid #e6ecf2;background:#fff;transition:background .2s}
.ds-table tr:nth-child(even) td{background:#f8fafc}
.ds-table.click td{cursor:pointer}
.ds-table.click td:hover{background:#eef6fc}
.ds-table td.found{background:#fdeee3!important;box-shadow:inset 0 0 0 2px #f28a3d;font-weight:700;color:#b85a15}
.ds-table td.nope{animation:shk .35s;background:#f3f5f8!important}
.ds-table .mono{font-family:Menlo,Consolas,monospace}
.ds-sql{font-family:Menlo,Consolas,monospace;background:#0d1b2a;color:#d6e2ee;border-radius:10px;padding:14px 16px;font-size:15px;line-height:1.6;white-space:pre-wrap;margin-bottom:14px}
.ds-sql .k{color:#ff7bb0;font-weight:700}.ds-sql .s{color:#a5d6ff}.ds-sql .n{color:#ffa657}
.ds-ctrls{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
.ds-ctrl{background:#f4f8fc;border-radius:10px;padding:10px 12px;font-size:13px}
.ds-ctrl b{display:block;font-family:Menlo,Consolas,monospace;color:#b0306a;margin-bottom:6px;font-size:13px}
.ds-ctrl label{display:flex;gap:6px;align-items:center;margin:3px 0;font-size:14px}
.ds-ctrl select{width:100%;padding:7px 8px;border:1px solid #cdd8e4;border-radius:7px;font:inherit;font-size:13.5px;background:#fff}
.ds-lab{display:grid;grid-template-columns:1.6fr 1fr;gap:20px}
.ds-rows{font-size:12.5px;color:#6b7a8b;margin:6px 0 0}
.ds-bars{display:flex;align-items:flex-end;gap:10px;height:220px;padding:10px 12px 0;border-bottom:2px solid #c9d4e0;position:relative}
.ds-bars .b{flex:1;background:#1479c9;border-radius:6px 6px 0 0;position:relative;transition:height .3s,background .3s;min-height:4px}
.ds-bars .b.out{background:#f28a3d}
.ds-bars .b span{position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:11.5px;font-weight:600;color:#44525f;white-space:nowrap}
.ds-bars .cap{position:absolute;top:0;left:0;right:0;border-top:2px dashed #f28a3d}
.ds-line{position:absolute;left:0;right:0;border-top:3px solid;transition:bottom .3s}
.ds-line i{position:absolute;left:4px;top:-22px;font-style:normal;font-size:12px;font-weight:700;background:#fff;padding:1px 6px;border-radius:5px}
.ds-names{display:flex;gap:10px;padding:6px 12px 0}.ds-names span{flex:1;text-align:center;font-size:11.5px;color:#6b7a8b}
.ds-big{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}
.ds-big div{border-radius:12px;padding:14px 16px;color:#fff}
.ds-big small{display:block;font-size:12px;opacity:.85;text-transform:uppercase;letter-spacing:.8px}
.ds-big b{font-size:28px}
.ds-plot{width:100%;height:auto;display:block;background:#f8fafc;border:1px solid #e1e7ee;border-radius:12px}
.ds-meter{height:12px;border-radius:8px;background:#e4eaf1;overflow:hidden;margin:6px 0 4px}
.ds-meter i{display:block;height:100%;transition:width .25s,background .25s}
`;
document.head.appendChild(st);

/* =====================================================================
   New activity: SQL query builder
   ===================================================================== */
const CUSTOMERS = [
  {id:1,name:"Thabo",city:"Johannesburg",age:34,spend:2500},{id:2,name:"Aisha",city:"Cape Town",age:28,spend:900},
  {id:3,name:"Pieter",city:"Durban",age:45,spend:1500},{id:4,name:"Naledi",city:"Johannesburg",age:23,spend:3200},
  {id:5,name:"Sipho",city:"Pretoria",age:38,spend:400},{id:6,name:"Lerato",city:"Johannesburg",age:41,spend:1200},
  {id:7,name:"Zanele",city:"Cape Town",age:31,spend:2800},{id:8,name:"Kyle",city:"Durban",age:26,spend:600}];
LM.register("sqlbuilder", (b, s, done, was) => {
  const COLS = ["name","city","age","spend"];
  const WHERE = [["","(none)"],["city = 'Johannesburg'",r=>r.city==="Johannesburg"],["city = 'Cape Town'",r=>r.city==="Cape Town"],["age > 30",r=>r.age>30],["spend > 1000",r=>r.spend>1000]];
  const ORDER = [["","(none)"],["spend DESC",(a,c)=>c.spend-a.spend],["spend ASC",(a,c)=>a.spend-c.spend],["age ASC",(a,c)=>a.age-c.age],["name ASC",(a,c)=>a.name.localeCompare(c.name)]];
  const LIMIT = ["","3","5"];
  const q = { cols:new Set(COLS), w:0, o:0, l:0 };
  let t = was ? s.tasks.length : 0;
  b.innerHTML = `<div class="ds-lab"><div>
      <div class="ds-ctrls">
        <div class="ds-ctrl"><b>SELECT</b>${COLS.map(c=>`<label><input type="checkbox" data-col="${c}" checked> ${c}</label>`).join("")}</div>
        <div class="ds-ctrl"><b>WHERE</b><select id="dsW">${WHERE.map((w,i)=>`<option value="${i}">${esc(i?w[0]:w[1])}</option>`).join("")}</select></div>
        <div class="ds-ctrl"><b>ORDER BY</b><select id="dsO">${ORDER.map((o,i)=>`<option value="${i}">${esc(i?o[0]:o[1])}</option>`).join("")}</select></div>
        <div class="ds-ctrl"><b>LIMIT</b><select id="dsL">${LIMIT.map((l,i)=>`<option value="${i}">${l||"(none)"}</option>`).join("")}</select></div>
      </div>
      <div class="ds-sql" id="dsSql"></div>
      <div id="dsRes"></div><p class="ds-rows" id="dsCount"></p>
    </div><div><ol class="lm-tasks" id="dsTasks"></ol><div class="lm-hint" id="dsHint"></div></div></div>`;
  const $ = id => b.querySelector("#" + id);
  const run = () => {
    let rows = CUSTOMERS.slice();
    if (q.w) rows = rows.filter(WHERE[q.w][1]);
    if (q.o) rows.sort(ORDER[q.o][1]);
    if (q.l) rows = rows.slice(0, +LIMIT[q.l]);
    const cols = COLS.filter(c => q.cols.has(c));
    const K = w => `<span class="k">${w}</span>`;
    let sql = `${K("SELECT")} ${cols.length === 4 ? "*" : cols.join(", ") || "…"}\n${K("FROM")} customers`;
    if (q.w) sql += `\n${K("WHERE")} ${esc(WHERE[q.w][0]).replace(/'([^']+)'/, `<span class="s">'$1'</span>`).replace(/(\d+)$/, `<span class="n">$1</span>`)}`;
    if (q.o) sql += `\n${K("ORDER BY")} ${ORDER[q.o][0].replace(/(DESC|ASC)/, m => K(m))}`;
    if (q.l) sql += `\n${K("LIMIT")} <span class="n">${LIMIT[q.l]}</span>`;
    $("dsSql").innerHTML = sql + ";";
    $("dsRes").innerHTML = cols.length ? `<table class="ds-table"><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>${rows.map(r=>`<tr>${cols.map(c=>`<td>${c==="spend"?"R "+r[c].toLocaleString("en-ZA"):esc(r[c])}</td>`).join("")}</tr>`).join("")}</table>` : `<p class="lm-hint">Tick at least one column.</p>`;
    $("dsCount").textContent = `${rows.length} row${rows.length===1?"":"s"} returned`;
    const state = { cols:cols.join(","), where:WHERE[q.w][0], order:ORDER[q.o][0], limit:LIMIT[q.l] };
    if (t < s.tasks.length && s.tasks[t].check(state)) { t++; tasks(); if (t === s.tasks.length) done(); }
  };
  const tasks = () => {
    $("dsTasks").innerHTML = s.tasks.map((x,i)=>`<li class="${i<t?'ok':i===t?'cur':''}"><span class="n">${i<t?'✓':i+1}</span>${esc(x.text)}</li>`).join("");
    $("dsHint").innerHTML = t < s.tasks.length ? `Stuck? <button id="dsHb">Show hint</button>` : `<b style="color:#1e7a4c">✓ All queries correct — you're writing SQL!</b>`;
    const hb = $("dsHb"); if (hb) hb.onclick = () => { $("dsHint").innerHTML = esc(s.tasks[t].hint); };
  };
  b.querySelectorAll("[data-col]").forEach(cb => cb.onchange = () => { cb.checked ? q.cols.add(cb.dataset.col) : q.cols.delete(cb.dataset.col); run(); });
  $("dsW").onchange = e => { q.w = +e.target.value; run(); };
  $("dsO").onchange = e => { q.o = +e.target.value; run(); };
  $("dsL").onchange = e => { q.l = +e.target.value; run(); };
  tasks(); run(); if (was) done();
}, "Complete every query");

/* =====================================================================
   New activity: spot the dirty data
   ===================================================================== */
LM.register("dirty", (b, s, done, was) => {
  const keys = Object.keys(s.problems);
  b.innerHTML = `<div class="lm-diag"><div><table class="ds-table click">
      <tr>${s.cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>
      ${s.rows.map((r,i)=>`<tr>${r.map((v,j)=>`<td data-cell="${i}-${j}" class="${s.mono?'mono':''}">${v===""?"&nbsp;":esc(v)}</td>`).join("")}</tr>`).join("")}</table></div>
      <div id="dsInfo"><div class="lm-callout"><h4>Be a data detective 🔎</h4>This table has <b>${keys.length} problems</b>. Click the cells that look wrong.</div></div></div>`;
  const upd = req(b, keys.length); const seen = new Set(was ? keys : []); upd(seen.size);
  const cellKey = c => keys.find(k => s.problems[k].cells.includes(c));
  if (was) b.querySelectorAll("td").forEach(td => { if (cellKey(td.dataset.cell)) td.classList.add("found"); });
  b.querySelectorAll("td").forEach(td => td.onclick = () => {
    const k = cellKey(td.dataset.cell);
    if (!k) { td.classList.remove("nope"); void td.offsetWidth; td.classList.add("nope");
      b.querySelector("#dsInfo").innerHTML = `<div class="lm-callout"><h4>Looks fine</h4>That value seems OK. Keep looking. ${keys.length - seen.size} problem${keys.length-seen.size===1?'':'s'} left.</div>`; return; }
    const p = s.problems[k];
    p.cells.forEach(c => { const x = b.querySelector(`td[data-cell="${c}"]`); x && x.classList.add("found"); });
    b.querySelector("#dsInfo").innerHTML = `<div class="lm-callout"><h4>✓ ${esc(p.title)}</h4>${p.text}</div>`;
    seen.add(k); upd(seen.size); if (seen.size === keys.length) done();
  });
}, "Find every problem");

/* =====================================================================
   New activity: mean vs median with an outlier
   ===================================================================== */
LM.register("meanmedian", (b, s, done, was) => {
  const base = s.values, names = s.names;
  b.innerHTML = `<div class="lm-diag"><div>
      <div class="ds-bars" id="dsBars"></div><div class="ds-names">${names.map(n=>`<span>${esc(n)}</span>`).join("")}</div>
      <div style="margin-top:18px"><b>${esc(s.sliderLabel)}</b>: <span id="dsVal"></span>
      <input type="range" class="lm-range" id="dsR" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.start}"></div>
    </div><div>
      <div class="ds-big"><div style="background:#1479c9"><small>Mean (average)</small><b id="dsMean"></b></div><div style="background:#2ea56a"><small>Median (middle)</small><b id="dsMed"></b></div></div>
      <div class="lm-callout" id="dsMsg"></div></div></div>`;
  const $ = id => b.querySelector("#" + id);
  const upd = req(b, 1);
  let hit = !!was; upd(hit ? 1 : 0);
  const fmt = v => "R" + Math.round(v).toLocaleString("en-ZA") + "k";
  const set = x => {
    const vals = base.concat([x]), sorted = vals.slice().sort((a,c)=>a-c);
    const mean = vals.reduce((a,c)=>a+c,0) / vals.length, med = sorted[Math.floor(sorted.length/2)];
    const cap = Math.max(...base) * 3, top = Math.min(Math.max(...vals), cap);
    $("dsBars").innerHTML = vals.map((v,i)=>`<div class="b${i===vals.length-1?' out':''}" style="height:${Math.min(v,cap)/top*200}px"><span>${fmt(v)}${v>cap?' ↑':''}</span></div>`).join("")
      + `<div class="ds-line" style="bottom:${Math.min(mean,top)/top*200}px;border-color:#1479c9"><i style="color:#1479c9">mean</i></div>`
      + `<div class="ds-line" style="bottom:${med/top*200}px;border-color:#2ea56a"><i style="color:#2ea56a;left:auto;right:4px;top:4px">median</i></div>`;
    $("dsVal").textContent = fmt(x) + " per month";
    $("dsMean").textContent = fmt(mean); $("dsMed").textContent = fmt(med);
    const ratio = mean / med;
    $("dsMsg").innerHTML = ratio < 1.2 ? "<h4>Balanced</h4>With no extreme values, the mean and median are close together."
      : ratio < 2 ? "<h4>Watch the mean…</h4>One high salary is already pulling the <b>mean</b> up. The <b>median</b> barely moves."
      : `<h4>Outlier alert!</h4>The mean says the typical person earns <b>${fmt(mean)}</b>, but most people earn far less. The <b>median (${fmt(med)})</b> tells the real story. That's why house prices and salaries are usually reported as medians.`;
    if (x >= s.goal && !hit) { hit = true; upd(1); done(); }
  };
  $("dsR").oninput = e => set(+e.target.value);
  set(s.start);
}, "Drag the salary right up");

/* =====================================================================
   New activity: fit the regression line
   ===================================================================== */
LM.register("fitline", (b, s, done, was) => {
  const P = s.points, W = 560, H = 330, pad = 46;
  const X0 = 0, X1 = s.xMax, Y0 = 0, Y1 = s.yMax;
  const sx = x => pad + (x - X0) / (X1 - X0) * (W - pad - 16), sy = y => H - pad - (y - Y0) / (Y1 - Y0) * (H - pad - 16);
  b.innerHTML = `<div class="lm-diag"><div><svg class="ds-plot" viewBox="0 0 ${W} ${H}" id="dsPlot"></svg></div><div>
      <div class="lm-stat" style="background:#f4f8fc;border-radius:10px;padding:14px 16px;margin-bottom:12px"><small style="font-size:12px;color:#6b7a8b;text-transform:uppercase;letter-spacing:.8px">Average error</small><br><b id="dsErr" style="font-size:26px;color:#0f2742"></b>
        <div class="ds-meter"><i id="dsBar"></i></div><span style="font-size:12.5px;color:#6b7a8b">Goal: below ${s.goalLabel}</span></div>
      <label style="font-weight:600">Slope <span id="dsMv" style="color:#1479c9"></span></label>
      <input type="range" class="lm-range" id="dsM" min="${s.slope[0]}" max="${s.slope[1]}" step="${s.slope[2]}" value="${s.slope[3]}">
      <label style="font-weight:600">Starting price (intercept) <span id="dsCv" style="color:#1479c9"></span></label>
      <input type="range" class="lm-range" id="dsC" min="${s.icpt[0]}" max="${s.icpt[1]}" step="${s.icpt[2]}" value="${s.icpt[3]}">
      <div class="lm-callout" id="dsMsg" style="margin-top:10px"></div></div></div>`;
  const $ = id => b.querySelector("#" + id);
  const upd = req(b, 1); let hit = !!was; upd(hit ? 1 : 0);
  const draw = () => {
    const m = +$("dsM").value, c = +$("dsC").value;
    const err = P.reduce((a,[x,y]) => a + Math.abs(y - (m*x + c)), 0) / P.length;
    let g = "";
    for (let i = 0; i <= 5; i++) { const y = Y0 + (Y1-Y0)*i/5, x = X0 + (X1-X0)*i/5;
      g += `<line x1="${pad}" y1="${sy(y)}" x2="${W-16}" y2="${sy(y)}" stroke="#e6ecf2"/><text x="${pad-6}" y="${sy(y)+4}" text-anchor="end" font-size="11" fill="#6b7a8b" font-family="Arial">${s.yFmt(y)}</text>
            <text x="${sx(x)}" y="${H-pad+16}" text-anchor="middle" font-size="11" fill="#6b7a8b" font-family="Arial">${Math.round(x)}</text>`; }
    g += `<text x="${(W+pad)/2}" y="${H-8}" text-anchor="middle" font-size="12" fill="#44525f" font-family="Arial" font-weight="700">${esc(s.xLabel)}</text>
          <text x="14" y="${(H-pad)/2}" text-anchor="middle" font-size="12" fill="#44525f" font-family="Arial" font-weight="700" transform="rotate(-90 14 ${(H-pad)/2})">${esc(s.yLabel)}</text>`;
    P.forEach(([x,y]) => { g += `<line x1="${sx(x)}" y1="${sy(y)}" x2="${sx(x)}" y2="${sy(Math.max(Y0, Math.min(Y1, m*x+c)))}" stroke="#f28a3d" stroke-width="1.5" stroke-dasharray="3 3"/>`; });
    const ya = m*X0 + c, yb = m*X1 + c;
    g += `<line clip-path="url(#dsClip)" x1="${sx(X0)}" y1="${sy(ya)}" x2="${sx(X1)}" y2="${sy(yb)}" stroke="#1479c9" stroke-width="3.5"/>`;
    P.forEach(([x,y]) => { g += `<circle cx="${sx(x)}" cy="${sy(y)}" r="6" fill="#16324f" stroke="#fff" stroke-width="2"/>`; });
    $("dsPlot").innerHTML = `<defs><clipPath id="dsClip"><rect x="${pad}" y="10" width="${W-pad-16}" height="${H-pad-10}"/></clipPath></defs>` + g;
    $("dsMv").textContent = s.slopeFmt(m); $("dsCv").textContent = s.yFmt(c);
    $("dsErr").textContent = s.yFmt(err);
    const good = err <= s.goal, pct = Math.max(4, Math.min(100, 100 - (err - s.goal) / (s.bad - s.goal) * 100));
    $("dsBar").style.width = pct + "%"; $("dsBar").style.background = good ? "#2ea56a" : err < s.goal * 2 ? "#f6c344" : "#e05a5a";
    $("dsMsg").innerHTML = good ? `<h4>✓ Great fit!</h4>Your line is close to every point. A computer does exactly this, but tries millions of lines in a split second to find the one with the smallest error. That's <b>linear regression</b>.`
      : "<h4>Keep adjusting</h4>The orange dashed lines show how far each house is from your prediction. Make them as short as you can.";
    if (good && !hit) { hit = true; upd(1); done(); }
  };
  $("dsM").oninput = draw; $("dsC").oninput = draw; draw();
}, "Get the error below the goal");

/* =====================================================================
   Illustrations
   ===================================================================== */
const ART = {};
// Data science lifecycle ring (6 clickable stages)
(function(){
  const cx = 250, cy = 175, R = 125, stages = [
    ["ask","1. Ask",C.blue,"?"],["collect","2. Collect",C.teal,"⬇"],["clean","3. Clean",C.orange,"✦"],
    ["explore","4. Explore",C.purple,"📊"],["model","5. Model",C.green,"⚙"],["communicate","6. Share",C.pink,"💬"]];
  let g = `<svg viewBox="0 0 500 350"><rect width="500" height="350" rx="14" fill="#f4f8fc"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#c9d6e3" stroke-width="3" stroke-dasharray="8 7"/>
    <text x="${cx}" y="${cy-6}" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="${C.navy}">Data science</text>
    <text x="${cx}" y="${cy+14}" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="${C.navy}">lifecycle</text>
    <text x="${cx}" y="${cy+36}" text-anchor="middle" font-family="Arial" font-size="11" fill="#6b7a8b">it's a loop, not a line ↻</text>`;
  stages.forEach(([k,label,col,ic],i) => {
    const a = -Math.PI/2 + i * Math.PI*2/6, x = cx + R*Math.cos(a), y = cy + R*Math.sin(a);
    g += `<g class="part" data-part="${k}"><rect x="${x-52}" y="${y-38}" width="104" height="76" rx="12"/>
      <circle cx="${x}" cy="${y-8}" r="20" fill="${col}"/><text x="${x}" y="${y-2}" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial">${ic}</text>
      <text x="${x}" y="${y+28}" text-anchor="middle" font-family="Arial" font-size="12.5" font-weight="700" fill="${C.ink}">${label}</text></g>`;
  });
  ART.lifecycle = g + "</svg>";
})();

ART.city = `<svg viewBox="0 0 800 380">
  <defs><linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dff1fb"/><stop offset="1" stop-color="#f7fbfe"/></linearGradient></defs>
  <rect width="800" height="380" fill="url(#dsky)"/>
  <rect x="300" y="36" width="150" height="70" rx="10" fill="#fff" stroke="${C.cyan}" stroke-width="3"/>
  <g fill="${C.orange}"><rect x="318" y="76" width="14" height="20"/><rect x="338" y="64" width="14" height="32"/><rect x="358" y="54" width="14" height="42"/></g>
  <path d="M384 90 L400 70 L414 78 L432 52" stroke="${C.blue}" stroke-width="3" fill="none"/>
  <text x="375" y="124" text-anchor="middle" font-family="Arial" font-weight="700" font-size="13" fill="${C.blue}">DATA + MODELS</text>
  <g stroke="${C.cyan}" stroke-width="2" stroke-dasharray="5 6" fill="none">
    <path d="M110 190 C150 130 280 110 310 100"/><path d="M250 170 C270 140 320 120 330 108"/><path d="M400 170 V130"/><path d="M560 180 C520 130 450 116 440 106"/><path d="M700 200 C660 110 480 96 450 90"/></g>
  <rect x="0" y="330" width="800" height="50" fill="#cfe3d3"/>
  <rect x="60" y="200" width="110" height="130" fill="${C.purple}"/><rect x="72" y="214" width="86" height="54" rx="4" fill="#1c1640"/><path d="M106 228l22 13-22 13z" fill="#fff"/><rect x="98" y="290" width="34" height="40" fill="#4a3fa0"/>
  <path d="M200 200 L260 172 L320 200Z" fill="${C.navy}"/><rect x="206" y="200" width="108" height="130" fill="#e7edf4"/>
  <g fill="${C.navy}"><rect x="218" y="214" width="12" height="100"/><rect x="246" y="214" width="12" height="100"/><rect x="274" y="214" width="12" height="100"/><rect x="298" y="214" width="8" height="100"/></g><rect x="200" y="314" width="120" height="16" fill="${C.navy}"/>
  <rect x="350" y="180" width="110" height="150" fill="#fff" stroke="#c9d6e3" stroke-width="3"/><rect x="390" y="196" width="30" height="30" fill="${C.pink}"/><path d="M405 200v22M394 211h22" stroke="#fff" stroke-width="6"/>
  <g fill="#bfe3f0"><rect x="364" y="240" width="22" height="18"/><rect x="394" y="240" width="22" height="18"/><rect x="424" y="240" width="22" height="18"/><rect x="364" y="268" width="22" height="18"/><rect x="424" y="268" width="22" height="18"/></g><rect x="394" y="290" width="22" height="40" fill="${C.teal}"/>
  <rect x="490" y="210" width="130" height="120" fill="${C.orange}"/><path d="M490 210h130l-8-26H498z" fill="#ffb877"/><g fill="#fff"><rect x="504" y="228" width="44" height="40" rx="3"/><rect x="562" y="228" width="44" height="40" rx="3"/></g><rect x="540" y="284" width="30" height="46" fill="#b85a15"/>
  <rect x="650" y="240" width="100" height="90" fill="${C.green}"/><g fill="#d6f5e4"><rect x="662" y="254" width="20" height="16"/><rect x="690" y="254" width="20" height="16"/><rect x="718" y="254" width="20" height="16"/></g>
  <path d="M700 150c8 6 10 16 9 26h-18c-1-10 1-20 9-26z" fill="#fff" stroke="${C.navy}" stroke-width="2"/><path d="M694 176l6 14 6-14z" fill="${C.orange}"/><rect x="686" y="290" width="28" height="40" fill="#1e7a4c"/>
  <g font-family="Arial" font-size="12" font-weight="700" fill="${C.ink}" text-anchor="middle"><text x="115" y="350">Streaming</text><text x="260" y="350">Bank</text><text x="405" y="350">Hospital</text><text x="555" y="350">Online shop</text><text x="700" y="350">Startup</text></g>
</svg>`;

ART.sql = `<svg viewBox="0 0 760 196">
  <rect width="760" height="196" rx="12" fill="#10263d"/>
  <g font-family="Menlo,Consolas,monospace" font-size="22" font-weight="700">
    <g class="part" data-part="select"><rect x="24" y="14" width="712" height="38" rx="8"/><text x="40" y="41"><tspan fill="#ff7bb0">SELECT</tspan><tspan fill="#e6edf3"> name, spend</tspan></text></g>
    <g class="part" data-part="from"><rect x="24" y="56" width="712" height="38" rx="8"/><text x="40" y="83"><tspan fill="#ff7bb0">FROM</tspan><tspan fill="#e6edf3"> customers</tspan></text></g>
    <g class="part" data-part="where"><rect x="24" y="98" width="712" height="38" rx="8"/><text x="40" y="125"><tspan fill="#ff7bb0">WHERE</tspan><tspan fill="#e6edf3"> city = </tspan><tspan fill="#a5d6ff">'Johannesburg'</tspan></text></g>
    <g class="part" data-part="order"><rect x="24" y="140" width="712" height="38" rx="8"/><text x="40" y="167"><tspan fill="#ff7bb0">ORDER BY</tspan><tspan fill="#e6edf3"> spend </tspan><tspan fill="#ff7bb0">DESC</tspan><tspan fill="#e6edf3">;</tspan></text></g>
  </g>
</svg>`;

const ICON = {
  chart:`<svg viewBox="0 0 64 64"><rect x="8" y="34" width="10" height="22" rx="2" fill="${C.teal}"/><rect x="22" y="24" width="10" height="32" rx="2" fill="${C.blue}"/><rect x="36" y="14" width="10" height="42" rx="2" fill="${C.purple}"/><path d="M8 20 L24 12 L38 16 L56 4" stroke="${C.orange}" stroke-width="3" fill="none"/></svg>`,
  brain:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="${C.light}" stroke="${C.green}" stroke-width="3"/><g fill="${C.green}"><circle cx="22" cy="26" r="4"/><circle cx="42" cy="24" r="4"/><circle cx="32" cy="40" r="4"/><circle cx="44" cy="42" r="3"/></g><path d="M22 26L42 24L32 40L22 26M42 24L44 42" stroke="${C.green}" stroke-width="2" fill="none"/></svg>`,
  pipe:`<svg viewBox="0 0 64 64"><rect x="6" y="26" width="52" height="12" rx="6" fill="${C.orange}"/><rect x="6" y="10" width="14" height="44" rx="5" fill="${C.navy}"/><rect x="44" y="10" width="14" height="44" rx="5" fill="${C.navy}"/><g fill="#fff"><circle cx="28" cy="32" r="3"/><circle cx="36" cy="32" r="3"/></g></svg>`,
  rocket:`<svg viewBox="0 0 64 64"><path d="M32 6c10 6 14 18 12 30H20C18 24 22 12 32 6z" fill="${C.light}" stroke="${C.navy}" stroke-width="3"/><circle cx="32" cy="24" r="5" fill="${C.cyan}"/><path d="M20 36l-8 10 10-2M44 36l8 10-10-2" fill="${C.pink}"/><path d="M26 40l6 16 6-16z" fill="${C.orange}"/></svg>`,
  stat:(t,col)=>`<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="44" rx="10" fill="${col}"/><text x="32" y="40" text-anchor="middle" font-size="${t.length>2?14:20}" font-weight="700" font-family="Arial" fill="#fff">${t}</text></svg>`,
  kw:(t)=>`<svg viewBox="0 0 64 64"><rect x="4" y="14" width="56" height="36" rx="7" fill="#10263d"/><text x="32" y="37" text-anchor="middle" font-size="${t.length>6?9:t.length>4?11:13}" font-weight="700" font-family="Menlo,Consolas,monospace" fill="#ff7bb0">${t}</text></svg>`
};

/* =====================================================================
   Lessons
   ===================================================================== */
window.LESSON_CONTENT = {

"1.1.2": { slides: [
  { type:"diagram", kicker:"1.1.2 · The Data Science Lifecycle", title:"From question to answer", lead:"Every data project follows the same loop. Click each stage to learn what happens there.",
    art: ART.lifecycle,
    parts:{ ask:{title:"1 · Ask a question", text:"Every project starts with a clear business question, e.g. <i>“Why are customers cancelling their subscriptions?”</i> A vague question gives a vague answer."},
            collect:{title:"2 · Collect the data", text:"Pull data from databases, spreadsheets, apps, sensors or surveys. Usually with <b>SQL</b> or <b>Python</b>."},
            clean:{title:"3 · Clean it", text:"Fix missing values, duplicates, typos and wrong formats. This often takes <b>60–80% of the time</b>!"},
            explore:{title:"4 · Explore", text:"Make charts and summary statistics to spot patterns, trends and outliers. This is called <b>EDA</b> (exploratory data analysis)."},
            model:{title:"5 · Model", text:"Train a <b>machine learning</b> model to predict or classify, e.g. which customers are likely to leave next month."},
            communicate:{title:"6 · Share the story", text:"Turn results into a clear chart or dashboard that a manager can act on. Then new questions start the loop again."} } },
  { type:"flip", kicker:"Interactive activity", title:"Four data careers, four different jobs", lead:"People often mix these up. Flip each card.",
    cards:[
      { icon:ICON.chart, title:"Data Analyst", sub:"What happened?", back:"Answers questions about the past with <b>SQL, Excel and dashboards</b> (Power BI, Tableau).<br><br>Great first job in data." },
      { icon:ICON.brain, title:"Data Scientist", sub:"What will happen?", back:"Uses <b>statistics and machine learning</b> in Python to make predictions and find hidden patterns." },
      { icon:ICON.pipe, title:"Data Engineer", sub:"Where does data live?", back:"Builds the <b>pipelines</b> that move, clean and store data so analysts and scientists can use it." },
      { icon:ICON.rocket, title:"ML Engineer", sub:"Make it run for real", back:"Takes a data scientist's model and <b>puts it into production</b> so it works reliably inside an app for millions of users." }
    ]},
  { type:"drag", kicker:"Check your understanding", title:"Which stage is it?", lead:"Drag each task to the lifecycle stage where it belongs.", cols:3,
    targets:["Ask","Collect","Clean","Explore","Model","Share"],
    items:[ {text:"Decide what question to answer", target:"Ask"}, {text:"Download sales data from the database", target:"Collect"},
            {text:"Remove duplicate rows", target:"Clean"}, {text:"Plot sales by month to spot trends", target:"Explore"},
            {text:"Train a model that predicts churn", target:"Model"}, {text:"Present findings to the CEO", target:"Share"} ],
    explain:"Ask → Collect → Clean → Explore → Model → Share, then back to Ask with new questions." }
]},

"1.1.3": { slides: [
  { type:"hotspots", kicker:"1.1.3 · Real-World Use Cases", title:"Data science is everywhere", lead:"Click each dot to see how data science helps that business.",
    art: ART.city,
    spots:[
      { x:14, y:62, title:"Streaming: recommendations", text:"Streaming apps study what millions of people watch and skip, then predict what <i>you</i> will enjoy next. That “Because you watched…” row is a machine learning model." },
      { x:32.5, y:60, title:"Bank: fraud detection", text:"A model checks every card payment in milliseconds. If it looks unusual (a different country, a strange amount at 3am), it's flagged or blocked." },
      { x:50.5, y:56, title:"Hospital: predicting risk", text:"Hospitals use patient data to predict who is at risk of getting sicker, so doctors can act early. Models can also help read X-rays and scans." },
      { x:69.5, y:62, title:"Online shop: forecasting demand", text:"Retailers forecast how many of each product they'll sell, so shelves aren't empty on Black Friday. Plus “customers also bought…” suggestions." },
      { x:87.5, y:44, title:"Startup: A/B testing", text:"Show half the users version A of a sign-up page and half version B. Statistics tells you if B <i>really</i> works better or if it was just luck." }
    ]},
  { type:"mc", kicker:"Check your understanding", title:"Question 1 of 2",
    q:"Your bank sends you an SMS asking “Did you just try to spend R8,000 in another country?” Which data science application is this?",
    options:["Recommendation system","Fraud detection","Demand forecasting","A/B testing"], answer:1,
    explain:"A fraud detection model spotted a transaction that didn't match your normal spending pattern." },
  { type:"mc", kicker:"Check your understanding", title:"Question 2 of 2",
    q:"A startup wants to know whether a green or a blue “Buy” button gets more clicks. What should they run?",
    options:["A fraud model","An A/B test","A database backup","A pie chart"], answer:1,
    explain:"An A/B test shows each version to a random group of users and compares the results using statistics." }
]},

"1.2.2": { slides: [
  { type:"flip", kicker:"1.2.2 · Mean, Median & Outliers", title:"Five numbers that describe any dataset", lead:"Flip each card. Example data: test scores <code>4, 6, 6, 7, 12</code>",
    cards:[
      { icon:ICON.stat("x̄",C.blue), title:"Mean", sub:"the average", back:"Add everything up and divide by how many.<br><code>(4+6+6+7+12) ÷ 5 = 7</code>" },
      { icon:ICON.stat("M",C.green), title:"Median", sub:"the middle value", back:"Sort the numbers and take the middle one.<br><code>4, 6, <b>6</b>, 7, 12 → 6</code>" },
      { icon:ICON.stat("Mo",C.purple), title:"Mode", sub:"most common", back:"The value that appears most often.<br><code>6</code> appears twice → mode = 6" },
      { icon:ICON.stat("↔",C.orange), title:"Range", sub:"spread", back:"Biggest minus smallest.<br><code>12 − 4 = 8</code>" },
      { icon:ICON.stat("σ",C.teal), title:"Standard deviation", sub:"typical distance from the mean", back:"Small σ = values bunched together.<br>Large σ = values spread out.<br>Here σ ≈ 2.8" }
    ]},
  { type:"meanmedian", kicker:"Interactive tool", title:"What one outlier does to the average", lead:"Eight people earn normal salaries. Drag the slider to change what the ninth person, the boss, earns, and watch the <b>mean</b> and <b>median</b>.",
    values:[12,15,18,20,22,25,28,30], names:["Ama","Ben","Chi","Dan","Eve","Fay","Gus","Hlo","Boss"],
    sliderLabel:"Boss's salary", min:20, max:1000, step:10, start:35, goal:400 },
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"A news site reports the “typical” house price in a suburb where a few mansions cost R50 million. Which measure should it use?",
    options:["Mean, because it uses every value","Median, because it isn't pulled by extreme values","Mode","Range"], answer:1,
    explain:"The median ignores how extreme the mansions are, so it reflects what a typical house really costs." }
]},

"1.2.3": { slides: [
  { type:"mc", kicker:"Statistics checkpoint", title:"Question 1 of 4",
    q:"What is the mean of 2, 4, 6 and 8?",
    options:["4","5","6","20"], answer:1, explain:"(2 + 4 + 6 + 8) ÷ 4 = 20 ÷ 4 = 5." },
  { type:"mc", kicker:"Statistics checkpoint", title:"Question 2 of 4",
    q:"What is the median of 9, 1, 20, 3, 7?",
    options:["3","7","8","9"], answer:1, explain:"Sorted: 1, 3, 7, 9, 20. The middle value is 7." },
  { type:"mc", kicker:"Statistics checkpoint", title:"Question 3 of 4",
    q:"Two classes both have a mean mark of 60%. Class A has a standard deviation of 3, Class B has 20. What does this tell you?",
    options:["Class A did better","Class B's marks are much more spread out","Class B cheated","Nothing, they're identical"], answer:1,
    explain:"Same average, but a larger standard deviation means Class B had some very high and some very low marks." },
  { type:"drag", kicker:"Statistics checkpoint", title:"Question 4 of 4: pick the right measure", lead:"Drag each question to the statistic that answers it best.",
    targets:["Mean","Median","Mode"],
    items:[ {text:"Most popular shoe size to stock", target:"Mode"}, {text:"Typical salary in a company with a billionaire CEO", target:"Median"},
            {text:"Average daily temperature this week", target:"Mean"}, {text:"Most common reason customers call support", target:"Mode"},
            {text:"Typical house price in a mixed suburb", target:"Median"} ],
    explain:"Mode for “most common”, median when there are outliers, mean when values are fairly balanced." }
]},

"1.3.2": { slides: [
  { type:"diagram", kicker:"1.3.2 · SQL in Action", title:"Reading a SQL query", lead:"SQL is how you ask a database questions. It reads almost like English. Click each line.",
    art: ART.sql,
    parts:{ select:{title:"SELECT: which columns", text:"Choose the columns you want back. <code>SELECT *</code> means “all columns”."},
            from:{title:"FROM: which table", text:"The table to read from. Databases hold many tables, like sheets in a workbook."},
            where:{title:"WHERE: which rows", text:"Filter the rows. Only customers whose city is Johannesburg are returned. Text goes in 'single quotes'."},
            order:{title:"ORDER BY: sort it", text:"Sort the results. <code>DESC</code> = biggest first, <code>ASC</code> = smallest first."} } },
  { type:"sqlbuilder", kicker:"Hands-on lab", title:"Query a real table", lead:"This is a <code>customers</code> table from an online shop. Use the controls to build each query. The SQL writes itself as you go.",
    tasks:[
      { text:"Show only the name and spend columns.", hint:"Untick city and age under SELECT.", check:q => q.cols === "name,spend" },
      { text:"Now show only customers from Johannesburg.", hint:"Under WHERE choose city = 'Johannesburg'.", check:q => q.where === "city = 'Johannesburg'" },
      { text:"Find the top 3 spenders from ALL cities.", hint:"WHERE (none), ORDER BY spend DESC, LIMIT 3.", check:q => q.where === "" && q.order === "spend DESC" && q.limit === "3" }
    ]},
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"Which query returns customers older than 30, youngest first?",
    options:["SELECT * FROM customers ORDER BY age DESC;","SELECT * FROM customers WHERE age > 30 ORDER BY age ASC;","SELECT age > 30 FROM customers;","SELECT * WHERE customers age > 30;"], answer:1,
    explain:"WHERE filters to age > 30, and ORDER BY age ASC sorts from youngest to oldest." }
]},

"1.3.3": { slides: [
  { type:"dirty", kicker:"1.3.3 · Cleaning Messy Data", title:"Spot the dirty data", lead:"Real data is never perfect. This orders table has problems a data scientist must fix before any analysis.",
    cols:["order_id","date","city","age","amount (R)"], mono:true,
    rows:[ ["1001","2026-03-01","Johannesburg","34","450.00"], ["1002","2026-03-02","Joburg","28","320.00"],
           ["1003","2026-03-02","Cape Town","","150.00"], ["1004","2026-03-03","Durban","250","900.00"],
           ["1005","2026-03-04","Pretoria","41","610.00"], ["1005","2026-03-04","Pretoria","41","610.00"],
           ["1007","04/03/2026","Cape Town","30","275.00"], ["1008","2026-03-05","Durban","37","-120.00"] ],
    problems:{
      typo:{ cells:["1-2"], title:"Inconsistent spelling", text:"<b>Joburg</b> and <b>Johannesburg</b> are the same city. A computer would count them separately. Standardise the spelling." },
      missing:{ cells:["2-3"], title:"Missing value", text:"The age is blank. You can drop the row, or fill it in with a sensible value like the median age." },
      impossible:{ cells:["3-3"], title:"Impossible value", text:"Nobody is <b>250</b> years old. Probably a typing error (25?). Check the source or treat it as missing." },
      dup:{ cells:["5-0","5-1","5-2","5-3","5-4","4-0"], title:"Duplicate row", text:"Order <b>1005</b> appears twice. Counting it twice would inflate your sales. Remove the copy." },
      date:{ cells:["6-1"], title:"Wrong date format", text:"Every other date is <code>YYYY-MM-DD</code>. <code>04/03/2026</code> could mean 4 March or 3 April! Convert all dates to one format." },
      neg:{ cells:["7-4"], title:"Suspicious negative amount", text:"An order can't cost <b>−R120</b>. It might be a refund recorded in the wrong table. Investigate before using it." } } },
  { type:"drag", kicker:"Check your understanding", title:"Match each problem to its fix", lead:"Drag each data problem to the best way to fix it.", cols:2,
    targets:["Remove the extra copy","Standardise the spelling","Fill with the median or drop the row","Convert to one standard format"],
    items:[ {text:"Duplicate row", target:"Remove the extra copy"}, {text:"“Joburg” vs “Johannesburg”", target:"Standardise the spelling"},
            {text:"Blank age", target:"Fill with the median or drop the row"}, {text:"Dates written two different ways", target:"Convert to one standard format"} ],
    explain:"Cleaning is about making data consistent and trustworthy before you analyse it." },
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"Roughly how much of a data scientist's time is often spent finding and cleaning data?",
    options:["About 5%","About 20%","More than half","None: tools do it automatically"], answer:2,
    explain:"Surveys of data scientists regularly put it at well over half. Clean data is the foundation of every good model." }
]},

"3.2.1": { slides: [
  { type:"video", kicker:"3.2.1 · Linear Regression", title:"Linear regression explained", lead:"Watch the short video, then try fitting a line yourself." },
  { type:"fitline", kicker:"Hands-on lab", title:"Fit the line yourself", lead:"Each dot is a house: its size and its price. Adjust the slope and intercept to draw the line that predicts price best.",
    points:[[45,560],[60,640],[72,790],[85,850],[100,1010],[110,1060],[125,1230],[140,1300],[160,1480],[180,1650]],
    xMax:200, yMax:2000, xLabel:"House size (m²)", yLabel:"Price (R thousands)",
    yFmt: v => "R" + Math.round(v).toLocaleString("en-ZA") + "k", slopeFmt: m => "R" + (m).toFixed(1) + "k per m²",
    slope:[0,15,0.1,3], icpt:[0,800,10,100], goal:45, bad:500, goalLabel:"R45k" },
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"Using a line with slope R8k per m² and intercept R200k, what's the predicted price of a 100 m² house?",
    options:["R800k","R1,000k (R1 million)","R208k","R2 million"], answer:1,
    explain:"Price = 8 × 100 + 200 = 1,000 → about R1 million. That's all a linear regression prediction is." }
]}
};
window.LESSON_TITLE_OVERRIDES = {};
})();
