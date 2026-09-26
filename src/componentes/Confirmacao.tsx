'use client';
import { useEffect,useRef } from 'react';
export function Confirmacao({aberta,titulo,texto,confirmar,cancelar}:{aberta:boolean;titulo:string;texto:string;confirmar:()=>void;cancelar:()=>void}){
  const dialogo=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(aberta)dialogo.current?.showModal();else dialogo.current?.close();},[aberta]);
  return <dialog ref={dialogo} className="confirmacao" onCancel={cancelar} aria-label={titulo}><h2>{titulo}</h2><p>{texto}</p><div><button className="botao" autoFocus onClick={cancelar}>Continuar tentando</button><button className="botao primario" onClick={confirmar}>Confirmar</button></div></dialog>;
}
