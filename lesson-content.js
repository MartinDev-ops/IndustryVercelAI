/* =====================================================================
   FuturePath AI — interactive lesson content (Phase 1 of Cloud Architect)
   Each lesson = a list of slides. Slide types:
     intro · video · flip · stack · hotspots · diagram · journey · cidr ·
     terminal · mc (multiple choice / true-false) · drag (match items)
   Lessons not listed here fall back to a single video slide.
   All illustrations are original inline SVG.
   ===================================================================== */
(function(){
const C = { navy:"#16324f", blue:"#1479c9", teal:"#12a3b8", cyan:"#3fc6e0", orange:"#f28a3d", yellow:"#f6c344",
            green:"#2ea56a", purple:"#6b5bd6", pink:"#e05a8a", grey:"#9aa7b6", light:"#eef3f8", ink:"#1d2733" };

/* ---------- small icon set ---------- */
const ICON = {
  saas:`<svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="34" rx="4" fill="${C.light}" stroke="${C.blue}" stroke-width="3"/><path d="M16 22h32M16 29h22M16 36h26" stroke="${C.teal}" stroke-width="3" stroke-linecap="round"/><rect x="24" y="48" width="16" height="4" rx="2" fill="${C.blue}"/></svg>`,
  paas:`<svg viewBox="0 0 64 64"><rect x="10" y="10" width="44" height="12" rx="3" fill="${C.purple}"/><rect x="10" y="26" width="44" height="12" rx="3" fill="${C.teal}"/><rect x="10" y="42" width="44" height="12" rx="3" fill="${C.light}" stroke="${C.grey}" stroke-width="2"/><path d="M20 16h8M20 32h14" stroke="#fff" stroke-width="3" stroke-linecap="round"/><text x="32" y="51" text-anchor="middle" font-size="8" font-family="Arial" fill="${C.grey}">your code</text></svg>`,
  iaas:`<svg viewBox="0 0 64 64"><rect x="12" y="8" width="40" height="14" rx="3" fill="${C.navy}"/><rect x="12" y="25" width="40" height="14" rx="3" fill="${C.navy}"/><rect x="12" y="42" width="40" height="14" rx="3" fill="${C.navy}"/><g fill="${C.green}"><circle cx="20" cy="15" r="2.5"/><circle cx="20" cy="32" r="2.5"/><circle cx="20" cy="49" r="2.5"/></g><path d="M30 15h16M30 32h16M30 49h16" stroke="${C.cyan}" stroke-width="3" stroke-linecap="round"/></svg>`,
  money:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="${C.yellow}"/><text x="32" y="41" text-anchor="middle" font-size="26" font-weight="700" font-family="Arial" fill="#8a5a00">R</text></svg>`,
  scale:`<svg viewBox="0 0 64 64"><rect x="8" y="40" width="10" height="16" rx="2" fill="${C.teal}"/><rect x="22" y="30" width="10" height="26" rx="2" fill="${C.teal}"/><rect x="36" y="18" width="10" height="38" rx="2" fill="${C.blue}"/><path d="M10 30 L30 14 L40 20 L56 6" stroke="${C.orange}" stroke-width="3" fill="none"/><path d="M50 6h6v6" stroke="${C.orange}" stroke-width="3" fill="none"/></svg>`,
  globe:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="${C.light}" stroke="${C.blue}" stroke-width="3"/><path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" stroke="${C.blue}" stroke-width="2.5" fill="none"/><circle cx="46" cy="18" r="5" fill="${C.orange}"/></svg>`,
  shield:`<svg viewBox="0 0 64 64"><path d="M32 6l20 8v16c0 14-9 23-20 28C21 53 12 44 12 30V14z" fill="${C.green}"/><path d="M23 32l7 7 12-14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  rocket:`<svg viewBox="0 0 64 64"><path d="M32 6c10 6 14 18 12 30H20C18 24 22 12 32 6z" fill="${C.light}" stroke="${C.navy}" stroke-width="3"/><circle cx="32" cy="24" r="5" fill="${C.cyan}"/><path d="M20 36l-8 10 10-2M44 36l8 10-10-2" fill="${C.pink}"/><path d="M26 40l6 16 6-16z" fill="${C.orange}"/></svg>`,
  term:(t)=>`<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="44" rx="5" fill="${C.navy}"/><text x="32" y="40" text-anchor="middle" font-size="${t.length>4?13:16}" font-weight="700" font-family="Menlo,Consolas,monospace" fill="${C.cyan}">${t}</text></svg>`
};

/* ---------- illustrations ---------- */
const ART = {};
ART.threeModels = `<svg viewBox="0 0 420 280">
  <rect x="0" y="0" width="420" height="280" rx="14" fill="#f4f8fc"/>
  <g font-family="Arial" font-weight="700" text-anchor="middle">
    <path d="M150 74c0-18 22-26 34-14 6-16 34-16 38 2 16-2 22 18 8 24H158c-12 0-14-10-8-12z" fill="${C.pink}"/>
    <text x="195" y="78" fill="#fff" font-size="16">SaaS</text>
    <path d="M120 150c0-20 26-30 40-16 8-18 40-18 46 2 20-2 26 22 10 28H130c-14 0-16-12-10-14z" fill="${C.purple}"/>
    <text x="178" y="156" fill="#fff" font-size="16">PaaS</text>
    <path d="M90 228c0-22 30-34 46-18 10-20 46-20 52 2 22-2 30 24 12 32H100c-16 0-18-14-10-16z" fill="${C.blue}"/>
    <text x="160" y="236" fill="#fff" font-size="16">IaaS</text>
  </g>
  <g font-family="Arial" font-size="12" fill="${C.ink}">
    <text x="262" y="72">Ready-made apps</text><text x="262" y="88" fill="#5b6878">you just log in</text>
    <text x="262" y="148">A platform to build on</text><text x="262" y="164" fill="#5b6878">you bring your code</text>
    <text x="262" y="226">Raw building blocks</text><text x="262" y="242" fill="#5b6878">servers, storage, networks</text>
  </g>
  <path d="M40 240V50" stroke="${C.grey}" stroke-width="2" marker-end="url(#ar)"/>
  <defs><marker id="ar" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0 10L5 0 10 10z" fill="${C.grey}"/></marker></defs>
  <text x="30" y="150" transform="rotate(-90 30 150)" text-anchor="middle" font-family="Arial" font-size="11" fill="#5b6878">less you manage ↑</text>
</svg>`;

ART.city = `<svg viewBox="0 0 800 380">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dff1fb"/><stop offset="1" stop-color="#f7fbfe"/></linearGradient></defs>
  <rect width="800" height="380" fill="url(#sky)"/>
  <path d="M300 70c0-24 30-36 48-18 10-26 56-24 60 4 26-4 36 28 14 38H316c-18 0-22-16-16-24z" fill="#fff" stroke="${C.cyan}" stroke-width="3"/>
  <text x="372" y="84" text-anchor="middle" font-family="Arial" font-weight="700" font-size="14" fill="${C.blue}">THE CLOUD</text>
  <g stroke="${C.cyan}" stroke-width="2" stroke-dasharray="5 6" fill="none">
    <path d="M110 190 C150 120 300 110 330 100"/><path d="M250 170 C270 130 330 120 350 106"/><path d="M400 170 V110"/><path d="M560 180 C520 120 440 116 420 106"/><path d="M700 200 C660 110 470 100 440 96"/>
  </g>
  <rect x="0" y="330" width="800" height="50" fill="#cfe3d3"/>
  <!-- streaming studio -->
  <rect x="60" y="200" width="110" height="130" fill="${C.purple}"/><rect x="72" y="214" width="86" height="54" rx="4" fill="#1c1640"/><path d="M106 228l22 13-22 13z" fill="#fff"/>
  <rect x="98" y="290" width="34" height="40" fill="#4a3fa0"/>
  <!-- bank -->
  <path d="M200 200 L260 172 L320 200Z" fill="${C.navy}"/><rect x="206" y="200" width="108" height="130" fill="#e7edf4"/>
  <g fill="${C.navy}"><rect x="218" y="214" width="12" height="100"/><rect x="246" y="214" width="12" height="100"/><rect x="274" y="214" width="12" height="100"/><rect x="298" y="214" width="8" height="100"/></g>
  <rect x="200" y="314" width="120" height="16" fill="${C.navy}"/>
  <!-- hospital -->
  <rect x="350" y="180" width="110" height="150" fill="#fff" stroke="#c9d6e3" stroke-width="3"/><rect x="390" y="196" width="30" height="30" fill="${C.pink}"/><path d="M405 200v22M394 211h22" stroke="#fff" stroke-width="6"/>
  <g fill="#bfe3f0"><rect x="364" y="240" width="22" height="18"/><rect x="394" y="240" width="22" height="18"/><rect x="424" y="240" width="22" height="18"/><rect x="364" y="268" width="22" height="18"/><rect x="424" y="268" width="22" height="18"/></g><rect x="394" y="290" width="22" height="40" fill="${C.teal}"/>
  <!-- online shop -->
  <rect x="490" y="210" width="130" height="120" fill="${C.orange}"/><path d="M490 210h130l-8-26H498z" fill="#ffb877"/><g fill="#fff"><rect x="504" y="228" width="44" height="40" rx="3"/><rect x="562" y="228" width="44" height="40" rx="3"/></g>
  <path d="M514 240h24l-4 16h-16z" fill="${C.orange}"/><rect x="540" y="284" width="30" height="46" fill="#b85a15"/>
  <!-- startup -->
  <rect x="650" y="240" width="100" height="90" fill="${C.green}"/><g fill="#d6f5e4"><rect x="662" y="254" width="20" height="16"/><rect x="690" y="254" width="20" height="16"/><rect x="718" y="254" width="20" height="16"/></g>
  <path d="M700 150c8 6 10 16 9 26h-18c-1-10 1-20 9-26z" fill="#fff" stroke="${C.navy}" stroke-width="2"/><path d="M694 176l6 14 6-14z" fill="${C.orange}"/>
  <rect x="686" y="290" width="28" height="40" fill="#1e7a4c"/>
  <g font-family="Arial" font-size="12" font-weight="700" fill="${C.ink}" text-anchor="middle">
    <text x="115" y="350">Streaming</text><text x="260" y="350">Bank</text><text x="405" y="350">Hospital</text><text x="555" y="350">Online shop</text><text x="700" y="350">Startup</text>
  </g>
</svg>`;

ART.prompt = `<svg viewBox="0 0 760 170">
  <rect width="760" height="170" rx="12" fill="#10263d"/>
  <g><circle cx="24" cy="20" r="6" fill="#ff5f57"/><circle cx="44" cy="20" r="6" fill="#febc2e"/><circle cx="64" cy="20" r="6" fill="#28c840"/></g>
  <g font-family="Menlo,Consolas,monospace" font-size="30" font-weight="700">
    <g class="part" data-part="user"><rect x="40" y="62" width="120" height="50" rx="8"/><text x="100" y="97" text-anchor="middle" fill="#7ee787">thandi</text></g>
    <text x="172" y="97" fill="#c9d1d9">@</text>
    <g class="part" data-part="host"><rect x="198" y="62" width="222" height="50" rx="8"/><text x="309" y="97" text-anchor="middle" fill="#79c0ff">cloud-server</text></g>
    <text x="430" y="97" fill="#c9d1d9">:</text>
    <g class="part" data-part="path"><rect x="452" y="62" width="186" height="50" rx="8"/><text x="545" y="97" text-anchor="middle" fill="#ffa657">~/projects</text></g>
    <g class="part" data-part="sym"><rect x="648" y="62" width="50" height="50" rx="8"/><text x="673" y="97" text-anchor="middle" fill="#f0f6fc">$</text></g>
  </g>
  <text x="380" y="148" text-anchor="middle" font-family="Arial" font-size="13" fill="#8aa0b8">Click each coloured part of the prompt</text>
</svg>`;

// Home network — nodes reused by the packet journey
const NET = { laptop:[80,210], router:[250,210], dns:[250,70], internet:[450,150], server:[650,150] };
function netArt(){
  const [l,r,d,i,s] = [NET.laptop,NET.router,NET.dns,NET.internet,NET.server];
  return `<svg viewBox="0 0 740 290">
  <rect width="740" height="290" rx="14" fill="#f4f8fc"/>
  <rect x="20" y="130" width="330" height="140" rx="14" fill="#e6f2fb" stroke="#b9d6ee" stroke-dasharray="6 5"/>
  <text x="34" y="152" font-family="Arial" font-size="12" font-weight="700" fill="${C.blue}">YOUR HOME NETWORK · 192.168.1.0/24</text>
  <g stroke="#9fb4c8" stroke-width="3" fill="none"><path d="M${l[0]} ${l[1]}H${r[0]}"/><path d="M${r[0]} ${r[1]}L${d[0]} ${d[1]}"/><path d="M${r[0]} ${r[1]}L${i[0]} ${i[1]}"/><path d="M${i[0]} ${i[1]}H${s[0]}"/></g>
  <g class="part" data-part="laptop" transform="translate(${l[0]-40},${l[1]-34})"><rect x="-8" y="-8" width="96" height="92" rx="10"/><rect x="8" y="4" width="64" height="40" rx="4" fill="${C.navy}"/><rect x="13" y="9" width="54" height="30" fill="${C.cyan}"/><path d="M0 50h80l-6 8H6z" fill="#8093a8"/><text x="40" y="76" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="${C.ink}">Laptop</text></g>
  <g class="part" data-part="router" transform="translate(${r[0]-40},${r[1]-30})"><rect x="-8" y="-8" width="96" height="88" rx="10"/><rect x="6" y="20" width="68" height="26" rx="6" fill="${C.teal}"/><path d="M20 20V6M60 20V6" stroke="${C.navy}" stroke-width="3"/><g fill="#d6fff2"><circle cx="22" cy="33" r="3"/><circle cx="34" cy="33" r="3"/><circle cx="46" cy="33" r="3"/></g><text x="40" y="68" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="${C.ink}">Router / Gateway</text></g>
  <g class="part" data-part="dns" transform="translate(${d[0]-40},${d[1]-40})"><rect x="-8" y="-8" width="96" height="92" rx="10"/><rect x="12" y="4" width="56" height="50" rx="5" fill="${C.purple}"/><text x="40" y="36" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#fff">DNS</text><text x="40" y="74" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="${C.ink}">DNS server</text></g>
  <g class="part" data-part="internet" transform="translate(${i[0]-60},${i[1]-40})"><rect x="-8" y="-8" width="136" height="92" rx="10"/><path d="M14 52c0-16 20-24 30-12 6-16 34-16 38 2 16-2 22 18 8 22H22c-10 0-12-8-8-12z" fill="#fff" stroke="${C.blue}" stroke-width="3"/><text x="60" y="78" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="${C.ink}">The Internet</text></g>
  <g class="part" data-part="server" transform="translate(${s[0]-40},${s[1]-44})"><rect x="-8" y="-8" width="96" height="100" rx="10"/><g fill="${C.navy}"><rect x="16" y="4" width="48" height="16" rx="3"/><rect x="16" y="24" width="48" height="16" rx="3"/><rect x="16" y="44" width="48" height="16" rx="3"/></g><g fill="${C.green}"><circle cx="24" cy="12" r="2.5"/><circle cx="24" cy="32" r="2.5"/><circle cx="24" cy="52" r="2.5"/></g><text x="40" y="80" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="${C.ink}">Web server</text></g>
  <circle class="packet" r="9" cx="${l[0]}" cy="${l[1]}" fill="${C.orange}" stroke="#fff" stroke-width="3" style="opacity:0;pointer-events:none"/>
</svg>`;
}
ART.network = netArt();
window.LESSON_NET = NET;

ART.address = `<svg viewBox="0 0 760 190">
  <rect width="760" height="190" rx="14" fill="#f4f8fc"/>
  <g font-family="Menlo,Consolas,monospace" font-size="40" font-weight="700" text-anchor="middle">
    <g class="part" data-part="network"><rect x="40" y="40" width="400" height="70" rx="10"/><text x="240" y="90" fill="${C.blue}">192.168.1.</text></g>
    <g class="part" data-part="host"><rect x="448" y="40" width="96" height="70" rx="10"/><text x="496" y="90" fill="${C.orange}">20</text></g>
    <g class="part" data-part="prefix"><rect x="556" y="40" width="130" height="70" rx="10"/><text x="621" y="90" fill="${C.purple}">/24</text></g>
  </g>
  <g font-family="Arial" font-size="13" font-weight="700" text-anchor="middle"><text x="240" y="140" fill="${C.blue}">NETWORK part</text><text x="496" y="140" fill="${C.orange}">HOST part</text><text x="621" y="140" fill="${C.purple}">PREFIX</text></g>
  <text x="380" y="172" text-anchor="middle" font-family="Arial" font-size="13" fill="#6b7a8b">Click each part of the address</text>
</svg>`;

ART.vpc = `<svg viewBox="0 0 760 330">
  <rect width="760" height="330" rx="14" fill="#f4f8fc"/>
  <g class="part" data-part="igw"><rect x="300" y="10" width="160" height="50" rx="10"/><rect x="316" y="20" width="128" height="30" rx="6" fill="${C.teal}"/><text x="380" y="40" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#fff">Internet Gateway</text></g>
  <path d="M380 60V94" stroke="${C.teal}" stroke-width="3"/>
  <rect x="30" y="80" width="700" height="236" rx="16" fill="#fff" stroke="${C.blue}" stroke-width="3"/>
  <text x="50" y="106" font-family="Arial" font-size="14" font-weight="700" fill="${C.blue}">VPC · 10.0.0.0/16  (65,536 addresses)</text>
  <g class="part" data-part="public"><rect x="50" y="122" width="210" height="176" rx="12" fill="#e9f8ef"/><text x="155" y="146" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" fill="${C.green}">Public subnet</text><text x="155" y="164" text-anchor="middle" font-family="Menlo,monospace" font-size="12" fill="#3a6b50">10.0.1.0/24</text><rect x="115" y="190" width="80" height="60" rx="6" fill="${C.green}"/><text x="155" y="226" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#fff">Web server</text></g>
  <g class="part" data-part="private"><rect x="275" y="122" width="210" height="176" rx="12" fill="#eef0fd"/><text x="380" y="146" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" fill="${C.purple}">Private subnet</text><text x="380" y="164" text-anchor="middle" font-family="Menlo,monospace" font-size="12" fill="#4b4a8a">10.0.2.0/24</text><rect x="340" y="190" width="80" height="60" rx="6" fill="${C.purple}"/><text x="380" y="226" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#fff">App servers</text></g>
  <g class="part" data-part="db"><rect x="500" y="122" width="210" height="176" rx="12" fill="#fdf1e8"/><text x="605" y="146" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" fill="#b85a15">Database subnet</text><text x="605" y="164" text-anchor="middle" font-family="Menlo,monospace" font-size="12" fill="#8a4a18">10.0.3.0/24</text><ellipse cx="605" cy="196" rx="36" ry="10" fill="${C.orange}"/><rect x="569" y="196" width="72" height="44" fill="${C.orange}"/><ellipse cx="605" cy="240" rx="36" ry="10" fill="#d9701f"/></g>
  <g stroke="#9fb4c8" stroke-width="2.5" stroke-dasharray="5 5"><path d="M195 220H340"/><path d="M420 220H569"/></g>
</svg>`;

/* ---------- the lessons ---------- */
window.LESSON_CONTENT = {

"1.1.2": { slides: [
  { type:"intro", kicker:"1.1.2 · Service Models", title:"Three ways to rent the cloud",
    text:`<p>Companies don't all use the cloud in the same way. Some just want finished software. Some want a place to run their own code. Others want raw servers they can control completely.</p>
          <p>These three options are called <b>service models</b>: <b>SaaS</b>, <b>PaaS</b> and <b>IaaS</b>. The higher up you go, the less you have to manage yourself.</p>`,
    art: ART.threeModels },
  { type:"flip", kicker:"Interactive activity", title:"Meet the three service models", lead:"Click each card to flip it and learn what it means.",
    cards:[
      { icon:ICON.saas, title:"SaaS", sub:"Software as a Service", back:"<b>Finished software you log into.</b> The provider runs everything: servers, updates, security.<br><br><i>Examples:</i> Gmail, Microsoft 365, Netflix." },
      { icon:ICON.paas, title:"PaaS", sub:"Platform as a Service", back:"<b>A ready platform for your own code.</b> You upload your app; the provider handles the servers and operating system.<br><br><i>Examples:</i> Heroku, Google App Engine, Azure App Service." },
      { icon:ICON.iaas, title:"IaaS", sub:"Infrastructure as a Service", back:"<b>Raw building blocks.</b> You rent virtual machines, storage and networks, and manage the rest yourself.<br><br><i>Examples:</i> AWS EC2, Azure Virtual Machines, Google Compute Engine." }
    ]},
  { type:"stack", kicker:"Interactive diagram", title:"Who manages what?", lead:"Click each tab to see which layers <b>you</b> manage and which the <b>cloud provider</b> manages.",
    layers:["Applications","Data","Runtime","Middleware","Operating system","Virtualisation","Servers","Storage","Networking"],
    models:[ {label:"On-premises", you:9, note:"Your own data centre: you buy and manage every layer."},
             {label:"IaaS", you:5, note:"The provider runs the physical hardware and virtualisation. You manage the OS and everything above it."},
             {label:"PaaS", you:2, note:"You only look after your application and its data. The provider runs the platform underneath."},
             {label:"SaaS", you:0, note:"The provider manages everything. You simply use the software."} ] },
  { type:"drag", kicker:"Check your understanding", title:"Match each product to its service model", lead:"Drag each card into the correct box (or click a card, then click a box).",
    targets:["SaaS","PaaS","IaaS"],
    items:[ {text:"Gmail", target:"SaaS"}, {text:"AWS EC2 virtual machine", target:"IaaS"}, {text:"Heroku", target:"PaaS"},
            {text:"Microsoft 365", target:"SaaS"}, {text:"Google App Engine", target:"PaaS"}, {text:"Azure Virtual Machines", target:"IaaS"} ],
    explain:"SaaS = finished apps, PaaS = a platform for your code, IaaS = raw servers you control." }
]},

"1.1.3": { slides: [
  { type:"hotspots", kicker:"1.1.3 · Real-World Use Cases", title:"The cloud is everywhere", lead:"Click each glowing dot to see how that business uses the cloud.",
    art: ART.city,
    spots:[
      { x:14, y:62, title:"Streaming service", text:"Video platforms store huge libraries in the cloud and stream from servers close to you, so millions of people can watch at the same time. Netflix, for example, runs on AWS." },
      { x:32.5, y:60, title:"Bank", text:"Banks use the cloud for mobile banking apps and to spot fraud in real time by analysing millions of transactions. Security and compliance are top priorities." },
      { x:50.5, y:56, title:"Hospital", text:"Hospitals keep patient records securely in the cloud, share X-rays between doctors and run telemedicine video calls." },
      { x:69.5, y:62, title:"Online shop", text:"On Black Friday traffic can jump 10×. The cloud automatically adds servers during the rush and removes them afterwards, so the shop only pays for what it used." },
      { x:87.5, y:44, title:"Startup", text:"A two-person startup can launch worldwide in a day with no hardware. Costs start tiny and grow only as users grow." }
    ]},
  { type:"flip", kicker:"Interactive activity", title:"Five benefits of the cloud", lead:"Flip every card.",
    cards:[
      { icon:ICON.money, title:"Pay as you go", sub:"Cost", back:"Pay only for what you use, like electricity. No big upfront hardware bill." },
      { icon:ICON.scale, title:"Scalability", sub:"Grow & shrink", back:"Add or remove servers in minutes when demand changes." },
      { icon:ICON.globe, title:"Global reach", sub:"Speed for users", back:"Run your app in data centres around the world, close to your users." },
      { icon:ICON.shield, title:"Reliability", sub:"Stay online", back:"Copies of your app in several data centres keep it running if one fails." },
      { icon:ICON.rocket, title:"Speed to launch", sub:"Agility", back:"Try new ideas in hours instead of waiting weeks for hardware." }
    ]},
  { type:"mc", kicker:"Check your understanding", title:"Question 1 of 2",
    q:"An online shop's traffic triples on Black Friday. Which cloud benefit helps the most?",
    options:["Global reach","Scalability","Pay-as-you-go pricing","Reliability"], answer:1,
    explain:"Scalability lets the shop add servers during the rush and remove them afterwards." },
  { type:"mc", kicker:"Check your understanding", title:"Question 2 of 2",
    q:"True or false: once a company moves to the cloud, it no longer has to think about security.",
    options:["True","False"], answer:1,
    explain:"False. Under the shared responsibility model the provider secures the data centre, but the customer must still secure their data, accounts and settings." }
]},

"1.2.2": { slides: [
  { type:"diagram", kicker:"1.2.2 · Essential Commands", title:"Reading the command prompt", lead:"Cloud engineers spend a lot of time in the terminal. Click each part of the prompt to learn what it tells you.",
    art: ART.prompt,
    parts:{ user:{title:"Username", text:"<b>thandi</b> is the user you are logged in as. Different users have different permissions."},
            host:{title:"Hostname", text:"<b>cloud-server</b> is the name of the machine. When you connect to a cloud server with <code>ssh</code>, this changes to that server's name."},
            path:{title:"Current folder", text:"<b>~/projects</b> is where you are. <code>~</code> is short for your home folder, <code>/home/thandi</code>."},
            sym:{title:"The $ symbol", text:"<b>$</b> means you're a normal user. If you see <b>#</b>, you're the all-powerful <b>root</b> user, so be careful!"} } },
  { type:"flip", kicker:"Interactive activity", title:"Six commands you'll use every day", lead:"Flip each card to see what the command does.",
    cards:[
      { icon:ICON.term("pwd"), title:"pwd", sub:"print working directory", back:"Shows the folder you're in right now.<br><code>$ pwd</code><br><code>/home/thandi</code>" },
      { icon:ICON.term("ls"), title:"ls", sub:"list", back:"Lists the files and folders in the current folder.<br><code>$ ls</code>" },
      { icon:ICON.term("cd"), title:"cd", sub:"change directory", back:"Moves you into another folder.<br><code>$ cd projects</code><br><code>cd ..</code> goes back up one level." },
      { icon:ICON.term("mkdir"), title:"mkdir", sub:"make directory", back:"Creates a new folder.<br><code>$ mkdir website</code>" },
      { icon:ICON.term("cat"), title:"cat", sub:"concatenate", back:"Prints a file's contents on screen.<br><code>$ cat notes.txt</code>" },
      { icon:ICON.term("sudo"), title:"sudo", sub:"superuser do", back:"Runs one command with admin rights, e.g. installing software.<br><code>$ sudo apt install nginx</code>" }
    ]},
  { type:"terminal", kicker:"Hands-on lab", title:"Try it yourself", lead:"You're logged into a practice cloud server. Complete each task by typing the command and pressing <b>Enter</b>.",
    tasks:[
      { text:"Show which folder you're in.", hint:"pwd", check:(c,st)=>c==="pwd" },
      { text:"List the files in this folder.", hint:"ls", check:(c,st)=>/^ls(\s|$)/.test(c) && st.cwd==="/home/thandi" },
      { text:"Move into the projects folder.", hint:"cd projects", check:(c,st)=>st.cwd==="/home/thandi/projects" },
      { text:"Create a new folder called website.", hint:"mkdir website", check:(c,st)=>!!st.fs["/home/thandi/projects/website"] || !!st.fs["/home/thandi/website"] },
      { text:"Read the file notes.txt.", hint:"cat notes.txt", check:(c,st)=>/^cat\s+.*notes\.txt$/.test(c) && st.lastOk }
    ]}
]},

"1.2.3": { slides: [
  { type:"drag", kicker:"Check your understanding", title:"Match each command to what it does", lead:"Drag each command onto its meaning.",
    targets:["List files","Change folder","Show current folder","Make a folder","Print a file"],
    items:[ {text:"ls", target:"List files", mono:true}, {text:"cd", target:"Change folder", mono:true}, {text:"pwd", target:"Show current folder", mono:true},
            {text:"mkdir", target:"Make a folder", mono:true}, {text:"cat", target:"Print a file", mono:true} ],
    explain:"These five commands cover most of your everyday moving around on a Linux server." },
  { type:"mc", kicker:"Check your understanding", title:"Question 2 of 4",
    q:"Which command do you use to log into a remote cloud server from your laptop?",
    options:["cat","mkdir","ssh","top"], answer:2,
    explain:"ssh (secure shell) opens an encrypted connection to a remote machine, e.g. ssh thandi@cloud-server." },
  { type:"mc", kicker:"Check your understanding", title:"Question 3 of 4",
    q:"True or false: most servers running in the cloud use Linux.",
    options:["True","False"], answer:0,
    explain:"True. Linux powers the large majority of cloud servers, which is why it's a core skill for cloud engineers." },
  { type:"mc", kicker:"Check your understanding", title:"Question 4 of 4",
    q:"You are in /home/thandi and type cd projects. What will pwd show now?",
    options:["/projects","/home/thandi/projects","~","/home/projects"], answer:1,
    explain:"cd projects moves into the projects folder inside your current folder, so you're now in /home/thandi/projects." }
]},

"1.3.1": { slides: [
  { type:"diagram", kicker:"1.3.1 · IP, DNS & Gateways", title:"The pieces of a network", lead:"Click every device to learn its job.",
    art: ART.network,
    parts:{ laptop:{title:"Your laptop · 192.168.1.20", text:"Every device on a network gets an <b>IP address</b>, like a house number. Your laptop's address is private and only works inside your home network."},
            router:{title:"Router / default gateway · 192.168.1.1", text:"The <b>gateway</b> is the exit door of your network. Anything going to the internet leaves through it."},
            dns:{title:"DNS server", text:"<b>DNS</b> is the internet's phone book. It turns a name like <code>futurepath.ai</code> into an IP address computers can use."},
            internet:{title:"The Internet", text:"A giant network of networks. Routers pass your data along, hop by hop, until it reaches the destination."},
            server:{title:"Web server · 203.0.113.10", text:"The computer that hosts the website. In the cloud, this is often a virtual machine in a data centre."} } },
  { type:"journey", kicker:"Animation", title:"What happens when you type a web address?", lead:"Press <b>Next step</b> to follow the data.",
    art: ART.network,
    steps:[
      { from:"laptop", to:"router", title:"1 · Ask for directions", text:"You type <code>futurepath.ai</code>. Your laptop doesn't know its IP address yet, so it sends a DNS question out through the gateway." },
      { from:"router", to:"dns", title:"2 · Look it up", text:"The DNS server looks up the name and finds the IP address <b>203.0.113.10</b>." },
      { from:"dns", to:"laptop", title:"3 · Answer comes back", text:"The IP address travels back to your laptop. Now it knows where to go." },
      { from:"laptop", to:"internet", title:"4 · Send the request", text:"Your laptop sends the web request to the gateway, which forwards it onto the internet." },
      { from:"internet", to:"server", title:"5 · Reach the server", text:"Routers pass it along until it reaches the web server at 203.0.113.10." },
      { from:"server", to:"laptop", title:"6 · Page delivered", text:"The server sends the web page back the same way, and your browser shows it. All in under a second!" }
    ]},
  { type:"mc", kicker:"Check your understanding", title:"Quick check",
    q:"What is the main job of DNS?",
    options:["Encrypting your data","Turning names like google.com into IP addresses","Giving your laptop a Wi-Fi password","Speeding up your internet"], answer:1,
    explain:"DNS translates human-friendly names into IP addresses, like looking up a number in a phone book." }
]},

"1.3.2": { slides: [
  { type:"diagram", kicker:"1.3.2 · Subnetting", title:"Anatomy of an IP address", lead:"An IP address has two parts. Click each part.",
    art: ART.address,
    parts:{ network:{title:"Network part", text:"<b>192.168.1.</b> identifies <i>which network</i> the device is on. Every device on the same network shares it, like a street name."},
            host:{title:"Host part", text:"<b>20</b> identifies <i>this specific device</i> on that network, like a house number."},
            prefix:{title:"Prefix length", text:"<b>/24</b> says the first 24 bits (the first three numbers) are the network part. The remaining 8 bits are for hosts, giving 256 addresses."} } },
  { type:"cidr", kicker:"Interactive tool", title:"Play with the prefix", lead:"Drag the slider. A <b>bigger</b> prefix number means a <b>smaller</b> network. Try at least three sizes." },
  { type:"diagram", kicker:"In the cloud", title:"Carving up a VPC into subnets", lead:"In the cloud you build your own network (a VPC) and split it into subnets. Click each part.",
    art: ART.vpc,
    parts:{ igw:{title:"Internet gateway", text:"The door between your VPC and the internet. Only subnets connected to it are reachable from outside."},
            public:{title:"Public subnet · 10.0.1.0/24", text:"Holds things the world must reach, like web servers and load balancers."},
            private:{title:"Private subnet · 10.0.2.0/24", text:"Holds your application servers. They can't be reached directly from the internet, which is safer."},
            db:{title:"Database subnet · 10.0.3.0/24", text:"Databases live in their own private subnet with the strictest firewall rules. Only the app servers may talk to them."} } },
  { type:"mc", kicker:"Check your understanding", title:"Question 1 of 2",
    q:"How many IP addresses are in a /24 network?",
    options:["24","128","256","65,536"], answer:2,
    explain:"A /24 leaves 32 − 24 = 8 bits for hosts, and 2⁸ = 256 addresses. (AWS keeps 5 of them for itself in every subnet.)" },
  { type:"mc", kicker:"Check your understanding", title:"Question 2 of 2",
    q:"Where should you put your company's customer database?",
    options:["In the public subnet","In a private subnet","Directly on the internet gateway","It doesn't matter"], answer:1,
    explain:"Databases belong in a private subnet so nobody on the internet can reach them directly." }
]},

"1.3.3": { slides: [
  { type:"video", kicker:"1.3.3 · TCP/IP & Routing", title:"TCP vs UDP", lead:"Watch the short video, then answer two questions." },
  { type:"drag", kicker:"Check your understanding", title:"TCP or UDP?", lead:"TCP is reliable and ordered. UDP is fast with no guarantees. Drag each activity to the protocol it would use.",
    targets:["TCP","UDP"],
    items:[ {text:"Loading a web page", target:"TCP"}, {text:"Live video call", target:"UDP"}, {text:"Sending an email", target:"TCP"},
            {text:"Online multiplayer game", target:"UDP"}, {text:"Downloading a file", target:"TCP"} ],
    explain:"If every byte must arrive (web pages, email, downloads), use TCP. If speed matters more than a lost packet (calls, games), use UDP." },
  { type:"mc", kicker:"Check your understanding", title:"Ports",
    q:"Websites that start with https:// use which port by default?",
    options:["22","80","443","3306"], answer:2,
    explain:"HTTPS uses port 443. Port 80 is plain HTTP and 22 is SSH." }
]}
};

/* Lesson titles that change for Phase 1 */
window.LESSON_TITLE_OVERRIDES = { "1.2.3": "Linux Checkpoint", "1.3.3": "TCP vs UDP & Ports" };
})();
