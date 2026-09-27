import { bornes } from './catalogo';
import type { Eletrica, Entradas, Projeto } from './tipos';
export function calcularEletrica(p: Projeto, e: Entradas): Eletrica {
  const ids = p.pecas.flatMap(c => bornes(c).map(b => `${c.id}:${b}`));
  const pai = new Map(ids.map(id => [id, id]));
  function raiz(id: string): string { const r = pai.get(id); if (!r || r === id) return id; const v = raiz(r); pai.set(id, v); return v; }
  function unir(a: string, b: string) { if (pai.has(a) && pai.has(b)) pai.set(raiz(a), raiz(b)); }
  p.ligacoes.forEach(l => unir(l.de, l.para));
  for (const c of p.pecas) {
    const bs = bornes(c), ativa = e.atuadas.includes(c.id);
    const fecha = c.tipo === 'disjuntor' ? !e.disparado : c.tipo === 'termico' ? !c.avaria : c.tipo === 'interruptor' ? (c.nf ? !ativa : ativa) : false;
    if (fecha) unir(`${c.id}:${bs[0]}`, `${c.id}:${bs[1]}`);
  }
  const fonte = p.pecas.find(c => c.tipo === 'fonte');
  if (fonte && e.perturbacao) p.ligacoes.filter(l => l.avaria).forEach(l => unir(l.de, `${fonte.id}:0`));
  const plus = fonte ? raiz(`${fonte.id}:+`) : '', zero = fonte ? raiz(`${fonte.id}:0`) : '';
  const curto = !!fonte && plus === zero && e.ligada;
  const energia = e.ligada && !e.disparado && !curto && !!fonte;
  const cargas = p.pecas.filter(c => ['lampada', 'bobina', 'motor-eletrico'].includes(c.tipo));
  const resistores = cargas.map(c => { const bs = bornes(c); return { c, a: raiz(`${c.id}:${bs[0]}`), b: raiz(`${c.id}:${bs[1]}`), g: 1 / c.valor }; });
  const fixos = new Map<string, number>(); if (fonte) { fixos.set(plus, energia ? 24 : 0); fixos.set(zero, 0); }
  // Só nós alcançáveis por uma carga/condutor até a fonte têm referência de potencial.
  const alcancaveis = new Set(fixos.keys()); let mudou = true;
  while (mudou) { mudou = false; for (const r of resistores) if (alcancaveis.has(r.a) || alcancaveis.has(r.b)) for (const id of [r.a, r.b]) if (!alcancaveis.has(id)) { alcancaveis.add(id); mudou = true; } }
  const incognitas = [...new Set(ids.map(raiz))].filter(id => !fixos.has(id) && alcancaveis.has(id));
  const matriz = incognitas.map(() => Array<number>(incognitas.length + 1).fill(0));
  for (const r of resistores) for (const [a, b] of [[r.a, r.b], [r.b, r.a]]) {
    const i = incognitas.indexOf(a); if (i < 0 || a === b) continue;
    matriz[i][i] += r.g; const j = incognitas.indexOf(b);
    if (j >= 0) matriz[i][j] -= r.g; else matriz[i][incognitas.length] += r.g * (fixos.get(b) ?? 0);
  }
  for (let k = 0; k < incognitas.length; k++) {
    let pivot = k; for (let i = k + 1; i < incognitas.length; i++) if (Math.abs(matriz[i][k]) > Math.abs(matriz[pivot][k])) pivot = i;
    [matriz[k], matriz[pivot]] = [matriz[pivot], matriz[k]];
    const d = matriz[k][k]; if (Math.abs(d) < 1e-10) continue;
    for (let j = k; j <= incognitas.length; j++) matriz[k][j] /= d;
    for (let i = 0; i < incognitas.length; i++) if (i !== k) { const f = matriz[i][k]; for (let j = k; j <= incognitas.length; j++) matriz[i][j] -= f * matriz[k][j]; }
  }
  incognitas.forEach((id, i) => fixos.set(id, matriz[i][incognitas.length]));
  const potenciais = Object.fromEntries(ids.map(id => [id, fixos.get(raiz(id)) ?? null]));
  const volts = Object.fromEntries(resistores.map(r => [r.c.id, Math.abs((fixos.get(r.a) ?? 0) - (fixos.get(r.b) ?? 0))]));
  let corrente = 0; for (const r of resistores) { if (r.a === plus) corrente += ((fixos.get(r.a) ?? 0) - (fixos.get(r.b) ?? 0)) * r.g; if (r.b === plus) corrente += ((fixos.get(r.b) ?? 0) - (fixos.get(r.a) ?? 0)) * r.g; }
  const sobrecarga = corrente > 8;
  const mensagem = !fonte ? 'Adicione uma fonte para alimentar sua montagem.' : e.disparado ? 'A proteção abriu. Desenergize, encontre a causa e rearme para repetir o teste.' : curto ? 'Caminho direto entre +24 V e retorno. A proteção da bancada vai abrir.' : sobrecarga ? 'A corrente ultrapassou o limite didático de 8 A.' : !e.ligada ? 'Bancada desenergizada. Monte e inspecione à vontade.' : Object.values(volts).some(v => v > 18) ? 'Alimentação chegando à carga. Compare antes e depois de acionar o comando.' : 'A fonte está ligada, mas a carga não recebe tensão suficiente. Siga o caminho com a sonda.';
  return { curto, sobrecarga, potenciais, cargas: volts, corrente, mensagem };
}
