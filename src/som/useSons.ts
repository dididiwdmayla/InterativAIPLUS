'use client';
import { useEffect, useRef } from 'react';
import type { EstadoJogo } from '@/motor/jogo';
import { configurarSom, prepararSom, tocarSom } from './audio';
export function useSons(estado: EstadoJogo) {
  const anterior = useRef<EstadoJogo | null>(null);
  useEffect(() => { configurarSom(estado.som); }, [estado.som]);
  useEffect(() => {
    const gesto = (evento: Event) => {
      prepararSom();
      if (evento instanceof KeyboardEvent && (evento.repeat || !['Enter', ' '].includes(evento.key))) return;
      if (evento.target instanceof Element && evento.target.closest('button,[role="button"]')) tocarSom('clique');
    };
    document.addEventListener('pointerdown', gesto); document.addEventListener('keydown', gesto);
    return () => { document.removeEventListener('pointerdown', gesto); document.removeEventListener('keydown', gesto); };
  }, []);
  useEffect(() => {
    const antes = anterior.current; anterior.current = estado;
    if (!antes?.carregado || !estado.carregado) return;
    if (estado.momento === 'conclusao' && antes.momento !== 'conclusao' || estado.segredo && !antes.segredo) tocarSom('conclusao');
    else if (estado.momento === 'feedback' && antes.momento !== 'feedback') tocarSom('acerto');
    if (estado.editor.simulacao.disjuntorDisparado && !antes.editor.simulacao.disjuntorDisparado) tocarSom('disjuntor');
    else if (estado.editor.simulacao.bobina !== antes.editor.simulacao.bobina) tocarSom('contatora');
    if (estado.editor.simulacao.entradas.termicoDisparado && !antes.editor.simulacao.entradas.termicoDisparado) tocarSom('aviso');
  }, [estado]);
}
