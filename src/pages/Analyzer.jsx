import "./Analyzer.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Cursor from "../components/Cursor";
import ReportView from "../components/ReportView";

const API = "https://pr-review-bot-dev-be.onrender.com/api/Reports";
/* ── Skeleton ─────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ background:"#05080a", minHeight:"100vh", fontFamily:"JetBrains Mono,monospace" }}>
      <style>{`
        @keyframes sk-pulse { 0%,100%{opacity:.07} 50%{opacity:.16} }
        .sk { background:#192228; border-radius:8px; animation:sk-pulse 1.6s ease infinite; }
      `}</style>

      {/* fake nav */}
      <div style={{ height:54, background:"rgba(5,8,10,.9)", borderBottom:"1px solid #1c2c31", display:"flex", alignItems:"center", padding:"0 28px", gap:14 }}>
        <div className="sk" style={{ width:90, height:20 }}/>
        <div style={{ width:1, height:18, background:"#1c2c31" }}/>
        <div className="sk" style={{ width:120, height:14 }}/>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <div className="sk" style={{ width:60, height:28, borderRadius:7 }}/>
          <div className="sk" style={{ width:80, height:28, borderRadius:7 }}/>
        </div>
      </div>

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"36px 28px" }}>
        {/* hero */}
        <div style={{ background:"#0d1417", border:"1px solid #1c2c31", borderRadius:20, padding:"40px 44px", marginBottom:28, display:"flex", alignItems:"center", gap:40 }}>
          <div className="sk" style={{ width:130, height:130, borderRadius:"50%" }}/>
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12 }}>
            <div className="sk" style={{ width:100, height:20, borderRadius:999 }}/>
            <div className="sk" style={{ width:"55%", height:36 }}/>
            <div className="sk" style={{ width:"75%", height:14 }}/>
            <div className="sk" style={{ width:"60%", height:14 }}/>
            <div style={{ display:"flex", gap:24, marginTop:8 }}>
              {[80,70,100].map((w,i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  <div className="sk" style={{ width:w, height:20 }}/>
                  <div className="sk" style={{ width:60, height:10 }}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
          {[...Array(4)].map((_,i) => (
            <div key={i} style={{ background:"#0d1417", border:"1px solid #1c2c31", borderRadius:14, padding:"20px 22px" }}>
              <div className="sk" style={{ width:28, height:18, marginBottom:10 }}/>
              <div className="sk" style={{ width:"55%", height:34, marginBottom:8 }}/>
              <div className="sk" style={{ width:"70%", height:10 }}/>
            </div>
          ))}
        </div>

        {/* summary */}
        <div style={{ background:"#0d1417", border:"1px solid #1c2c31", borderRadius:14, padding:"24px 28px", marginBottom:28, display:"flex", flexDirection:"column", gap:10 }}>
          <div className="sk" style={{ width:"30%", height:12 }}/>
          {[100,90,75,85].map((w,i) => <div key={i} className="sk" style={{ width:`${w}%`, height:12 }}/>)}
        </div>

        {/* page cards */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div className="sk" style={{ width:6, height:6, borderRadius:"50%" }}/>
          <div className="sk" style={{ width:130, height:16 }}/>
          <div style={{ flex:1, height:1, background:"#1c2c31" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ background:"#0d1417", border:"1px solid #1c2c31", borderRadius:16, padding:"22px 24px", display:"flex", flexDirection:"column", gap:14, animationDelay:`${i*.06}s` }}>
              <div style={{ display:"flex", gap:12 }}>
                <div className="sk" style={{ width:36, height:36, borderRadius:9 }}/>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
                  <div className="sk" style={{ width:"70%", height:12 }}/>
                  <div className="sk" style={{ width:"45%", height:10 }}/>
                </div>
                <div className="sk" style={{ width:46, height:46, borderRadius:"50%" }}/>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <div className="sk" style={{ width:80, height:20, borderRadius:5 }}/>
                <div className="sk" style={{ width:60, height:20, borderRadius:5 }}/>
              </div>
              <div className="sk" style={{ width:"100%", height:3, borderRadius:2 }}/>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div className="sk" style={{ width:60, height:12 }}/>
                <div className="sk" style={{ width:90, height:12 }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Empty / Error states ─────────────────────────────────────────────────── */
function CenteredState({ icon, title, sub, action, onAction }) {
  return (
    <div style={{ minHeight:"100vh", background:"#05080a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, fontFamily:"JetBrains Mono,monospace" }}>
      <div style={{ fontSize:"2.8rem", marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:".9rem", color:"#d8ecea", fontFamily:"Syne,sans-serif", fontWeight:800 }}>{title}</div>
      {sub && <div style={{ fontSize:".75rem", color:"#2e5050", maxWidth:340, textAlign:"center", lineHeight:1.6 }}>{sub}</div>}
      {action && (
        <button onClick={onAction} style={{ marginTop:8, background:"rgba(0,229,192,.08)", border:"1px solid rgba(0,229,192,.25)", color:"#00e5c0", borderRadius:9, padding:"9px 22px", fontFamily:"JetBrains Mono,monospace", fontSize:".78rem", fontWeight:600, cursor:"pointer", transition:"all .15s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(0,229,192,.14)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(0,229,192,.08)"; }}
        >
          {action}
        </button>
      )}
    </div>
  );
}



/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function Analyzer() {
  const [params]     = useSearchParams();
  const navigate     = useNavigate();
  const { getToken } = useAuth();
  const id           = params.get("id");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["report", id],
    enabled: !!id,
    queryFn: async () => {
      const token = await getToken();
      const res   = await axios.get(`${API}/FullReport/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
    staleTime: 5 * 60_000,
    retry: 1,
  });

  if (!id)       return <CenteredState icon="🔍" title="No report selected" sub="Head back and analyze a PR to see results here." action="← Analyze a PR" onAction={() => navigate("/GitURL")}/>;
  if (isLoading) return <Skeleton/>;
  if (isError)   return <CenteredState icon="⚠️" title="Failed to load report" sub={error?.response?.data?.message ?? "Something went wrong loading this report."} action="← Go back" onAction={() => navigate("/GitURL")}/>;

  return (
    <div style={{ background:"#05080a", minHeight:"100vh" }}>
      <Cursor/>
      <ReportView report={data} onBack={() => navigate("/GitURL")}/>
    </div>
  );
}
