"use client";

import type { Expressao } from "@/motor/expressao";
import { Bochechas } from "./Bochechas";
import type { DirecaoApontar } from "./BracoApontando";
import { OlhosRedondos } from "./OlhosRedondos";

type Props = {
  expressao: Expressao;
  piscando: boolean;
  direcao: DirecaoApontar;
};

const TRACO = {
  fill: "none",
  stroke: "var(--cor-mascote-rosto)",
  strokeWidth: 3.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const DESLOCAMENTO_OLHAR: Record<DirecaoApontar, { x: number; y: number }> = {
  esquerda: { x: -4, y: 0 },
  direita: { x: 4, y: 0 },
  cima: { x: -2, y: -4 },
};

/** Olhos e boca desenhados na tela do monitor, no estilo :) */
export function RostoMascote({ expressao, piscando, direcao }: Props) {
  switch (expressao) {
    case "feliz":
      return (
        <g>
          <OlhosRedondos esquerdo={{ x: 57, y: 57 }} direito={{ x: 83, y: 57 }} raio={5.5} piscando={piscando} />
          <path d="M59 69 Q70 79 81 69" {...TRACO} />
          <Bochechas />
        </g>
      );
    case "curioso":
      return (
        <g>
          <OlhosRedondos
            esquerdo={{ x: 57, y: 58 }}
            direito={{ x: 83, y: 57 }}
            raio={7.5}
            piscando={piscando}
            brilho
          />
          <path d="M75 44 Q83 38 91 43" {...TRACO} strokeWidth={3} />
          <path d="M50 47 L63 47" {...TRACO} strokeWidth={3} />
          <circle cx="70" cy="75" r="3.4" {...TRACO} strokeWidth={3} />
        </g>
      );
    case "pensativo":
      return (
        <g>
          <OlhosRedondos esquerdo={{ x: 61, y: 54 }} direito={{ x: 87, y: 54 }} raio={5} piscando={piscando} />
          <path d="M62 73 L78 73" {...TRACO} />
        </g>
      );
    case "apontando": {
      const olhar = DESLOCAMENTO_OLHAR[direcao];
      return (
        <g>
          <OlhosRedondos
            esquerdo={{ x: 57 + olhar.x, y: 57 + olhar.y }}
            direito={{ x: 83 + olhar.x, y: 57 + olhar.y }}
            raio={5.5}
            piscando={piscando}
          />
          <path d="M61 70 Q70 77 79 70" {...TRACO} />
          <Bochechas />
        </g>
      );
    }
    case "comemorando":
      return (
        <g>
          <path d="M50 60 L57 53 L64 60" {...TRACO} />
          <path d="M76 60 L83 53 L90 60" {...TRACO} />
          <path d="M58 66 Q70 86 82 66 Z" fill="var(--cor-mascote-rosto)" stroke="var(--cor-mascote-rosto)" strokeWidth={2} strokeLinejoin="round" />
          <ellipse cx="70" cy="76" rx="5.5" ry="3" fill="var(--cor-mascote-bochecha)" />
          <Bochechas />
        </g>
      );
    case "preocupado":
      return (
        <g>
          <OlhosRedondos esquerdo={{ x: 57, y: 59 }} direito={{ x: 83, y: 59 }} raio={5} piscando={piscando} />
          <path d="M49 50 L62 46" {...TRACO} strokeWidth={3} />
          <path d="M78 46 L91 50" {...TRACO} strokeWidth={3} />
          <path d="M57 76 q3.25 -4 6.5 0 t6.5 0 t6.5 0 t6.5 0" {...TRACO} strokeWidth={3} />
        </g>
      );
    case "dormindo":
      return (
        <g>
          <path d="M50 58 Q57 64 64 58" {...TRACO} />
          <path d="M76 58 Q83 64 90 58" {...TRACO} />
          <ellipse cx="70" cy="74" rx="3" ry="2.2" {...TRACO} strokeWidth={2.6} />
        </g>
      );
  }
}
