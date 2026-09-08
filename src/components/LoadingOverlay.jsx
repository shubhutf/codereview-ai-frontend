import { useState, useEffect } from "react";
import "./LoadingOverlay.css"

export default function LoadingOverlay({ url }) {
  const steps = [
    'Fetching repository & PR diff',
    'Parsing changed files',
    'Running security analysis',
    'Detecting bugs & anti-patterns',
    'Generating suggestions',
    'Compiling report',
  ];

  const [visibleSteps, setVisibleSteps] = useState([]);
  const [doneSteps, setDoneSteps] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeouts = [];

    const runAnimation = () => {
      // reset state
      setVisibleSteps([]);
      setDoneSteps([]);
      setProgress(0);

      steps.forEach((_, i) => {
        // show step
        timeouts.push(
          setTimeout(() => {
            setVisibleSteps((p) => [...p, i]);
          }, i * 400 + 100)
        );

        // mark step done + update progress
        timeouts.push(
          setTimeout(() => {
            setDoneSteps((p) => [...p, i]);
            setProgress(((i + 1) / steps.length) * 100);
          }, i * 400 + 450)
        );
      });

      const totalDuration = steps.length * 400 + 800;

      // loop again
      timeouts.push(
        setTimeout(() => {
          runAnimation();
        }, totalDuration)
      );
    };

    runAnimation();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-bg z-[200] flex flex-col items-center justify-center gap-5 grid-bg">
      
      {/* background orb */}
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: 'rgba(0,229,192,0.06)',
          top: -80,
          right: -80,
          position: 'fixed',
          borderRadius: '50%',
          filter: 'blur(100px)'
        }}
      />

      {/* title */}
      <div className="text-teal font-syne font-black text-xl tracking-tight animate-fadeIn">
        ⬡ ReviewBot
      </div>

      {/* subtitle */}
      <div className="text-zinc-400 text-sm text-center max-w-xs leading-relaxed font-syne animate-fadeIn">
        Analyzing pull request
        <div className="text-zinc-600 font-mono text-xs mt-1 truncate max-w-xs">
          {url}
        </div>
      </div>

      {/* progress bar */}
      <div className="w-72 h-0.5 bg-surface2 rounded-full overflow-hidden relative">
  <div
      className="absolute top-0 left-0 h-full w-1/3 bg-teal rounded-full animate-scrollbar"
      style={{
        boxShadow: '0 0 12px rgba(0,229,192,0.6)'
      }}
    />
  </div>

      {/* steps */}
      <div className="flex flex-col gap-2 w-72">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 text-xs font-mono transition-all duration-300 ${
              visibleSteps.includes(i)
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-3'
            }`}
          >
            <span
              className={`w-4 text-center transition-colors ${
                doneSteps.includes(i) ? 'text-teal' : 'text-zinc-600'
              }`}
            >
              {doneSteps.includes(i) ? '✓' : '◉'}
            </span>

            <span className={doneSteps.includes(i) ? 'text-teal' : 'text-zinc-500'}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}