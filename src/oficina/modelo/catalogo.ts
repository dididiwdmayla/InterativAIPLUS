import type { Area, Peca, Projeto, TipoPeca } from './tipos';
export const CATALOGO: Record<TipoPeca, { nome: string; prefixo: string; area: Area; valor: number; descricao: string }> = {
  fonte: { nome: 'Fonte 24 V', prefixo: 'U', area: 'eletrica', valor: 24, descricao: 'Alimenta o circuito em corrente contínua. Um polo + e um retorno 0 V.' },
  disjuntor: { nome: 'Disjuntor', prefixo: 'Q', area: 'eletrica', valor: 8, descricao: 'Abre o comando quando a bancada detecta um curto ou sobrecorrente.' },
  interruptor: { nome: 'Contato NA/NF', prefixo: 'S', area: 'eletrica', valor: 0, descricao: 'NA abre em repouso; NF fecha em repouso. Acione no teste para comparar.' },
  termico: { nome: 'Relé térmico', prefixo: 'F', area: 'eletrica', valor: 0, descricao: 'Seu contato NF abre após o disparo. Investigue a causa antes de rearmar.' },
  bobina: { nome: 'Bobina', prefixo: 'K', area: 'eletrica', valor: 120, descricao: 'Carga de comando entre A1 e A2. A tensão faz a contatora puxar.' },
  lampada: { nome: 'Lâmpada 24 V', prefixo: 'H', area: 'eletrica', valor: 24, descricao: 'Transforma energia em luz. O modelo usa uma resistência equivalente fixa.' },
  'motor-eletrico': { nome: 'Motor CC', prefixo: 'M', area: 'eletrica', valor: 48, descricao: 'Carga didática de 24 V. Gira quando recebe alimentação; sem modelo eletromagnético.' },
  motor: { nome: 'Motor de acionamento', prefixo: 'M', area: 'mecanica', valor: 120, descricao: 'Fonte de rotação. Ajuste a rotação livre em rpm. Torque máximo didático de 2 N·m.' },
  engrenagem: { nome: 'Engrenagem', prefixo: 'E', area: 'mecanica', valor: 20, descricao: 'Dentes transmitem movimento sem patinar. Duas engrenagens externas invertem o sentido.' },
  polia: { nome: 'Polia', prefixo: 'P', area: 'mecanica', valor: 80, descricao: 'Diâmetro em mm. Correia aberta mantém o sentido; cruzada inverte.' },
  rolete: { nome: 'Rolete da esteira', prefixo: 'R', area: 'mecanica', valor: 160, descricao: 'Saída da transmissão. Converte rotação em movimento linear da esteira.' },
};
export function bornes(p: Peca): string[] {
  if (CATALOGO[p.tipo].area === 'mecanica') return ['eixo'];
  if (p.tipo === 'fonte') return ['+', '0'];
  if (p.tipo === 'bobina') return ['A1', 'A2'];
  if (p.tipo === 'termico') return ['95', '96'];
  return ['1', '2'];
}
export function peca(tipo: TipoPeca, id: string, x: number, y: number, valor = CATALOGO[tipo].valor): Peca {
  return { id, tipo, tag: id.toUpperCase(), x, y, valor, nf: tipo === 'termico', avaria: false };
}
export function vazio(area: Area): Projeto { return { versao: 1, area, nome: area === 'eletrica' ? 'Meu circuito' : 'Minha transmissão', pecas: [], ligacoes: [], carga: 5, obstrucao: false }; }
export function adicionar(projeto: Projeto, tipo: TipoPeca): Projeto {
  if (CATALOGO[tipo].area !== projeto.area || projeto.pecas.length >= 16 || (['fonte', 'motor', 'rolete'].includes(tipo) && projeto.pecas.some(p => p.tipo === tipo))) return projeto;
  let n = 1; const prefixo = CATALOGO[tipo].prefixo.toLowerCase();
  while (projeto.pecas.some(p => p.id === `${prefixo}${n}`)) n++;
  const vagas = Array.from({ length: 20 }, (_, i) => ({ x: 90 + (i % 4) * 145, y: 70 + Math.floor(i / 4) * 100 }));
  const ponto = vagas.find(v => !projeto.pecas.some(p => Math.hypot(p.x - v.x, p.y - v.y) < 65)) ?? vagas[0];
  return { ...projeto, pecas: [...projeto.pecas, peca(tipo, `${prefixo}${n}`, ponto.x, ponto.y)] };
}
