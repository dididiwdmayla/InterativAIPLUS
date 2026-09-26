'use client';
import { useState } from 'react';
import { FASE_1 } from '@/conteudo/fase1';
import { falaAtual,type EstadoJogo,type AcaoJogo } from '@/motor/jogo';
import { Mascote } from './mascote/Mascote';
import { Icone } from './Icone';
import { Confirmacao } from './Confirmacao';
import type { Fala } from '@/motor/tipos';
export function GuiaFase({estado,enviar,falaTutor,children}:{estado:EstadoJogo;enviar:(a:AcaoJogo)=>void;falaTutor?:Fala|null;children?:React.ReactNode}){
  const [confirmacao,setConfirmacao]=useState(false);
  const fala=estado.editor.simulacao.curto?falaAtual(FASE_1,estado):falaTutor??falaAtual(FASE_1,estado);
  const avancar=estado.momento==='introducao'||estado.momento==='feedback'||(estado.momento==='conclusao'&&estado.fala<FASE_1.conclusao.length-1);
  return <section className="guia-fase" aria-label="Computadorzinho e ajuda"><div className="faixa-mascote"><Mascote expressao={fala.expressao} tamanho={94}/><div className="balao"><span className="sobretitulo">{estado.momento==='feedback'?'BOA! MAIS UMA DESCOBERTA':'COMPUTADORZINHO'}</span><p aria-live="polite">{fala.texto}</p></div><div className="acoes-guia">{avancar&&<button className="botao primario" onClick={()=>enviar({tipo:'avancar'})}>{estado.momento==='feedback'?estado.objetivo===4?'Ver conquista':'Próximo objetivo':estado.momento==='introducao'&&estado.fala===2?'Vamos começar':'Continuar'}<Icone nome="seta" tamanho={17}/></button>}{estado.momento==='objetivo'&&<><button className="botao" onClick={()=>estado.degrau>=3?setConfirmacao(true):enviar({tipo:'ajuda'})}>Me ajuda<small>{Math.min(4,estado.degrau+1)}/4</small></button><span className="nota-ajuda">Perguntar faz parte.</span></>}</div></div>{children}<Confirmacao aberta={confirmacao} titulo="Ver a solução?" texto={estado.estrelas>1?'Isso custa 1 estrela. O computadorzinho aplica a solução e explica o que mudou.':'Você já está com a estrela mínima. Posso aplicar a solução e explicar sem tirar sua última estrela.'} cancelar={()=>setConfirmacao(false)} confirmar={()=>{setConfirmacao(false);enviar({tipo:'solucao'});}}/></section>;
}
