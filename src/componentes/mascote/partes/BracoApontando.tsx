"use client";

import { motion } from "framer-motion";

export type DirecaoApontar = "esquerda" | "direita" | "cima";

type Props = { direcao: DirecaoApontar; animar: boolean };

const BRACOS: Record<DirecaoApontar, { braco: string; seta: string; vai: { x: number; y: number } }> = {
  esquerda: {
    braco: "M20 70 Q12 69 8 63",
    seta: "M1.5 56 L12.5 58 L5 66 Z",
    vai: { x: -3, y: -2 },
  },
  direita: {
    braco: "M120 70 Q128 69 132 63",
    seta: "M138.5 56 L127.5 58 L135 66 Z",
    vai: { x: 3, y: -2 },
  },
  cima: {
    braco: "M21 45 Q12 38 11 26",
    seta: "M11 15 L17 25 L5 25 Z",
    vai: { x: 0, y: -3 },
  },
};

/** Bracinho com setinha saindo da lateral do monitor. */
export function BracoApontando({ direcao, animar }: Props) {
  const forma = BRACOS[direcao];
  return (
    <motion.g
      animate={animar ? { x: [0, forma.vai.x, 0], y: [0, forma.vai.y, 0] } : undefined}
      transition={animar ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <path
        d={forma.braco}
        fill="none"
        stroke="var(--cor-mascote-moldura-sombra)"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={forma.seta}
        fill="var(--cor-destaque)"
        stroke="var(--cor-mascote-moldura-sombra)"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </motion.g>
  );
}
