/* =====================================================================
   IndustryVerse / FuturePath AI — Certifications Hub
   Phase 4 "Build Your Portfolio" → one module: Certifications.
   Each card deep-links to the specific certification / enrolment page.
   ===================================================================== */
(function(){
const TL = { provider:"Telkom Learn", mark:"TL", color:"#0077c8" };
const AWS = { provider:"AWS", mark:"aws", color:"#232f3e" };
const CR = { provider:"Coursera", mark:"C", color:"#0056d2" };

const CERTS = {
  cloud: [
    { ...TL, name:"Introduction to Cloud (IBM)",
      why:"Free cloud fundamentals course from the Telkom Learn catalogue, delivered on IBM SkillsBuild.",
      tags:["Free","Beginner","Digital badge"], note:"Needs a free IBMid sign-up",
      url:"https://students.yourlearning.ibm.com/activity/SN-COURSE-V1:IBMDEVELOPERSKILLSNETWORK+CC0101EN+V1" },
    { ...AWS, name:"AWS Certified Cloud Practitioner",
      why:"The entry-level AWS certification that employers ask for. No coding needed.",
      tags:["Industry exam","Beginner","~90 min exam"], note:"Paid exam; free prep on AWS Skill Builder",
      url:"https://aws.amazon.com/certification/certified-cloud-practitioner/" },
    { ...CR, name:"AWS Cloud Solutions Architect Professional Certificate",
      why:"A guided path toward the architect role, built by AWS and hosted on Coursera.",
      tags:["Professional certificate","Self-paced"], note:"Financial aid available",
      url:"https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect" }
  ],
  data: [
    { ...TL, name:"Data Science Fundamentals (IBM)",
      why:"Free data science foundations from the Telkom Learn catalogue, delivered on IBM SkillsBuild.",
      tags:["Free","Beginner","Digital badge"], note:"Needs a free IBMid sign-up",
      url:"https://students.yourlearning.ibm.com/activity/SN-COURSE-V1:BIGDATAUNIVERSITY+DS0101EN+V1" },
    { ...AWS, name:"AWS Certified AI Practitioner",
      why:"Proves you understand AI, machine learning and data concepts on the cloud.",
      tags:["Industry exam","Foundational"], note:"Paid exam; free prep on AWS Skill Builder",
      url:"https://aws.amazon.com/certification/certified-ai-practitioner/" },
    { ...CR, name:"IBM Data Science Professional Certificate",
      why:"Python, SQL, data analysis and machine learning, with hands-on projects for your portfolio.",
      tags:["Professional certificate","Portfolio projects"], note:"Financial aid available",
      url:"https://www.coursera.org/professional-certificates/ibm-data-science" }
  ],
  env: [
    { ...TL, name:"Fundamentals of Sustainability and Technology (IBM)",
      why:"Free sustainability learning plan from the Telkom Learn catalogue, delivered on IBM SkillsBuild.",
      tags:["Free","Beginner","Digital badge"], note:"Needs a free IBMid sign-up",
      url:"https://skills.yourlearning.ibm.com/activity/PLAN-BE0E24A0BA5C?utm_campaign=open-Telkom_Learn-Adult" },
    { ...AWS, name:"Sustainability Transformation with AWS",
      why:"How organisations use cloud and data to cut emissions and meet sustainability goals.",
      tags:["Free course","Skill Builder"], note:"Free AWS Skill Builder account",
      url:"https://skillbuilder.aws/learn/M4EA3BZSU1/sustainability-transformation-with-aws/WDBC7VDGXS" },
    { ...CR, name:"Introduction to Environmental Science Specialization",
      why:"University-level environmental science: ecosystems, pollution and resource management.",
      tags:["Specialization","Self-paced"], note:"Financial aid available",
      url:"https://www.coursera.org/specializations/environmental-science" }
  ]
};

const page = location.pathname;
const key = /data-scientist/.test(page) ? "data" : /environmental/.test(page) ? "env" : "cloud";

// tag every outbound link so providers can see the learner came from IndustryVerse
const tag = u => /[?&]utm_/.test(u) ? u : u + (u.includes("?") ? "&" : "?") + "utm_source=industryverse&utm_medium=referral&utm_campaign=" + key;
Object.values(CERTS).forEach(list => list.forEach(c => { c.url = tag(c.url); }));

window.LESSON_CONTENT = window.LESSON_CONTENT || {};
window.LESSON_CONTENT["4.1.1"] = { slides: [
  { type:"certhub", kicker:"4.1.1 · Certifications", title:"Turn your skills into proof",
    lead:"You've seen the job, learned the basics and practised. Pick a certification and start it with an industry provider.",
    certs: CERTS[key],
    footnote:"🎓 Each card opens the provider's own certification page in a new tab. Open one to complete this step." }
]};
})();
