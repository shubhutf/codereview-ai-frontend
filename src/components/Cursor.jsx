import { useRef,useEffect,useState } from "react";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const rp = useRef({ x: -100, y: -100 });
  const big = useRef(false);

  useEffect(() => {
    const mv = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", mv);
    let raf;
    const loop = () => {
      rp.current.x += (pos.current.x - rp.current.x) * 0.13;
      rp.current.y += (pos.current.y - rp.current.y) * 0.13;
      if (dot.current) { dot.current.style.left = pos.current.x + "px"; dot.current.style.top = pos.current.y + "px"; }
      if (ring.current) { ring.current.style.left = rp.current.x + "px"; ring.current.style.top = rp.current.y + "px"; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const en = () => { big.current = true; if (ring.current) { ring.current.style.width = "54px"; ring.current.style.height = "54px"; ring.current.style.borderColor = "rgba(63,185,80,.85)"; } };
    const le = () => { big.current = false; if (ring.current) { ring.current.style.width = "34px"; ring.current.style.height = "34px"; ring.current.style.borderColor = "rgba(63,185,80,.45)"; } };
    document.querySelectorAll("a,button,label").forEach(el => { el.addEventListener("mouseenter", en); el.addEventListener("mouseleave", le); });
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position:"fixed",width:9,height:9,background:"var(--accent)",borderRadius:"50%",pointerEvents:"none",zIndex:99999,transform:"translate(-50%,-50%)",mixBlendMode:"screen",transition:"width .25s,height .25s" }} />
      <div ref={ring} style={{ position:"fixed",width:34,height:34,border:"1px solid rgba(63,185,80,.45)",borderRadius:"50%",pointerEvents:"none",zIndex:99998,transform:"translate(-50%,-50%)",transition:"width .35s,height .35s,border-color .3s" }} />
    </>
  );
}