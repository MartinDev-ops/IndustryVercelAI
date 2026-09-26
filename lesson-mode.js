/* =====================================================================
   FuturePath AI — full-page Lesson Mode (NetAcad-style course pages)
   Uses globals from cloud-architect.html: PATH, MODS, LESSONS, S,
   lessonUnlocked, completeLesson, openTo, render, toast, ytReady, YT, popId
   ===================================================================== */
(function(){
const STYLE = `

/* certification hub */
.lm-certs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:6px}
@media(max-width:900px){.lm-certs{grid-template-columns:1fr}}
.lm-cert{background:#fff;border:1px solid #dbe3ec;border-radius:14px;padding:20px 18px 18px;display:flex;flex-direction:column;gap:10px;box-shadow:0 4px 14px rgba(15,39,66,.06);transition:transform .2s,box-shadow .2s,border-color .2s;position:relative}
.lm-cert:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(15,39,66,.12);border-color:#9fd3e2}
.lm-cert.went{border-color:#2fb47c}
.lm-cert.went::after{content:"✓ Opened";position:absolute;top:14px;right:14px;font-size:11px;font-weight:700;color:#1f8a5b;background:#e3f6ec;border-radius:20px;padding:3px 9px}
.lm-cert .logo{height:44px;display:flex;align-items:center;gap:10px}
.lm-cert .logo i{width:44px;height:44px;border-radius:10px;display:grid;place-items:center;font-style:normal;font-weight:800;font-size:15px;color:#fff}
.lm-cert .logo b{font-size:16px}
.lm-cert h5{margin:4px 0 0;font-size:17px;line-height:1.3;color:#10243c}
.lm-cert p{margin:0;font-size:14px;color:#51606f;line-height:1.45}
.lm-cert .tags{display:flex;flex-wrap:wrap;gap:6px}
.lm-cert .tags span{font-size:12px;background:#eef3f8;border:1px solid #dde5ee;color:#34475b;border-radius:20px;padding:3px 9px}
.lm-cert a.go{margin-top:auto;display:block;text-align:center;text-decoration:none;background:linear-gradient(90deg,#12a3b8,#1479c9);color:#fff;font-weight:700;border-radius:10px;padding:11px;font-size:14px}
.lm-cert a.go:hover{filter:brightness(1.08)}
.lm-cert small.note{font-size:12px;color:#7a8898}
.lm-certnote{margin-top:16px;font-size:13px;color:#51606f;background:#f5f8fb;border:1px dashed #cbd6e2;border-radius:10px;padding:10px 14px}
.lm{position:fixed;inset:0;z-index:45;display:grid;grid-template-rows:60px 5px 1fr 74px;grid-template-columns:300px 1fr;
  background:#eef2f6;color:#1d2733;font-family:Inter,system-ui,Arial,sans-serif;opacity:0;pointer-events:none;transition:opacity .35s}
.lm.show{opacity:1;pointer-events:auto}
.lm.noside{grid-template-columns:0 1fr}
.lm *{box-sizing:border-box}
.lm button{font-family:inherit;cursor:pointer}
.lm code{font-family:Menlo,Consolas,monospace;background:#eef2f7;border:1px solid #dde4ec;border-radius:4px;padding:1px 5px;font-size:.92em;color:#0b4f86}
/* top bar */
.lm-top{grid-column:1/-1;background:#0f2742;color:#fff;display:flex;align-items:center;gap:16px;padding:0 18px;box-shadow:0 2px 10px rgba(0,0,0,.18);z-index:2}
.lm-back{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:8px;padding:8px 14px;font-size:14px;font-weight:600;display:flex;gap:8px;align-items:center;white-space:nowrap}
.lm-back:hover{background:rgba(255,255,255,.2)}
.lm-crumb{flex:1;min-width:0;text-align:center}
.lm-crumb small{display:block;font-size:12px;color:#9fb6cf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lm-crumb b{display:block;font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lm-crumb b span{color:#5fd4ea;margin-right:6px}
.lm-right{display:flex;align-items:center;gap:10px}
.lm-pts{background:#1b3a5e;border-radius:20px;padding:6px 12px;font-size:13px;font-weight:600;white-space:nowrap}
.lm-pts i{font-style:normal;color:#f6c344}
.lm-ico{width:36px;height:36px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;display:grid;place-items:center}
.lm-ico:hover{background:rgba(255,255,255,.12)}
.lm-bar{grid-column:1/-1;background:#d6dee8}
.lm-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#12a3b8,#1479c9);transition:width .4s}
/* sidebar */
.lm-side{grid-row:3/5;grid-column:1;background:#fff;border-right:1px solid #dbe2ea;overflow-y:auto;overflow-x:hidden}
.lm.noside .lm-side{visibility:hidden}
.lm-side h4{font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:#6b7a8b;margin:18px 18px 8px}
.lm-modname{margin:0 18px 10px;font-weight:700;font-size:15px;line-height:1.3}
.lm-modbar{margin:0 18px 14px;height:6px;border-radius:4px;background:#e4eaf1;overflow:hidden}
.lm-modbar i{display:block;height:100%;background:#2ea56a}
.lm-li{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;border:none;background:none;padding:11px 18px;border-left:4px solid transparent;font-size:14px;color:#1d2733}
.lm-li:hover:not(:disabled){background:#f2f6fa}
.lm-li.cur{background:#e8f3fb;border-left-color:#1479c9}
.lm-li:disabled{opacity:.5;cursor:not-allowed}
.lm-li .st{flex:none;width:22px;height:22px;border-radius:50%;border:2px solid #b8c4d2;display:grid;place-items:center;font-size:12px;margin-top:1px}
.lm-li.done .st{background:#2ea56a;border-color:#2ea56a;color:#fff}
.lm-li.cur .st{border-color:#1479c9}
.lm-li b{display:block;font-weight:600;line-height:1.3}
.lm-li small{display:block;color:#6b7a8b;font-size:12px;margin-top:2px}
.lm-notes{margin:6px 18px 24px;border:1px solid #e1e7ee;border-radius:10px;background:#f8fafc;padding:12px 14px;font-size:13px}
.lm-notes b{display:block;margin-top:8px;color:#0f2742}
.lm-notes b:first-child{margin-top:0}
.lm-notes ul{margin:4px 0 0 16px;padding:0;color:#44525f}
.lm-notes li{margin:2px 0}
/* stage */
.lm-main{grid-row:3;grid-column:2;overflow-y:auto;padding:26px 28px 40px}
.lm-slide{max-width:1040px;margin:0 auto;background:#fff;border-radius:14px;box-shadow:0 2px 14px rgba(15,39,66,.08);padding:30px 34px 34px;animation:lmIn .4s ease}
@keyframes lmIn{from{opacity:0;transform:translateY(14px)}}
.lm-kick{display:inline-flex;gap:8px;align-items:center;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#1479c9;background:#e8f3fb;padding:5px 10px;border-radius:6px}
.lm-kick.q{color:#6b5bd6;background:#efedfd}
.lm-kick.lab{color:#b85a15;background:#fdf1e8}
.lm-slide h2{font-size:28px;line-height:1.2;margin:12px 0 8px;color:#0f2742}
.lm-lead{font-size:16px;color:#44525f;margin:0 0 22px;line-height:1.55}
.lm-req{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7a8b;margin-top:18px}
.lm-req .pill{background:#eef2f6;border-radius:20px;padding:4px 10px;font-weight:600;color:#44525f}
.lm-req.ok .pill{background:#e3f5ea;color:#1e7a4c}
/* intro */
.lm-intro{display:grid;grid-template-columns:1.1fr 1fr;gap:30px;align-items:center}
.lm-intro p{font-size:16.5px;line-height:1.65;color:#2d3a47;margin:0 0 14px}
.lm-art svg{width:100%;height:auto;display:block}
/* video */
.lm-video{display:grid;grid-template-columns:1fr 260px;gap:20px}
.lm-vbox{position:relative;aspect-ratio:16/9;background:#000;border-radius:10px;overflow:hidden}
.lm-vbox>div,.lm-vbox iframe{position:absolute;inset:0;width:100%;height:100%}
.lm-vnotes{border:1px solid #e1e7ee;border-radius:10px;padding:14px 16px;background:#f8fafc;font-size:13.5px;overflow:auto;max-height:440px}
.lm-vnotes h5{margin:0 0 8px;font-size:14px;color:#0f2742}
.lm-vnotes b{display:block;margin-top:10px}
.lm-vnotes ul{margin:4px 0 0 16px;padding:0;color:#44525f}
.lm-verr{position:absolute;inset:0;display:none;place-items:center;text-align:center;padding:20px;color:#cfd8e3;background:#0b1522;font-size:14px}
.lm-verr.show{display:grid}
/* flip cards */
.lm-flips{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px}
.lm-flip{perspective:1000px;height:230px;border:none;background:none;padding:0;text-align:left}
.lm-flip .in{position:relative;width:100%;height:100%;transition:transform .6s cubic-bezier(.3,.7,.2,1);transform-style:preserve-3d}
.lm-flip.flipped .in{transform:rotateY(180deg)}
.lm-flip .f,.lm-flip .b{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:14px;padding:18px}
.lm-flip .f{background:linear-gradient(160deg,#ffffff,#eef5fb);border:2px solid #d4e2ef;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px;transition:border-color .2s,box-shadow .2s}
.lm-flip:hover .f{border-color:#1479c9;box-shadow:0 6px 18px rgba(20,121,201,.18)}
.lm-flip .f svg{width:74px;height:74px}
.lm-flip .f b{font-size:22px;color:#0f2742}
.lm-flip .f small{font-size:13px;color:#6b7a8b}
.lm-flip .f em{position:absolute;bottom:10px;right:12px;font-size:11px;font-style:normal;color:#1479c9;font-weight:600}
.lm-flip .b{transform:rotateY(180deg);background:#0f2742;color:#e7eef6;font-size:14.5px;line-height:1.5;overflow:auto}
.lm-flip .b h4{margin:0 0 8px;color:#5fd4ea;font-size:17px}
.lm-flip .b code{background:#1b3a5e;border-color:#2b4d74;color:#9fe3f0}
.lm-flip.seen .f::after{content:"✓";position:absolute;top:10px;right:12px;width:22px;height:22px;border-radius:50%;background:#2ea56a;color:#fff;font-size:13px;display:grid;place-items:center}
/* stack */
.lm-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.lm-tab{border:2px solid #d4e2ef;background:#fff;border-radius:10px;padding:10px 18px;font-weight:600;font-size:15px;color:#2d3a47;position:relative}
.lm-tab:hover{border-color:#1479c9}
.lm-tab.on{background:#1479c9;border-color:#1479c9;color:#fff}
.lm-tab.seen:not(.on)::after{content:"✓";color:#2ea56a;margin-left:6px}
.lm-stackwrap{display:grid;grid-template-columns:340px 1fr;gap:28px;align-items:start}
.lm-stack{display:flex;flex-direction:column;gap:5px}
.lm-layer{padding:9px 14px;border-radius:7px;color:#fff;font-weight:600;font-size:14px;display:flex;justify-content:space-between;transition:background .45s,transform .45s}
.lm-layer.you{background:#1479c9}
.lm-layer.prov{background:#6b5bd6}
.lm-layer small{opacity:.8;font-weight:500}
.lm-legend{display:flex;gap:18px;margin:4px 0 14px;font-size:14px}
.lm-legend span{display:flex;gap:7px;align-items:center}
.lm-legend i{width:14px;height:14px;border-radius:4px;display:inline-block}
.lm-callout{background:#f4f8fc;border-left:4px solid #1479c9;border-radius:8px;padding:16px 18px;font-size:15.5px;line-height:1.6;color:#2d3a47}
.lm-callout h4{margin:0 0 6px;font-size:18px;color:#0f2742}
/* hotspots */
.lm-hot{position:relative;border-radius:12px;overflow:hidden;border:1px solid #e1e7ee}
.lm-hot svg{display:block;width:100%;height:auto}
.lm-spot{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:3px solid #fff;background:#1479c9;color:#fff;font-weight:700;font-size:14px;box-shadow:0 0 0 0 rgba(20,121,201,.6);animation:spot 1.8s infinite}
.lm-spot.seen{background:#2ea56a;animation:none}
.lm-spot.on{background:#f28a3d;animation:none;transform:scale(1.15)}
@keyframes spot{70%{box-shadow:0 0 0 14px rgba(20,121,201,0)}100%{box-shadow:0 0 0 0 rgba(20,121,201,0)}}
.lm-info{margin-top:16px;min-height:88px}
.lm-info .ph{color:#8a98a8;font-style:italic;padding:18px}
/* diagram */
.lm-diag{display:grid;grid-template-columns:1.5fr 1fr;gap:22px;align-items:start}
.lm-diag svg{width:100%;height:auto;display:block}
.lm .part{cursor:pointer}
.lm .part>rect:first-child{fill:rgba(20,121,201,.05);stroke:rgba(20,121,201,.45);stroke-width:2;stroke-dasharray:6 5;transition:all .2s}
.lm .part:hover>rect:first-child{fill:rgba(20,121,201,.14);stroke:#1479c9;stroke-dasharray:none}
.lm .part.seen>rect:first-child{stroke:#2ea56a;stroke-dasharray:none}
.lm .part.on>rect:first-child{fill:rgba(242,138,61,.16);stroke:#f28a3d;stroke-width:3;stroke-dasharray:none}
.lm-dark .part>rect:first-child{fill:rgba(255,255,255,.04);stroke:rgba(255,255,255,.3)}
.lm-dark .part:hover>rect:first-child{fill:rgba(255,255,255,.12);stroke:#fff}
.lm-dark .part.on>rect:first-child{fill:rgba(242,138,61,.2)}
.lm-diag.stacked{grid-template-columns:1fr}
/* journey */
.lm-steps{display:flex;gap:6px;margin:14px 0}
.lm-steps i{flex:1;height:6px;border-radius:4px;background:#e1e7ee;transition:background .3s}
.lm-steps i.on{background:#f28a3d}
.lm-btn{background:#1479c9;color:#fff;border:none;border-radius:8px;padding:11px 18px;font-weight:600;font-size:14.5px}
.lm-btn:hover{background:#0f65aa}
.lm-btn:disabled{background:#b8c4d2;cursor:not-allowed}
.lm-btn.ghost{background:#fff;color:#1479c9;border:2px solid #1479c9}
.lm-btn.ghost:hover{background:#e8f3fb}
/* cidr */
.lm-cidr{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.lm-cidr .addr{font-family:Menlo,Consolas,monospace;font-size:38px;font-weight:700;color:#0f2742}
.lm-cidr .addr span{color:#6b5bd6}
.lm-range{width:100%;accent-color:#1479c9;height:28px}
.lm-bits{display:grid;grid-template-columns:repeat(32,1fr);gap:3px;margin:14px 0 6px}
.lm-bits i{height:30px;border-radius:3px;transition:background .3s}
.lm-bits i.n{background:#1479c9}.lm-bits i.h{background:#f28a3d}
.lm-bits i:nth-child(8n){margin-right:6px}
.lm-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.lm-stat{background:#f4f8fc;border-radius:10px;padding:14px 16px}
.lm-stat small{display:block;font-size:12px;color:#6b7a8b;text-transform:uppercase;letter-spacing:.8px}
.lm-stat b{font-size:24px;color:#0f2742}
/* terminal */
.lm-lab{display:grid;grid-template-columns:1.5fr 1fr;gap:20px}
.lm-term{background:#0d1b2a;border-radius:12px;padding:0 0 12px;font-family:Menlo,Consolas,monospace;font-size:14px;color:#d6e2ee;height:360px;display:flex;flex-direction:column;overflow:hidden;cursor:text}
.lm-term .tb{background:#1b2c40;padding:9px 12px;display:flex;gap:7px;align-items:center;font-family:Arial;font-size:12px;color:#8aa0b8}
.lm-term .tb i{width:11px;height:11px;border-radius:50%;display:inline-block}
.lm-term .out{flex:1;overflow-y:auto;padding:10px 14px;white-space:pre-wrap;line-height:1.5}
.lm-term .row{display:flex;gap:8px;padding:0 14px}
.lm-term input{flex:1;background:transparent;border:none;outline:none;color:#fff;font:inherit;caret-color:#5fd4ea}
.lm-term .p{color:#7ee787}.lm-term .p b{color:#79c0ff;font-weight:400}.lm-term .dir{color:#79c0ff}.lm-term .err{color:#ff7b72}
.lm-tasks{list-style:none;margin:0;padding:0}
.lm-tasks li{display:flex;gap:10px;padding:11px 12px;border-radius:9px;margin-bottom:6px;font-size:14.5px;background:#f4f8fc;color:#8a98a8}
.lm-tasks li.cur{background:#e8f3fb;color:#0f2742;font-weight:600;border-left:4px solid #1479c9}
.lm-tasks li.ok{color:#1e7a4c;background:#e9f8ef}
.lm-tasks li .n{flex:none;width:22px;height:22px;border-radius:50%;background:#d6dee8;color:#fff;display:grid;place-items:center;font-size:12px}
.lm-tasks li.cur .n{background:#1479c9}.lm-tasks li.ok .n{background:#2ea56a}
.lm-hint{font-size:13px;color:#6b7a8b;margin-top:8px}
.lm-hint button{border:none;background:none;color:#1479c9;font-weight:600;padding:0}
/* quiz */
.lm-q{font-size:19px;font-weight:600;color:#0f2742;margin:4px 0 18px;line-height:1.45}
.lm-opts{display:grid;gap:10px}
.lm-opt{display:flex;gap:14px;align-items:center;text-align:left;border:2px solid #d4e2ef;background:#fff;border-radius:10px;padding:14px 16px;font-size:16px;color:#1d2733;transition:all .15s}
.lm-opt:hover:not(:disabled){border-color:#1479c9;background:#f4f9fd}
.lm-opt .r{flex:none;width:22px;height:22px;border-radius:50%;border:2px solid #b8c4d2;display:grid;place-items:center}
.lm-opt.sel{border-color:#1479c9;background:#eef6fc}
.lm-opt.sel .r{border-color:#1479c9;box-shadow:inset 0 0 0 4px #fff;background:#1479c9}
.lm-opt.right{border-color:#2ea56a;background:#e9f8ef}
.lm-opt.right .r{background:#2ea56a;border-color:#2ea56a;box-shadow:none;color:#fff}
.lm-opt.wrong{border-color:#e05a5a;background:#fdeeee;animation:shk .35s}
@keyframes shk{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.lm-fb{margin-top:16px;border-radius:10px;padding:14px 16px;font-size:15px;line-height:1.55;display:none}
.lm-fb.show{display:block}
.lm-fb.ok{background:#e9f8ef;border-left:4px solid #2ea56a}
.lm-fb.no{background:#fdeeee;border-left:4px solid #e05a5a}
.lm-qfoot{display:flex;justify-content:flex-end;margin-top:16px}
/* drag */
.lm-pool{display:flex;flex-wrap:wrap;gap:10px;min-height:56px;padding:12px;border:2px dashed #cdd8e4;border-radius:12px;background:#f8fafc;margin-bottom:18px}
.lm-chip{background:#fff;border:2px solid #1479c9;color:#0f2742;border-radius:9px;padding:9px 14px;font-weight:600;font-size:14.5px;cursor:grab;user-select:none;box-shadow:0 2px 6px rgba(15,39,66,.08)}
.lm-chip.mono{font-family:Menlo,Consolas,monospace}
.lm-chip.pick{background:#1479c9;color:#fff}
.lm-chip.ok{border-color:#2ea56a;background:#e9f8ef;color:#1e7a4c;cursor:default}
.lm-chip.bad{border-color:#e05a5a;background:#fdeeee;animation:shk .35s}
.lm-targets{display:grid;gap:12px}
.lm-target{border:2px solid #d4e2ef;border-radius:12px;background:#fff;min-height:96px;display:flex;flex-direction:column}
.lm-target h5{margin:0;padding:9px 12px;background:#0f2742;color:#fff;border-radius:10px 10px 0 0;font-size:14px;text-align:center}
.lm-target .zone{flex:1;display:flex;flex-wrap:wrap;gap:8px;padding:10px;align-content:flex-start}
.lm-target.over{border-color:#1479c9;background:#f0f7fd}
/* footer */
.lm-foot{grid-row:4;grid-column:2;background:#fff;border-top:1px solid #dbe2ea;display:flex;align-items:center;gap:14px;padding:0 24px}
.lm-dots{flex:1;display:flex;justify-content:center;gap:8px;align-items:center;flex-wrap:wrap}
.lm-dot{width:12px;height:12px;border-radius:50%;border:none;background:#d6dee8;padding:0}
.lm-dot.done{background:#2ea56a}
.lm-dot.on{background:#1479c9;transform:scale(1.35)}
.lm-dot:disabled{cursor:default}
.lm-need{font-size:13px;color:#8a98a8;white-space:nowrap}
.lm-next{background:#1479c9;color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:15px;white-space:nowrap}
.lm-next:hover:not(:disabled){background:#0f65aa}
.lm-next:disabled{background:#c3cdd8;cursor:not-allowed}
.lm-next.finish{background:#2ea56a}.lm-next.finish:hover{background:#238a57}
.lm-prev{background:#fff;color:#1479c9;border:2px solid #cfe0ef;border-radius:9px;padding:10px 16px;font-weight:600;font-size:14.5px;white-space:nowrap}
.lm-prev:hover:not(:disabled){border-color:#1479c9}
.lm-prev:disabled{opacity:.4;cursor:default}
/* module complete */
.lm-doneov{position:absolute;inset:0;background:rgba(15,39,66,.55);display:grid;place-items:center;z-index:5;opacity:0;pointer-events:none;transition:opacity .3s}
.lm-doneov.show{opacity:1;pointer-events:auto}
.lm-donecard{background:#fff;border-radius:18px;padding:34px 38px;text-align:center;max-width:460px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:lmIn .5s}
.lm-badge{width:86px;height:86px;border-radius:50%;background:#2ea56a;color:#fff;font-size:44px;display:grid;place-items:center;margin:0 auto 14px;box-shadow:0 0 0 10px #e3f5ea}
.lm-donecard h2{margin:0 0 6px;font-size:25px;color:#0f2742}
.lm-donecard p{color:#44525f;margin:0 0 20px;line-height:1.5}
.lm-donecard .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.lm-confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.lm-confetti i{position:absolute;top:-12px;width:9px;height:14px;border-radius:2px;animation:fall 2.4s linear forwards}
@keyframes fall{to{transform:translateY(110vh) rotate(720deg)}}
body:has(.lm.show) #toast{bottom:92px}
@media (max-width:980px){
  .lm{grid-template-columns:0 1fr}.lm-side{visibility:hidden}
  .lm.sideopen{grid-template-columns:260px 1fr}.lm.sideopen .lm-side{visibility:visible}
  .lm-intro,.lm-video,.lm-stackwrap,.lm-diag,.lm-cidr,.lm-lab{grid-template-columns:1fr}
  .lm-main{padding:16px 12px 30px}.lm-slide{padding:22px 18px}
  .lm-crumb small{display:none}.lm-need{display:none}
}
`;
const st = document.createElement("style"); st.textContent = STYLE; document.head.appendChild(st);

const root = document.createElement("div");
root.className = "lm";
root.innerHTML = `
  <header class="lm-top">
    <button class="lm-back" id="lmBack">← Back to map</button>
    <div class="lm-crumb"><small id="lmMod"></small><b id="lmTitle"></b></div>
    <div class="lm-right"><span class="lm-pts"><i>★</i> <span id="lmPts">0</span> pts</span>
      <button class="lm-ico" id="lmSide" title="Show / hide lesson list"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button></div>
  </header>
  <div class="lm-bar"><i id="lmBar"></i></div>
  <aside class="lm-side" id="lmSideEl"></aside>
  <main class="lm-main" id="lmMain"></main>
  <footer class="lm-foot">
    <button class="lm-prev" id="lmPrev">‹ Back</button>
    <div class="lm-dots" id="lmDots"></div>
    <span class="lm-need" id="lmNeed"></span>
    <button class="lm-next" id="lmNext">Next ›</button>
  </footer>
  <div class="lm-doneov" id="lmDone"><div class="lm-confetti" id="lmConf"></div><div class="lm-donecard" id="lmDoneCard"></div></div>`;
document.body.appendChild(root);
const $ = id => root.querySelector("#" + id);

/* ---------------- helpers ---------------- */
const content = () => window.LESSON_CONTENT || {};
function slidesFor(L){
  const c = content()[L.id];
  return c ? c.slides : [{ type:"video", kicker:`${L.id} · Video lesson`, title:L.title, lead:"Watch the video. Your quick notes are on the right." }];
}
function kindOf(L){
  const s = slidesFor(L).map(x => x.type);
  if (s.includes("certhub")) return "certs";
  if (s.every(t => t === "video")) return "video";
  if (s.every(t => t === "mc" || t === "drag")) return "quiz";
  if (s[0] === "video") return "videoquiz";
  return "interactive";
}
const KIND = { video:["▶","Video"], quiz:["?","Quiz"], videoquiz:["▶","Video + quiz"], interactive:["✦","Interactive"], certs:["🎓","Certifications"] };
function esc(t){ return String(t).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }

let cur = null;   // { L, slides, i, done:[], max }
let player = null, cleanup = [];

function setDone(i){
  if (!cur || cur.done[i]) return;
  cur.done[i] = true; foot();
}

/* ---------------- open / close ---------------- */
function open(L, startAt){
  closeDone();
  const slides = slidesFor(L), already = !!S.done[L.id];
  cur = { L, slides, i: startAt || 0, done: slides.map(s => already || !needs(s)), max: already ? slides.length-1 : 0 };
  root.classList.add("show");
  document.body.style.overflow = "hidden";
  side(); show();
}
function needs(s){ return !["intro","video"].includes(s.type); }
function close(){
  if (!cur) return;
  const L = cur.L;
  teardown(); closeDone();
  root.classList.remove("show");
  cur = null;
  const next = nextLesson();
  const mod = next && next.mod.pi === L.mod.pi ? next.mod : L.mod;
  openTo(PATH.phases[mod.pi], mod);
  if (next) setTimeout(() => { const el = document.querySelector(`.node[data-id="${next.id}"]`); el && el.classList.add("flash"); }, 650);
}
function teardown(){
  try { player && player.destroy(); } catch(e){}
  player = null;
  cleanup.forEach(f => { try { f(); } catch(e){} }); cleanup = [];
}

/* ---------------- sidebar ---------------- */
function side(){
  const L = cur.L, m = L.mod;
  const done = m.ls.filter(x => S.done[x.id]).length;
  let h = `<h4>Phase ${m.pi+1} · Module ${m.id}</h4><div class="lm-modname">${esc(m.title)}</div>
    <div class="lm-modbar"><i style="width:${done/m.ls.length*100}%"></i></div><h4>Lessons</h4>`;
  m.ls.forEach(x => {
    const k = KIND[kindOf(x)], ok = S.done[x.id], un = lessonUnlocked(x);
    h += `<button class="lm-li${x===L?' cur':''}${ok?' done':''}" data-lid="${x.id}" ${un?'':'disabled'}>
      <span class="st">${ok?'✓':un?'':'🔒'}</span><span><b>${x.id} ${esc(x.title)}</b><small>${k[0]} ${k[1]}</small></span></button>`;
  });
  h += `<h4>Quick notes</h4><div class="lm-notes">${notesHTML(L)}</div>`;
  $("lmSideEl").innerHTML = h;
}
function notesHTML(L){ return (L.notes||[]).map(([t,b]) => `<b>${esc(t)}</b><ul>${b.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`).join(""); }
$("lmSideEl").addEventListener("click", e => {
  const b = e.target.closest("[data-lid]"); if (!b || b.disabled) return;
  const L = LESSONS.find(x => x.id === b.dataset.lid);
  if (L && L !== cur.L) { teardown(); open(L); }
  if (innerWidth < 980) root.classList.remove("sideopen");
});
$("lmSide").onclick = () => { if (innerWidth < 980) root.classList.toggle("sideopen"); else root.classList.toggle("noside"); };
$("lmBack").onclick = close;

/* ---------------- footer ---------------- */
const NEED = { flip:"Flip every card", stack:"Open every tab", hotspots:"Click every dot", diagram:"Click every part", journey:"Finish the animation",
               cidr:"Try 3 prefix sizes", terminal:"Complete every task", mc:"Answer correctly", drag:"Match every card", certhub:"Open at least one certification" };
function foot(){
  const { slides, i, done } = cur, last = i === slides.length - 1, allDone = done.every(Boolean);
  cur.max = Math.max(cur.max, i);
  $("lmDots").innerHTML = slides.map((s,k) => `<button class="lm-dot${k===i?' on':''}${done[k]&&k!==i?' done':''}" data-k="${k}" ${k<=cur.max || done[k-1] ? '' : 'disabled'} title="${esc(s.title||'')}"></button>`).join("");
  $("lmBar").style.width = ((done.filter(Boolean).length) / slides.length * 100) + "%";
  const nx = $("lmNext");
  nx.classList.remove("finish");
  if (!done[i]) { nx.disabled = true; nx.textContent = last ? "Complete lesson ✓" : "Next ›"; $("lmNeed").textContent = "🔒 " + (NEED[slides[i].type] || "Finish this activity") + " to continue"; }
  else {
    nx.disabled = false; $("lmNeed").textContent = "";
    if (!last) nx.textContent = "Next ›";
    else if (!S.done[cur.L.id]) { nx.textContent = "Complete lesson ✓"; nx.classList.add("finish"); nx.disabled = !allDone; }
    else nx.textContent = nextInModule() ? "Next lesson ›" : "Finish module ›";
  }
  const pv = $("lmPrev");
  const prevL = LESSONS[cur.L.gi - 1];
  pv.disabled = i === 0 && !prevL;
  pv.textContent = i === 0 ? "‹ Previous lesson" : "‹ Back";
  $("lmPts").textContent = S.points;
}
$("lmDots").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b && !b.disabled) go(+b.dataset.k); });
$("lmPrev").onclick = () => {
  if (cur.i > 0) return go(cur.i - 1);
  const p = LESSONS[cur.L.gi - 1]; if (p) { teardown(); open(p); }
};
$("lmNext").onclick = () => {
  const { slides, i } = cur;
  if (i < slides.length - 1) return go(i + 1);
  if (!S.done[cur.L.id]) { completeLesson(cur.L); side(); }
  const n = nextInModule();
  if (n) { teardown(); open(n); }
  else moduleDone();
};
function nextInModule(){ const m = cur.L.mod; return m.ls[cur.L.j + 1] || null; }
function go(k){ teardown(); cur.i = k; show(); }

addEventListener("keydown", e => {
  if (!cur || !root.classList.contains("show")) return;
  if (e.target.tagName === "INPUT") return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowRight" && !$("lmNext").disabled) $("lmNext").click();
  if (e.key === "ArrowLeft" && !$("lmPrev").disabled) $("lmPrev").click();
});

/* ---------------- module complete ---------------- */
function moduleDone(){
  const m = cur.L.mod, nm = MODS[m.gi + 1];
  const phaseDone = !nm || nm.pi !== m.pi;
  $("lmDoneCard").innerHTML = `<div class="lm-badge">✓</div>
    <h2>Module ${m.id} complete!</h2>
    <p>You finished <b>${esc(m.title)}</b>${phaseDone ? ` and all of <b>Phase ${m.pi+1}</b>` : ""}. You now have <b>${S.points} points</b>.${nm ? `<br>Next up: <b>${nm.id} ${esc(nm.title)}</b>.` : ""}</p>
    <div class="row"><button class="lm-btn ghost" id="lmDoneMap">Back to map</button>${nm ? `<button class="lm-btn" id="lmDoneNext">Start ${nm.id} ›</button>` : ""}</div>`;
  $("lmDone").classList.add("show");
  const cf = $("lmConf"); cf.innerHTML = "";
  const cols = ["#1479c9","#2ea56a","#f28a3d","#6b5bd6","#f6c344","#12a3b8"];
  for (let k=0;k<70;k++){ const i=document.createElement("i"); i.style.left=Math.random()*100+"%"; i.style.background=cols[k%cols.length]; i.style.animationDelay=(Math.random()*.8)+"s"; i.style.animationDuration=(1.8+Math.random()*1.4)+"s"; cf.appendChild(i); }
  $("lmDoneMap").onclick = close;
  const b = $("lmDoneNext"); if (b) b.onclick = () => { closeDone(); teardown(); open(nm.ls[0]); };
}
function closeDone(){ $("lmDone").classList.remove("show"); }

/* ---------------- slide rendering ---------------- */
function show(){
  const { L, slides, i } = cur, s = slides[i];
  $("lmMod").textContent = `Phase ${L.mod.pi+1} · ${L.mod.id} ${L.mod.title} · Lesson ${L.j+1} of ${L.mod.ls.length}`;
  $("lmTitle").innerHTML = `<span>${L.id}</span>${esc(L.title)}`;
  const kc = s.type === "mc" || s.type === "drag" ? "q" : s.type === "terminal" ? "lab" : "";
  const main = $("lmMain");
  main.innerHTML = `<article class="lm-slide"><span class="lm-kick ${kc}">${esc(s.kicker || L.id)}</span>
    <h2>${esc(s.title || L.title)}</h2>${s.lead ? `<p class="lm-lead">${s.lead}</p>` : ""}<div id="lmBody"></div></article>`;
  main.scrollTop = 0;
  const body = $("lmBody");
  (R[s.type] || R.intro)(body, s, () => setDone(i), cur.done[i]);
  foot();
}
function req(body, total){
  const d = document.createElement("div"); d.className = "lm-req";
  body.appendChild(d);
  return n => { d.classList.toggle("ok", n >= total); d.innerHTML = `<span class="pill">${n >= total ? "✓ " : ""}${n} / ${total}</span> ${n >= total ? "All done — press Next to continue" : "explored"}`; };
}

const R = {};
R.intro = (b, s) => { b.innerHTML = `<div class="lm-intro"><div>${s.text||""}</div><div class="lm-art">${s.art||""}</div></div>`; };

R.video = (b, s, done) => {
  const L = cur.L, id = s.id || L.videoId;
  b.innerHTML = `<div class="lm-video"><div><div class="lm-vbox"><div id="lmPlayer"></div><div class="lm-verr" id="lmVerr">This video can't play here.<br>Open the site with “Start FuturePath.command” or VS Code Live Server.</div></div>
    <p class="lm-hint">▶ ${esc(L.videoTitle||"")}</p></div>
    <div class="lm-vnotes"><h5>Quick study notes</h5>${notesHTML(L)}</div></div>`;
  done();
  const mk = () => {
    if (!cur || !document.getElementById("lmPlayer")) return;
    if (!(typeof ytReady !== "undefined" && ytReady && window.YT && YT.Player)) return setTimeout(mk, 250);
    player = new YT.Player("lmPlayer", { host:"https://www.youtube-nocookie.com", videoId:id,
      playerVars:{ rel:0, modestbranding:1, playsinline:1, iv_load_policy:3 },
      events:{ onError:() => { const e = document.getElementById("lmVerr"); e && e.classList.add("show"); } } });
  };
  mk();
};

R.flip = (b, s, done, was) => {
  b.innerHTML = `<div class="lm-flips">${s.cards.map((c,k)=>`<button class="lm-flip${was?' seen':''}" data-k="${k}"><div class="in">
     <div class="f">${c.icon||""}<b>${esc(c.title)}</b><small>${esc(c.sub||"")}</small><em>Click to flip ↻</em></div>
     <div class="b"><h4>${esc(c.title)}</h4>${c.back}</div></div></button>`).join("")}</div>`;
  const upd = req(b, s.cards.length);
  const seen = new Set(was ? s.cards.map((_,k)=>k) : []);
  upd(seen.size);
  b.querySelectorAll(".lm-flip").forEach(el => el.onclick = () => {
    el.classList.toggle("flipped"); el.classList.add("seen"); seen.add(+el.dataset.k); upd(seen.size);
    if (seen.size === s.cards.length) done();
  });
};

R.stack = (b, s, done, was) => {
  b.innerHTML = `<div class="lm-tabs">${s.models.map((m,k)=>`<button class="lm-tab${was?' seen':''}" data-k="${k}">${esc(m.label)}</button>`).join("")}</div>
    <div class="lm-stackwrap"><div><div class="lm-legend"><span><i style="background:#1479c9"></i>You manage</span><span><i style="background:#6b5bd6"></i>Provider manages</span></div>
      <div class="lm-stack">${s.layers.map(l=>`<div class="lm-layer you">${esc(l)}<small></small></div>`).join("")}</div></div>
      <div class="lm-callout" id="lmCall"><h4>Pick a tab</h4>Start with <b>On-premises</b> and work your way to <b>SaaS</b>.</div></div>`;
  const upd = req(b, s.models.length);
  const seen = new Set(was ? s.models.map((_,k)=>k) : []); upd(seen.size);
  const tabs = b.querySelectorAll(".lm-tab"), rows = b.querySelectorAll(".lm-layer");
  const pick = k => {
    const m = s.models[k];
    tabs.forEach((t,q) => t.classList.toggle("on", q===k)); tabs[k].classList.add("seen");
    rows.forEach((r,q) => { const you = q < m.you; r.className = "lm-layer " + (you ? "you" : "prov"); r.querySelector("small").textContent = you ? "You" : "Provider"; });
    $("lmCall").innerHTML = `<h4>${esc(m.label)}</h4>${m.note}<br><br><b>You manage ${m.you} of ${s.layers.length} layers.</b>`;
    seen.add(k); upd(seen.size); if (seen.size === s.models.length) done();
  };
  tabs.forEach((t,k) => t.onclick = () => pick(k));
};

R.hotspots = (b, s, done, was) => {
  b.innerHTML = `<div class="lm-hot">${s.art}${s.spots.map((p,k)=>`<button class="lm-spot${was?' seen':''}" data-k="${k}" style="left:${p.x}%;top:${p.y}%">${k+1}</button>`).join("")}</div>
    <div class="lm-info" id="lmInfo"><div class="ph">Click a numbered dot to learn more.</div></div>`;
  const upd = req(b, s.spots.length);
  const seen = new Set(was ? s.spots.map((_,k)=>k) : []); upd(seen.size);
  b.querySelectorAll(".lm-spot").forEach(el => el.onclick = () => {
    const k = +el.dataset.k, p = s.spots[k];
    b.querySelectorAll(".lm-spot").forEach(x => x.classList.remove("on"));
    el.classList.add("on","seen");
    $("lmInfo").innerHTML = `<div class="lm-callout"><h4>${k+1}. ${esc(p.title)}</h4>${p.text}</div>`;
    $("lmInfo").scrollIntoView({ behavior:"smooth", block:"nearest" });
    seen.add(k); upd(seen.size); if (seen.size === s.spots.length) done();
  });
};

R.diagram = (b, s, done, was) => {
  const keys = Object.keys(s.parts), dark = s.art.includes('#10263d');
  b.innerHTML = `<div class="lm-diag${s.art.includes('viewBox="0 0 760 1')?' stacked':''}"><div class="lm-art${dark?' lm-dark':''}">${s.art}</div>
     <div id="lmInfo"><div class="lm-callout"><h4>Explore the diagram</h4>Click each highlighted part. You've got ${keys.length} to discover.</div></div></div>`;
  const upd = req(b, keys.length);
  const seen = new Set(was ? keys : []); upd(seen.size);
  if (was) b.querySelectorAll(".part").forEach(p => p.classList.add("seen"));
  b.querySelectorAll(".part").forEach(el => el.addEventListener("click", () => {
    const k = el.dataset.part, p = s.parts[k]; if (!p) return;
    b.querySelectorAll(".part").forEach(x => x.classList.remove("on"));
    el.classList.add("on","seen");
    $("lmInfo").innerHTML = `<div class="lm-callout"><h4>${esc(p.title)}</h4>${p.text}</div>`;
    seen.add(k); upd(seen.size); if (seen.size === keys.length) done();
  }));
};

R.journey = (b, s, done, was) => {
  const N = window.LESSON_NET;
  b.innerHTML = `<div class="lm-diag stacked"><div class="lm-art">${s.art}</div></div>
    <div class="lm-steps">${s.steps.map(()=>"<i></i>").join("")}</div>
    <div id="lmInfo"><div class="lm-callout"><h4>Ready?</h4>Press <b>Next step</b> to send your first packet.</div></div>
    <div class="lm-qfoot"><button class="lm-btn ghost" id="lmJr" style="margin-right:8px">↺ Replay</button><button class="lm-btn" id="lmJn">Next step ›</button></div>`;
  const svg = b.querySelector("svg"), pk = svg.querySelector(".packet"), bars = b.querySelectorAll(".lm-steps i");
  svg.querySelectorAll(".part").forEach(p => p.style.cursor = "default");
  let k = -1, raf = 0;
  const move = (from, to) => {
    cancelAnimationFrame(raf);
    const [x1,y1] = N[from], [x2,y2] = N[to], t0 = performance.now(), D = 1100;
    pk.style.opacity = 1;
    const step = t => { const p = Math.min(1,(t-t0)/D), e = p<.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
      pk.setAttribute("cx", x1+(x2-x1)*e); pk.setAttribute("cy", y1+(y2-y1)*e); if (p<1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  cleanup.push(() => cancelAnimationFrame(raf));
  const stepTo = n => {
    k = n; const st = s.steps[k];
    bars.forEach((x,q) => x.classList.toggle("on", q<=k));
    svg.querySelectorAll(".part").forEach(p => p.classList.toggle("on", p.dataset.part === st.from || p.dataset.part === st.to));
    move(st.from, st.to);
    $("lmInfo").innerHTML = `<div class="lm-callout"><h4>${esc(st.title)}</h4>${st.text}</div>`;
    $("lmJn").disabled = k === s.steps.length-1;
    $("lmJn").textContent = k === s.steps.length-1 ? "Done ✓" : "Next step ›";
    if (k === s.steps.length-1) done();
  };
  $("lmJn").onclick = () => stepTo(k+1);
  $("lmJr").onclick = () => stepTo(0);
  if (was) { bars.forEach(x => x.classList.add("on")); }
};

R.cidr = (b, s, done, was) => {
  b.innerHTML = `<div class="lm-cidr"><div>
      <div class="addr">10.0.0.0<span id="lmCp">/24</span></div>
      <input type="range" class="lm-range" id="lmCr" min="16" max="30" value="24">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7a8b"><span>/16 · huge network</span><span>/30 · tiny network</span></div>
      <div class="lm-bits" id="lmBits">${"<i></i>".repeat(32)}</div>
      <div class="lm-legend"><span><i style="background:#1479c9"></i>Network bits</span><span><i style="background:#f28a3d"></i>Host bits</span></div>
    </div><div>
      <div class="lm-stats">
        <div class="lm-stat"><small>Total addresses</small><b id="lmCt"></b></div>
        <div class="lm-stat"><small>Usable in AWS</small><b id="lmCu"></b></div>
        <div class="lm-stat"><small>Subnet mask</small><b id="lmCm" style="font-size:18px"></b></div>
        <div class="lm-stat"><small>Fit inside a /16 VPC</small><b id="lmCf"></b></div>
      </div>
      <div class="lm-callout" id="lmCc" style="margin-top:14px"></div></div></div>`;
  const upd = req(b, 3); const seen = new Set(was ? [1,2,3] : []);
  const fmt = n => n.toLocaleString("en-ZA");
  const set = n => {
    $("lmCp").textContent = "/" + n;
    b.querySelectorAll("#lmBits i").forEach((x,q) => x.className = q < n ? "n" : "h");
    const tot = 2 ** (32 - n);
    const mask = [0,1,2,3].map(o => { const bits = Math.max(0, Math.min(8, n - o*8)); return 256 - 2 ** (8 - bits); }).join(".");
    $("lmCt").textContent = fmt(tot); $("lmCu").textContent = fmt(Math.max(0, tot - 5)); $("lmCm").textContent = mask; $("lmCf").textContent = fmt(2 ** (n - 16)) + " subnets";
    $("lmCc").innerHTML = n <= 18 ? "<b>Very large.</b> Sizes like /16 are used for a whole VPC, not a single subnet."
      : n <= 24 ? "<b>Common subnet size.</b> A /24 (256 addresses) is the classic choice for a cloud subnet."
      : n <= 27 ? "<b>Small subnet.</b> Good for a handful of servers such as a database tier."
      : "<b>Tiny.</b> AWS won't even let you go smaller than /28 for a subnet.";
    seen.add(n); upd(Math.min(3, seen.size)); if (seen.size >= 3) done();
  };
  $("lmCr").oninput = e => set(+e.target.value);
  set(24); if (!was) { seen.clear(); seen.add(24); upd(1); }
};

R.terminal = (b, s, done, was) => {
  const H = "/home/thandi";
  const fs = { "/":{d:1}, "/home":{d:1}, [H]:{d:1}, [H+"/Documents"]:{d:1}, [H+"/projects"]:{d:1},
    [H+"/readme.txt"]:{c:"Welcome to your practice cloud server! Type help to see the commands."},
    [H+"/projects/notes.txt"]:{c:"TODO: back up the database before every deployment!\nRemember: least privilege for every IAM user."},
    [H+"/projects/app.py"]:{c:'print("Hello from the cloud")'}, [H+"/Documents/cv.pdf"]:{c:"(binary file)"} };
  const state = { cwd:H, fs, lastOk:true };
  let t = was ? s.tasks.length : 0;
  b.innerHTML = `<div class="lm-lab"><div class="lm-term" id="lmTerm"><div class="tb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i>&nbsp; thandi@cloud-server — practice lab</div>
      <div class="out" id="lmOut"></div><div class="row"><span class="p" id="lmPs"></span><input id="lmIn" autocomplete="off" spellcheck="false" aria-label="Type a command"></div></div>
      <div><ol class="lm-tasks" id="lmTasks"></ol><div class="lm-hint" id="lmHint"></div></div></div>`;
  const out = $("lmOut"), inp = $("lmIn");
  const short = p => p === H ? "~" : p.startsWith(H+"/") ? "~" + p.slice(H.length) : p;
  const ps = () => `thandi@<b>cloud-server</b>:${short(state.cwd)}$`;
  const print = (h) => { out.insertAdjacentHTML("beforeend", h + "\n"); out.scrollTop = out.scrollHeight; };
  const norm = p => { const parts = []; p.split("/").forEach(x => { if (!x || x === ".") return; if (x === "..") parts.pop(); else parts.push(x); }); return "/" + parts.join("/"); };
  const resolve = p => !p || p === "~" ? H : norm(p.startsWith("/") ? p : p.startsWith("~/") ? H + p.slice(1) : state.cwd + "/" + p);
  const kids = d => Object.keys(fs).filter(k => k !== d && k.startsWith(d === "/" ? "/" : d + "/") && !k.slice(d === "/" ? 1 : d.length+1).includes("/")).map(k => k.split("/").pop()).sort();
  const run = line => {
    const [cmd, ...a] = line.split(/\s+/); const arg = a.join(" "); state.lastOk = true;
    const fail = m => { state.lastOk = false; print(`<span class="err">${esc(m)}</span>`); };
    switch (cmd) {
      case "": return;
      case "pwd": print(state.cwd); break;
      case "ls": { const d = resolve(arg || "."); if (!fs[d]) return fail(`ls: cannot access '${arg}': No such file or directory`); if (!fs[d].d) return print(esc(arg));
        print(kids(d).map(n => fs[d === "/" ? "/"+n : d+"/"+n].d ? `<span class="dir">${esc(n)}/</span>` : esc(n)).join("   ") || ""); break; }
      case "cd": { const d = resolve(arg); if (!fs[d]) return fail(`cd: ${arg}: No such file or directory`); if (!fs[d].d) return fail(`cd: ${arg}: Not a directory`); state.cwd = d; break; }
      case "mkdir": { if (!arg) return fail("mkdir: missing operand"); const d = resolve(arg); if (fs[d]) return fail(`mkdir: cannot create directory '${arg}': File exists`); if (!fs[d.slice(0, d.lastIndexOf("/")) || "/"]) return fail(`mkdir: cannot create directory '${arg}': No such file or directory`); fs[d] = {d:1}; break; }
      case "touch": { if (!arg) return fail("touch: missing file operand"); const f = resolve(arg); if (!fs[f]) fs[f] = {c:""}; break; }
      case "cat": { if (!arg) return fail("cat: missing file operand"); const f = resolve(arg); if (!fs[f]) return fail(`cat: ${arg}: No such file or directory`); if (fs[f].d) return fail(`cat: ${arg}: Is a directory`); print(esc(fs[f].c)); break; }
      case "whoami": print("thandi"); break;
      case "echo": print(esc(arg)); break;
      case "clear": out.innerHTML = ""; break;
      case "sudo": print(`[sudo] password for thandi: <span class="err">not needed in this lab 😉</span>`); break;
      case "help": print("Commands: pwd  ls  cd  mkdir  cat  touch  whoami  echo  clear"); break;
      default: fail(`${cmd}: command not found`);
    }
  };
  const tasks = () => {
    $("lmTasks").innerHTML = s.tasks.map((x,q) => `<li class="${q<t?'ok':q===t?'cur':''}"><span class="n">${q<t?'✓':q+1}</span>${esc(x.text)}</li>`).join("");
    $("lmHint").innerHTML = t < s.tasks.length ? `Stuck? <button id="lmHb">Show hint</button>` : `<b style="color:#1e7a4c">✓ Lab complete — great work!</b>`;
    const hb = $("lmHb"); if (hb) hb.onclick = () => { $("lmHint").innerHTML = `Try typing: <code>${esc(s.tasks[t].hint)}</code>`; };
  };
  $("lmPs").innerHTML = ps();
  print(`<span style="color:#8aa0b8">Welcome to the FuturePath practice server. Type <b style="color:#fff">help</b> for commands.</span>`);
  tasks(); if (was) done();
  inp.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const line = inp.value.trim(); inp.value = "";
    print(`<span class="p">${ps()}</span> ${esc(line)}`);
    run(line);
    $("lmPs").innerHTML = ps();
    if (t < s.tasks.length && s.tasks[t].check(line, state)) {
      t++; tasks();
      if (t === s.tasks.length) done();
    }
  });
  $("lmTerm").addEventListener("click", () => inp.focus());
  setTimeout(() => inp.focus({ preventScroll:true }), 300);
};

R.certhub = (b, s, done, was) => {
  b.innerHTML = `<div class="lm-certs">${s.certs.map((c,k)=>`<div class="lm-cert${was?' went':''}" data-k="${k}">
      <div class="logo"><i style="background:${c.color}">${esc(c.mark)}</i><b>${esc(c.provider)}</b></div>
      <h5>${esc(c.name)}</h5><p>${esc(c.why)}</p>
      <div class="tags">${(c.tags||[]).map(t=>`<span>${esc(t)}</span>`).join("")}</div>
      ${c.note?`<small class="note">${esc(c.note)}</small>`:""}
      <a class="go" href="${c.url}" target="_blank" rel="noopener">Start on ${esc(c.provider)} →</a></div>`).join("")}</div>
    ${s.footnote?`<div class="lm-certnote">${s.footnote}</div>`:""}`;
  b.querySelectorAll(".lm-cert a.go").forEach(a => a.addEventListener("click", () => {
    const card = a.closest(".lm-cert"), c = s.certs[+card.dataset.k];
    card.classList.add("went"); done();
    try { window.IV && IV.logReferral({ career: (typeof PATH !== "undefined" && PATH.key) || "", provider: c.provider, certification: c.name, url: a.href }); } catch(e){}
  }));
};

R.mc = (b, s, done, was) => {
  const letters = "ABCDEFG";
  b.innerHTML = `<div class="lm-q">${esc(s.q)}</div><div class="lm-opts">${s.options.map((o,k)=>`<button class="lm-opt" data-k="${k}"><span class="r"></span><span><b style="color:#6b7a8b;margin-right:8px">${letters[k]}.</b>${esc(o)}</span></button>`).join("")}</div>
    <div class="lm-fb" id="lmFb"></div><div class="lm-qfoot"><button class="lm-btn" id="lmChk" disabled>Check answer</button></div>`;
  const opts = b.querySelectorAll(".lm-opt"); let sel = -1;
  const lock = () => { opts.forEach(o => o.disabled = true); opts[s.answer].classList.add("right"); opts[s.answer].querySelector(".r").textContent = "✓";
    $("lmFb").className = "lm-fb show ok"; $("lmFb").innerHTML = `<b>✓ Correct!</b> ${esc(s.explain)}`; $("lmChk").style.display = "none"; };
  if (was) return lock();
  opts.forEach(o => o.onclick = () => { opts.forEach(x => x.classList.remove("sel","wrong")); o.classList.add("sel"); sel = +o.dataset.k; $("lmChk").disabled = false; $("lmFb").className = "lm-fb"; });
  $("lmChk").onclick = () => {
    if (sel === s.answer) { lock(); done(); }
    else { opts[sel].classList.remove("sel"); void opts[sel].offsetWidth; opts[sel].classList.add("wrong");
      $("lmFb").className = "lm-fb show no"; $("lmFb").innerHTML = "<b>Not quite.</b> Have another look and try again."; $("lmChk").disabled = true; sel = -1; }
  };
};

R.drag = (b, s, done, was) => {
  const order = s.items.map((_,k)=>k).sort(() => Math.random() - .5);
  const cols = s.cols || (s.targets.length <= 3 ? s.targets.length : Math.min(5, s.targets.length));
  b.innerHTML = `<div class="lm-pool" id="lmPool">${order.map(k=>`<div class="lm-chip${s.items[k].mono?' mono':''}" draggable="true" data-k="${k}">${esc(s.items[k].text)}</div>`).join("")}</div>
    <div class="lm-targets" style="grid-template-columns:repeat(${cols},1fr)">${s.targets.map(t=>`<div class="lm-target" data-t="${esc(t)}"><h5>${esc(t)}</h5><div class="zone"></div></div>`).join("")}</div>
    <div class="lm-fb" id="lmFb"></div><div class="lm-qfoot"><button class="lm-btn" id="lmChk">Check answers</button></div>`;
  const pool = $("lmPool"); let picked = null;
  const place = (chip, tgt) => { if (chip.classList.contains("ok")) return; chip.classList.remove("pick","bad"); tgt.querySelector(".zone").appendChild(chip); picked = null; };
  b.querySelectorAll(".lm-chip").forEach(c => {
    c.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", c.dataset.k); c.style.opacity = .5; });
    c.addEventListener("dragend", () => c.style.opacity = 1);
    c.addEventListener("click", e => { e.stopPropagation();
      const tg = c.closest(".lm-target");
      if (picked && picked !== c && tg) return place(picked, tg);
      if (c.classList.contains("ok")) return;
      if (picked === c) { c.classList.remove("pick"); picked = null; return; }
      b.querySelectorAll(".lm-chip").forEach(x => x.classList.remove("pick")); c.classList.add("pick"); picked = c; });
  });
  b.querySelectorAll(".lm-target").forEach(t => {
    t.addEventListener("dragover", e => { e.preventDefault(); t.classList.add("over"); });
    t.addEventListener("dragleave", () => t.classList.remove("over"));
    t.addEventListener("drop", e => { e.preventDefault(); t.classList.remove("over"); const c = b.querySelector(`.lm-chip[data-k="${e.dataTransfer.getData("text/plain")}"]`); c && place(c, t); });
    t.addEventListener("click", () => { if (picked) place(picked, t); });
  });
  pool.addEventListener("dragover", e => e.preventDefault());
  pool.addEventListener("drop", e => { e.preventDefault(); const c = b.querySelector(`.lm-chip[data-k="${e.dataTransfer.getData("text/plain")}"]`); if (c && !c.classList.contains("ok")) pool.appendChild(c); });
  const finish = () => { $("lmFb").className = "lm-fb show ok"; $("lmFb").innerHTML = `<b>✓ All matched!</b> ${esc(s.explain||"")}`; $("lmChk").style.display = "none"; pool.style.display = "none"; };
  if (was) { b.querySelectorAll(".lm-chip").forEach(c => { const t = b.querySelector(`.lm-target[data-t="${CSS.escape(s.items[c.dataset.k].target)}"]`); t.querySelector(".zone").appendChild(c); c.classList.add("ok"); c.draggable = false; }); return finish(); }
  $("lmChk").onclick = () => {
    let wrong = 0, placed = 0;
    b.querySelectorAll(".lm-target").forEach(t => t.querySelectorAll(".lm-chip").forEach(c => {
      placed++;
      c.classList.remove("pick"); picked = null;
      if (s.items[c.dataset.k].target === t.dataset.t) { c.classList.add("ok"); c.draggable = false; }
      else { wrong++; c.classList.add("bad"); setTimeout(() => { c.classList.remove("bad"); pool.appendChild(c); }, 600); }
    }));
    const left = s.items.length - b.querySelectorAll(".lm-chip.ok").length;
    if (!left) { finish(); done(); }
    else { $("lmFb").className = "lm-fb show no";
      $("lmFb").innerHTML = placed === 0 ? "Drag the cards into the boxes first." : wrong ? `<b>${wrong} not quite right</b> — they've gone back to the top. ${left} still to place.` : `Good so far! ${left} card${left>1?'s':''} still to place.`; }
  };
};

window.LessonMode = { open, close, kindLabel: L => KIND[kindOf(L)].join(" "), kind: kindOf, isOpen: () => !!cur,
  register: (type, fn, needText) => { R[type] = fn; if (needText) NEED[type] = needText; }, req, esc };
})();
