/* =====================================================================
   IndustryVerse — Environmental Scientist interactive lessons
   New activity types: pollution tracer, carbon footprint calculator.
   Load AFTER lesson-mode.js. All illustrations are original SVG.
   ===================================================================== */
(function(){
const LM = window.LessonMode, esc = LM.esc, req = LM.req;
const C = { navy:"#16324f", blue:"#1479c9", teal:"#12a3b8", cyan:"#3fc6e0", orange:"#f28a3d", yellow:"#f6c344",
            green:"#2ea56a", dgreen:"#1e7a4c", purple:"#6b5bd6", pink:"#e05a8a", grey:"#9aa7b6", light:"#eef3f8",
            ink:"#1d2733", sand:"#e8d49a", brown:"#a0703c", sky:"#dff1fb", water:"#5ab4e5" };

const st = document.createElement("style");
st.textContent = `
.lm .static>rect:first-child{fill:none;stroke:none}
.ev-map{position:relative}
.ev-map svg{width:100%;height:auto;display:block;border-radius:12px;border:1px solid #e1e7ee}
.ev-map .stn{cursor:pointer}
.ev-map .stn circle.ring{fill:#fff;stroke:#1479c9;stroke-width:3;transition:all .2s}
.ev-map .stn:hover circle.ring{stroke:#f28a3d;r:17}
.ev-map .stn.tested circle.ring{stroke:#2ea56a}
.ev-map .stn.on circle.ring{fill:#fdeee3;stroke:#f28a3d;stroke-width:4}
.ev-map .stn .pulse{fill:none;stroke:#1479c9;stroke-width:2;animation:evp 1.8s infinite;transform-box:fill-box;transform-origin:center}
.ev-map .stn.tested .pulse{display:none}
@keyframes evp{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.9)}}
.ev-read{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.ev-read div{background:#f4f8fc;border-radius:9px;padding:9px 12px;font-size:13px;color:#44525f}
.ev-read b{display:block;font-size:19px;color:#0f2742}
.ev-read .bad{background:#fdeeee}.ev-read .bad b{color:#c0392b}
.ev-read .warn{background:#fff6e0}.ev-read .warn b{color:#b07a00}
.ev-read .good{background:#e9f8ef}.ev-read .good b{color:#1e7a4c}
.ev-badge{display:inline-block;border-radius:20px;padding:3px 10px;font-size:12px;font-weight:700;margin-left:8px;vertical-align:middle}
.ev-verdict{margin-top:14px;padding-top:12px;border-top:1px solid #e1e7ee}
.ev-verdict .opts{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.ev-log{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.ev-log span{font-size:12px;background:#eef2f6;border-radius:12px;padding:3px 9px;color:#44525f}
.ev-calc{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.ev-sl{margin-bottom:14px}
.ev-sl label{display:flex;justify-content:space-between;font-weight:600;font-size:14.5px}
.ev-sl label span{color:#1479c9}
.ev-sl small{display:block;color:#6b7a8b;font-size:12px}
.ev-total{border-radius:14px;padding:16px 18px;color:#fff;transition:background .3s}
.ev-total small{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.8px;opacity:.85}
.ev-total b{font-size:38px}
.ev-bars{margin-top:14px}
.ev-bar{display:grid;grid-template-columns:110px 1fr 60px;gap:8px;align-items:center;font-size:13px;margin-bottom:7px}
.ev-bar i{display:block;height:14px;border-radius:7px;transition:width .3s}
.ev-scale{position:relative;height:40px;margin-top:16px;background:linear-gradient(90deg,#2ea56a,#f6c344 45%,#e05a5a);border-radius:8px}
.ev-scale .mk{position:absolute;top:-4px;bottom:-4px;width:3px;background:#0f2742;transition:left .3s}
.ev-scale .ref{position:absolute;top:44px;font-size:11px;color:#44525f;transform:translateX(-50%);white-space:nowrap}
.ev-scale .ref::before{content:"";position:absolute;left:50%;top:-10px;width:1px;height:8px;background:#6b7a8b}
`;
document.head.appendChild(st);

/* =====================================================================
   Activity: trace the pollution along a river
   ===================================================================== */
LM.register("tracepollution", (b, s, done, was) => {
  const need = s.minTests || 3;
  b.innerHTML = `<div class="lm-diag"><div class="ev-map">${s.art}</div>
    <div><div id="evInfo"><div class="lm-callout"><h4>🧪 Water testing kit ready</h4>Click the numbered sampling points on the river to test the water. Test at least <b>${need}</b> points, then decide where the pollution comes from.</div></div>
      <div class="ev-log" id="evLog"></div>
      <div class="ev-verdict" id="evVerdict"></div></div></div>`;
  const $ = id => b.querySelector("#" + id);
  const tested = new Set();
  const lvl = (k, v) => { const r = s.limits[k]; return v == null ? "" : (r.bad(v) ? "bad" : r.warn(v) ? "warn" : "good"); };
  const verdict = () => {
    const v = $("evVerdict");
    if (tested.size < need && !was) { v.innerHTML = `<span class="lm-hint">🔒 Test ${need - tested.size} more point${need - tested.size === 1 ? "" : "s"} to unlock your conclusion.</span>`; return; }
    v.innerHTML = `<b>${esc(s.question)}</b><div class="opts">${s.suspects.map((x,i)=>`<button class="lm-btn ghost" data-sus="${i}">${esc(x)}</button>`).join("")}</div><div class="lm-fb" id="evFb"></div>`;
    v.querySelectorAll("[data-sus]").forEach(bt => bt.onclick = () => {
      const i = +bt.dataset.sus, fb = $("evFb");
      if (i === s.answer) { fb.className = "lm-fb show ok"; fb.innerHTML = `<b>✓ Case solved!</b> ${s.explain}`; v.querySelectorAll("[data-sus]").forEach(x => { if (x !== bt) x.disabled = true; }); bt.classList.remove("ghost"); bt.style.background = "#2ea56a"; bt.onclick = null; done(); }
      else { fb.className = "lm-fb show no"; fb.innerHTML = `<b>Not quite.</b> ${esc(s.hints[i] || "Compare the readings just above and just below that point.")}`; }
    });
    if (was) { const bt = v.querySelector(`[data-sus="${s.answer}"]`); bt && bt.click(); }
  };
  b.querySelectorAll(".stn").forEach(g => g.addEventListener("click", () => {
    const k = g.dataset.st, r = s.readings[k];
    b.querySelectorAll(".stn").forEach(x => x.classList.remove("on"));
    g.classList.add("on", "tested"); tested.add(k);
    const cells = Object.keys(s.limits).map(m => `<div class="${lvl(m, r[m])}">${esc(s.limits[m].label)}<b>${r[m]}${s.limits[m].unit}</b></div>`).join("");
    const cls = { good:["Healthy","#e9f8ef","#1e7a4c"], warn:["Watch","#fff6e0","#b07a00"], bad:["Polluted","#fdeeee","#c0392b"] }[r.status];
    $("evInfo").innerHTML = `<div class="lm-callout"><h4>Point ${esc(k)} · ${esc(r.name)}<span class="ev-badge" style="background:${cls[1]};color:${cls[2]}">${cls[0]}</span></h4>
      <div class="ev-read">${cells}</div><p style="margin:10px 0 0;font-size:14px">${r.note}</p></div>`;
    $("evLog").innerHTML = [...tested].sort().map(x => `<span>✓ Point ${esc(x)}</span>`).join("");
    verdict();
  }));
  if (was) s.art && Object.keys(s.readings).forEach(k => tested.add(k));
  verdict();
}, "Test the water and solve the case");

/* =====================================================================
   Activity: carbon footprint calculator
   ===================================================================== */
LM.register("carbon", (b, s, done, was) => {
  const F = s.factors;
  b.innerHTML = `<div class="ev-calc"><div>${F.map((f,i)=>`<div class="ev-sl"><label>${esc(f.label)} <span id="evV${i}"></span></label>
      <input type="range" class="lm-range" id="evS${i}" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.start}"><small>${esc(f.hint)}</small></div>`).join("")}</div>
    <div><div class="ev-total" id="evTot"><small>Your yearly carbon footprint</small><b id="evT"></b> <span style="font-size:16px">tonnes CO₂</span></div>
      <div class="ev-scale"><div class="mk" id="evMk"></div>${s.refs.map(r=>`<div class="ref" style="left:${r.t/s.maxT*100}%">${esc(r.label)}</div>`).join("")}</div>
      <div class="ev-bars" style="margin-top:34px" id="evBars"></div>
      <div class="lm-callout" id="evMsg" style="margin-top:10px"></div></div></div>`;
  const $ = id => b.querySelector("#" + id);
  const upd = req(b, 1); let hit = !!was; upd(hit ? 1 : 0);
  const cols = [C.orange, C.purple, C.pink, C.blue, C.teal];
  const calc = () => {
    const parts = F.map((f,i) => { const v = +$("evS"+i).value; $("evV"+i).textContent = f.fmt(v); return v * f.kg / 1000; });
    const tot = parts.reduce((a,c)=>a+c,0), mx = Math.max(...parts, .01);
    $("evT").textContent = tot.toFixed(1);
    $("evTot").style.background = tot <= s.goal ? C.green : tot <= s.goal*1.6 ? "#d9930d" : "#c0392b";
    $("evMk").style.left = Math.min(100, tot / s.maxT * 100) + "%";
    $("evBars").innerHTML = F.map((f,i)=>`<div class="ev-bar"><span>${esc(f.short)}</span><i style="width:${parts[i]/mx*100}%;background:${cols[i%cols.length]}"></i><span>${parts[i].toFixed(1)} t</span></div>`).join("");
    const big = F[parts.indexOf(Math.max(...parts))];
    $("evMsg").innerHTML = tot <= s.goal
      ? `<h4>✓ Goal reached: ${tot.toFixed(1)} t</h4>${s.win}`
      : `<h4>Your biggest source: ${esc(big.short)}</h4>${big.tip} Get below <b>${s.goal} tonnes</b> to complete the activity.`;
    if (tot <= s.goal && !hit) { hit = true; upd(1); done(); }
  };
  F.forEach((_,i) => $("evS"+i).oninput = calc); calc();
}, "Get your footprint under the goal");

/* =====================================================================
   Illustrations
   ===================================================================== */
const ART = {};

// Earth's four spheres (clickable)
ART.spheres = `<svg viewBox="0 0 760 360">
  <rect width="760" height="360" rx="14" fill="${C.sky}"/>
  <g class="part" data-part="atmosphere"><rect x="10" y="10" width="740" height="120" rx="12"/>
    <circle cx="660" cy="62" r="30" fill="${C.yellow}"/>
    <path d="M120 80c0-18 22-26 34-14 6-16 34-16 38 2 16-2 22 18 8 24H128c-12 0-14-10-8-12z" fill="#fff"/>
    <path d="M380 60c0-14 18-20 28-10 5-13 28-13 31 2 13-2 18 14 6 19H386c-10 0-11-8-6-11z" fill="#fff"/>
    <g stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 5" fill="none"><path d="M200 116c30-10 60 10 90 0"/><path d="M470 110c30-10 60 10 90 0"/></g>
    <text x="30" y="36" font-family="Arial" font-weight="700" font-size="14" fill="${C.blue}">ATMOSPHERE · air</text></g>
  <g class="part" data-part="geosphere"><rect x="10" y="136" width="330" height="214" rx="12"/>
    <path d="M20 340 L120 180 L170 240 L230 160 L330 340Z" fill="#b89572"/><path d="M120 180 L140 212 L100 212Z M230 160 L252 196 L208 196Z" fill="#fff"/>
    <rect x="20" y="300" width="310" height="44" fill="#8a6440"/><g fill="#6e4d2f"><circle cx="70" cy="320" r="6"/><circle cx="160" cy="330" r="5"/><circle cx="260" cy="318" r="7"/></g>
    <text x="30" y="160" font-family="Arial" font-weight="700" font-size="14" fill="#6e4d2f">GEOSPHERE · rock &amp; soil</text></g>
  <g class="part" data-part="hydrosphere"><rect x="560" y="136" width="190" height="214" rx="12"/>
    <path d="M566 230 H744 V344 H566Z" fill="${C.water}"/>
    <g stroke="#fff" stroke-width="3" fill="none"><path d="M580 250c14-8 28 8 42 0s28 8 42 0 28 8 42 0"/><path d="M590 290c14-8 28 8 42 0s28 8 42 0 28 8 42 0"/></g>
    <text x="574" y="160" font-family="Arial" font-weight="700" font-size="14" fill="${C.blue}">HYDROSPHERE</text><text x="574" y="178" font-family="Arial" font-size="12" fill="${C.blue}">water</text></g>
  <g class="part" data-part="biosphere"><rect x="346" y="136" width="208" height="214" rx="12"/>
    <rect x="346" y="300" width="208" height="44" fill="#9ccf7a"/>
    <rect x="386" y="230" width="12" height="74" fill="${C.brown}"/><circle cx="392" cy="220" r="34" fill="${C.green}"/>
    <rect x="470" y="250" width="10" height="54" fill="${C.brown}"/><ellipse cx="475" cy="236" rx="40" ry="18" fill="${C.dgreen}"/>
    <g fill="${C.orange}"><ellipse cx="515" cy="298" rx="18" ry="10"/><rect x="528" y="276" width="5" height="18"/><circle cx="532" cy="274" r="6"/></g>
    <g stroke="${C.navy}" stroke-width="2"><path d="M504 306v12M524 306v12"/></g>
    <text x="356" y="160" font-family="Arial" font-weight="700" font-size="14" fill="${C.dgreen}">BIOSPHERE · life</text></g>
</svg>`;

// South African landscape for "a day in the field"
ART.landscape = `<svg viewBox="0 0 800 380">
  <rect width="800" height="380" fill="${C.sky}"/>
  <path d="M0 150 L90 70 L170 130 L250 60 L340 150Z" fill="#b8a48c"/><path d="M90 70 L106 86 L74 86Z M250 60 L268 80 L232 80Z" fill="#fff"/>
  <rect x="0" y="150" width="800" height="230" fill="#cfe3b0"/>
  <path d="M130 150 C170 200 110 240 190 280 C270 320 330 290 420 320 C520 350 600 330 700 350 L800 350 L800 380 L0 380 L0 370 C60 360 140 330 130 150Z" fill="none"/>
  <path d="M150 150 C190 200 130 240 210 280 C290 320 360 290 440 316 C540 346 620 322 800 330" stroke="${C.water}" stroke-width="16" fill="none" stroke-linecap="round"/>
  <!-- mine dump -->
  <path d="M20 250 L60 196 L130 196 L170 250Z" fill="${C.sand}"/><path d="M40 250 L70 212 L120 212 L150 250" fill="#dcc27a"/>
  <rect x="150" y="180" width="10" height="46" fill="${C.navy}"/><path d="M142 180h26l-13-18z" fill="${C.navy}"/>
  <!-- farm -->
  <g transform="translate(300,170)"><rect width="150" height="70" fill="#e9d98a"/><g stroke="#c9b25a" stroke-width="3"><path d="M0 14h150M0 30h150M0 46h150M0 62h150"/></g>
    <rect x="160" y="16" width="44" height="34" fill="#c0392b"/><path d="M156 16h52l-26-18z" fill="#8e2b21"/></g>
  <!-- city -->
  <g transform="translate(560,110)"><g fill="#8fa3b8"><rect x="0" y="40" width="34" height="80"/><rect x="40" y="10" width="30" height="110"/><rect x="76" y="54" width="36" height="66"/><rect x="118" y="26" width="26" height="94"/></g>
    <g fill="#e7eef6"><rect x="6" y="50" width="8" height="8"/><rect x="20" y="50" width="8" height="8"/><rect x="46" y="22" width="7" height="7"/><rect x="58" y="22" width="7" height="7"/><rect x="82" y="64" width="8" height="8"/><rect x="124" y="36" width="7" height="7"/></g>
    <rect x="150" y="70" width="12" height="50" fill="#6b7a8b"/><path d="M152 70c-4-16 14-18 8-30" stroke="#b9c3cf" stroke-width="6" fill="none"/></g>
  <!-- wetland -->
  <g transform="translate(250,300)"><ellipse cx="60" cy="20" rx="80" ry="18" fill="#8fcbd9"/><g stroke="${C.dgreen}" stroke-width="3"><path d="M10 20v-26M20 22v-20M110 20v-24M120 22v-18M60 4v-20"/></g>
    <g fill="${C.brown}"><rect x="8" y="-12" width="5" height="10" rx="2"/><rect x="108" y="-10" width="5" height="10" rx="2"/></g></g>
  <!-- coast / estuary -->
  <rect x="690" y="300" width="110" height="80" fill="${C.water}"/><g stroke="#fff" stroke-width="3" fill="none"><path d="M700 330c10-6 20 6 30 0s20 6 30 0 20 6 30 0"/></g>
  <g font-family="Arial" font-size="12" font-weight="700" fill="${C.ink}" text-anchor="middle">
    <text x="95" y="270">Mine</text><text x="375" y="258">Farm</text><text x="632" y="248">City &amp; factory</text><text x="310" y="350">Wetland</text><text x="745" y="296">Estuary</text></g>
</svg>`;

// Savanna food web (clickable)
ART.foodweb = (function(){
  const N = { grass:[110,300,"Grass",C.green], tree:[290,300,"Acacia tree",C.dgreen], impala:[110,190,"Impala",C.orange], giraffe:[290,190,"Giraffe",C.yellow],
              lion:[200,80,"Lion",C.brown], vulture:[420,80,"Vulture",C.navy], beetle:[440,250,"Dung beetle & fungi",C.purple] };
  const E = [["grass","impala"],["tree","impala"],["tree","giraffe"],["impala","lion"],["giraffe","lion"],["lion","vulture"],["impala","vulture"],["impala","beetle"],["giraffe","beetle"],["lion","beetle"],["beetle","grass"]];
  let g = `<svg viewBox="0 0 540 360"><rect width="540" height="360" rx="14" fill="#f7f2e3"/>
    <defs><marker id="evar" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0L9 4.5 0 9z" fill="#8a7a5a"/></marker></defs>`;
  E.forEach(([a,c]) => { const [x1,y1]=N[a],[x2,y2]=N[c]; const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), k=(L-38)/L;
    g += `<line x1="${x1+dx*38/L}" y1="${y1+dy*38/L}" x2="${x1+dx*k}" y2="${y1+dy*k}" stroke="#8a7a5a" stroke-width="2" marker-end="url(#evar)"/>`; });
  Object.entries(N).forEach(([k,[x,y,label,col]]) => {
    g += `<g class="part" data-part="${k}"><rect x="${x-62}" y="${y-36}" width="124" height="72" rx="12"/><circle cx="${x}" cy="${y-8}" r="20" fill="${col}"/>
      <text x="${x}" y="${y+26}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.ink}">${label}</text></g>`; });
  return g + `<text x="270" y="348" text-anchor="middle" font-family="Arial" font-size="11" fill="#6b5a3a">Arrows show the direction energy flows: who gets eaten → who eats it</text></svg>`;
})();

// Water cycle (clickable)
ART.watercycle = `<svg viewBox="0 0 760 360">
  <rect width="760" height="360" rx="14" fill="${C.sky}"/>
  <circle cx="680" cy="60" r="32" fill="${C.yellow}"/>
  <path d="M0 250 L140 130 L260 250Z" fill="#b8a48c"/><path d="M140 130 L162 150 L118 150Z" fill="#fff"/>
  <rect x="0" y="250" width="440" height="110" fill="#b3d88c"/><rect x="0" y="310" width="440" height="50" fill="#9a7b56"/>
  <path d="M440 250 H760 V360 H440Z" fill="${C.water}"/>
  <g class="part" data-part="evap"><rect x="480" y="150" width="150" height="100" rx="10"/><g stroke="#fff" stroke-width="3" fill="none"><path d="M510 236c-8-14 8-22 0-36M550 236c-8-14 8-22 0-36M590 236c-8-14 8-22 0-36"/></g><path d="M550 180 l-8 12 h16z" fill="#fff"/><text x="555" y="168" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.navy}">Evaporation</text></g>
  <g class="part" data-part="cond"><rect x="300" y="20" width="200" height="90" rx="10"/><path d="M340 80c0-18 22-26 34-14 6-16 34-16 38 2 16-2 22 18 8 24H348c-12 0-14-10-8-12z" fill="#fff" stroke="#a9c6dc" stroke-width="2"/><text x="400" y="104" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.navy}">Condensation</text></g>
  <g class="part" data-part="precip"><rect x="120" y="20" width="160" height="110" rx="10"/><path d="M150 70c0-16 20-22 30-12 6-14 30-14 34 2 14-2 20 16 8 20H158c-10 0-12-8-8-10z" fill="#8ea8bd"/><g stroke="${C.blue}" stroke-width="3" stroke-linecap="round"><path d="M165 92l-5 14M185 92l-5 14M205 92l-5 14M225 92l-5 14"/></g><text x="200" y="124" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.navy}">Precipitation</text></g>
  <g class="part" data-part="runoff"><rect x="250" y="220" width="180" height="60" rx="10"/><path d="M260 248 C300 236 340 262 425 250" stroke="${C.blue}" stroke-width="7" fill="none" stroke-linecap="round"/><text x="340" y="274" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.navy}">Runoff</text></g>
  <g class="part" data-part="infil"><rect x="40" y="280" width="190" height="72" rx="10"/><g stroke="${C.blue}" stroke-width="3" stroke-dasharray="4 5"><path d="M80 288v40M120 288v48M160 288v40M200 288v44"/></g><text x="135" y="346" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#fff">Infiltration → groundwater</text></g>
  <g class="part" data-part="transp"><rect x="20" y="150" width="110" height="100" rx="10"/><rect x="66" y="200" width="10" height="46" fill="${C.brown}"/><circle cx="71" cy="192" r="24" fill="${C.green}"/><g stroke="#fff" stroke-width="2" fill="none"><path d="M60 166c-4-8 4-12 0-20M82 166c-4-8 4-12 0-20"/></g><text x="75" y="160" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="${C.navy}">Transpiration</text></g>
</svg>`;

// River pollution map
ART.river = `<svg viewBox="0 0 760 420">
  <rect width="760" height="420" fill="#d7ebc2"/>
  <path d="M0 0 H200 L150 70 L100 30 L40 90 L0 60Z" fill="#b8a48c"/>
  <path d="M640 420 C660 380 720 360 760 350 V420Z" fill="${C.water}"/><text x="712" y="408" font-family="Arial" font-size="12" font-weight="700" fill="#fff">SEA</text>
  <path d="M70 40 C120 120 60 170 150 210 C240 250 300 190 380 230 C470 275 500 330 580 350 C620 360 650 380 680 400" stroke="${C.water}" stroke-width="20" fill="none" stroke-linecap="round"/>
  <text x="84" y="26" font-family="Arial" font-size="11" font-weight="700" fill="#6e5a3e">Mountain spring</text>
  <!-- farm -->
  <g transform="translate(170,70)"><rect width="120" height="70" fill="#e9d98a"/><g stroke="#c9b25a" stroke-width="3"><path d="M0 14h120M0 30h120M0 46h120M0 62h120"/></g>
    <rect x="128" y="18" width="36" height="28" fill="#c0392b"/><path d="M124 18h44l-22-15z" fill="#8e2b21"/>
    <text x="60" y="-6" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.ink}">Maize farm</text></g>
  <path d="M230 140 C230 170 210 190 200 212" stroke="#8fc0dd" stroke-width="6" fill="none"/>
  <!-- mine -->
  <g transform="translate(300,300)"><path d="M0 70 L30 20 L100 20 L130 70Z" fill="${C.sand}"/><rect x="120" y="0" width="10" height="44" fill="${C.navy}"/><path d="M112 0h26l-13-16z" fill="${C.navy}"/>
    <ellipse cx="170" cy="60" rx="34" ry="12" fill="#d9a441"/>
    <text x="80" y="92" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.ink}">Old gold mine + tailings dam</text></g>
  <path d="M470 352 C460 320 440 300 430 262" stroke="#d9a441" stroke-width="6" fill="none"/>
  <!-- town -->
  <g transform="translate(560,160)"><g fill="#8fa3b8"><rect x="0" y="30" width="28" height="60"/><rect x="34" y="8" width="26" height="82"/><rect x="66" y="40" width="30" height="50"/></g>
    <rect x="104" y="60" width="44" height="30" rx="4" fill="#6b7a8b"/><text x="126" y="80" text-anchor="middle" font-family="Arial" font-size="9" fill="#fff">WWTW</text>
    <text x="60" y="-4" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="${C.ink}">Town + sewage works</text></g>
  <path d="M660 250 C650 300 610 320 590 348" stroke="#9bb0a5" stroke-width="6" fill="none"/>
  ${[["A",96,110],["B",300,218],["C",418,232],["D",520,318],["E",640,382]].map(([k,x,y]) =>
    `<g class="stn" data-st="${k}"><circle class="pulse" cx="${x}" cy="${y}" r="14"/><circle class="ring" cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y+5}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="${C.navy}">${k}</text></g>`).join("")}
</svg>`;

const ICON = {
  e:(t,col)=>`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="${col}"/><text x="32" y="42" text-anchor="middle" font-size="26" font-family="Arial">${t}</text></svg>`
};

/* =====================================================================
   Lessons
   ===================================================================== */
window.LESSON_CONTENT = {

"1.1.2": { slides: [
  { type:"intro", kicker:"1.1.2 · Earth's Systems", title:"Everything is connected",
    text:`<p>Environmental scientists study how the planet works as one big system, and how people change it.</p>
          <p>Scientists split Earth into four <b>spheres</b>: air, water, land and life. A problem in one sphere always spreads to the others. Smoke from a factory (air) becomes acid rain (water), which damages soil (land) and kills fish (life).</p>`,
    art: ART.spheres.replace(/class="part"/g, 'class="static"') },
  { type:"diagram", kicker:"Interactive diagram", title:"The four spheres", lead:"Click each sphere to learn what it includes and why it matters.",
    art: ART.spheres,
    parts:{ atmosphere:{title:"Atmosphere · the air", text:"The layer of gases around Earth. It gives us oxygen, traps heat and carries weather. Environmental scientists measure <b>air quality</b> and <b>greenhouse gases</b> here."},
            hydrosphere:{title:"Hydrosphere · all water", text:"Oceans, rivers, lakes, groundwater and ice. Only about <b>3%</b> of Earth's water is fresh, which is why protecting rivers matters so much in dry countries like South Africa."},
            geosphere:{title:"Geosphere · rock & soil", text:"Rocks, soil and minerals. Healthy soil grows our food; mining and erosion can damage it for decades."},
            biosphere:{title:"Biosphere · all living things", text:"Plants, animals, fungi, microbes and people. South Africa is one of the most <b>biodiverse</b> countries on Earth."} } },
  { type:"drag", kicker:"Check your understanding", title:"Which sphere is affected?", lead:"Drag each example to the sphere it belongs to.", cols:4,
    targets:["Atmosphere","Hydrosphere","Geosphere","Biosphere"],
    items:[ {text:"Smog over a city", target:"Atmosphere"}, {text:"A polluted river", target:"Hydrosphere"}, {text:"Soil erosion on a farm", target:"Geosphere"},
            {text:"Rhinos being poached", target:"Biosphere"}, {text:"Groundwater running low", target:"Hydrosphere"}, {text:"Rising CO₂ levels", target:"Atmosphere"} ],
    explain:"Air → atmosphere, water → hydrosphere, rock & soil → geosphere, living things → biosphere." }
]},

"1.1.3": { slides: [
  { type:"hotspots", kicker:"1.1.3 · A Day in the Field", title:"Where environmental scientists work", lead:"Environmental scientists don't only work in offices. Click each dot to see what they'd do at each place.",
    art: ART.landscape,
    spots:[
      { x:11, y:57, title:"Mine", text:"Test for <b>acid mine drainage</b>: acidic, metal-rich water leaking from old mines. It is one of South Africa's biggest water problems, especially around Johannesburg." },
      { x:47, y:50, title:"Farm", text:"Check how fertiliser and pesticides wash into rivers, and help farmers use water and chemicals more efficiently." },
      { x:79, y:40, title:"City & factory", text:"Monitor <b>air quality</b>, check that factories follow their permits, and plan better waste and recycling systems." },
      { x:39, y:80, title:"Wetland", text:"Wetlands are nature's water filters. Scientists map and protect them, and count the birds, frogs and plants living there." },
      { x:93, y:83, title:"Estuary", text:"Where the river meets the sea. Scientists test for sewage and plastic pollution and protect fish nurseries." }
    ]},
  { type:"flip", kicker:"Interactive activity", title:"Tools of the trade", lead:"Flip each card to see what an environmental scientist carries.",
    cards:[
      { icon:ICON.e("🧪","#dff1fb"), title:"Water test kit", sub:"pH, oxygen, nitrates", back:"Measures how acidic the water is, how much oxygen fish have, and whether fertiliser is polluting it." },
      { icon:ICON.e("🗺️","#e9f8ef"), title:"GPS & GIS", sub:"mapping", back:"Records exactly where each sample was taken, then maps the results to spot patterns." },
      { icon:ICON.e("🔲","#fff6e0"), title:"Quadrat", sub:"counting species", back:"A square frame placed on the ground to count plants and insects in a fixed area, used to measure biodiversity." },
      { icon:ICON.e("📊","#efedfd"), title:"Data & reports", sub:"the office side", back:"Field data becomes a report that tells a government or company what to fix, and how." }
    ]},
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"Old gold mines around Johannesburg leak acidic water full of heavy metals into rivers. What is this called?",
    options:["Eutrophication","Acid mine drainage","Soil erosion","The greenhouse effect"], answer:1,
    explain:"Acid mine drainage happens when water reacts with minerals in old mines, turning it acidic and full of metals like iron." }
]},

"1.2.2": { slides: [
  { type:"diagram", kicker:"1.2.2 · Food Webs", title:"Who eats whom on the savanna?", lead:"A food web shows how energy moves through an ecosystem. Click each living thing to see its role.",
    art: ART.foodweb,
    parts:{ grass:{title:"Grass · producer", text:"<b>Producers</b> make their own food from sunlight (photosynthesis). Every food web starts with them."},
            tree:{title:"Acacia tree · producer", text:"Another producer. Its leaves feed browsers like giraffes and impala."},
            impala:{title:"Impala · primary consumer", text:"A <b>herbivore</b>: it eats plants. Primary consumers turn plant energy into animal energy."},
            giraffe:{title:"Giraffe · primary consumer", text:"Also a herbivore. Giraffes can reach leaves no other animal can."},
            lion:{title:"Lion · apex predator", text:"An <b>apex predator</b> sits at the top: nothing hunts it. Predators keep herbivore numbers in balance."},
            vulture:{title:"Vulture · scavenger", text:"Scavengers eat animals that have already died, cleaning up the savanna and stopping disease."},
            beetle:{title:"Dung beetle & fungi · decomposers", text:"<b>Decomposers</b> break down waste and dead matter into nutrients, which feed the grass again. The circle is complete!"} } },
  { type:"drag", kicker:"Check your understanding", title:"Give each one its role", lead:"Drag each organism to its role in the food web.", cols:3,
    targets:["Producer","Consumer","Decomposer"],
    items:[ {text:"Grass", target:"Producer"}, {text:"Lion", target:"Consumer"}, {text:"Mushroom", target:"Decomposer"},
            {text:"Acacia tree", target:"Producer"}, {text:"Impala", target:"Consumer"}, {text:"Earthworm", target:"Decomposer"} ],
    explain:"Producers make food from sunlight, consumers eat other living things, and decomposers recycle dead matter." },
  { type:"mc", kicker:"Think like a scientist", title:"What happens next?",
    q:"Poachers remove most of the lions from a game reserve. What is most likely to happen?",
    options:["Nothing changes","Impala numbers explode and overgraze the grass","Grass grows much taller everywhere","Vultures get more food"], answer:1,
    explain:"Without predators, herbivores multiply, eat too much grass and damage the whole ecosystem. That's why every species matters." }
]},

"1.2.3": { slides: [
  { type:"flip", kicker:"1.2.3 · Biodiversity Checkpoint", title:"The five big threats to biodiversity", lead:"Flip every card, then answer the questions.",
    cards:[
      { icon:ICON.e("🏗️","#fdf1e8"), title:"Habitat loss", sub:"threat #1", back:"Clearing land for farms, mines and cities destroys the homes of plants and animals." },
      { icon:ICON.e("🌿","#e9f8ef"), title:"Invasive species", sub:"alien plants & animals", back:"Species from other places, like thirsty pine and wattle trees in SA, push out local ones and use up water." },
      { icon:ICON.e("🏭","#eef3f8"), title:"Pollution", sub:"air, water, land", back:"Chemicals, plastic and sewage poison ecosystems." },
      { icon:ICON.e("🌡️","#fdeeee"), title:"Climate change", sub:"hotter, drier", back:"Species can't move or adapt fast enough as temperatures and rainfall change." },
      { icon:ICON.e("🦏","#efedfd"), title:"Poaching", sub:"over-harvesting", back:"Illegal hunting (rhino horn, abalone) and over-fishing wipe out species faster than they can recover." }
    ]},
  { type:"mc", kicker:"Checkpoint", title:"Question 1 of 2",
    q:"Why do scientists remove invasive trees like wattle from river banks in South Africa?",
    options:["They look untidy","They use far more water than local plants and crowd them out","They are poisonous to people","To sell the wood"], answer:1,
    explain:"Invasive trees drink huge amounts of water and replace indigenous plants. Programmes like Working for Water clear them to protect rivers." },
  { type:"mc", kicker:"Checkpoint", title:"Question 2 of 2",
    q:"True or false: an ecosystem with many different species usually recovers better from droughts and disease.",
    options:["True","False"], answer:0,
    explain:"True. More biodiversity means more backup: if one species struggles, others can fill its role." }
]},

"1.3.1": { slides: [
  { type:"diagram", kicker:"1.3.1 · The Water Cycle", title:"Follow a drop of water", lead:"Water never disappears; it keeps moving. Click each stage of the cycle.",
    art: ART.watercycle,
    parts:{ evap:{title:"Evaporation", text:"The sun heats oceans, rivers and dams, turning water into invisible <b>water vapour</b> that rises into the air."},
            cond:{title:"Condensation", text:"High up, the vapour cools and turns into tiny droplets: <b>clouds</b>."},
            precip:{title:"Precipitation", text:"When the droplets get heavy they fall as <b>rain, hail or snow</b>."},
            runoff:{title:"Runoff", text:"Rain flows over the ground into rivers and back to the sea. On the way it picks up soil, fertiliser and litter, so runoff is how most pollution reaches rivers."},
            infil:{title:"Infiltration", text:"Some rain soaks into the ground and becomes <b>groundwater</b>, which many towns pump up for drinking."},
            transp:{title:"Transpiration", text:"Plants pull water up from the soil and release it from their leaves as vapour, like the plant 'breathing out' water."} } },
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"A farmer sprays fertiliser just before a big storm. Which part of the water cycle carries it into the river?",
    options:["Condensation","Runoff","Transpiration","Evaporation"], answer:1,
    explain:"Runoff washes whatever is on the ground (fertiliser, soil, litter) straight into streams and rivers." }
]},

"1.3.2": { slides: [
  { type:"intro", kicker:"1.3.2 · Trace the Pollution", title:"Case file: the dying river",
    text:`<p>Fishermen downstream report dead fish and orange-coloured water. The municipality has called <b>you</b>, the environmental scientist, to find the source.</p>
          <p>Three possible polluters sit along the river: a <b>maize farm</b>, an <b>old gold mine</b> and a <b>town with a sewage works</b>. Your job: test the water at different points and follow the evidence upstream.</p>
          <p><b>Tip:</b> pollution enters <i>between</i> a clean reading and a dirty one.</p>`,
    art: ART.river.replace(/class="stn"/g,'class="stn-static"') },
  { type:"tracepollution", kicker:"Field investigation", title:"Test the water", lead:"Click the sampling points A–E along the river.",
    art: ART.river, minTests: 4,
    limits:{
      ph:{ label:"pH (7 = neutral)", unit:"", bad:v=>v<5.5||v>9, warn:v=>v<6.5||v>8.5 },
      oxygen:{ label:"Dissolved oxygen", unit:" mg/L", bad:v=>v<4, warn:v=>v<6 },
      nitrate:{ label:"Nitrate (fertiliser)", unit:" mg/L", bad:v=>v>20, warn:v=>v>10 },
      iron:{ label:"Iron (metals)", unit:" mg/L", bad:v=>v>5, warn:v=>v>1 } },
    readings:{
      A:{ name:"Mountain spring", status:"good", ph:7.3, oxygen:9.2, nitrate:0.8, iron:0.1, note:"Clean, clear water. This is your <b>baseline</b> for comparing everything downstream." },
      B:{ name:"Below the farm", status:"warn", ph:7.1, oxygen:8.0, nitrate:12, iron:0.2, note:"Nitrate is a bit high from fertiliser runoff: worth watching, but oxygen is still healthy and fish can live here." },
      C:{ name:"Below the mine stream", status:"bad", ph:3.8, oxygen:5.1, nitrate:11, iron:22, note:"pH has crashed to <b>3.8</b> (as acidic as orange juice) and iron is <b>100× higher</b> than at point B. The water is stained orange." },
      D:{ name:"Before the town", status:"bad", ph:4.6, oxygen:4.8, nitrate:10, iron:14, note:"Still very acidic and metal-rich. Whatever entered between B and C is still flowing downstream." },
      E:{ name:"Below the sewage works", status:"bad", ph:5.2, oxygen:3.4, nitrate:18, iron:9, note:"Oxygen dropped further (sewage adds nutrients), but the acid and iron were already here before the town." } },
    question:"Where is the main pollution killing the fish coming from?",
    suspects:["The maize farm","The old gold mine","The town's sewage works"], answer:1,
    hints:{ 0:"Point B is below the farm and fish can still survive there. The big change happens later.", 2:"Point D is above the town and the water is already acidic and full of iron." },
    explain:"Between points B and C the pH crashes and iron jumps 100×. That's <b>acid mine drainage</b> from the old gold mine. Your report would recommend treating the mine water (e.g. with lime) before it reaches the river. The sewage works is a smaller, second problem to fix." },
  { type:"drag", kicker:"Check your understanding", title:"Match the clue to the polluter", lead:"Drag each clue to the source it points to.", cols:3,
    targets:["Farm","Mine","Sewage works"],
    items:[ {text:"High nitrate & algae blooms", target:"Farm"}, {text:"Very low pH & orange water", target:"Mine"}, {text:"E. coli bacteria", target:"Sewage works"},
            {text:"High iron & heavy metals", target:"Mine"}, {text:"Pesticides in the water", target:"Farm"}, {text:"Low oxygen & bad smell", target:"Sewage works"} ],
    explain:"Each polluter leaves its own chemical 'fingerprint'. Reading those clues is a core environmental science skill." }
]},

"1.3.3": { slides: [
  { type:"video", kicker:"1.3.3 · Water Quality Checkpoint", title:"How scientists test water", lead:"Watch the short video, then answer the checkpoint questions." },
  { type:"mc", kicker:"Checkpoint", title:"Question 1 of 2",
    q:"A water sample has a pH of 4. What does that tell you?",
    options:["It is very alkaline","It is neutral","It is acidic, too acidic for most fish","It has too much oxygen"], answer:2,
    explain:"pH 7 is neutral. Below about 6 most fish and insects struggle; pH 4 is strongly acidic." },
  { type:"mc", kicker:"Checkpoint", title:"Question 2 of 2",
    q:"Why do fish die when dissolved oxygen drops very low?",
    options:["They can't breathe: gills take oxygen from the water","The water gets too cold","The water becomes salty","They can't see"], answer:0,
    explain:"Fish breathe the oxygen dissolved in water. Sewage and algae blooms use up that oxygen, suffocating them." }
]},

"3.1.2": { slides: [
  { type:"video", kicker:"3.1.2 · Carbon Footprint", title:"What is a carbon footprint?", lead:"Watch the short video, then calculate a footprint yourself." },
  { type:"carbon", kicker:"Interactive tool", title:"Shrink this footprint", lead:"This is a typical middle-class lifestyle. Move the sliders to cut the yearly footprint below the goal. Which changes make the biggest difference?",
    goal:6, maxT:14,
    refs:[ {t:2, label:"2050 target ≈2 t"}, {t:7, label:"SA average ≈7 t"}, {t:12, label:"High ≈12 t"} ],
    factors:[
      { label:"Car travel", short:"Car", unit:"km", min:0, max:500, step:10, start:300, kg:0.18*52, fmt:v=>v+" km/week", hint:"Petrol car ≈ 0.18 kg CO₂ per km", tip:"Taxi, bus, lift clubs or working from home cut this fast." },
      { label:"Electricity", short:"Electricity", min:0, max:1000, step:25, start:650, kg:0.95*12, fmt:v=>v+" kWh/month", hint:"SA grid is mostly coal ≈ 0.95 kg CO₂ per kWh", tip:"In SA electricity is mostly coal. Solar geysers, LED bulbs and switching off appliances help a lot." },
      { label:"Red-meat meals", short:"Meat", min:0, max:21, step:1, start:10, kg:2.5*52, fmt:v=>v+" per week", hint:"A beef meal ≈ 2.5 kg CO₂e", tip:"Swapping some beef meals for chicken, beans or veg makes a real difference." },
      { label:"Domestic return flights", short:"Flights", min:0, max:10, step:1, start:4, kg:250, fmt:v=>v+" per year", hint:"JHB ↔ CPT return ≈ 250 kg CO₂", tip:"Fewer flights, or taking the bus for shorter trips, helps." } ],
    win:"Notice which sliders moved the total most. Environmental scientists do exactly this for companies and cities: measure where the emissions come from, then target the biggest sources first." },
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"Why does saving electricity cut carbon emissions so much in South Africa?",
    options:["Electricity is expensive","Most SA electricity is made by burning coal","Power lines leak CO₂","It doesn't. Electricity is carbon-free"], answer:1,
    explain:"Around 80% of SA's electricity comes from coal power stations, so every kWh saved means less CO₂." }
]},

"3.2.1": { slides: [
  { type:"video", kicker:"3.2.1 · Recycling", title:"How recycling works", lead:"Watch the video, then sort the waste." },
  { type:"drag", kicker:"Interactive activity", title:"Sort the rubbish", lead:"Drag each item into the right bin. Getting this right at home keeps recycling clean and useful.", cols:4,
    targets:["♻️ Recycle","🌱 Compost","☠️ Hazardous","🗑️ Landfill"],
    items:[ {text:"Glass bottle", target:"♻️ Recycle"}, {text:"Cardboard box", target:"♻️ Recycle"}, {text:"Aluminium can", target:"♻️ Recycle"},
            {text:"Banana peel", target:"🌱 Compost"}, {text:"Grass cuttings", target:"🌱 Compost"},
            {text:"Old battery", target:"☠️ Hazardous"}, {text:"Broken fluorescent tube", target:"☠️ Hazardous"},
            {text:"Chip packet", target:"🗑️ Landfill"}, {text:"Used nappy", target:"🗑️ Landfill"} ],
    explain:"Batteries and fluorescent tubes contain toxic metals and need special drop-off points. Chip packets are mixed materials that usually can't be recycled." },
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"Why is putting food scraps in the recycling bin a problem?",
    options:["It makes the bin heavy","It contaminates paper and cardboard so they can't be recycled","Food is hazardous waste","It isn't a problem"], answer:1,
    explain:"Greasy, wet food ruins paper and cardboard. Contamination is one of the biggest reasons recycling ends up in landfill." }
]}
};
window.LESSON_TITLE_OVERRIDES = {};
})();
