'use client';
import { useEffect, useRef, useState } from 'react';
import { FASE_1 } from '@/conteudo/fase1';
import { notacao } from '@/eletrica/operacoes';
import { ehExpressao } from '@/motor/expressao';
import type { EstadoJogo } from '@/motor/jogo';
import type { Fala } from '@/motor/tipos';
import { SEM_SINAL, type EntradaTutor, type Mensagem } from '@/tutor/contrato';
import { Icone } from './Icone';
export function CampoTutor({ estado, falar }: { estado: EstadoJogo; falar: (fala: Fala) => void }) {
  const [pergunta, setPergunta] = useState(''), [esperando, setEsperando] = useState(false), [historico, setHistorico] = useState<Mensagem[]>([]);
  const requisicao = useRef<AbortController | null>(null);
  useEffect(() => () => requisicao.current?.abort(), []);
  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const texto = pergunta.trim(); if (!texto || esperando) return;
    const controller = new AbortController(); requisicao.current = controller;
    const prazo = setTimeout(() => controller.abort('tempo'), 22000);
    const objetivo = FASE_1.objetivos[estado.objetivo];
    const entrada: EntradaTutor = { faseId: FASE_1.id, objetivoId: objetivo.id, enunciado: objetivo.enunciado,
      degrauAtual: estado.degrau, circuitoAtual: notacao(estado.editor.circuito), pergunta: texto, historico: historico.slice(-6) };
    setPergunta(''); setEsperando(true); falar({ texto: 'Deixa eu olhar o seu circuito...', expressao: 'pensativo' });
    let fala: Fala = SEM_SINAL;
    try {
      const r = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entrada), signal: controller.signal });
      const v: unknown = await r.json();
      if (r.ok && typeof v === 'object' && v !== null && 'texto' in v && typeof v.texto === 'string' && 'expressao' in v && ehExpressao(v.expressao)) fala = { texto: v.texto, expressao: v.expressao };
    } catch { /* A conversa pode falhar sem interromper a bancada. */ }
    finally { clearTimeout(prazo); }
    if (controller.signal.aborted && controller.signal.reason !== 'tempo') return;
    setEsperando(false); falar(fala);
    setHistorico(h => [...h, { papel: 'aluno' as const, texto }, { papel: 'tutor' as const, texto: fala.texto }].slice(-6));
  }
  return <div className="tutor"><form onSubmit={enviar}><label htmlFor="pergunta-tutor">Pergunte ao computadorzinho</label><div className="entrada-tutor"><input id="pergunta-tutor" value={pergunta} onChange={e => setPergunta(e.target.value)} maxLength={1000} placeholder="O que você quer descobrir?" autoComplete="off" disabled={esperando}/><button className="botao" type="submit" disabled={esperando || !pergunta.trim()} aria-label="Enviar pergunta"><Icone nome="seta" tamanho={18}/>{esperando ? 'Pensando...' : 'Perguntar'}</button></div></form>{historico.length > 0 && <details className="historico-tutor"><summary>Nossa conversa</summary><ol>{historico.map((m, i) => <li key={i} className={m.papel}><strong>{m.papel === 'aluno' ? 'Você' : 'Computadorzinho'}</strong><p>{m.texto}</p></li>)}</ol></details>}</div>;
}
