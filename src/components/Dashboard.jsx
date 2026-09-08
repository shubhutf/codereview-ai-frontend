import { useState,useEffect,useCallback } from "react";
import PRCard from "./PRcard";

const PR_CARDS = [
  {
    id: 1,
    repo: 'vercel/next.js',
    pr: '#62234',
    title: 'feat: add JWT auth middleware with rate limiting',
    author: 'alexdev',
    avatar: 'A',
    branch: 'feature/jwt-auth',
    status: 'open',
    score: 62,
    filesChanged: 8,
    additions: 342,
    deletions: 87,
    timeAgo: '2h ago',
    security: 3, bugs: 5, suggestions: 7, optimizations: 4,
    tags: ['security', 'auth'],
  },
  {
    id: 2,
    repo: 'facebook/react',
    pr: '#28945',
    title: 'refactor: migrate useState hooks to new concurrent API',
    author: 'sophialee',
    avatar: 'S',
    branch: 'refactor/concurrent-hooks',
    status: 'open',
    score: 84,
    filesChanged: 14,
    additions: 890,
    deletions: 456,
    timeAgo: '5h ago',
    security: 0, bugs: 2, suggestions: 9, optimizations: 6,
    tags: ['performance', 'refactor'],
  },
  {
    id: 3,
    repo: 'prisma/prisma',
    pr: '#21103',
    title: 'fix: resolve N+1 query issue in relation loading',
    author: 'marcust',
    avatar: 'M',
    branch: 'fix/n-plus-one',
    status: 'review',
    score: 91,
    filesChanged: 5,
    additions: 127,
    deletions: 43,
    timeAgo: '1d ago',
    security: 0, bugs: 1, suggestions: 3, optimizations: 8,
    tags: ['database', 'performance'],
  },
  {
    id: 4,
    repo: 'tailwindlabs/tailwindcss',
    pr: '#13887',
    title: 'chore: update JIT compiler for v4 config syntax',
    author: 'karinav',
    avatar: 'K',
    branch: 'chore/v4-jit',
    status: 'merged',
    score: 77,
    filesChanged: 22,
    additions: 1204,
    deletions: 893,
    timeAgo: '3d ago',
    security: 1, bugs: 3, suggestions: 5, optimizations: 2,
    tags: ['build', 'breaking-change'],
  },
  {
    id: 5,
    repo: 'supabase/supabase',
    pr: '#19021',
    title: 'feat: realtime presence with postgres CDC',
    author: 'ryanjones',
    avatar: 'R',
    branch: 'feat/realtime-presence',
    status: 'open',
    score: 55,
    filesChanged: 18,
    additions: 674,
    deletions: 132,
    timeAgo: '6h ago',
    security: 5, bugs: 4, suggestions: 6, optimizations: 3,
    tags: ['realtime', 'database'],
  },
  {
    id: 6,
    repo: 'trpc/trpc',
    pr: '#5673',
    title: 'fix: type inference regression in nested routers',
    author: 'jule',
    avatar: 'J',
    branch: 'fix/type-inference',
    status: 'review',
    score: 88,
    filesChanged: 6,
    additions: 89,
    deletions: 34,
    timeAgo: '12h ago',
    security: 0, bugs: 1, suggestions: 4, optimizations: 2,
    tags: ['types', 'typescript'],
  },
];

export default function Dashboard({ onSelectPR }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = PR_CARDS.filter(pr => {
    const matchFilter = filter === 'all' || pr.status === filter;
    const matchSearch = search === '' || 
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.repo.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      {/* Hero */}
      <div className="mb-10" style={{ animation: 'fadeUp 0.5s ease both' }}>
        <div className="inline-flex items-center gap-2 bg-dim border border-teal/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse2"/>
          <span className="text-xs font-mono text-teal">2,488+ PRs reviewed today</span>
        </div>
        <h1 className="text-4xl font-black font-syne tracking-tight text-white leading-tight mb-2">
          Pull Request <span className="shimmer-text">Reviews</span>
        </h1>
        <p className="text-zinc-500 text-sm max-w-lg leading-relaxed">
          Click any card below to view the full security report, bug analysis, and optimization suggestions.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-8 flex-wrap" style={{ animation: 'fadeUp 0.5s 0.1s ease both' }}>
        {/* Search */}
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 flex-1 min-w-48 max-w-72 focus-within:border-teal/40 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-600 flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search PRs..."
            className="bg-transparent text-xs font-mono text-zinc-300 placeholder-zinc-600 outline-none w-full"/>
        </div>
        {/* Status filters */}
        {['all','open','review','merged'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs font-mono px-3 py-2 rounded-xl border transition-all capitalize
              ${filter === s ? 'bg-dim2 border-teal/30 text-teal' : 'bg-surface border-border text-zinc-500 hover:border-border2'}`}>
            {s === 'all' ? '📋 All' : s === 'open' ? '🟢 Open' : s === 'review' ? '🟡 In Review' : '🟣 Merged'}
            <span className="ml-1.5 text-zinc-600 text-[10px]">
              {s === 'all' ? PR_CARDS.length : PR_CARDS.filter(p => p.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((pr, i) => (
          <PRCard key={pr.id} pr={pr} index={i} onClick={onSelectPR}/>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-20 text-zinc-600 font-mono text-sm">
            No pull requests found
          </div>
        )}
      </div>
    </div>
  );
}