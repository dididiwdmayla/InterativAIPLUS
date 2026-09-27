'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATALOGO, adicionar, bornes, nomePorta, vazio } from '../modelo/catalogo';
import { calcularEletrica } from '../modelo/eletrica';
import { calcularTransmissao, movimentoInicial, medirRotacao } from '../modelo/mecanica';
import { conectar, lerProjeto } from '../modelo/operacoes';
import { iniciar } from '../modelo/ordens';
import { ENTRADAS, type Area, type Entradas, type Movimento, type Ordem, type Projeto, type Sessao, type TipoLigacao, type TipoPeca } from '../modelo/tipos';
import { numero } from '../geometria';
import { tocarSom } from '@/som/audio';
import { Confirmacao } from '@/componentes/Confirmacao';
import { IconeOficina } from './IconeOficina';
import { CenaEletrica } from './CenaEletrica';
import { CenaMecanica } from './CenaMecanica';
import { Prancheta, type Ferramenta } from './Prancheta';
import { InspetorOficina } from './InspetorOficina';
import { GuiaOficina } from './GuiaOficina';
import { InstrumentosOficina } from './InstrumentosOficina';
const NOMES:Record<TipoLigacao,string>={fio:'Fio',eixo:'Mesmo eixo',engrenamento:'Engrenamento externo',correia:'Correia aberta',cruzada:'Correia cruzada'};
export function BancadaOficina({id,area,ordem,inicial,salvar,voltar}:{id:string;area:Area;ordem?:Ordem;inicial:Sessao;salvar:(s:Sessao)=>void;voltar:()=>void}){
 const [s,setS]=useState(inicial),[e,setE]=useState<Entradas>({...ENTRADAS}),[passado,setPassado]=useState<Projeto[]>([]);
 const [selecionado,setSelecionado]=useState<string|null>(null),[ferramenta,setFerramenta]=useState<Ferramenta>('inspecionar'),[origem,setOrigem]=useState<string|null>(null),[tipo,setTipo]=useState<TipoLigacao>(area==='eletrica'?'fio':'eixo');
 const [aba,setAba]=useState<'maquina'|'projeto'>(ordem?'maquina':'projeto'),[aviso,setAviso]=useState(''),[reset,setReset]=useState(false),[geracao,setGeracao]=useState(0);
 const mov=useRef(movimentoInicial()),arquivo=useRef<HTMLInputElement>(null);
 const p=s.projeto,livre=!ordem,r=useMemo(()=>calcularEletrica(p,e),[p,e]),t=useMemo(()=>calcularTransmissao(p),[p]);
 const selecionada=p.pecas.find(c=>c.id===selecionado)??p.pecas[0];
 const observar=useCallback((m:Movimento)=>{mov.current=m;},[]);
 useEffect(()=>salvar(s),[s,salvar]);
 useEffect(()=>{const pausar=()=>{if(document.hidden)setE(a=>({...a,ligada:false,atuadas:[]}));};document.addEventListener('visibilitychange',pausar);return()=>document.removeEventListener('visibilitychange',pausar);},[]);
 function alterar(novo:Projeto){
  if(e.ligada){setAviso('Desligue a bancada antes de alterar a montagem.');return;}
  if(novo===p)return;
  setPassado(a=>[...a.slice(-19),p]);setS(a=>({...a,projeto:novo,alterou:true,ajuda:0}));setOrigem(null);setAviso('Montagem atualizada. Ligue e compare o resultado.');
 }
 function operar(entrada:Entradas){
  const leitura=calcularEletrica(p,entrada),falha=entrada.ligada&&(leitura.curto||leitura.sobrecarga);
  const observou=entrada.ligada&&(id==='soldadora'?(leitura.cargas.k1??0)<18:id==='luminaria'?falha:id==='retorno'?t.rpm<0:id==='carga'?t.escorrega:id==='ritmo'?Math.abs(t.rpm)>61:false);
  setE({...entrada,disparado:entrada.disparado||falha});if(observou)setS(a=>({...a,observou:true}));
  if(falha){setAviso('Proteção aberta: desenergize e investigue a causa antes de rearmar.');tocarSom('disjuntor');}
  else {setAviso(entrada.ligada?'Ensaio iniciado. Observe a máquina e registre medições.':'Bancada desligada. Você pode modificar a montagem.');tocarSom('contatora');}
 }
 function terminal(porta:string){
  if(ferramenta==='medir'){
   const pec=p.pecas.find(c=>c.id===porta.split(':')[0]);if(!pec)return;
   const valor=area==='eletrica'?(r.potenciais[porta]===null||r.potenciais[porta]===undefined?'Sem referência':`${numero(r.potenciais[porta]!,2)} V`):`${numero(medirRotacao(t,mov.current,pec.id),1)} rpm · medidos`;
   setS(a=>({...a,medicoes:[...a.medicoes.slice(-5),{ponto:`${pec.tag}.${porta.split(':')[1]}`,valor}]}));setAviso(`Medição registrada: ${valor}.`);tocarSom('acerto');return;
  }
  if(ferramenta!=='conectar'){setSelecionado(porta.split(':')[0]);return;}
  if(e.ligada){setAviso('Desligue a bancada para conectar.');return;}
  if(origem===porta){setOrigem(null);setAviso('Ligação cancelada.');return;}
  if(!origem){setOrigem(porta);setAviso('Primeira ponta escolhida. Toque na outra.');return;}
  const novo=conectar(p,origem,porta,tipo);
  if(novo===p){setAviso('Essas pontas já estão ligadas ou não aceitam esse tipo de transmissão.');return;}
  alterar(novo);tocarSom('acerto');
 }
 function validar(){
  if(!e.ligada){setAviso('Ligue a bancada e comprove o resultado antes de concluir.');return;}
  let ok=false;
  if(id==='soldadora')ok=!p.obstrucao&&!p.pecas.find(c=>c.id==='f1')?.avaria&&(r.cargas.k1??0)>18&&(r.cargas.h1??0)>18;
  if(id==='luminaria')ok=e.perturbacao&&!e.disparado&&!p.ligacoes.some(l=>l.avaria)&&(r.cargas.h1??0)>18;
  if(id==='retorno')ok=t.conectada&&t.rpm>0&&mov.current.omega>.2;
  if(id==='carga')ok=t.conectada&&!t.escorrega&&p.carga>=25&&Math.abs(mov.current.omega)>.2;
  if(id==='ritmo')ok=t.conectada&&Math.abs(t.rpm+60)<.1&&p.pecas.find(c=>c.tipo==='motor')?.valor===120&&Math.abs(mov.current.omega)>.2;
  if(ok&&s.observou&&s.alterou){setS(a=>({...a,concluida:true,ajuda:0}));setAviso('Serviço aprovado. O resultado comprova sua hipótese.');tocarSom('conclusao');}
  else{setAviso(id==='luminaria'&&!e.perturbacao?'Repita o teste com o braço em movimento. É ali que a falha aparecia.':'Ainda falta comprovar o reparo. Confira o objetivo, reproduza o sintoma e compare as medições.');tocarSom('aviso');}
 }
 function desfazer(){if(e.ligada||!passado.length)return;setS(a=>({...a,projeto:passado[passado.length-1]}));setPassado(a=>a.slice(0,-1));setOrigem(null);setSelecionado(null);setAviso('Última mudança desfeita.');}
 function exportar(){const url=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`oficina-${area}.json`;a.click();URL.revokeObjectURL(url);setAviso('Projeto exportado. Você pode importá-lo em outra bancada livre.');}
 async function importar(file?:File){if(!file)return;if(file.size>80000){setAviso('Esse arquivo é grande demais para a bancada.');return;}try{const novo=lerProjeto(JSON.parse(await file.text()));if(!novo||novo.area!==area){setAviso('Arquivo inválido ou de outra área. Nenhum projeto foi alterado.');return;}alterar(novo);setSelecionado(null);setAviso('Projeto importado e pronto para testar.');}catch{setAviso('Não foi possível ler o projeto. Use um arquivo JSON exportado pela oficina.');}}
 function reiniciar(){setS(iniciar(ordem?.projeto??vazio(area)));setE({...ENTRADAS});setPassado([]);setSelecionado(null);setOrigem(null);setGeracao(g=>g+1);setReset(false);}
 return <main className={`of-trabalho of-${area}`} onKeyDown={ev=>{if(ev.key==='Escape'){setOrigem(null);setFerramenta('inspecionar');}if(ev.target instanceof HTMLInputElement||ev.target instanceof HTMLTextAreaElement||ev.target instanceof HTMLSelectElement)return;if((ev.ctrlKey||ev.metaKey)&&ev.key==='z'){ev.preventDefault();desfazer();}if(ferramenta==='mover'&&selecionada&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();alterar({...p,pecas:p.pecas.map(c=>c.id===selecionada.id?{...c,x:Math.max(65,Math.min(555,c.x+(ev.key==='ArrowRight'?20:ev.key==='ArrowLeft'?-20:0))),y:Math.max(55,Math.min(395,c.y+(ev.key==='ArrowDown'?20:ev.key==='ArrowUp'?-20:0)))}:c)});}}}>
 <div className="of-trabalho-titulo"><div><p className="of-eyebrow">{ordem?`ORDEM ${ordem.numero} / ${ordem.equipamento}`:'ESPAÇO AUTORAL / PRANCHETA LIVRE'}</p><h1>{ordem?.titulo??p.nome}</h1><p>{ordem?.relato??'Sem circuito pronto. Cada componente e cada ligação são decisões suas.'}</p></div><span className={`of-estado-servico ${s.concluida?'concluido':''}`}>{s.concluida?'RESOLVIDO':ordem?'EM MANUTENÇÃO':'EM CRIAÇÃO'}</span></div>
 <GuiaOficina ordem={ordem} sessao={s} ajuda={()=>setS(a=>({...a,ajuda:Math.min(3,a.ajuda+1)}))} validar={validar} voltar={voltar}/>
 <div className="of-abas-mobile" role="tablist" aria-label="Área da bancada"><button role="tab" aria-selected={aba==='maquina'} onClick={()=>setAba('maquina')}>Máquina e medições</button><button role="tab" aria-selected={aba==='projeto'} onClick={()=>setAba('projeto')}>Montagem e inspeção</button></div>
 <div className={`of-grid-trabalho of-aba-${aba}`}><div className="of-coluna-maquina"><section className="of-maquina"><div className="of-cabecalho-painel"><span>01 / ENSAIO VIRTUAL</span><b className={e.ligada?'of-em-teste':''}>{e.ligada?'AO VIVO':'EM REPOUSO'}</b></div>{area==='mecanica'?<CenaMecanica key={geracao} projeto={p} t={t} ligada={e.ligada} observar={observar}/>:<CenaEletrica id={id} projeto={p} e={e} r={r}/>}</section>
 <InstrumentosOficina projeto={p} eletrica={r} t={t} medicoes={s.medicoes} ligada={e.ligada} limpar={()=>setS(a=>({...a,medicoes:[]}))}/>
 <details className="of-como"><summary>O que esta bancada representa?</summary><p>{area==='eletrica'?'São circuitos fictícios de comando e iluminação em 24 Vcc. A soldadora não inclui o circuito de potência, arco ou capacitores de alta tensão. Uma intervenção real exige profissional habilitado.':'É um modelo didático de movimento: velocidade depende da transmissão, aceleração depende de torque e inércia. As caixas aderem gradualmente à esteira. O visor mostra a saída e o primeiro estágio; a prancheta contém todas as ligações. A escala de tensão da correia não substitui especificações de fabricante.'}</p></details></div>
 <div className="of-coluna-projeto"><section className="of-editor"><div className="of-cabecalho-painel"><span>02 / {livre?'SEU PROJETO':'DIAGRAMA DA MÁQUINA'}</span><button onClick={desfazer} disabled={e.ligada||!passado.length} aria-label="Desfazer mudança"><IconeOficina nome="desfazer"/></button></div>
 {livre&&<details className="of-catalogo" open><summary>Catálogo de peças <IconeOficina nome="mais"/></summary><div>{(Object.keys(CATALOGO) as TipoPeca[]).filter(k=>CATALOGO[k].area===area).map(k=><button key={k} disabled={e.ligada||p.pecas.length>=16||(['fonte','motor','rolete'].includes(k)&&p.pecas.some(c=>c.tipo===k))} onClick={()=>{const n=adicionar(p,k);alterar(n);setSelecionado(n.pecas.at(-1)?.id??null);}}><IconeOficina nome={area} tamanho={18}/>{CATALOGO[k].nome}<span>+</span></button>)}</div></details>}
 <div className="of-ferramentas" aria-label="Ferramentas">{(['inspecionar','medir',...(livre?['conectar','mover']:[])] as Ferramenta[]).map(f=><button key={f} aria-pressed={ferramenta===f} onClick={()=>{setFerramenta(f);setOrigem(null);}}><IconeOficina nome={f==='inspecionar'?'olho':f==='medir'?'sonda':f==='conectar'?'ligar-pontos':'mover'}/>{f==='inspecionar'?'Inspecionar':f==='medir'?'Medir':f==='conectar'?'Conectar':'Posicionar'}</button>)}</div>
 <div className="of-pontas"><p>{ferramenta==='conectar'?origem?`${nomePorta(p,origem)} na mão. Escolha a outra ponta.`:'Escolha duas pontas para fazer uma ligação.':ferramenta==='medir'?'Escolha uma peça e toque no borne ampliado para medir.':ferramenta==='mover'?'Selecione uma peça, toque no lugar desejado ou use as setas do teclado.':'Selecione uma peça ou uma ligação para investigar.'}</p>{ferramenta==='conectar'&&area==='mecanica'&&<label className="of-campo">Ligação a criar<select aria-label="Ligação a criar" value={tipo} onChange={ev=>setTipo(ev.target.value as TipoLigacao)}>{Object.entries(NOMES).filter(([k])=>k!=='fio').map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>}
 <div className="of-seletor-pecas">{p.pecas.map(c=><button key={c.id} aria-pressed={selecionada?.id===c.id} aria-label={`Peça ${c.tag}`} onClick={()=>setSelecionado(c.id)}>{c.tag}</button>)}</div>{(ferramenta==='conectar'||ferramenta==='medir')&&selecionada&&<div className="of-bornes"><span>{selecionada.tag}</span>{bornes(selecionada).map(b=><button key={b} aria-label={`Porta ${selecionada.tag}.${b}`} aria-pressed={origem===`${selecionada.id}:${b}`} onClick={()=>terminal(`${selecionada.id}:${b}`)}><i/>{b}</button>)}{ferramenta==='conectar'&&<button disabled={!origem} onClick={()=>setOrigem(null)}>Cancelar</button>}</div>}</div>
 {ferramenta==='medir'&&<output className="of-leitura" aria-live="polite"><span>{s.medicoes.at(-1)?.ponto??'SONDA PRONTA'}</span><b>{s.medicoes.at(-1)?.valor??'Escolha um ponto'}</b></output>}<Prancheta projeto={p} eletrica={r} ligada={e.ligada} selecionado={selecionado} origem={origem} ferramenta={ferramenta} selecionar={setSelecionado} terminal={terminal} mover={(x,y)=>{if(selecionada&&livre)alterar({...p,pecas:p.pecas.map(c=>c.id===selecionada.id?{...c,x:Math.max(65,Math.min(555,Math.round(x/20)*20)),y:Math.max(55,Math.min(395,Math.round(y/20)*20))}:c)});}}/>
 {p.ligacoes.length>0&&<details className="of-lista-ligacoes"><summary>Ligações · {p.ligacoes.length}</summary><div>{p.ligacoes.map(l=><button key={l.id} aria-pressed={selecionado===l.id} onClick={()=>setSelecionado(l.id)} aria-label={`Inspecionar ${nomePorta(p,l.de).toUpperCase()} para ${nomePorta(p,l.para).toUpperCase()}`}><span>{nomePorta(p,l.de).toUpperCase()} → {nomePorta(p,l.para).toUpperCase()}</span><small>{NOMES[l.tipo]}</small></button>)}</div></details>}</section><InspetorOficina projeto={p} selecionado={selecionado} ligada={e.ligada} livre={livre} origem={origem} alterar={alterar} terminal={terminal} remover={()=>{alterar({...p,pecas:p.pecas.filter(c=>c.id!==selecionado),ligacoes:p.ligacoes.filter(l=>l.id!==selecionado&&l.de.split(':')[0]!==selecionado&&l.para.split(':')[0]!==selecionado)});setSelecionado(null);}}/></div></div>
 <div className="of-mensagem" role="status">{aviso||'Cada experimento deixa uma pista. O caderno guarda suas medições.'}</div>
 <div className="of-operacao"><div className="of-indicador-operacao"><i className={e.disparado?'falha':e.ligada?'ligada':''}/><span>{e.disparado?'Proteção aberta':e.ligada?'Bancada em ensaio':'Pronta para montar'}<small>{area==='eletrica'?'COMANDO / 24 VCC':'TRANSMISSÃO / DINÂMICA'}</small></span></div><div className="of-controles"><button className={`of-botao ${e.ligada?'of-parar':'of-principal'}`} onClick={()=>operar({...e,ligada:!e.ligada})}><IconeOficina nome="ligar"/>{e.ligada?area==='eletrica'?'Desenergizar':'Parar ensaio':area==='eletrica'?'Energizar':'Ligar transmissão'}</button>{id==='luminaria'&&<button className="of-botao" aria-pressed={e.perturbacao} onClick={()=>operar({...e,perturbacao:!e.perturbacao})}>{e.perturbacao?'Recolher braço':'Mover braço'}</button>}{e.disparado&&<button className="of-botao" disabled={e.ligada} onClick={()=>operar({...e,disparado:false})}>Rearmar bancada</button>}{p.pecas.filter(c=>c.tipo==='interruptor').map(c=><button key={c.id} className="of-botao" aria-pressed={e.atuadas.includes(c.id)} onClick={()=>operar({...e,atuadas:e.atuadas.includes(c.id)?e.atuadas.filter(i=>i!==c.id):[...e.atuadas,c.id]})}>{e.atuadas.includes(c.id)?'Soltar':'Acionar'} {c.tag}</button>)}{area==='mecanica'&&<label className="of-carga">Carga <input aria-label="Carga na esteira" type="range" min="0" max="50" step="1" value={p.carga} onChange={ev=>setS(a=>({...a,projeto:{...a.projeto,carga:Number(ev.target.value)}}))}/><b>{p.carga} kg</b></label>}</div></div>
 <div className="of-arquivos">{livre&&<label>Nome do projeto<input value={p.nome} maxLength={60} onChange={ev=>setS(a=>({...a,projeto:{...a.projeto,nome:ev.target.value}}))}/></label>}<button className="of-botao" onClick={exportar}><IconeOficina nome="arquivo"/>Exportar projeto</button>{livre&&<><button className="of-botao" disabled={e.ligada} onClick={()=>arquivo.current?.click()}>Importar projeto</button><input ref={arquivo} type="file" accept=".json,application/json" hidden onChange={ev=>{void importar(ev.target.files?.[0]);ev.target.value='';}}/></>}<button className="of-botao of-discreto" onClick={()=>setReset(true)}>{livre?'Nova prancheta':'Recomeçar serviço'}</button></div>
 <Confirmacao aberta={reset} titulo={livre?'Começar uma nova montagem?':'Recomeçar este serviço?'} texto="A montagem atual desta bancada será substituída. Exporte o projeto antes se quiser guardar uma cópia. As outras bancadas ficam salvas." cancelar={()=>setReset(false)} confirmar={reiniciar}/>
 </main>;
}
