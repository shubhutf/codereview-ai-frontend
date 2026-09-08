import {useState,useEffect,useCallback,useRef} from 'react'
import TYPE_META from '../data/typemeta';
import SEV_META from "../data/sevmeta"


export default function IssueCard({ issue, index }) {
  const [expanded, setExpanded] = useState(false);
  const tm = TYPE_META[issue.type];
  return (
    <div className="border border-border rounded-xl overflow-hidden transition-colors hover:border-border2 cursor-pointer"
      style={{ animation: `fadeUp 0.4s ${index * 0.05}s ease both` }}
      onClick={() => setExpanded(e => !e)}>
      <div className="bg-surface px-5 py-4">
        <div className="flex items-start gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border flex-shrink-0 mt-0.5 ${tm.bg} ${tm.border} ${tm.color}`}>
            {tm.emoji} {tm.label}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white font-syne leading-snug">{issue.title}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${SEV_META[issue.severity]}`}>{issue.severity}</span>
            <span className={`text-zinc-500 transition-transform duration-200 text-xs ${expanded ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 pl-1">
          <span className="text-xs font-mono text-zinc-600">{issue.file}</span>
          <span className="text-xs font-mono text-zinc-700">{issue.line}</span>
        </div>
      </div>

      {expanded && (
        <div className="bg-bg border-t border-border px-5 py-4 space-y-3" style={{ animation: 'scaleIn 0.2s ease both' }}>
          <p className="text-sm text-zinc-400 leading-relaxed">{issue.desc}</p>
          {(issue.before || issue.after) && (
            <div className="rounded-lg overflow-hidden border border-border">
              {issue.before && (
                <div className="bg-red/5 border-b border-border">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-zinc-600 border-b border-border">Before</div>
                  <pre className="px-4 py-3 text-xs font-mono overflow-x-auto">
                    {issue.before.split('\n').map((l, i) => (
                      <div key={i} className="code-line-remove">─ {l}</div>
                    ))}
                  </pre>
                </div>
              )}
              {issue.after && (
                <div className="bg-teal/5">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-zinc-600 border-b border-border">Suggested fix</div>
                  <pre className="px-4 py-3 text-xs font-mono overflow-x-auto">
                    {issue.after.split('\n').map((l, i) => (
                      <div key={i} className="code-line-add">+ {l}</div>
                    ))}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
