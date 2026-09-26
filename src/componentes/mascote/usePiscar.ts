"use client";

import { useEffect, useState } from "react";

const DURACAO_PISCADA_MS = 140;

/** Pisca em intervalos aleatórios de 3 a 6 segundos enquanto estiver ativo. */
export function usePiscar(ativo: boolean): boolean {
  const [piscando, setPiscando] = useState(false);

  useEffect(() => {
    if (!ativo) return;
    let temporizador: ReturnType<typeof setTimeout>;
    let cancelado = false;

    const agendar = () => {
      const espera = 3000 + Math.random() * 3000;
      temporizador = setTimeout(() => {
        if (cancelado) return;
        setPiscando(true);
        temporizador = setTimeout(() => {
          if (cancelado) return;
          setPiscando(false);
          agendar();
        }, DURACAO_PISCADA_MS);
      }, espera);
    };

    agendar();
    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [ativo]);

  return ativo && piscando;
}
