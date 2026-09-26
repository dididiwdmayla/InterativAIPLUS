"use client";

import { useSyncExternalStore } from "react";

const assinarNada = () => () => {};

/**
 * Falso no servidor e durante a hidratação; verdadeiro depois. Serve para
 * o que depende do navegador (como "menos movimento") não mudar o HTML da
 * hidratação.
 */
export function useMontado(): boolean {
  return useSyncExternalStore(
    assinarNada,
    () => true,
    () => false,
  );
}
