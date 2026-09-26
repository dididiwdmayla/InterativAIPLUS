"use client";

import { motion } from "framer-motion";

type Props = { animar: boolean };

export function GotaSuor({ animar }: Props) {
  return (
    <motion.path
      d="M125 26 q-5 7 0 10.5 q5 -3.5 0 -10.5z"
      fill="var(--cor-secundaria)"
      stroke="var(--cor-mascote-moldura-sombra)"
      strokeWidth={1}
      animate={animar ? { y: [0, 6, 0], opacity: [1, 0.6, 1] } : undefined}
      transition={animar ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
}
