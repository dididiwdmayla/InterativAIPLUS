import { lerProjeto } from './operacoes';
import type { ArquivoOficina, Sessao } from './tipos';
export const CHAVE_OFICINA = 'interativai:oficina:v1';
export function arquivoVazio(): ArquivoOficina { return { versao:1, sessoes:{}, tema:'doce', som:true }; }
export function restaurar(texto: string | null): ArquivoOficina {
  const base = arquivoVazio(); if (!texto || texto.length > 600000) return base;
  try {
    const v: unknown = JSON.parse(texto); if (typeof v !== 'object' || v === null || !('versao' in v) || v.versao !== 1 || !('sessoes' in v) || typeof v.sessoes !== 'object' || v.sessoes === null) return base;
    if ('tema' in v && v.tema === 'fliperama') base.tema = 'fliperama'; if ('som' in v) base.som = v.som !== false;
    for (const [id,salvo] of Object.entries(v.sessoes as Record<string, unknown>).slice(0,12)) {
      if (!/^[a-z-]{1,30}$/.test(id) || typeof salvo !== 'object' || salvo === null) continue;
      const s = salvo as Record<string, unknown>;
      const p = lerProjeto(s.projeto); if (!p) continue;
      const sessao: Sessao = { projeto:p,observou:s.observou===true,alterou:s.alterou===true,concluida:s.concluida===true,ajuda:typeof s.ajuda === 'number' && Number.isInteger(s.ajuda)?Math.max(0,Math.min(3,s.ajuda)):0,medicoes:[] };
      if (Array.isArray(s.medicoes)) sessao.medicoes = s.medicoes.slice(-6).filter((m: unknown): m is Sessao['medicoes'][number] => typeof m === 'object' && m !== null && 'ponto' in m && 'valor' in m && typeof m.ponto === 'string' && m.ponto.length < 40 && typeof m.valor === 'string' && m.valor.length < 60);
      base.sessoes[id] = sessao;
    }
    return base;
  } catch { return base; }
}
