import { FASE_1 } from '@/conteudo/fase1';
import type { EstadoJogo } from '@/motor/jogo';
import { Carinha } from './mascote/Carinha';
export function ListaObjetivos({estado}:{estado:EstadoJogo}){
  return <ol className="lista-objetivos" aria-label="Objetivos da fase">{FASE_1.objetivos.map((o,i)=>{const feito=i<estado.objetivo||(i===estado.objetivo&&['feedback','conclusao'].includes(estado.momento));return <li key={o.id} className={feito?'feito':i===estado.objetivo?'atual':'futuro'} aria-current={i===estado.objetivo?'step':undefined}>{feito?<Carinha variante="feliz" tom="sucesso" tamanho={22}/>:<span className="numero-objetivo">{i+1}</span>}<span>{o.titulo}</span>{feito&&<span className="sr-only">Concluído</span>}</li>;})}</ol>;
}
