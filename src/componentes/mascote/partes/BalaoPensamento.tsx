"use client";

import { motion } from "framer-motion";

type Props = { animar: boolean };

/** Mini balão com três pontinhos, usado no rosto pensativo. */
export function BalaoPensamento({ animar }: Props) {
  return (
    <g>
      <circle cx="108" cy="23" r="2.4" fill="var(--cor-superficie)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.4} />
      <circle cx="115" cy="16.5" r="3.4" fill="var(--cor-superficie)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.4} />
      <rect x="103" y="1" width="36" height="13" rx="6.5" fill="var(--cor-superficie)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth={1.4} />
      {[112, 121, 130].map((x, indice) => (
        <motion.circle
          key={x}
          cx={x}
          cy={7.5}
          r={2}
          fill="var(--cor-texto)"
          animate={animar ? { opacity: [0.25, 1, 0.25] } : { opacity: 1 }}
          transition={
            animar
              ? { duration: 1.2, repeat: Infinity, delay: indice * 0.2, ease: "easeInOut" }
              : undefined
          }
        />
      ))}
    </g>
  );
}
