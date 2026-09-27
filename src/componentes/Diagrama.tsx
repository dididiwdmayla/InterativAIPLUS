'use client';
import { useRef, useState } from 'react';
import type { EstadoEditor, AcaoEditor } from '@/eletrica/editor';
import { apresentarCircuito } from '@/eletrica/layout';
import { useTelaEstreita } from '@/lib/useTelaEstreita';
import { PecaDiagrama } from './PecaDiagrama';
export type ModoDiagrama = 'selecionar' | 'sonda' | 'fio' | 'inserir';
export function Diagrama({ editor, enviar, modo, origem, setOrigem, terminal, hover, editavel = true, destaque }: {
  editor: EstadoEditor; enviar: (a: AcaoEditor) => void; modo: ModoDiagrama; origem: string | null;
  setOrigem: (s: string | null) => void; terminal: (s: string) => void; hover: (s: string | null) => void; editavel?: boolean; destaque?: string;
}) {
  const estreito = useTelaEstreita();
  const circuito = apresentarCircuito(editor.circuito, estreito);
  const gesto = useRef<{ inicio: string; x: number; y: number; arrastando: boolean } | null>(null);
  const ignorarClique = useRef(false), svg = useRef<SVGSVGElement>(null);
  const [ponteiro, setPonteiro] = useState<{ x: number; y: number } | null>(null);
  const [fioSelecionado, setFioSelecionado] = useState<string | null>(null);
  const terminais = circuito.componentes.flatMap(c => c.terminais.map(t => ({ ...t, id: `${c.id}:${t.nome}`, tag: c.tag })));
  const tOrigem = terminais.find(t => t.id === origem), aux = terminais.find(t => t.id === 'q1:13')!;
  const contatora = circuito.componentes.find(c => c.id === 'q1')!;
  const fechado = contatora.contato === 'NA' ? editor.simulacao.bobina : !editor.simulacao.bobina;
  function cancelarGesto() { gesto.current = null; setPonteiro(null); }
  function escolherFio(id: string) {
    if (modo === 'inserir' && editavel) { enviar({ tipo: 'editar', edicao: { tipo: 'inserir', conexaoId: id } }); setFioSelecionado(null); }
    else setFioSelecionado(id);
  }
  return <div className="diagrama-area"><div className="rolagem-diagrama"><svg ref={svg} viewBox={estreito ? '0 0 365 525' : '0 0 750 380'} className={`diagrama-svg modo-${modo}`} aria-label="Diagrama de comando de 24 volts. Toque nos bornes para ligar. Tab e setas navegam; Enter escolhe."
    onClickCapture={e => { if (ignorarClique.current) { ignorarClique.current = false; e.preventDefault(); e.stopPropagation(); } }}
    onKeyDown={e => {
      if (e.key === 'Escape') { setOrigem(null); cancelarGesto(); }
      if (e.key.startsWith('Arrow')) {
        const itens = Array.from(e.currentTarget.querySelectorAll<SVGElement>('[tabindex="0"]'));
        const i = itens.indexOf(document.activeElement as SVGElement);
        if (i >= 0) { e.preventDefault(); itens[(i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1) + itens.length) % itens.length]?.focus(); }
      }
    }}
    onPointerMove={e => {
      const g = gesto.current;
      if (!g || !svg.current || modo !== 'fio' || !editavel) return;
      if (!g.arrastando && Math.hypot(e.clientX - g.x, e.clientY - g.y) < 6) return;
      g.arrastando = true; setOrigem(g.inicio); svg.current.setPointerCapture(e.pointerId);
      const matrix = svg.current.getScreenCTM();
      if (matrix) { const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse()); setPonteiro({ x: p.x, y: p.y }); }
    }}
    onPointerUp={e => {
      const g = gesto.current; cancelarGesto();
      if (!g?.arrastando) return;
      ignorarClique.current = true;
      const destino = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-terminal]')?.getAttribute('data-terminal');
      if (destino && destino !== g.inicio) enviar({ tipo: 'editar', edicao: { tipo: 'conectar', de: g.inicio, para: destino } });
      setOrigem(null);
    }} onPointerCancel={() => { cancelarGesto(); setOrigem(null); }} onLostPointerCapture={cancelarGesto}>
    <text x="24" y="26" className="legenda-diagrama">COMANDO · 24 Vcc</text><text x="65" y={estreito ? 510 : 359} className="legenda-diagrama">0 V · RETORNO</text>
    {circuito.conexoes.map(w => {
      const a = terminais.find(t => t.id === w.de), b = terminais.find(t => t.id === w.para);
      if (!a || !b) return null;
      const via = w.via ?? (a.x !== b.x && a.y !== b.y ? [{ x: a.x, y: b.y }] : []);
      const pontos = [a,...via,b];
      const trecho = pontos.slice(1).map((fim,i)=>({inicio:pontos[i],fim})).sort((u,v)=>Math.hypot(v.fim.x-v.inicio.x,v.fim.y-v.inicio.y)-Math.hypot(u.fim.x-u.inicio.x,u.fim.y-u.inicio.y))[0];
      const meio = {x:(trecho.inicio.x+trecho.fim.x)/2,y:(trecho.inicio.y+trecho.fim.y)/2};
      const d = `M${a.x} ${a.y} ${[...via, b].map(p => `L${p.x} ${p.y}`).join(' ')}`;
      return <g key={w.id} role="button" tabIndex={0} aria-label={`Fio ${a.tag}.${a.nome} para ${b.tag}.${b.nome}`} data-fio={w.id} className={destaque === w.id ? 'alvo-ajuda' : ''} onClick={() => escolherFio(w.id)} onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); escolherFio(w.id); }
        if (e.key === 'Delete' && editavel) enviar({ tipo: 'editar', edicao: { tipo: 'desconectar', id: w.id } });
      }}><path d={d} className="alvo-fio"/><path d={d} className={`fio ${editor.simulacao.energizados.includes(w.id) ? 'energizado' : ''} ${fioSelecionado === w.id ? 'selecionado' : ''}`}/>{modo==='inserir'&&<g className="ponto-insercao"><circle cx={meio.x} cy={meio.y} r="18"/><path d={`M${meio.x-7} ${meio.y}h14 M${meio.x} ${meio.y-7}v14`}/></g>}</g>;
    })}
    {circuito.componentes.map(peca => <g key={peca.id} className={destaque === peca.id ? 'alvo-ajuda' : ''}><PecaDiagrama peca={peca} s={editor.simulacao} selecionada={editor.selecionado === peca.id} selecionar={() => enviar({ tipo: 'selecionar', id: peca.id })} hover={hover} editavel={editavel} alternar={() => enviar({ tipo: 'editar', edicao: { tipo: 'contato', id: peca.id, contato: peca.contato === 'NA' ? 'NF' : 'NA' } })}/></g>)}
    <g className={destaque === 'selo' ? 'alvo-ajuda' : ''}><rect x={aux.x - 18} y={aux.y - 22} width="105" height="52" rx="10" className="auxiliar-fundo"/><text x={aux.x + 35} y={aux.y - 30} textAnchor="middle" className="nome-peca">{contatora.tag} · auxiliar {contatora.contato}</text><path d={`M${aux.x} ${aux.y}h15 m40 0h15 M${aux.x + 15} ${aux.y}L${aux.x + 55} ${aux.y - (fechado ? 0 : 15)}`} className="simbolo"/></g>
    {terminais.map(t => <g key={t.id} data-terminal={t.id} role="button" tabIndex={0} aria-label={`Terminal ${t.tag}.${t.nome}`} className={`terminal ${origem === t.id ? 'origem' : ''} ${editor.terminal === t.id ? 'sondado' : ''} ${destaque === t.id ? 'alvo-ajuda' : ''}`} onClick={() => terminal(t.id)}
      onPointerDown={e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; ignorarClique.current = false; gesto.current = { inicio: t.id, x: e.clientX, y: e.clientY, arrastando: false }; }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); terminal(t.id); } }}>
      <circle cx={t.x} cy={t.y} r={estreito ? 22 : 16} className="alvo-terminal"/><circle cx={t.x} cy={t.y} r="5" className="pino"/><text x={t.x} y={t.y + 21} textAnchor="middle" className="numero-terminal">{t.nome}</text>
    </g>)}
    {tOrigem && ponteiro && <path d={`M${tOrigem.x} ${tOrigem.y}L${ponteiro.x} ${ponteiro.y}`} className="fio rascunho"/>}
  </svg></div><div className="legenda-estados"><span><i/>Energizado</span><span><i/>Sem tensão</span><span>Contatos acompanham a bancada</span></div>{fioSelecionado && circuito.conexoes.some(w => w.id === fioSelecionado) && editavel && <div className="acoes-fio"><span>Fio selecionado</span><button onClick={() => { enviar({ tipo: 'editar', edicao: { tipo: 'desconectar', id: fioSelecionado } }); setFioSelecionado(null); }}>Remover fio</button><button onClick={() => setFioSelecionado(null)}>Cancelar</button></div>}</div>;
}
