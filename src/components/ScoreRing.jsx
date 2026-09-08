
import scoreColor from "./ScoreColour";
import TYPE_META from '../data/typemeta';


export default function ScoreRing({ score, size = 56 }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a2628" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="12" fontFamily="JetBrains Mono" fontWeight="700">
        {score}
      </text>
    </svg>
  );
}