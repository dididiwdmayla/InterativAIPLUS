'use client';
import { useState } from 'react';
import { useJogo } from '@/motor/useJogo';
import { FASE_1 } from '@/conteudo/fase1';
import type { AcaoJogo } from '@/motor/jogo';
import { BarraSuperior } from './BarraSuperior';
import { PainelEletrico } from './PainelEletrico';
import { Bancada } from './Bancada';
import { ListaObjetivos } from './ListaObjetivos';
import { GuiaFase } from './GuiaFase';
import { Conclusao } from './Conclusao';
import { Confirmacao } from './Confirmacao';
import { Icone } from './Icone';
import { CampoTutor } from './CampoTutor';
import type { Fala } from '@/motor/tipos';
import { useSons } from '@/som/useSons';
import { PainelNotacao } from './PainelNotacao';
export function Jogo(){
  const {estado,enviar}=useJogo();
  useSons(estado);
  const [falaTutor,setFalaTutor]=useState<Fala|null>(null);
  const [destacado,setDestacado]=useState<string|null>(null),[reset,setReset]=useState(false),[aba,setAba]=useState<'painel'|'bancada'>('painel');
  function acao(a:AcaoJogo){setFalaTutor(null);enviar(a);if(a.tipo==='avancar'&&estado.momento==='feedback'){if(estado.objetivo===1)setAba('bancada');if(estado.objetivo===2)setAba('painel');}}
  const destaque=estado.degrau===3&&estado.momento==='objetivo'?FASE_1.objetivos[estado.objetivo].ajudas.linha.alvo:undefined;
  if(!estado.carregado)return <main className="carregando" aria-live="polite">Preparando sua bancada...</main>;
  return <><BarraSuperior tema={estado.tema} mudarTema={tema=>acao({tipo:'tema',tema})} som={estado.som} mudarSom={()=>acao({tipo:'som'})} estrelas={estado.estrelas} segredo={estado.segredo}/><main className="jogo"><div className="cabecalho-fase"><div><span className="sobretitulo">SUA PRIMEIRA MISSÃO</span><h1>O painel é seu<span>.</span></h1><p>A esteira parou. A próxima fornada depende de você.</p></div><div className="selo-fase"><Icone nome="raio"/><span>Ilha Elétrica<strong>Comandos · 01</strong></span></div></div><ListaObjetivos estado={estado}/>{estado.momento==='conclusao'&&<Conclusao estado={estado} enviar={acao}/>}<div className="abas-moveis" role="tablist" aria-label="Área de trabalho"><button role="tab" aria-selected={aba==='painel'} aria-controls="area-painel" onClick={()=>setAba('painel')}>Painel</button><button role="tab" aria-selected={aba==='bancada'} aria-controls="area-bancada" onClick={()=>setAba('bancada')}>Bancada<span>{estado.editor.simulacao.motor?' · ligada':''}</span></button></div><div className={`area-jogo aba-${aba}`}><div id="area-painel" className="coluna-painel"><PainelEletrico editor={estado.editor} enviar={a=>acao({tipo:'editor',acao:a})} hover={setDestacado} editavel={estado.objetivo>=3} destaque={destaque}/></div><div id="area-bancada" className={`coluna-bancada ${destaque==='bancada-s1'?'alvo-ajuda':''}`}><Bancada circuito={estado.editor.circuito} estado={estado.editor.simulacao} destacado={destacado} atuar={a=>acao({tipo:'editor',acao:{tipo:'atuar',acao:a}})}/></div></div><GuiaFase estado={estado} enviar={acao} falaTutor={falaTutor}><CampoTutor key={`${estado.momento}-${estado.objetivo}`} estado={estado} falar={setFalaTutor} descobrir={()=>{enviar({tipo:'segredo'});setFalaTutor({texto:'Você me achou por dentro! O tema Segredo é seu. Essa curiosidade vai te levar longe.',expressao:'comemorando'});}}/></GuiaFase>{estado.momento==='conclusao'&&<PainelNotacao circuito={estado.editor.circuito}/>}<div className="rodape-jogo"><span>{estado.salvamentoFalhou?'Seu navegador não permitiu salvar. A fase continua funcionando nesta sessão.':'Seu progresso fica salvo neste navegador.'}</span><button onClick={()=>setReset(true)}>Recomeçar fase</button></div></main><Confirmacao aberta={reset} titulo="Recomeçar a fase?" texto="Seu circuito e os objetivos voltam ao início. Seu tema e as conquistas anteriores ficam guardados." cancelar={()=>setReset(false)} confirmar={()=>{setReset(false);setAba('painel');acao({tipo:'recomecar'});}}/></>;
}
