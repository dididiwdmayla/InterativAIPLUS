'use client';
import { useState } from 'react';
import { obterFase } from '@/conteudo/campanha';
import { falaAtual, type EstadoJogo, type AcaoJogo } from '@/motor/jogo';
import { Mascote } from './mascote/Mascote';
import { Icone } from './Icone';
import { Confirmacao } from './Confirmacao';
import type { Fala } from '@/motor/tipos';
export function GuiaFase({ estado, enviar, falaTutor }: { estado: EstadoJogo; enviar: (a: AcaoJogo) => void; falaTutor?: Fala | null }) {
  const [confirmacao, setConfirmacao] = useState(false), fase = obterFase(estado.faseId);
  const fala = estado.editor.simulacao.curto ? falaAtual(fase, estado) : falaTutor ?? falaAtual(fase, estado);
  const avancar = estado.momento === 'introducao' || estado.momento === 'feedback' || (estado.momento === 'conclusao' && estado.fala < fase.conclusao.length - 1);
  return <section className={`guia-fase guia-presente ${estado.momento === 'feedback' ? 'guia-acerto' : ''}`} aria-label="Computadorzinho e ajuda"><div className="faixa-mascote"><Mascote expressao={fala.expressao} tamanho={64}/><div className="balao"><span className="sobretitulo">{estado.momento === 'feedback' ? 'DESCOBERTA CONFIRMADA' : estado.momento === 'objetivo' ? `AGORA · ${estado.objetivo + 1}/${fase.objetivos.length}` : 'COMPUTADORZINHO'}</span><p aria-live="polite">{fala.texto}</p></div><div className="acoes-guia">{avancar && <button className="botao primario" onClick={() => enviar({ tipo: 'avancar' })}>{estado.momento === 'feedback' ? estado.objetivo === fase.objetivos.length - 1 ? 'Ver conquista' : 'Próximo objetivo' : estado.momento === 'introducao' && estado.fala === fase.introducao.length - 1 ? 'Vamos começar' : 'Continuar'}<Icone nome="seta" tamanho={17}/></button>}{estado.momento === 'objetivo' && <button className="botao" onClick={() => estado.degrau >= 3 ? setConfirmacao(true) : enviar({ tipo: 'ajuda' })}>Me ajuda<small>{Math.min(4, estado.degrau + 1)}/4</small></button>}</div></div><Confirmacao aberta={confirmacao} titulo="Ver a solução?" texto={estado.estrelas > 1 ? 'Isso custa 1 estrela. Vou aplicar a solução e explicar o que mudou.' : 'Sua última estrela fica com você. Vou aplicar a solução e explicar.'} cancelar={() => setConfirmacao(false)} confirmar={() => { setConfirmacao(false); enviar({ tipo: 'solucao' }); }}/></section>;
}
