import { useState,useEffect,useCallback } from "react";
import ScoreRing from "./ScoreRing";
import TYPE_META from '../data/typemeta';
import SEV_META from "../data/sevmeta"
import STATUS_META from "../data/statusmeta"



export default function PRCard({ pr, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const st = STATUS_META[pr.status];
  const total = pr.security + pr.bugs + pr.suggestions + pr.optimizations;
  return (
    <div
      className="relative group cursor-pointer card-glow hover-lift"
      style={{ animation: `fadeUp 0.5s ${index * 0.07}s ease both` }}
      onClick={() => onClick(pr)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Border glow on hover */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(135deg, rgba(0,229,192,0.1), transparent)', borderRadius: 16 }}/>
      <div className={`relative bg-surface border rounded-2xl p-5 transition-all duration-300 ${hovered ? 'border-teal/30' : 'border-border'}`}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-zinc-500">{pr.repo}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs font-mono text-teal">{pr.pr}</span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 font-syne">{pr.title}</h3>
          </div>
          <ScoreRing score={pr.score} size={52}/>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-mono ${st.bg} ${st.color}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }}/>
            {pr.status}
          </span>
          <span className="text-xs font-mono text-zinc-600">{pr.filesChanged} files</span>
          <span className="text-xs font-mono text-green/70">+{pr.additions}</span>
          <span className="text-xs font-mono text-red/70">-{pr.deletions}</span>
          <span className="text-xs font-mono text-zinc-600 ml-auto">{pr.timeAgo}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {pr.tags.map(t => (
            <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-surface2 border border-border text-zinc-500">{t}</span>
          ))}
        </div>

        {/* Issue counts */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { count: pr.security,     ...TYPE_META.security },
            { count: pr.bugs,         ...TYPE_META.bug },
            { count: pr.suggestions,  ...TYPE_META.suggestion },
            { count: pr.optimizations,...TYPE_META.optimization },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl px-2 py-2 text-center ${item.bg} border ${item.border}`}>
              <div className={`text-base font-black font-mono ${item.color}`}>{item.count}</div>
              <div className="text-zinc-600 text-[10px] font-mono mt-0.5">{item.emoji}</div>
            </div>
          ))}
        </div>

        {/* Click hint */}
        <div className={`mt-4 flex items-center gap-1.5 text-xs font-mono text-teal transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          View full report →
        </div>
      </div>
    </div>
  );
}