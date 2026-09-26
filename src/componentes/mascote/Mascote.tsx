"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMontado } from "@/lib/useMontado";
import type { Expressao } from "@/motor/expressao";
import type { DirecaoApontar } from "./partes/BracoApontando";
import { CorpoMonitor } from "./partes/CorpoMonitor";
import { ExtrasMascote } from "./partes/ExtrasMascote";
import { RostoMascote } from "./partes/RostoMascote";
import { usePiscar } from "./usePiscar";

type Props = {
  expressao?: Expressao;
  direcao?: DirecaoApontar;
  tamanho?: number;
  className?: string;
};

const PISCA_EM: readonly Expressao[] = ["feliz", "curioso", "pensativo", "apontando", "preocupado"];

const DESCRICAO: Record<Expressao, string> = {
  feliz: "sorrindo",
  curioso: "curioso, com uma sobrancelha levantada",
  pensativo: "pensando",
  apontando: "apontando",
  comemorando: "comemorando",
  preocupado: "preocupado",
  dormindo: "dormindo",
};

/** O computadorzinho: um monitor retrô fofo, 100% SVG. */
export function Mascote({ expressao = "feliz", direcao = "cima", tamanho = 120, className }: Props) {
  const reduzirMovimento = useReducedMotion() ?? false;
  // Só anima depois de montar: no servidor não dá para saber se a pessoa pediu
  // menos movimento, e o HTML da hidratação precisa ser igual dos dois lados.
  const montado = useMontado();
  const animar = montado && !reduzirMovimento;
  const piscando = usePiscar(animar && PISCA_EM.includes(expressao));

  const inclinacao = expressao === "curioso" ? -7 : 0;
  const pulando = expressao === "comemorando" && animar;

  return (
    <svg
      viewBox="0 0 140 130"
      width={tamanho}
      height={(tamanho * 130) / 140}
      className={className}
      role="img"
      aria-label={`Computadorzinho ${DESCRICAO[expressao]}`}
      overflow="visible"
    >
      <motion.g
        initial={false}
        animate={pulando ? { y: [0, -9, 0], rotate: inclinacao } : { y: 0, rotate: inclinacao }}
        transition={
          pulando
            ? { y: { duration: 0.55, repeat: Infinity, ease: "easeOut" }, rotate: { duration: 0.3 } }
            : { type: "spring", stiffness: 260, damping: 18 }
        }
        style={{ originX: 0.5, originY: 1 }}
      >
        <motion.g
          animate={animar ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={animar ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" } : undefined}
          style={{ originX: 0.5, originY: 1 }}
        >
          <CorpoMonitor />
          <AnimatePresence initial={false}>
            <motion.g
              key={`${expressao}-${direcao}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <RostoMascote expressao={expressao} piscando={piscando} direcao={direcao} />
            </motion.g>
          </AnimatePresence>
        </motion.g>
      </motion.g>
      <AnimatePresence initial={false}>
        <motion.g
          key={`${expressao}-${direcao}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
        >
          <ExtrasMascote expressao={expressao} direcao={direcao} animar={animar} />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
