'use client';
import { useEffect,useReducer } from 'react';
import { FASE_1 } from '../conteudo/fase1';
import { jogoInicial,reduzirJogo } from './jogo';
import { CHAVE_PROGRESSO,desserializar,serializar } from '../lib/progresso';
export function useJogo(){
  const [estado,enviar]=useReducer(reduzirJogo.bind(null,FASE_1),undefined,jogoInicial);
  useEffect(()=>{try{enviar({tipo:'carregar',estado:desserializar(localStorage.getItem(CHAVE_PROGRESSO))});}catch{enviar({tipo:'carregar',estado:jogoInicial()});enviar({tipo:'falha-salvar'});}},[]);
  useEffect(()=>{if(!estado.carregado)return;document.documentElement.dataset.theme=estado.tema;try{localStorage.setItem(CHAVE_PROGRESSO,serializar(estado));}catch{enviar({tipo:'falha-salvar'});}},[estado]);
  useEffect(()=>{const soltar=()=>enviar({tipo:'editor',acao:{tipo:'atuar',acao:{tipo:'soltar-todas'}}});const visibilidade=()=>{if(document.hidden)soltar();};window.addEventListener('blur',soltar);document.addEventListener('visibilitychange',visibilidade);return()=>{window.removeEventListener('blur',soltar);document.removeEventListener('visibilitychange',visibilidade);};},[]);
  return{estado,enviar};
}
