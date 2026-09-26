import { S3 } from './inicial';
import type { Circuito, Contato } from './tipos';
export type Edicao = { tipo: 'conectar'; de: string; para: string } | {tipo:'desconectar';id:string} | {tipo:'tag';id:string;tag:string} | {tipo:'contato';id:string;contato:Contato} | {tipo:'inserir';conexaoId:string};
export function editar(c: Circuito, acao: Edicao): Circuito {
  if(acao.tipo==='conectar') {
    const terminais=new Set(c.componentes.flatMap(c=>c.terminais.map(t=>`${c.id}:${t.nome}`)));
    if(acao.de===acao.para||!terminais.has(acao.de)||!terminais.has(acao.para)||c.conexoes.some(w=>(w.de===acao.de&&w.para===acao.para)||(w.para===acao.de&&w.de===acao.para)))return c;
    let n=1;while(c.conexoes.some(w=>w.id===`fio-${n}`))n++;
    return {...c,conexoes:[...c.conexoes,{id:`fio-${n}`,de:acao.de,para:acao.para}]};
  }
  if(acao.tipo==='desconectar')return {...c,conexoes:c.conexoes.filter(w=>w.id!==acao.id)};
  if(acao.tipo==='tag') {
    const tag=acao.tag.trim().toUpperCase();
    if(!/^[A-Z][A-Z0-9_-]{0,11}$/.test(tag)||c.componentes.some(item=>item.id!==acao.id&&item.tag===tag))return c;
    return {...c,componentes:c.componentes.map(item=>item.id===acao.id ? {...item,tag} : item)};
  }
  if(acao.tipo==='contato')return {...c,componentes:c.componentes.map(item=>item.id===acao.id&&(item.tipo==='botoeira'||item.tipo==='contatora') ? {...item,contato:acao.contato} : item)};
  const fio=c.conexoes.find(w=>w.id===acao.conexaoId);
  if(!fio||c.componentes.some(item=>item.id==='s3'))return c;
  return {...c,componentes:[...c.componentes,structuredClone(S3)],conexoes:[...c.conexoes.filter(w=>w.id!==fio.id),{id:`${fio.id}-a`,de:fio.de,para:'s3:1'},{id:`${fio.id}-b`,de:'s3:2',para:fio.para}]};
}
export function adicionarSelo(c: Circuito): Circuito {
  return editar(editar(c,{tipo:'conectar',de:'q1:13',para:'s1:1'}),{tipo:'conectar',de:'q1:14',para:'s1:2'});
}
export function notacao(c: Circuito): string {
  const terminal=(t:string)=> { const [id,p]=t.split(':'); return `${c.componentes.find(item=>item.id===id)?.tag??id}.${p}`; };
  return ['// Circuito de comando · notação derivada',...c.componentes.filter(item=>item.tipo!=='motor').map(item=>`COMP ${item.tag} ${item.tipo.toUpperCase()}${item.contato ? ` contato=${item.contato}` : ''}`),'',...c.conexoes.map(w=>`${terminal(w.de)} -> ${terminal(w.para)}`)].join('\n');
}
