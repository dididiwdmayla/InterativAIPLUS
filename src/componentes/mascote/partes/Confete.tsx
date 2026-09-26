"use client";

import { motion } from "framer-motion";

type Peca = {
  forma: "circulo" | "triangulo" | "quadrado";
  x: number;
  y: number;
  cor: string;
  atraso: number;
  giro: number;
};

/** Posições fixas para o desenho ser igual no servidor e no cliente. */
const PECAS: readonly Peca[] = [
  { forma: "circulo", x: 10, y: 20, cor: "var(--cor-primaria)", atraso: 0, giro: 0 },
  { forma: "triangulo", x: 28, y: 6, cor: "var(--cor-destaque)", atraso: 0.25, giro: 120 },
  { forma: "quadrado", x: 50, y: 12, cor: "var(--cor-secundaria)", atraso: 0.5, giro: -90 },
  { forma: "circulo", x: 92, y: 8, cor: "var(--cor-sucesso)", atraso: 0.15, giro: 0 },
  { forma: "triangulo", x: 112, y: 18, cor: "var(--cor-alerta)", atraso: 0.4, giro: -140 },
  { forma: "quadrado", x: 130, y: 6, cor: "var(--cor-primaria)", atraso: 0.65, giro: 100 },
  { forma: "circulo", x: 132, y: 44, cor: "var(--cor-destaque)", atraso: 0.35, giro: 0 },
  { forma: "quadrado", x: 6, y: 50, cor: "var(--cor-sucesso)", atraso: 0.55, giro: 80 },
];

function desenharPeca(peca: Peca) {
  if (peca.forma === "circulo") return <circle cx={0} cy={0} r={3} fill={peca.cor} />;
  if (peca.forma === "quadrado") return <rect x={-3} y={-3} width={6} height={6} rx={1} fill={peca.cor} />;
  return <path d="M0 -4 L3.6 2.6 L-3.6 2.6 Z" fill={peca.cor} />;
}

type Props = { animar: boolean };

export function Confete({ animar }: Props) {
  return (
    <g>
      {PECAS.map((peca) => (
        <g key={`${peca.x}-${peca.y}`} transform={`translate(${peca.x} ${peca.y})`}>
          <motion.g
            animate={
              animar
                ? { y: [0, 14, 0], rotate: [0, peca.giro || 180, 0], opacity: [1, 0.85, 1] }
                : undefined
            }
            transition={
              animar
                ? { duration: 1.6, repeat: Infinity, delay: peca.atraso, ease: "easeInOut" }
                : undefined
            }
          >
            {desenharPeca(peca)}
          </motion.g>
        </g>
      ))}
    </g>
  );
}
