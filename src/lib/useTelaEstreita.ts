'use client';
import { useSyncExternalStore } from 'react';
const consulta = '(max-width: 600px)';
const assinar = (avisar: () => void) => {
  const media = window.matchMedia(consulta);
  media.addEventListener('change', avisar);
  return () => media.removeEventListener('change', avisar);
};
export function useTelaEstreita() {
  return useSyncExternalStore(assinar, () => window.matchMedia(consulta).matches, () => false);
}
