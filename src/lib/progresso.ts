import { circuitoInicial,S3 } from '../eletrica/inicial';
import { criarEditor } from '../eletrica/editor';
import type { Circuito,Conexao } from '../eletrica/tipos';
import { obterFase, FASES, faseLiberada } from '../conteudo/campanha';
import { simular } from '../eletrica/simulador';
import type { Fase } from '../motor/tipos';
import { jogoInicial,partidaInicial,guardarPartida,type Partida,type EstadoJogo } from '../motor/jogo';
export const CHAVE_PROGRESSO='interativai:progresso:v1';
function objeto(v:unknown):v is Record<string,unknown>{return typeof v==='object'&&v!==null&&!Array.isArray(v);}
function inteiro(v:unknown,min:number,max:number,padrao:number){return typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max?v:padrao;}
export function normalizarCircuito(v:unknown,base=circuitoInicial()):Circuito{
  const reserva=structuredClone(base);
  if(!objeto(v)||v.versao!==1||!Array.isArray(v.componentes)||!Array.isArray(v.conexoes)||v.conexoes.length>50)return base;
  const lista=v.componentes.filter(objeto);
  if(lista.some(c=>c.id==='s3')&&!base.componentes.some(c=>c.id==='s3'))base.componentes.push(structuredClone(S3));
  const tags=new Set<string>();
  base.componentes=base.componentes.map(c=>{
    const salvo=lista.find(p=>p.id===c.id);
    const tag=typeof salvo?.tag==='string'&&/^[A-Z][A-Z0-9_-]{0,11}$/.test(salvo.tag)&&!tags.has(salvo.tag)?salvo.tag:c.tag;
    tags.add(tag);
    const contato=salvo?.contato==='NA'||salvo?.contato==='NF'?salvo.contato:c.contato;
    return{...c,tag,contato:c.tipo==='botoeira'||c.tipo==='contatora'?contato:c.contato};
  });
  const terminais=new Set(base.componentes.flatMap(c=>c.terminais.map(t=>`${c.id}:${t.nome}`)));
  const ids=new Set<string>(),conexoes:Conexao[]=[];
  for(const w of v.conexoes){
    if(!objeto(w)||typeof w.id!=='string'||!/^[a-zA-Z0-9_-]{1,40}$/.test(w.id)||ids.has(w.id)||typeof w.de!=='string'||typeof w.para!=='string'||!terminais.has(w.de)||!terminais.has(w.para)||w.de===w.para)return reserva;
    ids.add(w.id);
    const original=base.conexoes.find(f=>f.id===w.id&&f.de===w.de&&f.para===w.para);
    conexoes.push({id:w.id,de:w.de,para:w.para,...(original?.via?{via:original.via}:{})});
  }
  return{...base,conexoes};
}

function lerPartida(p:Record<string,unknown>,fase:Fase):Partida{
  const base=partidaInicial(fase);
  const circuito=normalizarCircuito(p.circuito,base.editor.circuito);
  const editor=criarEditor(circuito),entradas=objeto(p.entradas)?p.entradas:null;
  const e=entradas?{pressionadas:[],disjuntorLigado:entradas.disjuntorLigado!==false,termicoDisparado:entradas.termicoDisparado===true,emergenciaTravada:entradas.emergenciaTravada===true}:base.editor.simulacao.entradas;
  editor.simulacao=simular(circuito,e,{...editor.simulacao,bobina:false,disjuntorDisparado:p.disjuntorDisparado===true,curto:p.curto===true});
  if(typeof p.selecionado==='string'&&circuito.componentes.some(c=>c.id===p.selecionado))editor.selecionado=p.selecionado;
  const momento=['introducao','objetivo','feedback','conclusao'].includes(String(p.momento))?p.momento as Partida['momento']:'introducao';
  return{...base,editor,momento,objetivo:inteiro(p.objetivo,0,fase.objetivos.length-1,0),fala:inteiro(p.fala,0,(momento==='conclusao'?fase.conclusao:fase.introducao).length-1,0),degrau:inteiro(p.degrau,0,4,0) as Partida['degrau'],estrelas:inteiro(p.estrelas,1,3,3),missao:p.missao===true};
}
export function desserializar(texto:string|null):EstadoJogo{
  const padrao=jogoInicial();
  if(!texto||texto.length>100000)return padrao;
  try{
    const p:unknown=JSON.parse(texto);if(!objeto(p)||(p.versao!==1&&p.versao!==2))return padrao;
    const ids=Array.isArray(p.fasesConcluidas)?p.fasesConcluidas:[];
    const fasesConcluidas=FASES.filter(f=>ids.includes(f.id)).map(f=>f.id);
    const fase=obterFase(typeof p.faseId==='string'&&faseLiberada(p.faseId,fasesConcluidas)?p.faseId:padrao.faseId);
    const segredo=p.segredo===true,estrelasPorFase:Record<string,number>={},partidas:Record<string,Partida>={};
    if(objeto(p.estrelasPorFase))for(const f of FASES)if(f.id in p.estrelasPorFase)estrelasPorFase[f.id]=inteiro(p.estrelasPorFase[f.id],1,3,1);
    if(objeto(p.partidas))for(const f of FASES){const salvo=p.partidas[f.id];if(objeto(salvo))partidas[f.id]=lerPartida(salvo,f);}
    return{...padrao,...lerPartida(p,fase),faseId:fase.id,partidas,tema:p.tema==='fliperama'?'fliperama':p.tema==='segredo'&&segredo?'segredo':'doce',som:p.som!==false,segredo,fasesConcluidas,estrelasPorFase};
  }catch{return padrao;}
}
function dados(s:Partida){return{circuito:s.editor.circuito,disjuntorDisparado:s.editor.simulacao.disjuntorDisparado,curto:s.editor.simulacao.curto,entradas:{...s.editor.simulacao.entradas,pressionadas:[]},selecionado:s.editor.selecionado,momento:s.momento,objetivo:s.objetivo,fala:s.fala,degrau:s.degrau,estrelas:s.estrelas,missao:s.missao};}
export function serializar(s:EstadoJogo){
  const partidas=Object.fromEntries(Object.entries({...s.partidas,[s.faseId]:guardarPartida(s)}).map(([id,p])=>[id,dados(p)]));
  return JSON.stringify({versao:2,...dados(s),faseId:s.faseId,partidas,tema:s.tema,som:s.som,segredo:s.segredo,fasesConcluidas:s.fasesConcluidas,estrelasPorFase:s.estrelasPorFase});
}
