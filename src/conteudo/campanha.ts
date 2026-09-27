import { FASE_1 } from './fase1';
import { FASE_2 } from './fase2';
import { FASE_3 } from './fase3';
export const FASES = [FASE_1, FASE_2, FASE_3];
export function obterFase(id: string) { return FASES.find(f => f.id === id) ?? FASE_1; }
export function faseLiberada(id: string, concluidas: string[]) {
  const i = FASES.findIndex(f => f.id === id);
  return i === 0 || (i > 0 && concluidas.includes(FASES[i - 1].id));
}
