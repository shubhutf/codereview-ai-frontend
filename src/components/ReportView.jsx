

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

/* ── Reset & root ── */
.rv * { box-sizing:border-box; margin:0; padding:0; }
.rv { font-family:'DM Sans',sans-serif; background:#05080a; color:#d8ecea; min-height:100vh; position:relative; overflow-x:hidden; }

/* ── CSS vars ── */
.rv {
  --bg:    #05080a;
  --bg2:   #090d10;
  --s1:    #0d1417;
  --s2:    #121b1f;
  --s3:    #192228;
  --ln:    #1c2c31;
  --ln2:   #223540;
  --teal:  #00e5c0;
  --red:   #ff3d55;
  --amber: #ffb830;
  --blue:  #38b6ff;
  --lime:  #39ff8a;
  --t1:    #d8ecea;
  --t2:    #6b9e96;
  --t3:    #2e5050;
  --mono:  'JetBrains Mono', monospace;
  --syne:  'Syne', sans-serif;
  --body:  'DM Sans', sans-serif;
}

/* ── Nav ── */
.rv-nav {
  position:sticky; top:0; z-index:100;
  height:54px; display:flex; align-items:center; gap:12px; padding:0 28px;
  background:rgba(5,8,10,.82); backdrop-filter:blur(20px) saturate(180%);
  border-bottom:1px solid rgba(255,255,255,.045);
}
.rv-nav-logo { font-family:var(--syne); font-size:.82rem; font-weight:800; color:var(--teal); letter-spacing:-.01em; display:flex; align-items:center; gap:7px; }
.rv-nav-logo svg { opacity:.8; }
.rv-nav-sep { width:1px; height:18px; background:var(--ln2); }
.rv-nav-crumb { display:flex; align-items:center; gap:6px; }
.rv-nav-crumb-item { font-family:var(--mono); font-size:.72rem; color:var(--t2); cursor:pointer; transition:color .15s; }
.rv-nav-crumb-item:hover { color:var(--t1); }
.rv-nav-crumb-item.active { color:var(--t1); }
.rv-nav-crumb-sep { color:var(--t3); font-size:.7rem; }
.rv-nav-actions { margin-left:auto; display:flex; align-items:center; gap:8px; }
.rv-btn {
  display:inline-flex; align-items:center; gap:6px;
  font-family:var(--mono); font-size:.7rem; font-weight:600;
  padding:5px 13px; border-radius:7px; cursor:pointer; transition:all .15s; text-decoration:none;
}
.rv-btn-ghost { background:transparent; border:1px solid var(--ln2); color:var(--t2); }
.rv-btn-ghost:hover { border-color:rgba(0,229,192,.4); color:var(--teal); background:rgba(0,229,192,.04); }
.rv-btn-teal  { background:var(--teal); border:1px solid var(--teal); color:#03100e; font-weight:700; }
.rv-btn-teal:hover { background:#00ccaa; border-color:#00ccaa; }


/* ── Noise texture overlay ── */
.rv::before {
  content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:.022; background-size: 200px 200px;
}

/* ── Ambient orbs ── */
.rv-orb {
  position:fixed; border-radius:50%; pointer-events:none; z-index:0;
  filter:blur(120px); animation: rv-drift 18s ease-in-out infinite alternate;
}
@keyframes rv-drift { from{transform:translate(0,0);} to{transform:translate(30px,20px);} }

/* ── Animations ── */
@keyframes rv-up    { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
@keyframes rv-left  { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }
@keyframes rv-in    { from{opacity:0;transform:scale(.96);} to{opacity:1;transform:scale(1);} }
@keyframes rv-glow  { 0%,100%{opacity:.5;} 50%{opacity:1;} }
@keyframes rv-scan  { 0%{top:-2px;} 100%{top:100%;} }
@keyframes rv-pulse { 0%,100%{transform:scale(1);opacity:.6;} 50%{transform:scale(1.5);opacity:1;} }
@keyframes rv-sk    { 0%,100%{opacity:.08;} 50%{opacity:.18;} }
@keyframes rv-slide-in-r { from{opacity:0;transform:translateX(32px);} to{opacity:1;transform:translateX(0);} }
@keyframes rv-slide-in-l { from{opacity:0;transform:translateX(-32px);} to{opacity:1;transform:translateX(0);} }

/* ── Nav ── */
.rv-nav {
  position:sticky; top:0; z-index:100;
  height:54px; display:flex; align-items:center; gap:12px; padding:0 28px;
  background:rgba(5,8,10,.82); backdrop-filter:blur(20px) saturate(180%);
  border-bottom:1px solid rgba(255,255,255,.045);
}
.rv-nav-logo { font-family:var(--syne); font-size:.82rem; font-weight:800; color:var(--teal); letter-spacing:-.01em; display:flex; align-items:center; gap:7px; }
.rv-nav-logo svg { opacity:.8; }
.rv-nav-sep { width:1px; height:18px; background:var(--ln2); }
.rv-nav-crumb { display:flex; align-items:center; gap:6px; }
.rv-nav-crumb-item { font-family:var(--mono); font-size:.72rem; color:var(--t2); cursor:pointer; transition:color .15s; }
.rv-nav-crumb-item:hover { color:var(--t1); }
.rv-nav-crumb-item.active { color:var(--t1); }
.rv-nav-crumb-sep { color:var(--t3); font-size:.7rem; }
.rv-nav-actions { margin-left:auto; display:flex; align-items:center; gap:8px; }
.rv-btn {
  display:inline-flex; align-items:center; gap:6px;
  font-family:var(--mono); font-size:.7rem; font-weight:600;
  padding:5px 13px; border-radius:7px; cursor:pointer; transition:all .15s; text-decoration:none;
}
.rv-btn-ghost { background:transparent; border:1px solid var(--ln2); color:var(--t2); }
.rv-btn-ghost:hover { border-color:rgba(0,229,192,.4); color:var(--teal); background:rgba(0,229,192,.04); }
.rv-btn-teal  { background:var(--teal); border:1px solid var(--teal); color:#03100e; font-weight:700; }
.rv-btn-teal:hover { background:#00ccaa; border-color:#00ccaa; }

/* ── Overview layout ── */
.rv-overview { max-width:1320px; margin:0 auto; padding:32px 32px 80px; position:relative; z-index:1; }

/* ── TOP ROW: hero (wide) + stats sidebar ── */
.rv-top-row {
  display:grid;
  grid-template-columns:1fr 320px;
  gap:16px;
  align-items:stretch;
  margin-bottom:16px;
}

/* ── MIDDLE ROW: summary (wide) + severity panel ── */
.rv-mid-row {
  display:grid;
  grid-template-columns:1fr 320px;
  gap:16px;
  align-items:start;
  margin-bottom:28px;
}

/* ── Hero ── */
.rv-hero-compact {
  border-radius:18px; border:1px solid var(--ln2);
  background:linear-gradient(145deg, #0d1a1e 0%, #091214 100%);
  padding:32px 36px; position:relative; overflow:hidden;
  height:100%;
}
.rv-hero-compact::after {
  content:''; position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,229,192,.3), transparent);
  animation:rv-scan 4s linear infinite; pointer-events:none;
}
.rv-hero-compact-inner { position:relative; display:flex; align-items:center; gap:28px; height:100%; }

/* ── Stats panel (right of hero) ── */
.rv-stats-panel {
  background:var(--s1); border:1px solid var(--ln);
  border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:10px;
  animation:rv-up .5s .04s ease both; height:100%;
}
.rv-stats-panel-title {
  font-family:var(--mono); font-size:.62rem; color:var(--t3);
  text-transform:uppercase; letter-spacing:.12em; padding-bottom:10px;
  border-bottom:1px solid var(--ln); display:flex; align-items:center; gap:7px;
}
.rv-stat-row {
  display:flex; align-items:center; gap:12px; padding:8px 10px;
  border-radius:10px; transition:background .15s; cursor:default;
}
.rv-stat-row:hover { background:var(--s2); }
.rv-stat-row-ico { font-size:1rem; width:28px; text-align:center; flex-shrink:0; }
.rv-stat-row-info { flex:1; min-width:0; }
.rv-stat-row-label { font-family:var(--mono); font-size:.65rem; color:var(--t2); }
.rv-stat-row-bar { height:3px; background:var(--s3); border-radius:2px; margin-top:4px; overflow:hidden; }
.rv-stat-row-fill { height:100%; border-radius:2px; }
.rv-stat-row-val { font-family:var(--syne); font-weight:900; font-size:1.4rem; line-height:1; }

/* ── Risk/severity panel ── */
.rv-risk-panel {
  background:var(--s1); border:1px solid var(--ln);
  border-radius:16px; padding:20px; animation:rv-up .5s .08s ease both;
}

/* ── Hero banner ── */
.rv-hero {
  border-radius:20px; border:1px solid var(--ln2);
  background:linear-gradient(135deg, #0d1a1e 0%, #0a1215 100%);
  padding:40px 44px; margin-bottom:28px; position:relative; overflow:hidden;
  animation: rv-up .5s ease both;
}
.rv-hero-grid {
  position:absolute; inset:0; pointer-events:none;
  background-image:
    linear-gradient(rgba(0,229,192,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,192,.018) 1px, transparent 1px);
  background-size:36px 36px;
}
.rv-hero-glow {
  position:absolute; width:500px; height:500px; border-radius:50%;
  top:-180px; right:-100px; pointer-events:none;
  filter:blur(130px);
  animation:rv-glow 4s ease infinite;
}
/* scan line */
.rv-hero::after {
  content:''; position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,229,192,.3), transparent);
  animation:rv-scan 4s linear infinite; pointer-events:none;
}
.rv-hero-inner { position:relative; display:flex; align-items:center; gap:40px; }

/* large arc score */
.rv-arc-wrap { position:relative; flex-shrink:0; }
.rv-arc-label {
  position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center; pointer-events:none;
}
.rv-arc-num { font-family:var(--syne); font-weight:900; line-height:1; letter-spacing:-.04em; }
.rv-arc-sub { font-family:var(--mono); font-size:.62rem; letter-spacing:.1em; text-transform:uppercase; margin-top:3px; }

.rv-hero-text { flex:1; min-width:0; }
.rv-hero-tag {
  display:inline-flex; align-items:center; gap:7px;
  font-family:var(--mono); font-size:.68rem; font-weight:700; letter-spacing:.06em;
  padding:4px 12px; border-radius:999px; border:1px solid; margin-bottom:14px;
}
.rv-hero-title { font-family:var(--syne); font-weight:900; font-size:1.9rem; line-height:1.1; letter-spacing:-.03em; color:var(--t1); margin-bottom:10px; }
.rv-hero-sub { font-size:.92rem; color:var(--t2); line-height:1.72; max-width:520px; }

.rv-hero-meta { display:flex; gap:28px; margin-top:22px; flex-wrap:wrap; }
.rv-hero-meta-item { display:flex; flex-direction:column; gap:3px; }
.rv-hero-meta-val { font-family:var(--mono); font-size:.82rem; color:var(--t1); font-weight:600; }
.rv-hero-meta-key { font-family:var(--mono); font-size:.62rem; color:var(--t3); text-transform:uppercase; letter-spacing:.1em; }

/* ── Stat row ── */
.rv-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; animation:rv-up .5s .06s ease both; }
.rv-stat {
  background:var(--s1); border:1px solid var(--ln);
  border-radius:14px; padding:20px 22px; cursor:default;
  transition:border-color .2s, transform .25s, box-shadow .25s;
  position:relative; overflow:hidden;
}
.rv-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; border-radius:14px 14px 0 0; }
.rv-stat:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,.5); }
.rv-stat-icon { font-size:.95rem; margin-bottom:10px; }
.rv-stat-val { font-family:var(--syne); font-weight:900; font-size:2.1rem; line-height:1; }
.rv-stat-lbl { font-family:var(--mono); font-size:.62rem; color:var(--t3); text-transform:uppercase; letter-spacing:.1em; margin-top:6px; }

/* ── Section header ── */
.rv-section-hd { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.rv-section-hd-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.rv-section-hd-title { font-family:var(--syne); font-weight:800; font-size:1rem; color:var(--t1); }
.rv-section-hd-count { font-family:var(--mono); font-size:.68rem; color:var(--t3); background:var(--s2); border:1px solid var(--ln); border-radius:6px; padding:2px 8px; }
.rv-section-hd-line { flex:1; height:1px; background:var(--ln); }

/* ── Summary card ── */
.rv-summary-card {
  background:var(--s1); border:1px solid var(--ln); border-radius:14px;
  padding:24px 28px; margin-bottom:28px; animation:rv-up .5s .1s ease both;
}
.rv-summary-text { font-size:.9rem; color:var(--t2); line-height:1.82; }
.rv-summary-text strong { color:var(--t1); }

/* ── Pages grid ── */
.rv-pages-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(180px,1fr));
  gap:24px 20px;
  animation:rv-up .5s .14s ease both;
}

/* ── Document page card ── */
.rv-page-card {
  cursor:pointer;
  position:relative;
  transition:all .28s cubic-bezier(.16,1,.3,1);
  animation:rv-up .45s ease both;
  /* portrait aspect ratio ~A4 */
  aspect-ratio: 3/4;
  display:flex; flex-direction:column;
}
.rv-page-card:hover { transform:translateY(-8px) rotate(.5deg); }

/* paper shadow stack — gives depth illusion */
.rv-page-card::before, .rv-page-card::after {
  content:''; position:absolute; border-radius:5px;
  transition:all .28s cubic-bezier(.16,1,.3,1);
}
.rv-page-card::before {
  inset:-5px 7px 0; z-index:-1;
  background:#0c181b; border:1px solid rgba(0,229,192,.1);
  border-radius:5px;
}
.rv-page-card::after {
  inset:-9px 13px 0; z-index:-2;
  background:#0a1417; border:1px solid rgba(0,229,192,.05);
  border-radius:5px;
}
.rv-page-card:hover::before { inset:-8px 10px 0; }
.rv-page-card:hover::after  { inset:-14px 18px 0; }

/* the actual page surface */
.rv-page-inner {
  background:#0e181c;
  border:1px solid #1e3038;
  border-radius:5px;
  overflow:hidden;
  display:flex; flex-direction:column;
  flex:1;
  position:relative;
  box-shadow:0 4px 24px rgba(0,0,0,.65);
  transition:border-color .28s, box-shadow .28s;
}
.rv-page-card:hover .rv-page-inner {
  border-color:rgba(0,229,192,.35);
  box-shadow:0 24px 70px rgba(0,0,0,.75), 0 0 0 1px rgba(0,229,192,.12), 0 0 40px rgba(0,229,192,.04);
}

/* folded corner */
.rv-page-corner {
  position:absolute; top:0; right:0; width:22px; height:22px; z-index:2;
  background:linear-gradient(225deg, #05080a 50%, rgba(0,229,192,.1) 50%);
  border-left:1px solid rgba(0,229,192,.15);
  border-bottom:1px solid rgba(0,229,192,.15);
}

/* top header bar of page */
.rv-page-header {
  padding:12px 14px 10px;
  border-bottom:1px solid rgba(30,48,56,.9);
  display:flex; align-items:center; gap:8px;
  background:linear-gradient(180deg, #131f24 0%, #0e181c 100%);
  flex-shrink:0;
}
.rv-page-ext-badge {
  font-family:var(--mono); font-size:.56rem; font-weight:700;
  padding:2px 6px; border-radius:3px;
  letter-spacing:.08em; flex-shrink:0;
}
.rv-page-filename {
  font-family:var(--mono); font-size:.7rem; font-weight:700; color:var(--t1);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; min-width:0;
}

/* faux code lines — take all available space */
.rv-page-lines { padding:10px 14px; display:flex; flex-direction:column; gap:4px; flex:1; justify-content:center; }
.rv-page-line {
  height:4px; border-radius:2px; background:var(--s3);
  opacity:.45;
}
.rv-page-line.hl   { background:rgba(0,229,192,.2);  opacity:1; }
.rv-page-line.err  { background:rgba(255,61,85,.3);  opacity:1; }
.rv-page-line.warn { background:rgba(255,184,48,.25);opacity:1; }

/* page footer */
.rv-page-footer {
  padding:9px 14px;
  border-top:1px solid rgba(30,48,56,.9);
  display:flex; align-items:center; justify-content:space-between;
  background:#0b1518;
  flex-shrink:0;
}
.rv-page-footer-score { display:flex; align-items:center; gap:6px; }
.rv-page-pills { display:flex; gap:3px; flex-wrap:wrap; }
.rv-page-pill {
  font-family:var(--mono); font-size:.55rem; font-weight:700;
  padding:2px 5px; border-radius:3px; border:1px solid;
}
.rv-page-open-hint {
  position:absolute; inset:0; border-radius:6px;
  background:rgba(0,229,192,.04);
  display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity .2s;
  font-family:var(--mono); font-size:.72rem; color:var(--teal);
  font-weight:700; letter-spacing:.04em; gap:6px;
  backdrop-filter:blur(2px);
}
.rv-page-card:hover .rv-page-open-hint { opacity:1; }

/* ── Page detail view ── */
.rv-detail { max-width:1100px; margin:0 auto; padding:32px 28px 80px; position:relative; z-index:1; animation:rv-slide-in-r .35s cubic-bezier(.16,1,.3,1) both; }

.rv-detail-hero {
  background:var(--s1); border:1px solid var(--ln2);
  border-radius:18px; padding:30px 36px; margin-bottom:24px;
  display:flex; align-items:center; gap:28px;
  position:relative; overflow:hidden;
}
.rv-detail-hero::after {
  content:''; position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,229,192,.25), transparent);
  animation:rv-scan 3.5s linear infinite; pointer-events:none;
}
.rv-detail-file-badge {
  display:flex; flex-direction:column; align-items:center; gap:6px;
  background:var(--s2); border:1px solid var(--ln2);
  border-radius:14px; padding:18px 22px; flex-shrink:0;
}
.rv-detail-file-ext { font-family:var(--mono); font-size:.62rem; color:var(--t3); text-transform:uppercase; letter-spacing:.1em; }
.rv-detail-file-icon-big { font-size:1.8rem; }

.rv-detail-info { flex:1; min-width:0; }
.rv-detail-filename { font-family:var(--syne); font-weight:900; font-size:1.4rem; color:var(--t1); letter-spacing:-.02em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rv-detail-filepath { font-family:var(--mono); font-size:.72rem; color:var(--t3); margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rv-detail-pills { display:flex; gap:6px; margin-top:12px; flex-wrap:wrap; }

/* ── Issue list ── */
.rv-issue {
  background:var(--s1); border:1px solid var(--ln);
  border-radius:12px; margin-bottom:8px; overflow:hidden;
  cursor:pointer; transition:border-color .15s, box-shadow .15s;
}
.rv-issue:hover { border-color:var(--ln2); box-shadow:0 4px 28px rgba(0,0,0,.45); }
.rv-issue.rv-issue-open { border-color:rgba(0,229,192,.18); }

.rv-issue-head { display:flex; align-items:flex-start; gap:14px; padding:15px 20px; }
.rv-issue-bar { width:3px; border-radius:2px; min-height:22px; align-self:stretch; flex-shrink:0; }
.rv-issue-badge { font-family:var(--mono); font-size:.62rem; font-weight:700; padding:3px 9px; border-radius:5px; border:1px solid; flex-shrink:0; margin-top:1px; letter-spacing:.04em; }
.rv-issue-body { flex:1; min-width:0; }
.rv-issue-title { font-family:var(--syne); font-weight:700; font-size:.9rem; color:var(--t1); line-height:1.38; }
.rv-issue-meta { display:flex; align-items:center; gap:8px; margin-top:5px; flex-wrap:wrap; }
.rv-issue-file-tag { font-family:var(--mono); font-size:.65rem; color:var(--t3); display:flex; align-items:center; gap:4px; }
.rv-issue-line-tag { font-family:var(--mono); font-size:.63rem; background:var(--s3); color:var(--t2); padding:1px 7px; border-radius:4px; }
.rv-issue-right { display:flex; align-items:center; gap:8px; flex-shrink:0; margin-top:1px; }
.rv-sev { font-family:var(--mono); font-size:.62rem; font-weight:700; padding:3px 9px; border-radius:5px; letter-spacing:.04em; }
.rv-chevron { color:var(--t3); font-size:.62rem; transition:transform .2s; width:16px; text-align:center; user-select:none; }
.rv-chevron.open { transform:rotate(180deg); }

.rv-issue-body-expanded {
  border-top:1px solid var(--ln); background:var(--bg2);
  padding:20px 20px 20px 37px;
  display:flex; flex-direction:column; gap:14px;
  animation:rv-in .2s ease both;
}
.rv-code-block { border-radius:10px; overflow:hidden; border:1px solid var(--ln2); }
.rv-code-hd { padding:8px 14px; display:flex; align-items:center; gap:7px; border-bottom:1px solid var(--ln); }
.rv-code-hd-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
.rv-code-hd-label { font-family:var(--mono); font-size:.62rem; color:var(--t3); letter-spacing:.08em; text-transform:uppercase; }
.rv-code-pre { padding:14px 16px; font-family:var(--mono); font-size:.78rem; line-height:1.65; overflow-x:auto; margin:0; white-space:pre; }
.rv-code-ln { color:var(--t3); user-select:none; margin-right:14px; min-width:28px; display:inline-block; text-align:right; }

/* ── Filters ── */
.rv-filters { display:flex; align-items:center; gap:6px; margin-bottom:14px; flex-wrap:wrap; }
.rv-filter {
  font-family:var(--mono); font-size:.7rem; font-weight:600;
  padding:5px 13px; border-radius:7px; border:1px solid var(--ln2);
  background:transparent; color:var(--t3); cursor:pointer;
  transition:all .15s; display:inline-flex; align-items:center; gap:5px;
}
.rv-filter:hover { color:var(--t2); background:var(--s2); }
.rv-filter.active { color:var(--fc,var(--teal)); background:rgba(var(--fcr,0,229,192),.1); border-color:rgba(var(--fcr,0,229,192),.3); }
.rv-filter-n { font-size:.62rem; background:var(--s3); border-radius:4px; padding:1px 5px; }
.rv-filter.active .rv-filter-n { background:rgba(255,255,255,.1); }

/* ── Empty state ── */
.rv-empty { text-align:center; padding:60px 24px; background:var(--s1); border:1px dashed var(--ln2); border-radius:14px; }
.rv-empty-ico { font-size:2.4rem; margin-bottom:12px; }
.rv-empty-txt { font-family:var(--mono); font-size:.78rem; color:var(--t3); line-height:1.6; }

/* ── Skeleton ── */
.rv-sk-bar { border-radius:6px; background:var(--s2); animation:rv-sk 1.6s ease infinite; }

/* ── Scrollbar ── */
.rv *::-webkit-scrollbar { width:4px; height:4px; }
.rv *::-webkit-scrollbar-track { background:transparent; }
.rv *::-webkit-scrollbar-thumb { background:var(--ln2); border-radius:2px; }

/* ── Responsive ── */
@media(max-width:700px) {
  .rv-stats { grid-template-columns:repeat(2,1fr); }
  .rv-hero-inner { flex-direction:column; gap:24px; }
  .rv-detail-hero { flex-direction:column; }
  .rv-info-row { grid-template-columns:1fr; }
}
`;

/* ═══════════════════════════════════════════════════
   LIGHTWEIGHT MARKDOWN RENDERER
═══════════════════════════════════════════════════ */
function renderInline(text) {
  const parts = [];
  const re = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={m.index} style={{ color:"#d8ecea", fontWeight:700 }}>{m[2]}</strong>);
    if (m[3]) parts.push(<code key={m.index} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".8em", background:"rgba(0,229,192,.08)", border:"1px solid rgba(0,229,192,.15)", borderRadius:4, padding:"1px 6px", color:"#00e5c0" }}>{m[3]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Markdown({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) { i++; continue; }
    if (/^##\s/.test(trimmed)) {
      elements.push(<h2 key={i} style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#d8ecea", margin:"22px 0 8px", letterSpacing:"-.02em", borderBottom:"1px solid #1c2c31", paddingBottom:8 }}>{renderInline(trimmed.replace(/^##\s+/,""))}</h2>);
      i++; continue;
    }
    if (/^###\s/.test(trimmed)) {
      elements.push(<h3 key={i} style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:".9rem", color:"#d8ecea", margin:"16px 0 5px" }}>{renderInline(trimmed.replace(/^###\s+/,""))}</h3>);
      i++; continue;
    }
    if (/^####\s/.test(trimmed)) {
      elements.push(<h4 key={i} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".72rem", color:"#00e5c0", margin:"12px 0 4px", textTransform:"uppercase", letterSpacing:".08em" }}>{renderInline(trimmed.replace(/^####\s+/,""))}</h4>);
      i++; continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s/,"")); i++; }
      elements.push(<ol key={"ol"+i} style={{ paddingLeft:20, margin:"8px 0", display:"flex", flexDirection:"column", gap:5 }}>{items.map((item,j)=><li key={j} style={{ fontSize:".88rem", color:"#6b9e96", lineHeight:1.72 }}>{renderInline(item)}</li>)}</ol>);
      continue;
    }
    if (/^[-*]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-*]\s/,"")); i++; }
      elements.push(
        <ul key={"ul"+i} style={{ margin:"8px 0", display:"flex", flexDirection:"column", gap:5, listStyle:"none", paddingLeft:0 }}>
          {items.map((item,j)=>(
            <li key={j} style={{ fontSize:".88rem", color:"#6b9e96", lineHeight:1.72, display:"flex", gap:9, alignItems:"flex-start" }}>
              <span style={{ color:"#00e5c0", flexShrink:0, fontSize:".55rem", marginTop:".35em" }}>◆</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (/^---+$/.test(trimmed)) {
      elements.push(<hr key={i} style={{ border:"none", borderTop:"1px solid #1c2c31", margin:"16px 0" }}/>);
      i++; continue;
    }
    elements.push(<p key={i} style={{ fontSize:".88rem", color:"#6b9e96", lineHeight:1.78, margin:"4px 0" }}>{renderInline(trimmed)}</p>);
    i++;
  }
  return <div style={{ display:"flex", flexDirection:"column", gap:1 }}>{elements}</div>;
}

/* ═══════════════════════════════════════════════════
   HELPERS & CONSTANTS
═══════════════════════════════════════════════════ */
function sc(s) {
  if (s >= 85) return { c:"#ff3d55", r:"255,61,85",   label:"High Risk",    dim:"rgba(255,61,85,.07)"   };
  if (s >= 70) return { c:"#ffb830", r:"255,184,48",  label:"Needs Review", dim:"rgba(255,184,48,.07)"  };
  if (s >= 55) return { c:"#00e5c0", r:"0,229,192",   label:"Moderate",     dim:"rgba(0,229,192,.07)"   };
  return     { c:"#39ff8a", r:"61,255,138",  label:"Low Risk",     dim:"rgba(61,255,138,.07)"  };
}

function extractRepoAndPR(url="") {
  try {
    const p = new URL(url).pathname.split("/").filter(Boolean);
    const i = p.indexOf("pull");
    if (i!==-1) return { repo:p.slice(0,i).join("/"), pr:`#${p[i+1]??"?"}` };
  } catch {}
  return { repo:url, pr:"" };
}

function fileExt(f="") { return f.split(".").pop()?.toUpperCase().slice(0,4) ?? "FILE"; }
function fileName(f="") { return f.split("/").pop() ?? f; }

const TYPE = {
  security:    { label:"SECURITY",    c:"#ff3d55", bg:"rgba(255,61,85,.12)",    bd:"rgba(255,61,85,.3)"    },
  bug:         { label:"BUG",         c:"#ffb830", bg:"rgba(255,184,48,.1)",    bd:"rgba(255,184,48,.28)"  },
  performance: { label:"PERF",        c:"#00e5c0", bg:"rgba(0,229,192,.1)",     bd:"rgba(0,229,192,.28)"   },
};
const SEV = {
  high:   { c:"#ff3d55", bg:"rgba(255,61,85,.12)"   },
  medium: { c:"#ffb830", bg:"rgba(255,184,48,.1)"   },
  low:    { c:"#39ff8a", bg:"rgba(61,255,138,.08)"  },
};

/* ═══════════════════════════════════════════════════
   SCORE ARC  (SVG donut)
═══════════════════════════════════════════════════ */
function ScoreArc({ score, size=120, strokeWidth=7 }) {
  const { c } = sc(score);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="rv-arc-wrap" style={{ width:size, height:size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position:"absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.04)" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ filter:`drop-shadow(0 0 10px ${c}99)`, transition:"stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1)" }}
        />
      </svg>
      <div className="rv-arc-label">
        <span className="rv-arc-num" style={{ fontSize: size > 90 ? "2rem" : "1.1rem", color:c }}>{score}</span>
        <span className="rv-arc-sub" style={{ color:c, opacity:.55 }}>/ 100</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MINI SCORE RING  (for page cards)
═══════════════════════════════════════════════════ */
function MiniArc({ score, size=46 }) {
  const { c } = sc(score);
  const sw=4, r=(size-sw)/2, circ=2*Math.PI*r, dash=(score/100)*circ;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position:"absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c}
          strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ filter:`drop-shadow(0 0 5px ${c}88)`, transition:"stroke-dasharray 1s cubic-bezier(.16,1,.3,1)" }}
        />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"Syne,sans-serif", fontWeight:900, fontSize:".72rem", color:c }}>{score}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE CARD  (document-style)
═══════════════════════════════════════════════════ */
function PageCard({ page, index, onClick }) {
  const { c } = sc(page.score);
  const fname = fileName(page.file);
  const ext   = fileExt(page.file);

  const typeCounts = page.issues.reduce((a, i) => { a[i.type] = (a[i.type]??0)+1; return a; }, {});
  const sevCounts  = page.issues.reduce((a, i) => { a[i.severity] = (a[i.severity]??0)+1; return a; }, {});

  // Generate faux code lines pattern based on issues
  const lineCount = 10;
  const lineTypes = Array.from({ length: lineCount }, (_, li) => {
    const issue = page.issues[li % Math.max(page.issues.length, 1)];
    if (!issue) return "normal";
    if (li % 3 === 0 && issue.severity === "high")   return "err";
    if (li % 3 === 0 && issue.severity === "medium")  return "warn";
    if (li % 4 === 0) return "hl";
    return "normal";
  });
  const lineWidths = [72,55,88,40,65,80,48,70,60,75];

  const EXT_COLORS = { JS:"#ffd166", TS:"#4db8ff", JSX:"#00e5c0", TSX:"#00e5c0", PY:"#39ff8a", GO:"#4db8ff", RS:"#ff8c42", CSS:"#b388ff", HTML:"#ff6b6b", default:"#7fa89f" };
  const extColor = EXT_COLORS[ext] ?? EXT_COLORS.default;

  return (
    <div className="rv-page-card" style={{ animationDelay:`${index*.055}s` }} onClick={() => onClick(page)}>
      <div className="rv-page-inner">
        {/* folded corner */}
        <div className="rv-page-corner"/>

        {/* header */}
        <div className="rv-page-header">
          <span className="rv-page-ext-badge" style={{ color:extColor, background:`${extColor}14`, border:`1px solid ${extColor}28` }}>{ext}</span>
          <span className="rv-page-filename" title={fname}>{fname}</span>
        </div>

        {/* faux code body */}
        <div className="rv-page-lines">
          {lineTypes.map((type, li) => (
            <div key={li} className={`rv-page-line${type !== "normal" ? " "+type : ""}`}
              style={{ width:`${lineWidths[li]}%`, animationDelay:`${(index*.055)+(li*.02)}s` }}
            />
          ))}
        </div>

        {/* pills row */}
        <div style={{ padding:"8px 16px 6px", display:"flex", gap:4, flexWrap:"wrap" }}>
          {Object.entries(typeCounts).map(([type, cnt]) => {
            const tm = TYPE[type] ?? TYPE.bug;
            return <span key={type} className="rv-page-pill" style={{ color:tm.c, background:tm.bg, borderColor:tm.bd }}>{tm.label} {cnt}</span>;
          })}
        </div>

        {/* footer */}
        <div className="rv-page-footer">
          <div className="rv-page-footer-score">
            <MiniArc score={page.score} size={32}/>
            <div style={{ display:"flex", flexDirection:"column" }}>
              <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".6rem", color:c, fontWeight:700 }}>{sc(page.score).label}</span>
              <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".58rem", color:"var(--t3)" }}>{page.issues.length} issue{page.issues.length!==1?"s":""}</span>
            </div>
          </div>
          {(sevCounts.high ?? 0) > 0 && (
            <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".6rem", color:"#ff3d55", background:"rgba(255,61,85,.1)", border:"1px solid rgba(255,61,85,.2)", borderRadius:4, padding:"2px 7px", fontWeight:700 }}>
              🚨 {sevCounts.high} HIGH
            </span>
          )}
        </div>

        {/* hover overlay */}
        <div className="rv-page-open-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Open Report
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ISSUE ROW  (expandable)
═══════════════════════════════════════════════════ */
function IssueRow({ issue, index }) {
  const [open, setOpen] = useState(false);
  const tm  = TYPE[issue.type]  ?? TYPE.bug;
  const sev = SEV[issue.severity] ?? SEV.medium;
  return (
    <div className={`rv-issue${open?" rv-issue-open":""}`}
      style={{ animation:`rv-up .35s ${index*.04}s ease both` }}
      onClick={() => setOpen(o=>!o)}
    >
      <div className="rv-issue-head">
        <div className="rv-issue-bar" style={{ background:tm.c, opacity:.75 }}/>
        <span className="rv-issue-badge" style={{ color:tm.c, background:tm.bg, borderColor:tm.bd }}>{tm.label}</span>
        <div className="rv-issue-body">
          <div className="rv-issue-title">{issue.issue}</div>
          <div className="rv-issue-meta">
            <span className="rv-issue-file-tag">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              {issue.file}
            </span>
            {issue.line!=null && <span className="rv-issue-line-tag">L{issue.line}</span>}
          </div>
        </div>
        <div className="rv-issue-right">
          <span className="rv-sev" style={{ color:sev.c, background:sev.bg }}>{(issue.severity??"").toUpperCase()}</span>
          <span className={`rv-chevron${open?" open":""}`}>▾</span>
        </div>
      </div>

      {open && (
        <div className="rv-issue-body-expanded">
          {issue.code && (
            <div className="rv-code-block" style={{ background:"rgba(255,61,85,.025)" }}>
              <div className="rv-code-hd">
                <div className="rv-code-hd-dot" style={{ background:"#ff3d55" }}/>
                <span className="rv-code-hd-label">Problematic code</span>
              </div>
              <pre className="rv-code-pre" style={{ color:"#ff8fa3", background:"transparent" }}>
                {issue.code.split("\n").map((ln,i)=>(
                  <div key={i}><span className="rv-code-ln">{(issue.line||1)+i}</span>{ln}</div>
                ))}
              </pre>
            </div>
          )}
          {issue.fix && (
            <div className="rv-code-block" style={{ background:"rgba(0,229,192,.02)" }}>
              <div className="rv-code-hd">
                <div className="rv-code-hd-dot" style={{ background:"#00e5c0" }}/>
                <span className="rv-code-hd-label">Suggested fix</span>
              </div>
              <pre className="rv-code-pre" style={{ color:"#4dffd8", background:"transparent" }}>
                {issue.fix.split("\n").map((ln,i)=>(
                  <div key={i}><span className="rv-code-ln">{i+1}</span>{ln}</div>
                ))}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE DETAIL VIEW
═══════════════════════════════════════════════════ */
function PageDetail({ page }) {
  const [filter, setFilter] = useState("all");
  const { c } = sc(page.score);
  const ext = fileExt(page.file);
  const fname = fileName(page.file);
  const counts = page.issues.reduce((a,i)=>{ a[i.type]=(a[i.type]??0)+1; return a; }, {});
  const sevCounts = page.issues.reduce((a,i)=>{ a[i.severity]=(a[i.severity]??0)+1; return a; }, {});
  const filtered = filter==="all" ? page.issues : page.issues.filter(i=>i.type===filter);

  const FILTERS = [
    { key:"all",         label:"All",      count:page.issues.length, fc:"#00e5c0", fcr:"0,229,192"   },
    { key:"security",    label:"Security", count:counts.security??0, fc:"#ff3d55", fcr:"255,61,85"   },
    { key:"bug",         label:"Bug",      count:counts.bug??0,      fc:"#ffb830", fcr:"255,184,48"  },
    { key:"performance", label:"Perf",     count:counts.performance??0, fc:"#00e5c0", fcr:"0,229,192" },
  ];

  return (
    <div className="rv-detail">
      {/* file hero */}
      <div className="rv-detail-hero" style={{ background:`linear-gradient(135deg, #0d1a1e 0%, #0a1215 100%)` }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 80% 50%, ${sc(page.score).dim} 0%, transparent 65%)`, pointerEvents:"none", borderRadius:18 }}/>
        <div className="rv-detail-file-badge" style={{ position:"relative" }}>
          <div className="rv-detail-file-icon-big">{fileExt(page.file)==="JS"?"🟡":fileExt(page.file)==="TS"?"🔷":fileExt(page.file)==="PY"?"🐍":"📄"}</div>
          <div className="rv-detail-file-ext">{ext}</div>
        </div>
        <div className="rv-detail-info" style={{ position:"relative" }}>
          <div className="rv-detail-filename">{fname}</div>
          <div className="rv-detail-filepath">{page.file}</div>
          <div className="rv-detail-pills">
            {[
              { label:`${page.issues.length} issues`,  c:"#7fa89f", bg:"var(--s3)",               bd:"var(--ln2)"              },
              { label:`${sevCounts.high??0} high`,     c:"#ff3d55", bg:"rgba(255,61,85,.1)",       bd:"rgba(255,61,85,.25)"     },
              { label:`${sevCounts.medium??0} medium`, c:"#ffb830", bg:"rgba(255,184,48,.08)",     bd:"rgba(255,184,48,.22)"    },
            ].map(({label,c,bg,bd})=>(
              <span key={label} style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".65rem", fontWeight:700, color:c, background:bg, border:`1px solid ${bd}`, borderRadius:6, padding:"3px 10px" }}>{label}</span>
            ))}
          </div>
        </div>
        <MiniArc score={page.score} size={72}/>
      </div>

      {/* filter + issues */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14, flexWrap:"wrap" }}>
        <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.02rem", color:"var(--t1)", letterSpacing:"-.01em" }}>Issues</h2>
        <div className="rv-filters" style={{ margin:0 }}>
          {FILTERS.map(f=>(
            <button key={f.key}
              className={`rv-filter${filter===f.key?" active":""}`}
              style={filter===f.key ? { "--fc":f.fc, "--fcr":f.fcr } : {}}
              onClick={e=>{ e.stopPropagation(); setFilter(f.key); }}
            >
              {f.label}
              <span className="rv-filter-n">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length===0
        ? <div className="rv-empty"><div className="rv-empty-ico">✅</div><div className="rv-empty-txt">No issues in this category</div></div>
        : filtered.map((issue,i) => <IssueRow key={issue._id??i} issue={issue} index={i}/>)
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════ */
function Overview({ report, pages, onSelectPage }) {
  const { repo, pr } = extractRepoAndPR(report.Metadata?.PRUrl??"");
  const score = report.risk_score ?? 0;
  const { c, dim, label } = sc(score);
  const issues = report.Issues ?? [];
  const counts = issues.reduce((a,i)=>{ a[i.type]=(a[i.type]??0)+1; return a; }, {});

  const STATS = [
    { val:counts.security??0,    label:"Security",    c:"#ff3d55", bg:"rgba(255,61,85,.08)",   ico:"🔒" },
    { val:counts.bug??0,         label:"Bugs",        c:"#ffb830", bg:"rgba(255,184,48,.08)",  ico:"🐛" },
    { val:counts.performance??0, label:"Performance", c:"#00e5c0", bg:"rgba(0,229,192,.08)",   ico:"⚡" },
    { val:issues.length,         label:"Total",       c:"#7fa89f", bg:"rgba(127,168,159,.08)", ico:"◎"  },
  ];

  const sevCounts = issues.reduce((a,i)=>{ a[i.severity]=(a[i.severity]??0)+1; return a; }, {});
  const maxStat   = Math.max(...STATS.map(s=>s.val), 1);

  return (
    <div className="rv-overview">
      {/* ambient orbs */}
      <div className="rv-orb" style={{ width:700, height:700, background:dim, top:-250, right:-200, animationDuration:"24s" }}/>
      <div className="rv-orb" style={{ width:350, height:350, background:"rgba(61,255,138,.03)", bottom:50, left:-120, animationDuration:"18s", animationDirection:"alternate-reverse" }}/>

      {/* ═══ TOP ROW: hero left, issue stats right ═══ */}
      <div className="rv-top-row" style={{ animation:"rv-up .45s ease both" }}>

        {/* Hero */}
        <div className="rv-hero-compact">
          <div className="rv-hero-grid"/>
          <div className="rv-hero-glow" style={{ background:dim }}/>
          <div className="rv-hero-compact-inner">
            <ScoreArc score={score} size={118} strokeWidth={7}/>
            <div style={{ flex:1, minWidth:0, position:"relative" }}>
              <div className="rv-hero-tag" style={{ color:c, background:`${c}10`, borderColor:`${c}28` }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:c, display:"inline-block", animation:"rv-pulse 2s ease infinite" }}/>
                {label}
              </div>
              <div className="rv-hero-title" style={{ fontSize:"1.55rem" }}>{repo}<span style={{ color:c }}> {pr}</span></div>
              <div className="rv-hero-meta" style={{ marginTop:14 }}>
                {[
                  { key:"Files Analyzed", val:pages.length },
                  { key:"Total Issues",   val:issues.length },
                  { key:"High Severity",  val:sevCounts.high??0 },
                ].map(({key,val})=>(
                  <div key={key} className="rv-hero-meta-item">
                    <span className="rv-hero-meta-val">{val}</span>
                    <span className="rv-hero-meta-key">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Issue stats panel */}
        <div className="rv-stats-panel">
          <div className="rv-stats-panel-title">
            <span style={{ color:"var(--teal)" }}>◈</span>
            Issue Breakdown
          </div>
          {STATS.map(({val,label,c,ico})=>(
            <div key={label} className="rv-stat-row">
              <div className="rv-stat-row-ico">{ico}</div>
              <div className="rv-stat-row-info">
                <div className="rv-stat-row-label">{label}</div>
                <div className="rv-stat-row-bar">
                  <div className="rv-stat-row-fill" style={{ width:`${(val/maxStat)*100}%`, background:c, boxShadow:`0 0 6px ${c}66` }}/>
                </div>
              </div>
              <div className="rv-stat-row-val" style={{ color:c }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ MID ROW: summary left, severity + risk-summary right ═══ */}
      <div className="rv-mid-row" style={{ animation:"rv-up .45s .07s ease both" }}>

        {/* Final summary */}
        {report.final_summary ? (
          <div className="rv-summary-card" style={{ marginBottom:0 }}>
            <div className="rv-section-hd" style={{ marginBottom:14 }}>
              <div className="rv-section-hd-dot" style={{ background:"var(--teal)" }}/>
              <span className="rv-section-hd-title">Analysis Summary</span>
              <div className="rv-section-hd-line"/>
            </div>
            <Markdown text={report.final_summary}/>
          </div>
        ) : <div/>}

        {/* Right column: severity + risk summary */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Severity distribution */}
          <div className="rv-risk-panel">
            <div className="rv-stats-panel-title" style={{ marginBottom:14 }}>
              <span style={{ color:"var(--teal)" }}>◈</span>
              Severity Distribution
            </div>
            {[
              { key:"high",   label:"High",   c:"#ff3d55" },
              { key:"medium", label:"Medium", c:"#ffb830" },
              { key:"low",    label:"Low",    c:"#39ff8a" },
            ].map(({key,label,c})=>{
              const cnt = sevCounts[key]??0;
              const pct = issues.length ? (cnt/issues.length)*100 : 0;
              return (
                <div key={key} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".68rem", color:"var(--t2)", display:"flex", alignItems:"center", gap:7 }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", background:c, display:"inline-block" }}/>
                      {label}
                    </span>
                    <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".68rem", color:c, fontWeight:700 }}>{cnt}</span>
                  </div>
                  <div style={{ height:4, background:"var(--s3)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:c, borderRadius:2, boxShadow:`0 0 8px ${c}55`, transition:"width 1s cubic-bezier(.16,1,.3,1)" }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk summary */}
          {report.risk_summary && (
            <div style={{ background:"var(--s1)", border:"1px solid var(--ln)", borderRadius:16, padding:"18px 20px" }}>
              <div className="rv-stats-panel-title" style={{ marginBottom:12 }}>
                <span style={{ color:"var(--teal)" }}>◈</span>
                Risk Summary
              </div>
              <div style={{ fontSize:".82rem", color:"var(--t2)", lineHeight:1.7 }}>
                <Markdown text={report.risk_summary}/>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ FILES SECTION ═══ */}
      <div style={{ animation:"rv-up .45s .13s ease both" }}>
        <div className="rv-section-hd" style={{ marginBottom:20 }}>
          <div className="rv-section-hd-dot" style={{ background:"var(--teal)" }}/>
          <span className="rv-section-hd-title">Files Analyzed</span>
          <span className="rv-section-hd-count">{pages.length} files</span>
          <div className="rv-section-hd-line"/>
        </div>
        <div className="rv-pages-grid">
          {pages.map((page, i) => (
            <PageCard key={page.file} page={page} index={i} onClick={onSelectPage}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════ */
function Nav({ report, selectedPage,setSelectedPage, onHome }) {
  const { repo, pr } = extractRepoAndPR(report?.Metadata?.PRUrl??"");
  const navigate=useNavigate()
  return (
    <nav className="rv-nav">
      {/* logo */}
      <div className="rv-nav-logo" onClick={()=>navigate("/")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
          <line x1="2" y1="8.5" x2="22" y2="8.5"/>
          <line x1="2" y1="15.5" x2="22" y2="15.5"/>
        </svg>
        ReviewBot
      </div>
      <div className="rv-nav-sep"/>
      {/* breadcrumbs */}
      <div className="rv-nav-crumb">
        <span className="rv-nav-crumb-item" onClick={onHome}>Overview</span>
        {selectedPage && <>
          <span className="rv-nav-crumb-sep">›</span>
          <span className="rv-nav-crumb-item active">{fileName(selectedPage.file)}</span>
        </>}
      </div>
      {/* actions */}
      <div className="rv-nav-actions">
        <button className="rv-btn rv-btn-ghost" onClick={()=>(selectedPage?(setSelectedPage(false)):navigate("/GitURL"))}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <a href={report?.Metadata?.PRUrl} target="_blank" rel="noreferrer" className="rv-btn rv-btn-teal">
          GitHub
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════════ */
export default function ReportView({ report, onBack }) {
  const [selectedPage, setSelectedPage] = useState(null);
  const styleInjected = useRef(false);
  const navigate=useNavigate();
  // inject CSS once
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const el = document.createElement("style");
    el.id = "rv-styles";
    el.textContent = CSS;
    if (!document.getElementById("rv-styles")) document.head.appendChild(el);
  }, []);

  // derive "pages" by grouping Issues by file, compute per-file score
  const issues = report?.Issues ?? [];
  const fileMap = {};
  issues.forEach(issue => {
    if (!fileMap[issue.file]) fileMap[issue.file] = [];
    fileMap[issue.file].push(issue);
  });

  // score per file: 100 minus weighted penalty per issue
  const SEV_W = { high:18, medium:9, low:3 };
  const TYPE_W = { security:1.4, bug:1.0, performance:0.7 };
  const pages = Object.entries(fileMap).map(([file, fileIssues]) => {
    const penalty = fileIssues.reduce((sum, i) => {
      return sum + (SEV_W[i.severity]??5) * (TYPE_W[i.type]??1);
    }, 0);
    const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    return { file, issues:fileIssues, score };
  }).sort((a,b) => a.score - b.score); // worst files first

  return (
    <div className="rv">
      <Nav
        report={report}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        onHome={() => setSelectedPage(null)}
      />
      {selectedPage
        ? <PageDetail key={selectedPage.file} page={selectedPage}/>
        : <Overview report={report} pages={pages} onSelectPage={setSelectedPage}/>
      }
    </div>
  );
}