export default function scoreColor(s) {
  if (s >= 85) return '#39ff8a';
  if (s >= 70) return '#00e5c0';
  if (s >= 55) return '#ffd166';
  return '#ff4c6a';
}