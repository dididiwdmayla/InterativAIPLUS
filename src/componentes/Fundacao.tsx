'use client';
import { Mascote } from './mascote/Mascote';
import { useState } from 'react';
import { BarraSuperior, type Tema } from './BarraSuperior';
import { AbasZonas } from './AbasZonas';
import { Icone } from './Icone';
export function Fundacao() {
  const [tema, setTema] = useState<Tema>('doce');
  const [som, setSom] = useState(true);
  return <><BarraSuperior tema={tema} mudarTema={t=>{setTema(t);document.documentElement.dataset.theme=t;}} som={som} mudarSom={()=>setSom(!som)}/><main className="jogo"><div className="cabecalho-fase"><div><span className="sobretitulo">SUA PRIMEIRA MISSÃO</span><h1>O painel é seu<span>.</span></h1><p>A esteira parou. A próxima fornada depende de você.</p></div><div className="selo-fase"><Icone nome="raio"/><span>Ilha Elétrica<strong>Comandos · 01</strong></span></div></div><div className="area-jogo"><section className="painel"><AbasZonas/><div className="titulo-painel"><h2>Seu diagrama</h2><span>Explore as peças do painel</span></div><div className="vazio-diagrama"><Icone nome="fio" tamanho={64}/><p>Aqui começa uma nova conexão.</p></div><div className="inspetor"><strong>Inspetor de componentes</strong><p>Selecione uma peça para conhecer seus terminais.</p></div></section><section className="bancada-moldura"><div className="titulo-bancada"><span className="ponto-status"/>BANCADA VIRTUAL<span>AO VIVO</span></div><div className="vazio-bancada"><span className="placa-padaria">PADARIA<strong>Pão Quentinho</strong></span><p>Sua instalação vai ganhar vida aqui.</p></div><div className="rodape-bancada">Observe, experimente, descubra.</div></section></div><section className="faixa-mascote"><Mascote expressao="curioso" tamanho={95}/><div><span className="sobretitulo">SEU COMPANHEIRO DE BANCADA</span><p>Uma peça de cada vez. Vamos descobrir como tudo se conecta?</p></div></section></main></>;
}
