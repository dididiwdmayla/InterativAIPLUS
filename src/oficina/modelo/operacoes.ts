import { bornes, CATALOGO } from './catalogo';
import type { Ligacao, Projeto, TipoLigacao } from './tipos';
export function tipoCompativel(p: Projeto, de: string, para: string, tipo: TipoLigacao): boolean {
  const a = p.pecas.find(c => c.id === de.split(':')[0]), b = p.pecas.find(c => c.id === para.split(':')[0]);
  if (!a || !b || de === para || !bornes(a).includes(de.split(':')[1]) || !bornes(b).includes(para.split(':')[1])) return false;
  if (p.area === 'eletrica') return tipo === 'fio';
  if (a.id === b.id) return false;
  if (tipo === 'eixo') return true;
  if (tipo === 'engrenamento') return a.tipo === 'engrenagem' && b.tipo === 'engrenagem';
  return (tipo === 'correia' || tipo === 'cruzada') && a.tipo === 'polia' && b.tipo === 'polia';
}
export function conectar(p: Projeto, de: string, para: string, tipo: TipoLigacao): Projeto {
  if (!tipoCompativel(p, de, para, tipo) || p.ligacoes.length >= 40 || p.ligacoes.some(l => (l.de === de && l.para === para) || (l.de === para && l.para === de))) return p;
  let n = 1; while (p.ligacoes.some(l => l.id === `l${n}`)) n++;
  const l: Ligacao = { id: `l${n}`, de, para, tipo, tensao: 70, avaria: false };
  return { ...p, ligacoes: [...p.ligacoes, l] };
}
function objeto(v: unknown): v is Record<string, unknown> { return typeof v === 'object' && v !== null && !Array.isArray(v); }
export function lerProjeto(v: unknown): Projeto | null {
  if (!objeto(v) || v.versao !== 1 || !['eletrica', 'mecanica'].includes(String(v.area)) || typeof v.nome !== 'string' || v.nome.length > 60 || !Array.isArray(v.pecas) || v.pecas.length > 16 || !Array.isArray(v.ligacoes) || v.ligacoes.length > 40) return null;
  const p: Projeto = { versao: 1, area: v.area as Projeto['area'], nome: v.nome, pecas: [], ligacoes: [], carga: typeof v.carga === 'number' && Number.isFinite(v.carga) ? Math.max(0, Math.min(50, v.carga)) : 5, obstrucao: v.obstrucao === true };
  for (const c of v.pecas) {
    if (!objeto(c) || typeof c.tipo !== 'string' || !Object.hasOwn(CATALOGO, c.tipo) || typeof c.id !== 'string' || !/^[a-z][a-z0-9_-]{0,19}$/.test(c.id) || p.pecas.some(a => a.id === c.id) || typeof c.tag !== 'string' || !/^[A-Z][A-Z0-9_-]{0,11}$/.test(c.tag) || p.pecas.some(a => a.tag === c.tag)) return null;
    const tipo = c.tipo as keyof typeof CATALOGO;
    if (CATALOGO[tipo].area !== p.area || (['fonte', 'motor', 'rolete'].includes(tipo) && p.pecas.some(a => a.tipo === tipo))) return null;
    if (typeof c.x !== 'number' || typeof c.y !== 'number' || !Number.isFinite(c.x) || !Number.isFinite(c.y) || typeof c.valor !== 'number' || !Number.isFinite(c.valor)) return null;
    const valor = tipo === 'fonte' ? 24 : ['lampada', 'bobina', 'motor-eletrico', 'disjuntor', 'interruptor', 'termico'].includes(tipo) ? CATALOGO[tipo].valor : Math.max(tipo === 'engrenagem' ? 10 : 20, Math.min(tipo === 'motor' ? 600 : 240, Math.round(c.valor)));
    p.pecas.push({ id: c.id, tag: c.tag, tipo, x: Math.max(65, Math.min(555, c.x)), y: Math.max(55, Math.min(445, c.y)), valor, nf: c.nf === true, avaria: c.avaria === true });
  }
  for (const l of v.ligacoes) {
    if (!objeto(l) || typeof l.id !== 'string' || !/^[a-z][a-z0-9_-]{0,19}$/.test(l.id) || p.ligacoes.some(a => a.id === l.id) || typeof l.de !== 'string' || typeof l.para !== 'string' || !['fio', 'eixo', 'engrenamento', 'correia', 'cruzada'].includes(String(l.tipo))) return null;
    const tipo = l.tipo as TipoLigacao;
    if (!tipoCompativel(p, l.de, l.para, tipo) || p.ligacoes.some(a => (a.de === l.de && a.para === l.para) || (a.para === l.de && a.de === l.para))) return null;
    p.ligacoes.push({ id: l.id, de: l.de, para: l.para, tipo, tensao: typeof l.tensao === 'number' && Number.isFinite(l.tensao) ? Math.max(0, Math.min(100, l.tensao)) : 70, avaria: l.avaria === true });
  }
  return p;
}
