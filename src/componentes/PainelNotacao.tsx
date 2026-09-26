'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { Circuito } from '@/eletrica/tipos';
import { notacao } from '@/eletrica/operacoes';
const NotacaoCircuito = dynamic(() => import('./NotacaoCircuito').then(m => m.NotacaoCircuito), { ssr: false, loading: () => <p>Preparando a lista de fios...</p> });
export function PainelNotacao({ circuito }: { circuito: Circuito }) {
  const [aberto, setAberto] = useState(false);
  return <section className="painel-notacao"><button className="botao" aria-expanded={aberto} aria-controls="notacao" onClick={() => setAberto(!aberto)}>{aberto ? 'Fechar lista de fios' : 'Ver meu circuito em texto'}</button>{aberto && <div id="notacao"><p>Olha só: cada fio que você montou também tem um endereço. Essa lista acompanha o diagrama; editar por texto fica para uma próxima aventura.</p><NotacaoCircuito texto={notacao(circuito)}/></div>}</section>;
}
