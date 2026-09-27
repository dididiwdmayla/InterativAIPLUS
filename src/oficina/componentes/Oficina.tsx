'use client';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { arquivoVazio, CHAVE_OFICINA, restaurar } from '../modelo/progresso';
import { iniciar, ORDENS } from '../modelo/ordens';
import { vazio } from '../modelo/catalogo';
import type { Area, ArquivoOficina, Sessao } from '../modelo/tipos';
import { configurarSom, prepararSom, tocarSom } from '@/som/audio';
import { IconeOficina } from './IconeOficina';
import { EntradaOficina } from './EntradaOficina';
import { CentralOficina } from './CentralOficina';
import { BancadaOficina } from './BancadaOficina';
type Estado = { arquivo:ArquivoOficina; carregado:boolean; falhou:boolean };
type Acao = { tipo:'carregar';arquivo:ArquivoOficina } | { tipo:'salvar';id:string;sessao:Sessao } | {tipo:'tema'|'som'|'falhou'};
function reduzir(s:Estado,a:Acao):Estado {
 if(a.tipo==='carregar')return {...s,arquivo:a.arquivo,carregado:true};
 if(a.tipo==='falhou')return s.falhou?s:{...s,falhou:true};
 if(a.tipo==='salvar')return s.arquivo.sessoes[a.id]===a.sessao?s:{...s,arquivo:{...s.arquivo,sessoes:{...s.arquivo.sessoes,[a.id]:a.sessao}}};
 return {...s,arquivo:{...s.arquivo,...(a.tipo==='tema'?{tema:s.arquivo.tema==='doce'?'fliperama':'doce'}:{som:!s.arquivo.som})}};
}
export function Oficina(){
 const [s,dispatch]=useReducer(reduzir,{arquivo:arquivoVazio(),carregado:false,falhou:false});
 const [area,setArea]=useState<Area|null>(null),[id,setId]=useState<string|null>(null);
 useEffect(()=>{try{dispatch({tipo:'carregar',arquivo:restaurar(localStorage.getItem(CHAVE_OFICINA))});}catch{dispatch({tipo:'carregar',arquivo:arquivoVazio()});dispatch({tipo:'falhou'});}},[]);
 useEffect(()=>{if(!s.carregado)return;document.documentElement.dataset.theme=s.arquivo.tema;configurarSom(s.arquivo.som);try{localStorage.setItem(CHAVE_OFICINA,JSON.stringify(s.arquivo));}catch{dispatch({tipo:'falhou'});}},[s.arquivo,s.carregado]);
 const salvar=useCallback((sessao:Sessao)=>{if(id)dispatch({tipo:'salvar',id,sessao});},[id]);
 const ordem=ORDENS.find(o=>o.id===id);
 function abrir(novo:string){setId(novo);window.scrollTo({top:0});}
 function voltar(){if(id)setId(null);else setArea(null);window.scrollTo({top:0});}
 return <MotionConfig reducedMotion="user"><div className={`oficina ${area?`of-${area}`:''}`} onPointerDown={e=>{prepararSom();if((e.target as Element).closest('button'))tocarSom('clique');}}><header className="of-cabecalho"><button className="of-marca" onClick={()=>{setArea(null);setId(null);}} aria-label="Início da oficina"><span className="of-marca-simbolo"><IconeOficina nome="mecanica" tamanho={27}/></span><span>InterativAI<small>OFICINA</small></span></button><div className="of-caminho">{area?<button onClick={voltar}><IconeOficina nome="voltar"/>{id?'Ordens de serviço':'Trocar área'}</button>:<span>EXPERIMENTAR É APRENDER</span>}</div><div className="of-preferencias"><button onClick={()=>dispatch({tipo:'tema'})} aria-label="Trocar tema">{s.arquivo.tema==='doce'?'Doce':'Fliperama'}</button><button onClick={()=>dispatch({tipo:'som'})} aria-label={s.arquivo.som?'Desativar som':'Ativar som'}><IconeOficina nome={s.arquivo.som?'som':'mudo'}/></button></div></header>
 {!s.carregado?<p className="of-carregando">Abrindo a oficina...</p>:!area?<EntradaOficina escolher={a=>{setArea(a);window.scrollTo({top:0});}}/>:!id?<CentralOficina area={area} arquivo={s.arquivo} abrir={abrir}/>:<BancadaOficina key={id} id={id} area={area} ordem={ordem} inicial={s.arquivo.sessoes[id]??iniciar(ordem?.projeto??vazio(area))} salvar={salvar} voltar={()=>setId(null)}/>}
 <footer className="of-rodape"><b>InterativAI Oficina</b><span>{s.falhou?'O navegador não permitiu salvar. Exporte seu projeto para guardar.':'Faça. Entenda. Leve a descoberta com você.'}</span><span>ELÉTRICA + MECÂNICA</span></footer></div></MotionConfig>;
}
