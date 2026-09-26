import { circuitoInicial,S3 } from '../eletrica/inicial';
import { criarEditor } from '../eletrica/editor';
import type { Circuito,Conexao } from '../eletrica/tipos';
import { jogoInicial,type EstadoJogo } from '../motor/jogo';
export const CHAVE_PROGRESSO='interativai:progresso:v1';
function objeto(v:unknown):v is Record<string,unknown>{return typeof v==='object'&&v!==null&&!Array.isArray(v);}
function inteiro(v:unknown,min:number,max:number,padrao:number){return typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max?v:padrao;}
export function normalizarCircuito(v:unknown):Circuito{
  const base=circuitoInicial();
  if(!objeto(v)||v.versao!==1||!Array.isArray(v.componentes)||!Array.isArray(v.conexoes)||v.conexoes.length>50)return base;
  const lista=v.componentes.filter(objeto);
  if(lista.some(c=>c.id==='s3'))base.componentes.push(structuredClone(S3));
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
    if(!objeto(w)||typeof w.id!=='string'||!/^[a-zA-Z0-9_-]{1,40}$/.test(w.id)||ids.has(w.id)||typeof w.de!=='string'||typeof w.para!=='string'||!terminais.has(w.de)||!terminais.has(w.para)||w.de===w.para)return circuitoInicial();
    ids.add(w.id);
    const original=base.conexoes.find(f=>f.id===w.id&&f.de===w.de&&f.para===w.para);
    conexoes.push({id:w.id,de:w.de,para:w.para,...(original?.via?{via:original.via}:{})});
  }
  return{...base,conexoes};
}
export function desserializar(texto:string|null):EstadoJogo{
  const padrao=jogoInicial();
  if(!texto||texto.length>80000)return padrao;
  try{
    const p:unknown=JSON.parse(texto);if(!objeto(p)||p.versao!==1)return padrao;
    const segredo=p.segredo===true;
    const momento=['introducao','objetivo','feedback','conclusao'].includes(String(p.momento))?p.momento as EstadoJogo['momento']:'introducao';
    const estrelasPorFase:Record<string,number>={};
    if(objeto(p.estrelasPorFase))for(const [id,valor] of Object.entries(p.estrelasPorFase)){if(/^[a-z0-9-]{1,60}$/.test(id))estrelasPorFase[id]=inteiro(valor,1,3,1);}
    const editor=criarEditor(normalizarCircuito(p.circuito));
    if(typeof p.selecionado==='string'&&editor.circuito.componentes.some(c=>c.id===p.selecionado))editor.selecionado=p.selecionado;
    return{...padrao,editor,momento,objetivo:inteiro(p.objetivo,0,4,0),fala:inteiro(p.fala,0,2,0),degrau:inteiro(p.degrau,0,4,0) as EstadoJogo['degrau'],estrelas:inteiro(p.estrelas,1,3,3),tema:p.tema==='fliperama'?'fliperama':p.tema==='segredo'&&segredo?'segredo':'doce',som:p.som!==false,segredo,missao:p.missao===true,fasesConcluidas:Array.isArray(p.fasesConcluidas)?p.fasesConcluidas.filter((id):id is string=>typeof id==='string'&&/^[a-z0-9-]{1,60}$/.test(id)).slice(0,100):[],estrelasPorFase};
  }catch{return padrao;}
}
export function serializar(s:EstadoJogo){return JSON.stringify({versao:1,circuito:s.editor.circuito,selecionado:s.editor.selecionado,momento:s.momento,objetivo:s.objetivo,fala:s.fala,degrau:s.degrau,estrelas:s.estrelas,tema:s.tema,som:s.som,segredo:s.segredo,missao:s.missao,fasesConcluidas:s.fasesConcluidas,estrelasPorFase:s.estrelasPorFase});}
