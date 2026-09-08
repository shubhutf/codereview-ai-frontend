import { useState } from "react";
import "./GitURL.css";
import Cursor from "../components/Cursor";
import LoadingOverlay from "../components/LoadingOverlay";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const API = "https://pr-review-bot-dev-be.onrender.com/api/Reports";
function scoreColor(s) {
  if (s >= 85) return "#ff4c6a"; 
  if (s >= 70) return "#ffd166";
  if (s >= 55) return "#00e5c0";
  return "#39ff8a";
}

function riskLabel(s) {
  if (s >= 85) return { label: "High Risk",    bg: "rgba(255,76,106,0.08)",  border: "rgba(255,76,106,0.2)",  color: "#ff4c6a" };
  if (s >= 70) return { label: "Needs Review", bg: "rgba(255,209,102,0.08)", border: "rgba(255,209,102,0.2)", color: "#ffd166" };
  if (s >= 55) return { label: "Moderate",     bg: "rgba(0,229,192,0.08)",   border: "rgba(0,229,192,0.2)",   color: "#00e5c0" };
  return        { label: "Low Risk",    bg: "rgba(57,255,138,0.08)",  border: "rgba(57,255,138,0.2)",  color: "#39ff8a" };
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function extractRepoAndPR(url = "") {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    const pullIdx = parts.indexOf("pull");
    if (pullIdx !== -1)
      return { repo: parts.slice(0, pullIdx).join("/"), pr: `#${parts[pullIdx + 1] ?? "?"}` };
  } catch {}
  return { repo: url, pr: "" };
}

function MiniRing({ score, size = 42 }) {
  const r    = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const c    = scoreColor(score);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a2628" strokeWidth="3.5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c}
        strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ filter: `drop-shadow(0 0 5px ${c}88)`, transition: "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        fill={c} fontSize="10" fontFamily="JetBrains Mono" fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}>
        {score}
      </text>
    </svg>
  );
}

function HistoryCard({ report, onOpen }) {
  const { repo, pr } = extractRepoAndPR(report.Metadata?.PRUrl);
  const risk = riskLabel(report.risk_score ?? 0);
  return (
    <button onClick={() => onOpen(report._id)}
      style={{ width: "100%", textAlign: "left", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.4s ease both" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,192,0.35)"; e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,229,192,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <MiniRing score={report.risk_score ?? 0} size={42}/>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>
          {repo} <span style={{ color: "var(--teal)" }}>{pr}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.68rem", fontFamily: "var(--mono)", padding: "2px 9px", borderRadius: 999, background: risk.bg, border: `1px solid ${risk.border}`, color: risk.color }}>
          {risk.label}
        </span>
        <span style={{ marginLeft: "auto", fontSize: "0.68rem", fontFamily: "var(--mono)", color: "var(--text3)" }}>{timeAgo(report.createdAt)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </button>
  );
}

function SkeletonList() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ background: "var(--surface2)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)", animation: `pulse 1.5s ${i * 0.1}s ease infinite` }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--border2)" }}/>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ height: 10, width: "55%", borderRadius: 4, background: "var(--border2)" }}/>
              <div style={{ height: 10, width: "75%", borderRadius: 4, background: "var(--border2)" }}/>
            </div>
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </>
  );
}

function HistorySidebar({ getToken, onOpen }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allReports"],
    queryFn: async () => {
      const token = await getToken();
      const res   = await axios.get(`${API}/AllReports`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
    staleTime: 30_000,
  });

  return (
    <aside style={{ width: 420, flexShrink: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 120px)", position: "sticky", top: 80, overflow: "hidden", boxShadow: "0 4px 40px rgba(0,0,0,0.3)" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <span>🕑</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text2)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Analysis History</span>
        <button onClick={() => refetch()} style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", color: "var(--text3)", transition: "color 0.2s", padding: 4 }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--teal)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text3)"}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {isLoading && <SkeletonList/>}
        {isError && (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>⚠️</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text3)" }}>Failed to load history</div>
            <button onClick={() => refetch()} style={{ marginTop: 12, background: "var(--teal-dim)", border: "1px solid rgba(0,229,192,0.2)", color: "var(--teal)", borderRadius: 8, padding: "6px 14px", fontSize: "0.75rem", fontFamily: "var(--mono)", cursor: "pointer" }}>Retry</button>
          </div>
        )}
        {!isLoading && !isError && data?.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>🔍</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text3)", lineHeight: 1.6 }}>No reports yet.<br/>Analyze your first PR!</div>
          </div>
        )}
        {!isLoading && !isError && data?.map(r => <HistoryCard key={r._id} report={r} onOpen={onOpen}/>)}
      </div>

      {!isLoading && !isError && !!data?.length && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "10px 20px", fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text3)", display: "flex", justifyContent: "space-between" }}>
          <span>{data.length} report{data.length !== 1 ? "s" : ""} total</span>
          <span style={{ color: "var(--teal)" }}>↑ sorted by latest</span>
        </div>
      )}
    </aside>
  );
}


function Nav() {
  const navigate=useNavigate()
  return (
    <nav className="rv-nav">
      {/* logo */}
      <div onClick={()=>navigate("/")} className="rv-nav-logo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
          <line x1="2" y1="8.5" x2="22" y2="8.5"/>
          <line x1="2" y1="15.5" x2="22" y2="15.5"/>
        </svg>
        ReviewBot
      </div>
      <div className="rv-nav-sep"/>
      {/* actions */}
      <div className="rv-nav-actions">
        <button className="rv-btn rv-btn-ghost" onClick={()=>navigate("/")}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
    </nav>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

const GitURL = () => {
  const [url, setUrl]           = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { getToken }            = useAuth();
  const queryClient             = useQueryClient();
  const navigate                = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (pr_url) => {
      const token = await getToken();
      const res   = await axios.post(`${API}/create`, { pr_url }, { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    },
    onSuccess: (data) => {
      setUrl(""); setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["allReports"] });
      navigate(`/Analyze?id=${data.data._id}`);
    },
    onError: (err) => {
      setErrorMsg(err?.response?.data?.message ?? "Something went wrong. Please try again.");
    },
  });

  const handleAnalyze = () => {
    setErrorMsg("");
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!/^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+/.test(trimmed)) {
      setErrorMsg("Please enter a valid GitHub PR URL, e.g. https://github.com/owner/repo/pull/123");
      return;
    }
    mutate(trimmed);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Cursor/>
      <Nav />
      {isPending && <LoadingOverlay url={url}/>}
      <div className="orb orb1"/><div className="orb orb2"/>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 24px 48px", display: "flex", gap: 48, alignItems: "flex-start", position: "relative", zIndex: 1 }}>

        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="input-badge" style={{ marginBottom: "2rem" }}>
            <div className="dot-pulse"/> Now in public beta · 2,488+ PRs reviewed today
          </div>
          <h1 className="input-title" style={{ textAlign: "left" }}>Analyze your<br/><span>pull request.</span></h1>
          <p className="input-sub" style={{ textAlign: "left", maxWidth: 480 }}>
            Paste any GitHub PR URL and get a full report — security threats, bugs, suggestions, and optimizations, in seconds.
          </p>

          <div className="url-form" style={{ maxWidth: "100%", marginTop: "2rem" }}>
            <div className="url-box" style={errorMsg ? { borderColor: "var(--red)", boxShadow: "0 0 0 3px rgba(255,76,106,0.1)" } : {}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text3)", flexShrink: 0 }}>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <input value={url} onChange={e => { setUrl(e.target.value); setErrorMsg(""); }}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                type="url" className="url-input" placeholder="https://github.com/owner/repo/pull/123"/>
              <button className="analyze-btn" onClick={handleAnalyze} disabled={isPending}>
                {isPending
                  ? <><div className="spinner"/>Analyzing…</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Analyze PR</>
                }
              </button>
            </div>
            {errorMsg && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(255,76,106,0.08)", border: "1px solid rgba(255,76,106,0.25)", borderRadius: 8, color: "var(--red)", fontFamily: "var(--mono)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 8, animation: "fadeUp 0.3s ease both" }}>
                <span>⚠</span> {errorMsg}
              </div>
            )}
            <p className="url-hint">e.g. https://github.com/vercel/next.js/pull/62234 · or press Enter ↵</p>
          </div>

          <div className="features-row" style={{ justifyContent: "flex-start", marginTop: "2.5rem" }}>
            {[{ dot: "#ff4c6a", label: "Security threats" },{ dot: "#ffd166", label: "Bug detection" },{ dot: "#00e5c0", label: "Optimizations" },{ dot: "#4cc9f0", label: "Suggestions" }].map(f => (
              <div key={f.label} className="feat-item"><div className="feat-dot" style={{ background: f.dot }}/>{f.label}</div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <HistorySidebar getToken={getToken} onOpen={(id) => navigate(`/Analyze?id=${id}`)}/>
      </div>
    </div>
  );
};

export default GitURL;
