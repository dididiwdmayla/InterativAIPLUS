'use client';
import { useEffect, useRef, useState } from 'react';
import { integrar, movimentoInicial } from './modelo/mecanica';
import type { Movimento, Transmissao } from './modelo/tipos';
export function useMovimento(t:Transmissao,carga:number,ligada:boolean,observar:(m:Movimento)=>void){
 const ref=useRef(movimentoInicial()),[m,setM]=useState(movimentoInicial);
 useEffect(()=>{let ultimo=0,desenho=0,frame=0;const passo=(agora:number)=>{const dt=ultimo?Math.min(.05,(agora-ultimo)/1000):0;ultimo=agora;if(!document.hidden){ref.current=integrar(ref.current,t,carga,ligada,dt);observar(ref.current);if(agora-desenho>32){setM(ref.current);desenho=agora;}}frame=requestAnimationFrame(passo);};frame=requestAnimationFrame(passo);return()=>cancelAnimationFrame(frame);},[t,carga,ligada,observar]);
 return m;
}
