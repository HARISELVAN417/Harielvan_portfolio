import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const dotXSpring = useSpring(dotX, springConfig);
  const dotYSpring = useSpring(dotY, springConfig);

  useEffect(() => {
    // Disable custom cursor on mobile or touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    setVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("clickable")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (!visible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        ref={cursorRef}
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={{
          scale: hovered ? 1.5 : 1,
          backgroundColor: hovered ? "rgba(147, 51, 234, 0.15)" : "rgba(6, 182, 212, 0.05)",
          borderColor: hovered ? "rgba(147, 51, 234, 0.8)" : "rgba(6, 182, 212, 0.5)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
        className="fixed w-8 h-8 rounded-full border border-cyan-500/50 pointer-events-none z-50 mix-blend-screen hidden md:block"
        id="custom-cursor-ring"
      />
      {/* Inner Dot */}
      <motion.div
        style={{
          left: dotXSpring,
          top: dotYSpring,
        }}
        animate={{
          scale: hovered ? 0.5 : 1,
          backgroundColor: hovered ? "#c084fc" : "#22d3ee",
        }}
        className="fixed w-2 h-2 rounded-full pointer-events-none z-50 hidden md:block"
        id="custom-cursor-dot"
      />
    </>
  );
}
