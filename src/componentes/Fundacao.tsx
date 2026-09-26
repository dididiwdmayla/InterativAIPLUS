'use client';
import { Bancada } from './Bancada';
import { Mascote } from './mascote/Mascote';
import { useState, useReducer, useEffect } from 'react';
import { BarraSuperior, type Tema } from './BarraSuperior';
import { PainelEletrico } from './PainelEletrico';
import { criarEditor, reduzirEditor } from '@/eletrica/editor';
import { Icone } from './Icone';
export function Fundacao() {
  const [tema, setTema] = useState<Tema>('doce');
  const [som, setSom] = useState(true);
  const [editor,enviar] = useReducer(reduzirEditor,undefined,()=>criarEditor());
  const [destacado,setDestacado] = useState<string|null>(null);
  useEffect(()=>{const soltar=()=>enviar({tipo:'atuar',acao:{tipo:'soltar-todas'}});window.addEventListener('blur',soltar);return()=>window.removeEventListener('blur',soltar);},[]);
  return <><BarraSuperior tema={tema} mudarTema={t=>{setTema(t);document.documentElement.dataset.theme=t;}} som={som} mudarSom={()=>setSom(!som)}/><main className="jogo"><div className="cabecalho-fase"><div><span className="sobretitulo">SUA PRIMEIRA MISSÃO</span><h1>O painel é seu<span>.</span></h1><p>A esteira parou. A próxima fornada depende de você.</p></div><div className="selo-fase"><Icone nome="raio"/><span>Ilha Elétrica<strong>Comandos · 01</strong></span></div></div><div className="area-jogo"><PainelEletrico editor={editor} enviar={enviar} hover={setDestacado}/><Bancada circuito={editor.circuito} estado={editor.simulacao} destacado={destacado} atuar={acao=>enviar({tipo:"atuar",acao})}/></div><section className="faixa-mascote"><Mascote expressao={editor.simulacao.curto ? "preocupado" : "curioso"} tamanho={95}/><div><span className="sobretitulo">SEU COMPANHEIRO DE BANCADA</span><p>Uma peça de cada vez. Vamos descobrir como tudo se conecta?</p></div></section></main></>;
}
