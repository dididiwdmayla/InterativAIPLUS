import { FASE_1 } from '../conteudo/fase1';
import { ehExpressao } from '../motor/expressao';
import type { Fala } from '../motor/tipos';
export type Mensagem = { papel: 'aluno' | 'tutor'; texto: string };
export type EntradaTutor = {
  faseId: string; objetivoId: string; enunciado: string; degrauAtual: 0 | 1 | 2 | 3 | 4;
  circuitoAtual: string; pergunta: string; historico: Mensagem[];
};
export const SEM_SINAL: Fala = { texto: 'Estou sem sinal agora. Tenta o botão Me ajuda!', expressao: 'preocupado' };
const registro = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
export function lerEntrada(v: unknown): EntradaTutor | null {
  if (!registro(v) || v.faseId !== FASE_1.id) return null;
  const objetivo = FASE_1.objetivos.find(o => o.id === v.objetivoId);
  if (!objetivo || typeof v.pergunta !== 'string' || !v.pergunta.trim() || v.pergunta.length > 1000 ||
    typeof v.circuitoAtual !== 'string' || v.circuitoAtual.length > 10000 ||
    typeof v.degrauAtual !== 'number' || ![0, 1, 2, 3, 4].includes(v.degrauAtual) || !Array.isArray(v.historico)) return null;
  const historico: Mensagem[] = [];
  for (const m of v.historico.slice(-6)) {
    if (!registro(m) || (m.papel !== 'aluno' && m.papel !== 'tutor') || typeof m.texto !== 'string') return null;
    historico.push({ papel: m.papel, texto: m.texto.slice(0, 1000) });
  }
  return { faseId: FASE_1.id, objetivoId: objetivo.id, enunciado: objetivo.enunciado,
    degrauAtual: v.degrauAtual as EntradaTutor['degrauAtual'], circuitoAtual: v.circuitoAtual,
    pergunta: v.pergunta.trim(), historico };
}
function textoCurto(texto: string): string {
  const limpo = texto.replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\u200d\ufe0f\u20e3]/gu, '').replace(/[*#`]/g, '').trim();
  return (limpo.match(/[^.!?]+[.!?]*(?:\s|$)/g)?.slice(0, 3).join('').trim() || limpo).slice(0, 700);
}
export function lerResposta(texto: string | undefined): Fala {
  if (!texto?.trim()) return SEM_SINAL;
  const limpo = texto.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    const v: unknown = JSON.parse(limpo);
    if (!registro(v) || typeof v.texto !== 'string' || !v.texto.trim()) return SEM_SINAL;
    return { texto: textoCurto(v.texto), expressao: ehExpressao(v.expressao) ? v.expressao : 'feliz' };
  } catch {
    // JSON truncado não deve aparecer como uma fala. Texto puro continua legível.
    return /^[{[]/.test(limpo) ? SEM_SINAL : { texto: textoCurto(limpo), expressao: 'feliz' };
  }
}
