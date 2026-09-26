"use client";

import { motion } from "framer-motion";

type Props = {
  esquerdo: { x: number; y: number };
  direito: { x: number; y: number };
  raio: number;
  piscando: boolean;
  brilho?: boolean;
};

export function OlhosRedondos({ esquerdo, direito, raio, piscando, brilho = false }: Props) {
  return (
    <motion.g
      animate={{ scaleY: piscando ? 0.12 : 1 }}
      transition={{ duration: 0.07 }}
      style={{ originY: 0.5 }}
    >
      {[esquerdo, direito].map((olho) => (
        <g key={olho.x}>
          <circle cx={olho.x} cy={olho.y} r={raio} fill="var(--cor-mascote-rosto)" />
          {brilho && (
            <circle
              cx={olho.x + raio * 0.35}
              cy={olho.y - raio * 0.35}
              r={raio * 0.32}
              fill="var(--cor-mascote-tela)"
            />
          )}
        </g>
      ))}
    </motion.g>
  );
}
