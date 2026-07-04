import { useEffect, useRef, useState } from "react";

// Reveals children with a fade-up when they scroll into view (once).
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// Cycles through words with an upward slide/fade.
export function RotatingWord({ words, className = "", interval = 2200 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  // Widest word reserves the width (invisible ghost) so nothing reflows.
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="word-slot">
      <span className="invisible" aria-hidden>
        {widest}
      </span>
      {/* remounts on change so it re-animates each rotation */}
      <span key={i} className={`word-live animate-word-in ${className}`}>
        {words[i]}
      </span>
    </span>
  );
}

// Types a word, pauses, deletes, moves to the next — with a blinking caret.
export function Typewriter({
  words,
  className = "",
  typeSpeed = 75,
  deleteSpeed = 38,
  pause = 1500,
}) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[wi % words.length];
    let t;
    if (!del && text === word) {
      t = setTimeout(() => setDel(true), pause);
    } else if (del && text === "") {
      setDel(false);
      setWi((w) => w + 1);
    } else {
      t = setTimeout(
        () => setText(word.slice(0, del ? text.length - 1 : text.length + 1)),
        del ? deleteSpeed : typeSpeed
      );
    }
    return () => clearTimeout(t);
  }, [text, del, wi, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={className}>
      {text}
      <span className="tw-caret" aria-hidden>
        |
      </span>
    </span>
  );
}

// Interactive 3D tilt that follows the pointer.
export function Tilt({ children, className = "", max = 9 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-py * max).toFixed(
      2
    )}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

// Counts up to a number once scrolled into view.
export function CountUp({ to, duration = 1400, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}
