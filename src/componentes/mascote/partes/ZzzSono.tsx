"use client";

import { motion } from "framer-motion";

type Props = { animar: boolean };

/** "Z z" desenhados em SVG, subindo devagar. */
export function ZzzSono({ animar }: Props) {
  const flutuar = (atraso: number) =>
    animar
      ? {
          animate: { y: [4, -4], opacity: [0.35, 1, 0.35] },
          transition: { duration: 2.4, repeat: Infinity, delay: atraso, ease: "easeOut" as const },
        }
      : {};

  return (
    <g
      fill="none"
      stroke="var(--cor-secundaria)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path d="M98 12h11l-11 12h11" strokeWidth={3} {...flutuar(0)} />
      <motion.path d="M117 2h7l-7 8h7" strokeWidth={2.4} {...flutuar(0.8)} />
    </g>
  );
}
