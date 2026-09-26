import { FASE_1 } from '@/conteudo/fase1';
import type { EstadoJogo,AcaoJogo } from '@/motor/jogo';
import { Icone } from './Icone';
import { Celebracao } from './Celebracao';
export function Conclusao({estado,enviar}:{estado:EstadoJogo;enviar:(a:AcaoJogo)=>void}){
  return <section className="conclusao" aria-label="Fase concluída"><Celebracao/><div><span className="sobretitulo">ILHA ELÉTRICA · PRIMEIRA CONQUISTA</span><h2>Essa fornada é sua!</h2><div className="estrelas estrelas-conclusao" aria-label={`${estado.estrelas} estrelas conquistadas`}>{[1,2,3].map(n=><span key={n} className={n<=estado.estrelas?'acesa':''} style={{animationDelay:`${n*.12}s`}}><Icone nome="estrela" tamanho={38}/></span>)}</div><p>Você aprendeu a reconhecer, medir e montar um comando com selo.</p></div><div className="missao-campo"><strong>Sua missão fora do jogo</strong><p>{FASE_1.missaoDeCampo}</p><label><input type="checkbox" checked={estado.missao} onChange={e=>enviar({tipo:'missao',valor:e.target.checked})}/>Identifiquei em uma foto ou diagrama real</label></div></section>;
}
