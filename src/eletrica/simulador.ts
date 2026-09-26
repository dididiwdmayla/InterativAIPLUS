import { ENTRADAS_INICIAIS, pino, type Circuito, type Entradas, type Simulacao, type AcaoBancada } from './tipos';

function analisar(circuito: Circuito, entradas: Entradas, bobina: boolean) {
  const terminais = circuito.componentes.flatMap(c=>c.terminais.map(t=>pino(c.id,t.nome)));
  const pai = new Map(terminais.map(t=>[t,t]));
  function raiz(t: string): string { const r=pai.get(t); return r && r!==t ? raiz(r) : t; }
  function unir(a: string,b: string) { if(pai.has(a)&&pai.has(b))pai.set(raiz(a),raiz(b)); }
  circuito.conexoes.forEach(c=>unir(c.de,c.para));
  for(const c of circuito.componentes) {
    if(c.tipo==='disjuntor' && entradas.disjuntorLigado) unir(pino(c.id,'1'),pino(c.id,'2'));
    if(c.tipo==='termico' && !entradas.termicoDisparado) unir(pino(c.id,'95'),pino(c.id,'96'));
    if(c.tipo==='botoeira') {
      const acionada=c.retencao ? entradas.emergenciaTravada : entradas.pressionadas.includes(c.id);
      if(c.contato==='NA' ? acionada : !acionada) unir(pino(c.id,'1'),pino(c.id,'2'));
    }
    if(c.tipo==='contatora' && (c.contato==='NA' ? bobina : !bobina)) unir(pino(c.id,'13'),pino(c.id,'14'));
  }
  const positivo=raiz('fonte:+'), negativo=raiz('fonte:0');
  const curto=positivo===negativo;
  const valores=new Map<string,number>();
  // Antes de Q0, a fonte mantém tensão mesmo com o disjuntor aberto.
  // Um curto direto na fonte bloqueia sua saída no modelo didático.
  valores.set(positivo,curto ? 0 : circuito.tensao);
  valores.set(negativo,0);
  const cargas: [string,string][] = circuito.componentes.flatMap(c=>c.tipo==='contatora' ? [[raiz(pino(c.id,'A1')),raiz(pino(c.id,'A2'))] as [string,string]] : c.tipo==='lampada' ? [[raiz(pino(c.id,'1')),raiz(pino(c.id,'2'))] as [string,string]] : []);
  // Nós sem alimentação, ligados através de uma carga a um único potencial,
  // assumem esse potencial. Redes de cargas em série ficam indeterminadas:
  // não inventamos tensões analógicas que este modelo lógico não calcula.
  function potencial(r: string): number | null {
    if(valores.has(r))return valores.get(r)!;
    const visitados=new Set<string>(), fila=[r], encontrados=new Set<number>();
    while(fila.length) {
      const atual=fila.pop()!;
      if(visitados.has(atual))continue;
      visitados.add(atual);
      if(valores.has(atual)) { encontrados.add(valores.get(atual)!); continue; }
      for(const [a,b] of cargas) { if(a===atual)fila.push(b); if(b===atual)fila.push(a); }
    }
    return encontrados.size===1 ? [...encontrados][0] : null;
  }
  const potenciais=Object.fromEntries(terminais.map(t=>[t,potencial(raiz(t))]));
  function energizada(a: string,b: string) { const va=potenciais[a],vb=potenciais[b]; return typeof va==='number' && typeof vb==='number' && Math.abs(va-vb)===circuito.tensao; }
  return {curto,potenciais,bobina:energizada('q1:A1','q1:A2'),lampada:energizada('h1:1','h1:2')};
}

export function simular(circuito: Circuito, entradas: Entradas = ENTRADAS_INICIAIS, anterior?: Simulacao): Simulacao {
  let e={...entradas,pressionadas:[...entradas.pressionadas]}, bobina=anterior?.bobina ?? false;
  let disparado=anterior?.disjuntorDisparado ?? false, curto=false, oscilacao=false;
  const vistos=new Set<boolean>();
  let rede=analisar(circuito,e,bobina);
  for(let i=0;i<8;i++) {
    rede=analisar(circuito,e,bobina);
    if(rede.curto) { curto=true;disparado=true;e={...e,disjuntorLigado:false};bobina=false;rede=analisar(circuito,e,false);break; }
    if(rede.bobina===bobina)break;
    if(vistos.has(rede.bobina)) { oscilacao=true;bobina=false;rede=analisar(circuito,e,false);break; }
    vistos.add(bobina);bobina=rede.bobina;
  }
  return {entradas:e,bobina:!oscilacao&&bobina,motor:!oscilacao&&bobina&&e.disjuntorLigado&&!e.termicoDisparado,lampada:!oscilacao&&rede.lampada,curto:curto||(disparado&&!!anterior?.curto),oscilacao,disjuntorDisparado:disparado,potenciais:rede.potenciais,energizados:circuito.conexoes.filter(c=>rede.potenciais[c.de]===24&&rede.potenciais[c.para]===24).map(c=>c.id)};
}

export function atuar(circuito: Circuito, estado: Simulacao, acao: AcaoBancada): Simulacao {
  const e={...estado.entradas,pressionadas:[...estado.entradas.pressionadas]};
  if(acao.tipo==='pressionar'&&!e.pressionadas.includes(acao.id))e.pressionadas.push(acao.id);
  if(acao.tipo==='soltar')e.pressionadas=e.pressionadas.filter(id=>id!==acao.id);
  if(acao.tipo==='soltar-todas')e.pressionadas=[];
  if(acao.tipo==='termico')e.termicoDisparado=!e.termicoDisparado;
  if(acao.tipo==='emergencia')e.emergenciaTravada=true;
  if(acao.tipo==='rearmar-emergencia')e.emergenciaTravada=false;
  if(acao.tipo==='disjuntor')e.disjuntorLigado=!e.disjuntorLigado;
  return simular(circuito,e,acao.tipo==='disjuntor' ? {...estado,disjuntorDisparado:false,curto:false} : estado);
}
export function medir(estado: Simulacao, terminal: string, referencia='q1:A2'): number | null {
  const a=estado.potenciais[terminal],b=estado.potenciais[referencia];
  return typeof a==='number'&&typeof b==='number' ? a-b : null;
}
