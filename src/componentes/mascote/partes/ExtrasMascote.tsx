"use client";

import type { Expressao } from "@/motor/expressao";
import { BalaoPensamento } from "./BalaoPensamento";
import { BracoApontando, type DirecaoApontar } from "./BracoApontando";
import { Confete } from "./Confete";
import { GotaSuor } from "./GotaSuor";
import { ZzzSono } from "./ZzzSono";

type Props = {
  expressao: Expressao;
  direcao: DirecaoApontar;
  animar: boolean;
};

/** Enfeites fora da tela: balão, bracinho, confete, gota e Z z. */
export function ExtrasMascote({ expressao, direcao, animar }: Props) {
  switch (expressao) {
    case "pensativo":
      return <BalaoPensamento animar={animar} />;
    case "apontando":
      return <BracoApontando direcao={direcao} animar={animar} />;
    case "comemorando":
      return <Confete animar={animar} />;
    case "preocupado":
      return <GotaSuor animar={animar} />;
    case "dormindo":
      return <ZzzSono animar={animar} />;
    default:
      return null;
  }
}
