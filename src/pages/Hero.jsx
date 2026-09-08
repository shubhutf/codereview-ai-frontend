import { useState, useEffect, useRef, useCallback } from "react";
import Cursor from "../components/Cursor";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";


const HERO_CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:     #04070a;
  --bg2:    #070c10;
  --s1:     #0b1318;
  --s2:     #101a20;
  --s3:     #162028;
  --ln:     #1a2d35;
  --ln2:    #1f3540;
  --teal:   #00e5c0;
  --teal2:  #00c4a3;
  --red:    #ff3d55;
  --amber:  #ffb830;
  --blue:   #38b6ff;
  --lime:   #3dff9a;
  --t1:     #d4ecec;
  --t2:     #5d9590;
  --t3:     #2b4a47;
  --mono:   'JetBrains Mono', monospace;
  --syne:   'Syne', sans-serif;
  --body:   'DM Sans', sans-serif;
}

body { background: var(--bg); color: var(--t1); overflow-x: hidden; }

/* ── Keyframes ── */
@keyframes h-drift1  { 0%{transform:translate(0,0) scale(1);} 50%{transform:translate(40px,-30px) scale(1.05);} 100%{transform:translate(0,0) scale(1);} }
@keyframes h-drift2  { 0%{transform:translate(0,0) scale(1);} 50%{transform:translate(-30px,50px) scale(1.08);} 100%{transform:translate(0,0) scale(1);} }
@keyframes h-drift3  { 0%{transform:translate(0,0);} 50%{transform:translate(20px,-20px);} 100%{transform:translate(0,0);} }
@keyframes h-float   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-14px);} }
@keyframes h-float2  { 0%,100%{transform:translateY(0) rotate(-.5deg);} 50%{transform:translateY(-9px) rotate(.5deg);} }
@keyframes h-pulse   { 0%,100%{opacity:.6; transform:scale(1);} 50%{opacity:1; transform:scale(1.5);} }
@keyframes h-beam    { 0%{transform:translateX(-100%);} 100%{transform:translateX(400%);} }
@keyframes h-scan    { 0%{top:0; opacity:.7;} 100%{top:100%; opacity:.7;} }
@keyframes h-scroll  { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
@keyframes h-up      { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
@keyframes h-in      { from{opacity:0;transform:scale(.96);} to{opacity:1;transform:scale(1);} }
@keyframes h-reveal  { from{opacity:0;transform:translateY(32px);} to{opacity:1;transform:translateY(0);} }
@keyframes h-cursor  { 0%,100%{opacity:1;} 50%{opacity:0;} }
@keyframes h-shimmer { 0%{background-position:-500px 0;} 100%{background-position:500px 0;} }
@keyframes h-particle{ 0%{transform:translateY(0) translateX(0); opacity:0;} 10%{opacity:.6;} 90%{opacity:.3;} 100%{transform:translateY(-120vh) translateX(var(--pdx)); opacity:0;} }
@keyframes h-rot     { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
@keyframes h-glow    { 0%,100%{box-shadow:0 0 20px rgba(0,229,192,.2);} 50%{box-shadow:0 0 50px rgba(0,229,192,.5), 0 0 80px rgba(0,229,192,.2);} }
@keyframes h-ripple  { 0%{transform:translate(-50%,-50%) scale(0); opacity:.5;} 100%{transform:translate(-50%,-50%) scale(4); opacity:0;} }
@keyframes h-sk      { 0%,100%{opacity:.06;} 50%{opacity:.14;} }
@keyframes h-spin    { to{transform:rotate(360deg);} }
@keyframes h-fadeup  { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
@keyframes h-slideR  { from{opacity:0;transform:translateX(18px);} to{opacity:1;transform:translateX(0);} }

/* ── Nav ── */
.h-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 58px; display: flex; align-items: center;
  padding: 0 clamp(20px, 5vw, 72px);
  transition: background .4s, border-color .4s, backdrop-filter .4s;
}
.h-nav.solid {
  background: rgba(4,7,10,.88);
  backdrop-filter: blur(20px) saturate(160%);
  border-bottom: 1px solid rgba(255,255,255,.04);
}
.h-logo {
  display: flex; align-items: center; gap: 9px;
  font-family: var(--syne); font-weight: 900; font-size: .96rem; color: var(--t1);
  text-decoration: none; letter-spacing: -.01em;
}
.h-logo-icon {
  width: 32px; height: 32px; border-radius: 9px;
  background: var(--teal); display: flex; align-items: center; justify-content: center;
  color: #030d0b; animation: h-glow 3s ease-in-out infinite;
}
.h-nav-links { display: flex; align-items: center; gap: 28px; margin-left: auto; }
.h-nav-link {
  font-family: var(--mono); font-size: .72rem; color: var(--t2);
  text-decoration: none; transition: color .15s, transform .15s;
  display: inline-block;
}
.h-nav-link:hover { color: var(--t1); transform: translateY(-1px); }
.h-nav-sep { width: 1px; height: 18px; background: var(--ln2); }
.h-btn {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--mono); font-weight: 700; font-size: .72rem;
  padding: 8px 18px; border-radius: 8px; cursor: pointer;
  transition: all .18s; text-decoration: none; border: none;
}
.h-btn-teal {
  background: var(--teal); color: #020e0b;
  box-shadow: 0 0 22px rgba(0,229,192,.28);
}
.h-btn-teal:hover { background: var(--teal2); box-shadow: 0 0 36px rgba(0,229,192,.45); transform: translateY(-1px); }
.h-btn-ghost { background: transparent; border: 1px solid var(--ln2) !important; color: var(--t2); }
.h-btn-ghost:hover { border-color: rgba(0,229,192,.35) !important; color: var(--teal); background: rgba(0,229,192,.04); }

/* ── Badge ── */
.h-badge {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--mono); font-size: .68rem; font-weight: 600;
  padding: 5px 13px; border-radius: 999px;
  background: rgba(0,229,192,.07); border: 1px solid rgba(0,229,192,.2);
  color: var(--teal);
}

/* ── Section label ── */
.h-sl {
  font-family: var(--mono); font-size: .65rem; font-weight: 700;
  color: var(--teal); text-transform: uppercase; letter-spacing: .14em;
  display: flex; align-items: center; gap: 8px;
}
.h-sl::before { content:''; width: 18px; height: 1px; background: var(--teal); opacity: .5; }

/* ── Typewriter cursor ── */
.h-cur { display: inline-block; width: 2px; height: 1em; background: var(--teal); margin-left: 3px; vertical-align: middle; animation: h-cursor .8s step-end infinite; }

/* ── Gradient texts ── */
.h-gt-teal { background: linear-gradient(90deg, var(--teal), #38b6ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.h-gt-warm { background: linear-gradient(90deg, #ffb830, #ff3d55); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.h-gt-white{ background: linear-gradient(90deg, #d4ecec, rgba(212,236,236,.55)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* ── Cards ── */
.h-card {
  background: var(--s1); border: 1px solid var(--ln);
  border-radius: 14px; transition: border-color .2s, transform .25s, box-shadow .25s;
}
.h-card:hover { border-color: var(--ln2); box-shadow: 0 12px 48px rgba(0,0,0,.5); }
.h-card-glow:hover { border-color: rgba(0,229,192,.25); box-shadow: 0 16px 56px rgba(0,0,0,.55), 0 0 0 1px rgba(0,229,192,.07); }

/* ── Scroll reveal ── */
.sr-init { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.sr-init.sr-vis { opacity: 1; transform: translateY(0); }

/* ── Diff lines ── */
.dl { font-family: var(--mono); font-size: .72rem; padding: 1px 14px 1px 10px; line-height: 1.7; white-space: pre; overflow: hidden; text-overflow: ellipsis; }
.da { background: rgba(0,229,192,.07); color: #4dffd8; border-left: 2px solid rgba(0,229,192,.4); }
.dr { background: rgba(255,61,85,.07);  color: #ff8fa3; border-left: 2px solid rgba(255,61,85,.35); opacity: .7; }
.dn { color: var(--t2); border-left: 2px solid transparent; }

/* ── Comment bubble ── */
.h-cb {
  background: var(--s1); border: 1px solid var(--ln2);
  border-radius: 12px; padding: 14px 16px;
}

/* ── Feature card track glow ── */
.h-fcard {
  background: var(--s1); border: 1px solid var(--ln);
  border-radius: 16px; padding: 28px;
  transition: border-color .2s, transform .28s cubic-bezier(.16,1,.3,1), box-shadow .28s;
  cursor: default; overflow: hidden; position: relative;
}
.h-fcard::before {
  content: ''; position: absolute; inset: 0; border-radius: 16px; opacity: 0;
  background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,229,192,.06) 0%, transparent 55%);
  transition: opacity .3s;
}
.h-fcard:hover::before { opacity: 1; }
.h-fcard:hover { border-color: rgba(0,229,192,.22); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,.55); }

/* ── Step connector ── */
.h-steps-wrap { position: relative; }
.h-steps-line {
  position: absolute; top: 36px; left: 12.5%; right: 12.5%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--teal), #38b6ff, var(--amber), transparent);
  opacity: .15; pointer-events: none;
}

/* ── Pricing card ── */
.h-price-card {
  background: var(--s1); border: 1px solid var(--ln);
  border-radius: 18px; padding: 36px 32px;
  transition: border-color .2s, transform .25s, box-shadow .25s;
  cursor: default; position: relative; overflow: hidden;
}
.h-price-card:hover { border-color: var(--ln2); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,.5); }
.h-price-card.featured {
  border-color: rgba(0,229,192,.3);
  background: linear-gradient(145deg, #0d1e22, #091417);
  box-shadow: 0 0 0 1px rgba(0,229,192,.1), 0 16px 60px rgba(0,229,192,.07);
}
.h-price-card.featured:hover { box-shadow: 0 0 0 1px rgba(0,229,192,.25), 0 24px 80px rgba(0,229,192,.12); }

/* ── Testimonial ── */
.h-tcard {
  background: var(--s1); border: 1px solid var(--ln);
  border-radius: 16px; padding: 28px;
  transition: border-color .2s, transform .25s; cursor: default;
}
.h-tcard:hover { border-color: var(--ln2); transform: translateY(-3px); }

/* ── Marquee ── */
.h-marquee-track { display: flex; gap: 64px; align-items: center; width: max-content; animation: h-scroll 28s linear infinite; }
.h-marquee-track:hover { animation-play-state: paused; }

/* ── CTA section ── */
.h-cta-box {
  border-radius: 24px; padding: 96px 64px;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,229,192,.06), transparent),
              linear-gradient(145deg, #0b1a1f, #070e12);
  border: 1px solid rgba(0,229,192,.1);
  position: relative; overflow: hidden; text-align: center;
}

/* ── Footer ── */
.h-footer {
  border-top: 1px solid var(--ln);
  padding: 32px clamp(20px,5vw,72px);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;
}
.h-footer-link { color: var(--t2); font-family: var(--mono); font-size: .72rem; text-decoration: none; transition: color .15s; }
.h-footer-link:hover { color: var(--t1); }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--ln2); border-radius: 3px; }
`;


const GH  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
const CHK = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>;

/* ═══════════════════════════════════════════════════════════
   SCROLL-REVEAL HOOK
═══════════════════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("sr-vis"); obs.unobserve(e.target); } });
    }, { threshold: .1 });
    document.querySelectorAll(".sr-init").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════ */
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[idx]; let t;
    if (!del && txt.length < w.length)   t = setTimeout(() => setTxt(w.slice(0, txt.length + 1)), 75);
    else if (!del && txt.length === w.length) t = setTimeout(() => setDel(true), 2200);
    else if (del && txt.length > 0)      t = setTimeout(() => setTxt(txt.slice(0, -1)), 38);
    else { setDel(false); setIdx((idx + 1) % words.length); }
    return () => clearTimeout(t);
  }, [txt, del, idx, words]);
  return <span className="h-gt-teal">{txt}<span className="h-cur"/></span>;
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════ */
function Counter({ to, sfx = "", dur = 1800 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const s = performance.now();
        const tick = n => {
          const p = Math.min((n - s) / dur, 1);
          setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: .5 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [to, dur]);
  return <span ref={ref}>{v.toLocaleString()}{sfx}</span>;
}

/* ═══════════════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════════════ */
function Particles({ n = 24 }) {
  const ps = useRef(Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    dur: 8 + Math.random() * 10,
    dx: (Math.random() - .5) * 120,
    sz: .8 + Math.random() * 1.6,
    col: ["#00e5c0", "#38b6ff", "#3dff9a", "#ffb830"][i % 4],
  })));
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {ps.current.map(p => (
        <div key={p.id} style={{
          position:"absolute", bottom:0, left:`${p.left}%`,
          width:p.sz, height:p.sz, borderRadius:"50%",
          background:p.col, opacity:.45,
          animation:`h-particle ${p.dur}s ${p.delay}s ease-in infinite`,
          "--pdx":`${p.dx}px`,
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AMBIENT ORBS
═══════════════════════════════════════════════════════════ */
function Orbs() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:900, height:900, borderRadius:"50%", top:"-20%", left:"-10%", background:"radial-gradient(circle, rgba(0,229,192,.07) 0%, transparent 65%)", filter:"blur(60px)", animation:"h-drift1 22s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", top:"30%", right:"-8%", background:"radial-gradient(circle, rgba(56,182,255,.06) 0%, transparent 65%)", filter:"blur(60px)", animation:"h-drift2 28s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", bottom:"5%", left:"35%", background:"radial-gradient(circle, rgba(255,184,48,.04) 0%, transparent 65%)", filter:"blur(50px)", animation:"h-drift3 18s ease-in-out infinite" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GRID BG
═══════════════════════════════════════════════════════════ */
function GridBg() {
  return (
    <div style={{
      position:"absolute", inset:0, pointerEvents:"none",
      backgroundImage:"linear-gradient(rgba(0,229,192,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,192,.018) 1px, transparent 1px)",
      backgroundSize:"44px 44px",
    }}/>
  );
}

/* ═══════════════════════════════════════════════════════════
   RIPPLE RINGS
═══════════════════════════════════════════════════════════ */
function Ripples({ x = "50%", y = "50%" }) {
  return (
    <div style={{ position:"absolute", left:x, top:y, pointerEvents:"none", overflow:"visible" }}>
      {[0, .8, 1.6, 2.4].map(d => (
        <div key={d} style={{
          position:"absolute", width:600, height:600, borderRadius:"50%",
          border:"1px solid rgba(0,229,192,.04)",
          transform:"translate(-50%,-50%)",
          animation:`h-ripple 6s ${d}s ease-out infinite`,
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DIFF CARD
═══════════════════════════════════════════════════════════ */
const DIFF_LINES = [
  { t:"n", c:"  export async function authMiddleware(req, res, next) {"       },
  { t:"r", c:'-    if (!req.headers["authorization"]) return res.status(401);' },
  { t:"a", c:'+    const token = req.headers["authorization"]?.split(" ")[1];' },
  { t:"a", c:'+    if (!token) return res.status(401).json({ error: "Unauthorized" });' },
  { t:"n", c:"    try {"                                                        },
  { t:"r", c:'-      const user = jwt.verify(req.headers.authorization, SECRET);' },
  { t:"a", c:'+      const user = jwt.verify(token, process.env.JWT_SECRET);'  },
  { t:"a", c:'+      if (!user.active) return res.status(403).json({ error: "Forbidden" });' },
  { t:"n", c:"      req.user = user; next();"                                  },
];

function DiffCard() {
  return (
    <div style={{
      width: 500, borderRadius:14, overflow:"hidden",
      background:"#0a1318", border:"1px solid #1f3540",
      boxShadow:"0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(0,229,192,.06)",
      position:"relative",
    }}>
      {/* scan line */}
      <div style={{ position:"absolute", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(0,229,192,.25),transparent)", animation:"h-scan 4s linear infinite", pointerEvents:"none", zIndex:2 }}/>
      {/* header */}
      <div style={{ background:"#0f1c22", borderBottom:"1px solid #1f3540", padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width:11, height:11, borderRadius:"50%", background:c, opacity:.85 }}/>)}
        </div>
        <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".7rem", color:"#5d9590", marginLeft:4 }}>src/middleware/auth.ts</span>
        <span style={{ marginLeft:"auto", fontFamily:"JetBrains Mono,monospace", fontSize:".68rem" }}>
          <span style={{ color:"#4dffd8" }}>+8</span>
          <span style={{ color:"#ff8fa3", marginLeft:6 }}>-3</span>
        </span>
      </div>
      {/* diff body */}
      <div style={{ padding:"6px 0" }}>
        {DIFF_LINES.map((l, i) => (
          <div key={i} className={`dl ${l.t === "a" ? "da" : l.t === "r" ? "dr" : "dn"}`}>{l.c}</div>
        ))}
      </div>
      {/* shimmer */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", borderRadius:14 }}>
        <div style={{ position:"absolute", top:0, bottom:0, width:"35%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent)", animation:"h-beam 3.5s 1s ease-in-out infinite" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEW BUBBLE
═══════════════════════════════════════════════════════════ */
function ReviewBubble({ visible }) {
  return (
    <div className="h-cb" style={{
      width: 380,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(20px)",
      transition: "opacity .7s ease .3s, transform .7s ease .3s",
      boxShadow: "0 18px 50px rgba(0,0,0,.6)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
        <div style={{ width:27, height:27, borderRadius:"50%", background:"linear-gradient(135deg,#38b6ff,#00e5c0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".58rem", fontWeight:900, color:"#03100e", fontFamily:"Syne,sans-serif", flexShrink:0 }}>AI</div>
        <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".7rem", color:"#38b6ff", fontWeight:600 }}>reviewbot[bot]</span>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#00e5c0", animation:"h-pulse 2s infinite" }}/>
          <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".64rem", color:"#5d9590" }}>just now</span>
        </div>
      </div>
      <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:".82rem", color:"#8ab8b4", lineHeight:1.7 }}>
        🔐 <strong style={{ color:"#d4ecec" }}>Security:</strong> Hardcoded{" "}
        <code style={{ fontFamily:"JetBrains Mono,monospace", background:"rgba(255,61,85,.1)", padding:"1px 5px", borderRadius:4, fontSize:".74rem", color:"#ff8fa3" }}>SECRET</code>
        {" "}replaced with env var — great. Consider adding rate limiting on auth failures to prevent brute-force.
      </p>
      <div style={{ marginTop:10, display:"flex", gap:5, flexWrap:"wrap" }}>
        {["🛡️ Security", "💡 Suggestion", "⚠️ Action needed"].map(t => (
          <span key={t} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".62rem", padding:"2px 8px", borderRadius:999, background:"rgba(56,182,255,.08)", color:"#38b6ff", border:"1px solid rgba(56,182,255,.18)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURE CARD
═══════════════════════════════════════════════════════════ */
function FeatureCard({ icon, iconBg, accentColor, title, desc, tags, num, delay }) {
  const ref = useRef(null);
  const onMove = e => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ref.current.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
    ref.current.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
  };
  return (
    <div ref={ref} className="h-fcard sr-init" onMouseMove={onMove} style={{ transitionDelay:`${delay}ms` }}>
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
          <div style={{
            width:52, height:52, borderRadius:14, background:iconBg,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem",
            boxShadow:`0 0 24px ${iconBg}`, transition:"transform .3s, box-shadow .3s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1) rotate(-5deg)"; e.currentTarget.style.boxShadow=`0 0 40px ${iconBg}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1) rotate(0)"; e.currentTarget.style.boxShadow=`0 0 24px ${iconBg}`; }}
          >{icon}</div>
          <span style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"3.4rem", color:"rgba(26,45,53,.6)", lineHeight:1 }}>0{num}</span>
        </div>
        <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1rem", color:"#d4ecec", marginBottom:10 }}>{title}</h3>
        <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:".84rem", color:"#5d9590", lineHeight:1.75, marginBottom:18 }}>{desc}</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {tags.map(t => (
            <span key={t} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".62rem", padding:"2px 8px", borderRadius:5, background:"var(--s3)", color:accentColor, border:`1px solid ${accentColor}1a` }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════════════════════ */
function Marquee() {
  const names = ["Vercel", "Linear", "Railway", "Supabase", "Neon", "Resend", "Turso", "Fly.io", "Liveblocks", "Planetscale"];
  const dbl = [...names, ...names];
  return (
    <div style={{ overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg, var(--bg2) 0%, transparent 15%, transparent 85%, var(--bg2) 100%)", zIndex:2, pointerEvents:"none" }}/>
      <div className="h-marquee-track">
        {dbl.map((n, i) => (
          <span key={i} style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:".9rem", color:"rgba(26,45,53,.8)", letterSpacing:"-.01em", flexShrink:0, transition:"color .2s", cursor:"default" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5d9590"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(26,45,53,.8)"}
          >{n}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon:"🔍", iconBg:"rgba(0,229,192,.14)",  accentColor:"#00e5c0", title:"Deep Code Analysis",  desc:"Goes beyond syntax — understands intent, patterns, and runtime risks across your entire diff.", tags:["Logic bugs","Edge cases","Anti-patterns","Dead code"] },
  { icon:"🛡️", iconBg:"rgba(255,61,85,.12)",  accentColor:"#ff6b80", title:"Security Scanning",   desc:"Spots injections, hardcoded secrets, broken auth flows, and OWASP Top 10 vulnerabilities instantly.", tags:["OWASP Top 10","Secrets","Auth flaws","XSS/SQLi"] },
  { icon:"⚡", iconBg:"rgba(56,182,255,.12)", accentColor:"#38b6ff", title:"Performance Insights", desc:"Flags N+1 queries, re-render storms, and memory leaks with concrete before/after suggestions.", tags:["N+1 queries","Memory leaks","Bundle size","Complexity"] },
  { icon:"📝", iconBg:"rgba(255,184,48,.1)",  accentColor:"#ffb830", title:"Auto Documentation",  desc:"Generates PR summaries, changelog entries, and JSDoc — so humans focus on what matters.", tags:["PR summary","Changelog","JSDoc","Issue links"] },
];

const STEPS = [
  { n:"01", icon:"⚙️", title:"Install the GitHub App",  desc:"One-click install. No API keys, no YAML, no CI changes needed." },
  { n:"02", icon:"📬", title:"Open a Pull Request",     desc:"Create a PR normally. ReviewBot triggers automatically on every push." },
  { n:"03", icon:"⚡", title:"Get Instant Reviews",     desc:"Inline comments in seconds — security, performance, style, logic." },
  { n:"04", icon:"🚀", title:"Merge with Confidence",   desc:"Address feedback, watch checks go green, ship knowing code is solid." },
];

const PLANS = [
  { name:"Open Source", price:"Free",  per:"",    desc:"For public repos & OSS projects.", featured:false,
    features:["Unlimited public repos","Core code review","Security scanning","Community support","Weekly digest"], cta:"Get started →" },
  { name:"Team",        price:"$29",   per:"/mo", desc:"For growing teams on private repos.", featured:true,
    features:["Unlimited private repos","Advanced AI analysis","Custom rules & filters","Slack & Discord alerts","Priority support","Analytics dashboard"], cta:"Start free trial" },
  { name:"Enterprise",  price:"Custom",per:"",    desc:"Compliance, SSO, and scale.", featured:false,
    features:["Self-hosted option","SSO / SAML","Audit logs & SOC 2","99.9% SLA","Dedicated Slack","Custom integrations"], cta:"Contact us →" },
];

const TESTIMONIALS = [
  { q:"ReviewBot caught a JWT secret we'd hardcoded in 3 places. Saved us from a very bad day on-call.", name:"Sarah K.", role:"Lead Engineer · Vercel",           grad:"#00e5c0,#38b6ff" },
  { q:"The PR summaries alone are worth it. Our retros take half the time now. Can't imagine going back.", name:"Marcus T.", role:"Tech Lead · Linear",             grad:"#38b6ff,#3dff9a" },
  { q:"98% catch rate isn't marketing fluff — we ran it against 6 months of historical PRs and it held up.", name:"Priya M.", role:"Engineering Manager · Railway", grad:"#ffb830,#ff3d55" },
];

/* ═══════════════════════════════════════════════════════════
   HERO MAIN
═══════════════════════════════════════════════════════════ */
export default function Hero() {
  const { user }       = useUser();
  const { openSignIn } = useClerk();
  const navigate       = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [heroIn, setHeroIn]       = useState(false);
  const [bubbleVis, setBubbleVis] = useState(false);
  useScrollReveal();

  // inject CSS once
  const cssInjected = useRef(false);
  useEffect(() => {
    if (cssInjected.current) return;
    cssInjected.current = true;
    const el = document.createElement("style");
    el.id = "hero-css";
    el.textContent = HERO_CSS;
    if (!document.getElementById("hero-css")) document.head.appendChild(el);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroIn(true), 80);
    setTimeout(() => setBubbleVis(true), 1000);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hv = (delay, y = 26) => ({
    opacity:   heroIn ? 1 : 0,
    transform: heroIn ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
  });

  const PX = "clamp(20px, 5vw, 72px)";

  return (
    <div style={{ width:"100%", background:"var(--bg)", color:"var(--t1)", fontFamily:"DM Sans,sans-serif" }}>
      <Cursor/>

      {/* ══════════════════ NAV ══════════════════ */}
      <nav className={`h-nav${scrolled ? " solid" : ""}`}>
        <a href="#" className="h-logo">
          <div className="h-logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#030d0b">
              <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/>
            </svg>
          </div>
          ReviewBot
        </a>
        <div className="h-nav-links">
          {["Features","How it works","Pricing","Docs"].map(l => (
            <a key={l} href={`#${l.replace(/ /g,"-")}`} className="h-nav-link">{l}</a>
          ))}
          <div className="h-nav-sep"/>
          {user
            ? <><UserButton/><button className="h-btn h-btn-teal" onClick={() => navigate("/GitURL")} style={{ marginLeft:6 }}>Dashboard →</button></>
            : <button className="h-btn h-btn-teal" onClick={openSignIn}><GH/> Get Started Free</button>
          }
        </div>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:`100px ${PX} 80px`, position:"relative", overflow:"hidden" }}>
        <GridBg/>
        <Orbs/>
        <Particles n={30}/>
        <Ripples x="25%" y="55%"/>
        {/* vignette */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(4,7,10,.75) 100%)", pointerEvents:"none" }}/>

        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:56, alignItems:"center", position:"relative", zIndex:1 }}>

          {/* ── LEFT ── */}
          <div style={{ maxWidth:700 }}>
            <div style={{ ...hv(80), marginBottom:26 }}>
              <span className="h-badge">
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#00e5c0", display:"inline-block", animation:"h-pulse 2s infinite", flexShrink:0 }}/>
                Now in public beta · 2,400+ PRs reviewed today
              </span>
            </div>

            <h1 style={{
              width:"100%",
              fontFamily:"Syne,sans-serif", fontWeight:900,
              fontSize:"clamp(1.2rem, 4.5vw, 4rem)",
              lineHeight:1.02, letterSpacing:"-.03em",
              marginBottom:28, color:"#d4ecec",
              ...hv(180),
            }}>
              AI code reviews<br/>
              that{" "}< br/><Typewriter words={["understand.", "catch bugs.", "ship faster.", "stay secure."]}/><br/>
              <span className="h-gt-white">every pull request.</span>
            </h1>

            <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"1.06rem", color:"#5d9590", maxWidth:480, lineHeight:1.8, marginBottom:44, fontWeight:300, ...hv(320) }}>
              ReviewBot reads your GitHub pull requests like a senior engineer — catching security holes, bugs, and performance issues before they reach production.
            </p>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:56, ...hv(430) }}>
              <button className="h-btn h-btn-teal" style={{ fontSize:".9rem", padding:"13px 30px" }}
                onClick={() => user ? navigate("/GitURL") : openSignIn()}>
                <GH/> {user ? "Go to Dashboard" : "Install on GitHub — Free"}
              </button>
              <button className="h-btn h-btn-ghost" style={{ fontSize:".9rem", padding:"13px 30px" }}>
                ▶ Watch 90-sec demo
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display:"flex", gap:40, flexWrap:"wrap", ...hv(530) }}>
              {[
                { label:"PRs reviewed",    to:2400, sfx:"+" },
                { label:"Issue catch rate", to:98,   sfx:"%" },
                { label:"Avg review time",  to:14,   sfx:"s" },
                { label:"Teams",            to:340,  sfx:"+" },
              ].map(x => (
                <div key={x.label} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  <span style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"1.75rem", color:"#00e5c0", lineHeight:1 }}>
                    <Counter to={x.to} sfx={x.sfx}/>
                  </span>
                  <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".68rem", color:"#2b4a47", textTransform:"uppercase", letterSpacing:".08em" }}>{x.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: floating visuals ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"flex-end", ...hv(260, 40) }}>
            <div style={{ animation:"h-float 7s ease-in-out infinite" }}>
              <DiffCard/>
            </div>
            <div style={{ animation:"h-float2 5.5s ease-in-out 1.2s infinite", alignSelf:"flex-start", marginLeft:32 }}>
              <ReviewBubble visible={bubbleVis}/>
            </div>
          </div>
        </div>

        {/* bottom fade */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, background:"linear-gradient(transparent, var(--bg))", pointerEvents:"none" }}/>
      </section>

      {/* ══════════════════ LOGO STRIP ══════════════════ */}
      <div style={{ borderTop:"1px solid var(--ln)", borderBottom:"1px solid var(--ln)", padding:"20px 0", background:"var(--bg2)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(0,229,192,.02),transparent)", animation:"h-beam 5s ease-in-out infinite", backgroundSize:"800px 100%", pointerEvents:"none" }}/>
        <div style={{ padding:`0 ${PX}`, marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
          <span className="h-sl">Trusted by teams at</span>
        </div>
        <Marquee/>
      </div>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section id="Features" style={{ padding:`120px ${PX}`, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,229,192,.022), transparent)", pointerEvents:"none" }}/>
        <div className="sr-init" style={{ marginBottom:64 }}>
          <p className="h-sl" style={{ marginBottom:16 }}>What it catches</p>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"clamp(2rem,4vw,3.4rem)", lineHeight:1.08, letterSpacing:"-.025em", maxWidth:520 }}>
            More than a linter.<br/><span className="h-gt-teal">A second engineer.</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} num={i + 1} delay={i * 80}/>)}
        </div>
      </section>

      {/* ══════════════════ LIVE DEMO ══════════════════ */}
      <section style={{ padding:`0 ${PX} 120px` }}>
        <div className="sr-init" style={{ textAlign:"center", marginBottom:52 }}>
          <p className="h-sl" style={{ marginBottom:16, justifyContent:"center" }}>Live preview</p>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"clamp(2rem,4vw,3.2rem)", letterSpacing:"-.025em" }}>
            See it <span className="h-gt-teal">in action.</span>
          </h2>
        </div>
        <div className="sr-init" style={{ background:"var(--s1)", border:"1px solid var(--ln2)", borderRadius:20, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,.6)" }}>
          {/* browser chrome */}
          <div style={{ background:"#0b1820", padding:"12px 20px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid var(--ln)" }}>
            <div style={{ display:"flex", gap:6 }}>
              {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width:11, height:11, borderRadius:"50%", background:c, opacity:.85 }}/>)}
            </div>
            <div style={{ flex:1, margin:"0 16px" }}>
              <div style={{ background:"rgba(255,255,255,.04)", borderRadius:7, padding:"5px 14px", display:"inline-flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:".62rem", color:"#2b4a47" }}>🔒</span>
                <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".7rem", color:"#5d9590" }}>github.com/your-org/repo/pull/42</span>
              </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
            {/* PR info */}
            <div style={{ padding:36, borderRight:"1px solid var(--ln)" }}>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.05rem", marginBottom:14, lineHeight:1.4, color:"#d4ecec" }}>feat: refactor auth middleware with JWT validation</h3>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:24 }}>
                {["security","auth","breaking-change"].map(t => (
                  <span key={t} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".62rem", padding:"2px 8px", borderRadius:5, background:"rgba(56,182,255,.07)", color:"#38b6ff", border:"1px solid rgba(56,182,255,.18)" }}>{t}</span>
                ))}
              </div>
              <hr style={{ border:"none", borderTop:"1px solid var(--ln)", marginBottom:24 }}/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
                {[{ l:"Files changed",v:"7" },{ l:"Additions",v:"+142",c:"#00e5c0" },{ l:"Deletions",v:"−38",c:"#ff3d55" },{ l:"Commits",v:"3" }].map(s => (
                  <div key={s.l} style={{ background:"var(--s2)", border:"1px solid var(--ln)", borderRadius:10, padding:"13px 16px", textAlign:"center", transition:"border-color .2s, transform .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,229,192,.25)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="var(--ln)"; e.currentTarget.style.transform="translateY(0)"; }}
                  >
                    <div style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"1.3rem", color:s.c||"#d4ecec", marginBottom:4 }}>{s.v}</div>
                    <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".65rem", color:"#2b4a47" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#00e5c0", animation:"h-pulse 2s infinite", flexShrink:0 }}/>
                <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".7rem", color:"#00e5c0" }}>ReviewBot analyzing diff…</span>
              </div>
              {[["Security",92,true],["Performance",78,false],["Style",100,false]].map(([label,pct,active]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".68rem", color:"#5d9590" }}>{label}</span>
                    <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".65rem", color:active?"#00e5c0":"#5d9590" }}>{pct}%</span>
                  </div>
                  <div style={{ height:3, background:"var(--s3)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:active?"linear-gradient(90deg,#00e5c0,#38b6ff)":"#1f3540", borderRadius:2, transition:"width 2s cubic-bezier(.16,1,.3,1)" }}/>
                  </div>
                </div>
              ))}
            </div>
            {/* AI comments */}
            <div style={{ padding:36, display:"flex", flexDirection:"column", gap:12, background:"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,182,255,.035), transparent)" }}>
              <p className="h-sl" style={{ marginBottom:6 }}>AI Review Comments</p>
              {[
                { type:"🛡️ Security",   col:"#ff6b80", msg:"Env var for JWT_SECRET is correct. Verify it's set in staging and production.", d:0 },
                { type:"⚡ Performance", col:"#38b6ff", msg:"Consider caching decoded JWT claims in Redis to avoid re-decoding on every request.", d:120 },
                { type:"✅ Approved",    col:"#00e5c0", msg:"Active user check before proceeding is a solid security pattern. Well handled!", d:240 },
                { type:"💡 Suggestion",  col:"#ffb830", msg:"Add structured logging for token expiry events to improve observability.", d:360 },
              ].map((c, i) => (
                <div key={i} className="h-cb" style={{ animation:`h-slideR .5s ${c.d + 200}ms both` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".62rem", padding:"2px 9px", borderRadius:999, background:"var(--s2)", color:c.col, border:`1px solid ${c.col}25` }}>{c.type}</span>
                    <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".64rem", color:"#2b4a47", marginLeft:"auto" }}>line {14+i*3}</span>
                  </div>
                  <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:".8rem", color:"#8ab8b4", lineHeight:1.68 }}>{c.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section id="How-it-works" style={{ padding:`0 ${PX} 120px`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 80% at 0% 50%, rgba(56,182,255,.03), transparent)", pointerEvents:"none" }}/>
        <div className="sr-init" style={{ textAlign:"center", marginBottom:72 }}>
          <p className="h-sl" style={{ marginBottom:16, justifyContent:"center" }}>How it works</p>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"clamp(2rem,4vw,3.2rem)", letterSpacing:"-.025em" }}>
            Set up in <span className="h-gt-teal">60 seconds.</span>
          </h2>
        </div>
        <div className="h-steps-wrap" style={{ maxWidth:1000, margin:"0 auto" }}>
          <div className="h-steps-line"/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }}>
            {STEPS.map((s, i) => (
              <div key={i} className="sr-init" style={{ padding:"0 24px", transitionDelay:`${i*100}ms`, textAlign:"center" }}>
                <div style={{
                  width:72, height:72, borderRadius:"50%",
                  background:"var(--s1)", border:"1px solid var(--ln)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 24px", fontSize:"1.6rem", position:"relative",
                  transition:"border-color .25s, box-shadow .25s, transform .25s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#00e5c0"; e.currentTarget.style.boxShadow="0 0 40px rgba(0,229,192,.3)"; e.currentTarget.style.transform="translateY(-6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--ln)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  {s.icon}
                  <div style={{ position:"absolute", top:-4, right:-4, width:22, height:22, borderRadius:"50%", background:"#00e5c0", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontSize:".58rem", fontWeight:900, color:"#030d0b" }}>{i+1}</div>
                </div>
                <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".64rem", color:"#00e5c0", letterSpacing:".12em", marginBottom:10 }}>{s.n}</div>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:".95rem", color:"#d4ecec", marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:".82rem", color:"#5d9590", lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section style={{ padding:`0 ${PX} 120px` }}>
        <div className="sr-init" style={{ textAlign:"center", marginBottom:52 }}>
          <p className="h-sl" style={{ marginBottom:16, justifyContent:"center" }}>From engineers</p>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"clamp(1.8rem,3.5vw,2.8rem)", letterSpacing:"-.025em" }}>
            What teams <span className="h-gt-warm">are saying.</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="h-tcard sr-init" style={{ transitionDelay:`${i*100}ms`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:16, right:20, fontFamily:"Georgia,serif", fontSize:"4rem", color:"rgba(0,229,192,.05)", lineHeight:1, userSelect:"none" }}>"</div>
              <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:".87rem", color:"#8ab8b4", lineHeight:1.78, marginBottom:24, fontStyle:"italic", position:"relative", zIndex:1 }}>"{t.q}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${t.grad})`, flexShrink:0 }}/>
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:".85rem", color:"#d4ecec" }}>{t.name}</div>
                  <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".68rem", color:"#2b4a47" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section id="Docs" style={{ padding:`0 ${PX} 120px` }}>
        <div className="h-cta-box sr-init">
          {/* decorative orbs */}
          <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,229,192,.08),transparent 65%)", top:"50%", left:"-10%", transform:"translateY(-50%)", filter:"blur(50px)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(56,182,255,.06),transparent 65%)", top:"50%", right:"-6%", transform:"translateY(-50%)", filter:"blur(50px)", pointerEvents:"none" }}/>
          {/* beam */}
          <div style={{ position:"absolute", inset:0, overflow:"hidden", borderRadius:24, pointerEvents:"none" }}>
            <div style={{ position:"absolute", top:0, bottom:0, width:"30%", background:"linear-gradient(90deg,transparent,rgba(0,229,192,.025),transparent)", animation:"h-beam 5s ease-in-out infinite" }}/>
          </div>
          <Particles n={16}/>
          <div style={{ position:"relative" }}>
            <p className="h-sl" style={{ justifyContent:"center", marginBottom:20 }}>Start reviewing</p>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:"clamp(2.4rem,5vw,4.4rem)", letterSpacing:"-.03em", lineHeight:1.04, marginBottom:22, color:"#d4ecec" }}>
              Ship code you're<br/><span className="h-gt-teal">genuinely proud of.</span>
            </h2>
            <p style={{ fontFamily:"DM Sans,sans-serif", color:"#5d9590", fontSize:"1rem", maxWidth:440, margin:"0 auto 52px", lineHeight:1.78 }}>
              Join thousands of developers catching bugs before they hit production. Free for open source, forever.
            </p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="h-btn h-btn-teal" style={{ fontSize:".96rem", padding:"14px 34px" }}
                onClick={() => user ? navigate("/GitURL") : openSignIn()}>
                <GH/> {user ? "Open Dashboard" : "Install on GitHub — It's Free"}
              </button>
              <button className="h-btn h-btn-ghost" style={{ fontSize:".96rem", padding:"14px 34px" }}>Read the docs</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="h-footer">
        <a href="#" className="h-logo" style={{ color:"#d4ecec" }}>
          <div className="h-logo-icon" style={{ width:26, height:26, borderRadius:7, fontSize:".7rem" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="#030d0b"><path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/></svg>
          </div>
          ReviewBot
        </a>
        <div style={{ display:"flex", gap:28 }}>
          {["Privacy","Terms","GitHub","Status","Blog"].map(l => (
            <a key={l} href="#" className="h-footer-link">{l}</a>
          ))}
        </div>
        <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".68rem", color:"#1a2d35" }}>© 2025 ReviewBot · MIT License</div>
      </footer>
    </div>
  );
}