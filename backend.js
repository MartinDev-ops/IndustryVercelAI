/* =====================================================================
   IndustryVerse — Supabase backend
   - Accounts (Supabase Auth, email + password)
   - Cloud progress sync per career (table: progress, protected by RLS)
   - Referral tracking for certification clicks (table: referral_clicks)
   The anon key below is a PUBLIC key by design; all data is protected by
   Row Level Security in the database. Never put the service_role key here.
   ===================================================================== */
(function(){
const SUPABASE_URL = "https://dwtpcryfynzssnbljpos.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ITTEMp7DekRmSFqU3xeAnw_Zj5lT4AJ";

const configured = /^https:\/\//.test(SUPABASE_URL);
const IV = window.IV = { user:null, ready:false, logReferral(){}, openAuth(){} };
if (!configured) { console.warn("[IV] Supabase not configured yet"); return; }

/* ---------- load supabase-js ---------- */
const s = document.createElement("script");
s.src = "vendor/supabase.min.js";
s.onload = init;
document.head.appendChild(s);

let sb;
const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const onTree = () => typeof S !== "undefined" && typeof PATH !== "undefined";

/* ---------- auth modal ---------- */
const css = `
.ivm{position:fixed;inset:0;z-index:200;display:none;place-items:center;background:rgba(10,20,35,.55);font-family:Inter,system-ui,Arial,sans-serif}
.ivm.show{display:grid}
.ivm .box{background:#fff;color:#1d2733;width:min(400px,92vw);border-radius:14px;padding:26px 24px 20px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.ivm h2{margin:0 0 4px;font-size:22px}.ivm p{margin:0 0 16px;color:#5b6b7c;font-size:14px}
.ivm input{width:100%;box-sizing:border-box;border:1px solid #cfd8e3;border-radius:8px;padding:11px 12px;font-size:15px;margin-bottom:10px}
.ivm .row{display:flex;gap:10px;margin-top:6px}.ivm button{flex:1;border:none;border-radius:8px;padding:11px;font-size:15px;font-weight:600;cursor:pointer}
.ivm .prim{background:linear-gradient(90deg,#12a3b8,#1479c9);color:#fff}.ivm .ghost{background:#eef2f6;color:#1d2733}
.ivm .sw{margin-top:14px;font-size:13px;text-align:center;color:#5b6b7c}.ivm .sw a{color:#1479c9;cursor:pointer;font-weight:600}
.ivm .msg{min-height:18px;font-size:13px;margin:4px 0 2px}.ivm .msg.err{color:#c0392b}.ivm .msg.ok{color:#1f8a5b}
.ivm .google{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:#fff;border:1px solid #cfd8e3;color:#1d2733;margin-bottom:12px}
.ivm .google:hover{background:#f5f8fb}.ivm .or{display:flex;align-items:center;gap:10px;color:#8a97a6;font-size:12px;margin:2px 0 12px}.ivm .or:before,.ivm .or:after{content:"";flex:1;height:1px;background:#e1e7ee}
`;
function ensureModal(){
  if (document.getElementById("ivAuth")) return;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const m = document.createElement("div"); m.className = "ivm"; m.id = "ivAuth";
  m.innerHTML = `<div class="box" role="dialog" aria-modal="true"><div id="ivBody"></div></div>`;
  m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show"); });
  document.body.appendChild(m);
}
let mode = "signin";
function renderModal(){
  const b = document.getElementById("ivBody");
  if (IV.user) {
    const n = IV.user.user_metadata?.full_name || IV.user.email;
    b.innerHTML = `<h2>Hi, ${esc(n)}</h2><p>Your progress is saved to your account and syncs across devices.</p>
      <div class="row"><button class="ghost" id="ivClose">Close</button><button class="prim" id="ivOut">Sign out</button></div>`;
    b.querySelector("#ivClose").onclick = () => hide();
    b.querySelector("#ivOut").onclick = async () => { await sb.auth.signOut(); hide(); };
    return;
  }
  const up = mode === "signup";
  b.innerHTML = `<h2>${up ? "Create your account" : "Sign in"}</h2><p>Save your progress and pick up where you left off, on any device.</p>
    <button class="google" id="ivGoogle"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Continue with Google</button>
    <div class="or">or use email</div>
    ${up ? `<input id="ivName" placeholder="Full name" autocomplete="name" maxlength="80">` : ""}
    <input id="ivEmail" type="email" placeholder="Email" autocomplete="email" maxlength="120">
    <input id="ivPass" type="password" placeholder="Password (min 8 characters)" autocomplete="${up ? "new-password" : "current-password"}">
    <div class="msg" id="ivMsg"></div>
    <div class="row"><button class="ghost" id="ivCancel">Cancel</button><button class="prim" id="ivGo">${up ? "Sign up" : "Sign in"}</button></div>
    <div class="sw">${up ? `Already have an account? <a id="ivSw">Sign in</a>` : `New here? <a id="ivSw">Create an account</a>`}</div>`;
  b.querySelector("#ivCancel").onclick = () => hide();
  b.querySelector("#ivSw").onclick = () => { mode = up ? "signin" : "signup"; renderModal(); };
  b.querySelector("#ivGo").onclick = submit;
  b.querySelector("#ivGoogle").onclick = async () => {
    const msg = document.getElementById("ivMsg");
    // check Google is switched on first, so learners never land on a raw error page
    try {
      const cfg = await fetch(SUPABASE_URL + "/auth/v1/settings", { headers: { apikey: SUPABASE_ANON_KEY } }).then(r => r.json());
      if (!cfg?.external?.google) { msg.className = "msg err"; msg.textContent = "Google sign-in is coming soon. Please use email for now."; return; }
    } catch(e) {}
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } });
    if (error) { msg.className = "msg err"; msg.textContent = /not enabled|Unsupported provider/i.test(error.message) ? "Google sign-in isn't switched on yet. Use email for now." : error.message; }
  };
  b.querySelectorAll("input").forEach(i => i.addEventListener("keydown", e => { if (e.key === "Enter") submit(); }));
}
async function submit(){
  const msg = document.getElementById("ivMsg"), go = document.getElementById("ivGo");
  const email = document.getElementById("ivEmail").value.trim(), pass = document.getElementById("ivPass").value;
  const nameEl = document.getElementById("ivName"), name = nameEl ? nameEl.value.trim() : "";
  const say = (t, ok) => { msg.textContent = t; msg.className = "msg " + (ok ? "ok" : "err"); };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say("Enter a valid email address.");
  if (pass.length < 8) return say("Password must be at least 8 characters.");
  if (nameEl && !name) return say("Enter your name.");
  go.disabled = true; say("Please wait…", true);
  try {
    if (mode === "signup") {
      const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { full_name: name } } });
      if (error) throw error;
      if (!data.session) { say("Account created. Check your email to confirm it, then sign in.", true); mode = "signin"; setTimeout(renderModal, 2500); }
      else hide();
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      hide();
    }
  } catch (e) { say(e.message || "Something went wrong. Try again."); }
  finally { go.disabled = false; }
}
function show(){ ensureModal(); renderModal(); document.getElementById("ivAuth").classList.add("show"); setTimeout(() => document.querySelector("#ivAuth input")?.focus(), 50); }
function hide(){ document.getElementById("ivAuth")?.classList.remove("show"); }
IV.openAuth = show;

/* ---------- header / nav wiring ---------- */
function paintUser(){
  const name = IV.user ? (IV.user.user_metadata?.full_name || IV.user.email.split("@")[0]) : null;
  const un = document.querySelector(".uname");
  if (un) un.textContent = name || "Guest Learner";
  document.querySelectorAll('button.login[data-modal="login"]').forEach(b => b.textContent = name ? name.toUpperCase() : "LOGIN/SIGN UP");
}
function wireButtons(){
  // home page: take over the existing Login/Sign up button
  document.addEventListener("click", e => {
    const b = e.target.closest('[data-modal="login"]');
    if (b) { e.preventDefault(); e.stopImmediatePropagation(); show(); }
  }, true);
  // career pages: the user icon opens the account box when signed out
  const bu = document.getElementById("btnUser");
  if (bu) bu.addEventListener("click", e => { if (!IV.user) { e.stopImmediatePropagation(); show(); } }, true);
  const av = document.querySelector("header .avatar, header .uname");
  document.querySelectorAll("header .avatar, header .uname").forEach(el => { el.style.cursor = "pointer"; el.addEventListener("click", show); });
}

/* ---------- progress sync ---------- */
let pushT = null;
function schedulePush(){
  if (!IV.user || !onTree()) return;
  clearTimeout(pushT);
  pushT = setTimeout(async () => {
    const { error } = await sb.from("progress").upsert({ user_id: IV.user.id, career: PATH.key, state: S, updated_at: new Date().toISOString() });
    if (error) console.warn("[IV] save failed", error.message);
  }, 600);
}
async function pullAndMerge(){
  if (!IV.user || !onTree()) return;
  const { data, error } = await sb.from("progress").select("state").eq("user_id", IV.user.id).eq("career", PATH.key).maybeSingle();
  if (error) return console.warn("[IV] load failed", error.message);
  const r = data?.state;
  if (r) {
    Object.assign(S.done, r.done || {});
    Object.assign(S.prog, r.prog || {});
    S.points = Math.max(S.points || 0, r.points || 0);
    S.introSeen = S.introSeen || !!r.introSeen;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){}
    try { render(); } catch(e){}
    const p = document.getElementById("points"); if (p) p.textContent = S.points;
    if (typeof toast === "function") toast("☁️ Progress synced from your account");
  }
  schedulePush();
}
function hookSave(){
  if (!onTree() || typeof window.save !== "function") return;
  const orig = window.save;
  window.save = function(){ orig.apply(this, arguments); schedulePush(); };
}

/* ---------- referral tracking ---------- */
IV.logReferral = function(r){
  sb.from("referral_clicks").insert({
    user_id: IV.user ? IV.user.id : null,
    career: String(r.career || "").slice(0, 60),
    provider: String(r.provider || "").slice(0, 60),
    certification: String(r.certification || "").slice(0, 200),
    url: String(r.url || "").slice(0, 500)
  }).then(({ error }) => { if (error) console.warn("[IV] referral log failed", error.message); });
};

/* ---------- init ---------- */
async function init(){
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  IV.client = sb;
  wireButtons(); hookSave();
  const { data } = await sb.auth.getSession();
  IV.user = data.session?.user || null; IV.ready = true;
  paintUser(); if (IV.user) pullAndMerge();
  sb.auth.onAuthStateChange((ev, session) => {
    const was = IV.user?.id; IV.user = session?.user || null;
    paintUser();
    if (IV.user && IV.user.id !== was) { pullAndMerge(); if (typeof toast === "function") toast("👋 Signed in — your progress is now saved to your account"); }
  });
}
})();
